import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VectorizationToolPanel from '@/components/map/VectorizationToolPanel.vue'

vi.mock('@/context/language/useLanguageContext', () => ({
  useLanguageContext: () => ({
    getLanguage: (key: string) => key,
  }),
}))

const mockConfig = [
  {
    groupKey: 'group1',
    groupName: 'Group 1',
    layersToVectorize: [
      { layerCode: 'layer1', displayName: 'Layer 1', rules: { maxInstances: 1, required: true } },
    ],
  },
  {
    groupKey: 'group2',
    groupName: 'Group 2',
    layersToVectorize: [
      { layerCode: 'layer2', displayName: 'Layer 2', rules: { maxInstances: 2 } },
    ],
  },
]

describe('VectorizationToolPanel.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(VectorizationToolPanel, {
      props: {
        config: mockConfig,
        displayedAreas: [],
      },
    })
  })

  it('should render group boxes', () => {
    expect(wrapper.findAll('.group-box').length).toBe(mockConfig.length)
    expect(wrapper.text()).toContain('Group 1')
  })

  it('should show a message if config is empty', async () => {
    await wrapper.setProps({ config: [] })
    expect(wrapper.text()).toContain('mapComponents.vectorizationToolPanel.noLayerGroupsConfigured')
  })

  it('should toggle group expansion', async () => {
    const group1Button = wrapper.findAll('.group-box')[0]
    await group1Button.trigger('click')
    expect(wrapper.find('.expanded-group-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Layer 1')

    await group1Button.trigger('click')
    expect(wrapper.find('.expanded-group-content').exists()).toBe(false)
  })

  it('should enable all groups initially', () => {
    const groupButtons = wrapper.findAll('.group-box')
    groupButtons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeUndefined()
    })
  })

  it('should enable the next group when required layers are drawn', async () => {
    await wrapper.setProps({ displayedAreas: [{ layerCode: 'layer1' }] })
    await wrapper.vm.$nextTick()
    const group2Button = wrapper.findAll('.group-box')[1]
    expect(group2Button.attributes('disabled')).toBeUndefined()
  })

  it('should select a layer and emit an event', async () => {
    await wrapper.findAll('.group-box')[0].trigger('click')
    const layer1Button = wrapper.find('.expanded-group-content button')
    await layer1Button.trigger('click')

    expect(wrapper.emitted().vectorizationLayerSelected).toBeTruthy()
    expect(wrapper.emitted().vectorizationLayerSelected[0][0]).toEqual({
      layer: mockConfig[0].layersToVectorize[0],
    })
    expect(layer1Button.classes()).toContain('bg-blue-900')
  })

  it('should deselect a layer', async () => {
    await wrapper.findAll('.group-box')[0].trigger('click')
    const layer1Button = wrapper.find('.expanded-group-content button')
    await layer1Button.trigger('click') // select
    await layer1Button.trigger('click') // deselect

    expect(wrapper.emitted().vectorizationLayerSelected[1][0]).toEqual({ layer: null })
    expect(layer1Button.classes()).not.toContain('bg-blue-900')
  })

  it('should disable a layer when maxInstances is reached', async () => {
    // Abre o grupo antes de desenhar a camada obrigatória, pois o primeiro grupo fica desabilitado após isso
    await wrapper.findAll('.group-box')[0].trigger('click')
    let expandedContent = wrapper.find('.expanded-group-content')
    expect(expandedContent.exists()).toBe(true)

    await wrapper.setProps({ displayedAreas: [{ layerCode: 'layer1' }] })
    await wrapper.vm.$nextTick()

    // Conteúdo ainda deve estar acessível e o botão da camada desabilitado
    expandedContent = wrapper.find('.expanded-group-content')
    const layer1Button = expandedContent.find('button')
    expect(layer1Button.exists()).toBe(true)
    expect(layer1Button.attributes('disabled')).toBe('')
  })

  it('should expose toggleStep and resetLayerSelection', async () => {
    expect(wrapper.vm.toggleStep).toBeDefined()
    expect(wrapper.vm.resetLayerSelection).toBeDefined()

    wrapper.vm.toggleStep('group2')
    await wrapper.vm.$nextTick()
    // Cannot test if group2 is open because it is disabled

    await wrapper.findAll('.group-box')[0].trigger('click')
    await wrapper.find('.expanded-group-content button').trigger('click')
    expect(wrapper.vm.currentStep.layer.key).toBe('layer1')

    wrapper.vm.resetLayerSelection()
    expect(wrapper.vm.currentStep.layer.key).toBe('')
  })
})
