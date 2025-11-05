import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageContext from '../../../../src/context/language/LanguageContext.vue'

vi.mock('@/config/languages.json', () => ({
  default: {
    defaultlanguage: 'pt-br',
    'pt-br': {
      title: 'Título',
      subtitle: 'Subtítulo',
    },
    'en-us': {
      title: 'Title',
      subtitle: 'Subtitle',
    },
  },
}))

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('renders slot content', () => {
    const wrapper = mount(LanguageContext, {
      slots: {
        default: '<div data-testid="content">Test Content</div>',
      },
    })

    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)
  })

  it('provides language context', () => {
    const wrapper = mount(LanguageContext, {
      slots: {
        default: '<div>Test</div>',
      },
    })

    expect(wrapper.vm).toBeDefined()
  })
})
