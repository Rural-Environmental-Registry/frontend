import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { checkAuth } from '@/services/authService'

vi.mock('jwt-decode', () => ({
  jwtDecode: (token: string) => {
    if (token === 'valid-token') {
      return {
        exp: Date.now() / 1000 + 3600,
        name: 'Test User',
        email: 'test@example.com',
        sub: '123',
      }
    }
    if (token === 'expired-token') {
      return {
        exp: Date.now() / 1000 - 3600,
        name: 'Test User',
        email: 'test@example.com',
        sub: '123',
      }
    }
    throw new Error('Invalid token')
  },
}))

const mockWindowLocation = (href: string) => {
  const location = new URL(href)
  Object.defineProperty(window, 'location', {
    value: {
      ...location,
      href: location.href,
      origin: location.origin,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      replace: vi.fn(),
      assign: vi.fn(),
    },
    writable: true,
  })
}

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    mockWindowLocation('http://localhost:3000/')
    Object.defineProperty(window, 'history', {
      value: {
        replaceState: vi.fn(),
      },
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('checkAuth', () => {
    it('should return false when code is present but token is not', () => {
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '?code=test-code',
        origin: 'http://localhost',
        pathname: '/',
      } as any
      const result = checkAuth()
      expect(result).toBe(false)
    })

    it('should return true and set language/token when both are present in query', () => {
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '?lang=en-us&token=valid-token',
        origin: 'http://localhost',
        pathname: '/',
      } as any

      const result = checkAuth()

      expect(result).toBe(true)
      expect(localStorage.getItem('language')).toBe('en-us')
      expect(localStorage.getItem('token')).toBe('valid-token')
      expect(window.history.replaceState).toHaveBeenCalled()
    })

    it('should return true when token is in sessionStorage', () => {
      localStorage.setItem('token', 'valid-token')
      localStorage.setItem('language', 'pt-br')
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '',
        origin: 'http://localhost',
        pathname: '/',
      } as any
      const result = checkAuth()
      expect(result).toBe(true)
      expect(localStorage.getItem('language')).toBe('pt-br')
      expect(localStorage.getItem('token')).toBe('valid-token')
    })

    it('should return false when no token is available', () => {
      localStorage.clear()
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '',
        origin: 'http://localhost',
        pathname: '/',
      } as any
      const result = checkAuth()
      expect(result).toBe(false)
    })

    it('should return false for expired token from query', () => {
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '?lang=en-us&token=expired-token',
        origin: 'http://localhost',
        pathname: '/',
      } as any
      const result = checkAuth()
      expect(result).toBe(false)
    })

    it('should return false for expired token from storage', () => {
      localStorage.setItem('token', 'expired-token')
      localStorage.setItem('language', 'pt-br')
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '',
        origin: 'http://localhost',
        pathname: '/',
      } as any
      const result = checkAuth()
      expect(result).toBe(false)
    })

    it('should return false for invalid token from query', () => {
      const originalLocation = window.location
      delete (window as any).location
      window.location = {
        ...originalLocation,
        search: '?lang=en-us&token=invalid-token',
        origin: 'http://localhost',
        pathname: '/',
      } as any
      const result = checkAuth()
      expect(result).toBe(false)
    })
  })
})
