import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ValidatorContext from '../../../../src/context/validators/ValidatorContext.vue'

vi.mock('../../../../src/context/useFormContext.ts', () => ({
  useFormContext: () => ({
    formData: {},
    updateFormData: vi.fn(),
    resetForm: vi.fn(),
  }),
}))

describe('ValidatorContext', () => {
  it('renders slot content', () => {
    const wrapper = mount(ValidatorContext, {
      slots: {
        default: '<div data-testid="content">Test Content</div>',
      },
    })

    expect(wrapper.find('[data-testid="content"]').exists()).toBe(true)
  })

  it('provides validator context', () => {
    const wrapper = mount(ValidatorContext, {
      slots: {
        default: '<div>Test</div>',
      },
    })

    expect(wrapper.vm).toBeDefined()
  })
})
