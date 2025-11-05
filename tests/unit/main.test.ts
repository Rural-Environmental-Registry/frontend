import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApp } from 'vue'

vi.mock('./assets/index.css', () => ({}))
vi.mock('dpg-mapa/dist/index.css', () => ({}))
vi.mock('../src/App.vue', () => ({
  default: {
    name: 'App',
    template: '<div>App</div>',
  },
}))
vi.mock('../src/router', () => ({
  default: {
    name: 'router',
    install: vi.fn(),
  },
}))

const mockMount = vi.fn()
const mockUse = vi.fn()

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    createApp: vi.fn(() => ({
      use: mockUse,
      mount: mockMount,
    })),
  }
})

describe('main.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates Vue app and configures it', async () => {
    await import('../../src/main')

    expect(createApp).toHaveBeenCalled()
    expect(mockUse).toHaveBeenCalled()
    expect(mockMount).toHaveBeenCalledWith('#app')
  })
})
