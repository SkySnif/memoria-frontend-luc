import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'
import { authApi } from '@/services/authApi'
import { ApiError } from '@/services/api'
import { demoAdmin, demoCustomer } from '@/mocks/fixtures/users'

vi.mock('@/services/authApi', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts with no user, not loading, not initialized', () => {
      const store = useAuthStore()
      expect(store.currentUser).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.initialized).toBe(false)
    })

    it('isAuthenticated is false when no user', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('sets the user on success', async () => {
      vi.mocked(authApi.login).mockResolvedValueOnce(demoCustomer)
      const store = useAuthStore()

      await store.login({ email: 'demo@memoria.dev', password: 'demo1234' })

      expect(store.currentUser).toEqual(demoCustomer)
      expect(store.isAuthenticated).toBe(true)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('sets the error message on ApiError', async () => {
      vi.mocked(authApi.login).mockRejectedValueOnce(new ApiError('Identifiants invalides', 401))
      const store = useAuthStore()

      await expect(store.login({ email: 'x@y.z', password: 'wrong123' })).rejects.toThrow()

      expect(store.error).toBe('Identifiants invalides')
      expect(store.currentUser).toBeNull()
    })

    it('sets generic error message on non-ApiError', async () => {
      vi.mocked(authApi.login).mockRejectedValueOnce(new Error('boom'))
      const store = useAuthStore()

      await expect(store.login({ email: 'x@y.z', password: 'wrong123' })).rejects.toThrow()

      expect(store.error).toBe('Erreur de connexion')
    })
  })

  describe('register', () => {
    it('sets the user on success', async () => {
      vi.mocked(authApi.register).mockResolvedValueOnce(demoCustomer)
      const store = useAuthStore()

      await store.register({
        email: 'new@memoria.dev',
        pseudo: 'Newbie',
        password: 'newpwd1234',
        gdprConsent: true,
      })

      expect(store.currentUser).toEqual(demoCustomer)
    })

    it('sets the error on failure', async () => {
      vi.mocked(authApi.register).mockRejectedValueOnce(new ApiError('Email déjà utilisé', 409))
      const store = useAuthStore()

      await expect(
        store.register({
          email: 'taken@memoria.dev',
          pseudo: 'Taken',
          password: 'pwd12345678',
          gdprConsent: true,
        }),
      ).rejects.toThrow()

      expect(store.error).toBe('Email déjà utilisé')
    })
  })

  describe('logout', () => {
    it('clears the current user', async () => {
      vi.mocked(authApi.me).mockResolvedValueOnce(demoCustomer)
      vi.mocked(authApi.logout).mockResolvedValueOnce(undefined)

      const store = useAuthStore()
      await store.fetchMe()
      expect(store.currentUser).toEqual(demoCustomer)

      await store.logout()
      expect(store.currentUser).toBeNull()
    })

    it('clears the user even if the API call fails', async () => {
      vi.mocked(authApi.me).mockResolvedValueOnce(demoCustomer)
      vi.mocked(authApi.logout).mockRejectedValueOnce(new Error('boom'))

      const store = useAuthStore()
      await store.fetchMe()
      await store.logout()

      expect(store.currentUser).toBeNull()
    })
  })

  describe('fetchMe', () => {
    it('hydrates the user from /auth/me', async () => {
      vi.mocked(authApi.me).mockResolvedValueOnce(demoCustomer)
      const store = useAuthStore()

      await store.fetchMe()

      expect(store.currentUser).toEqual(demoCustomer)
      expect(store.initialized).toBe(true)
    })

    it('silently leaves user null on 401', async () => {
      vi.mocked(authApi.me).mockRejectedValueOnce(new ApiError('Non authentifié', 401))
      const store = useAuthStore()

      await expect(store.fetchMe()).resolves.toBeUndefined()
      expect(store.currentUser).toBeNull()
      expect(store.initialized).toBe(true)
    })

    it('rethrows non-401 errors', async () => {
      vi.mocked(authApi.me).mockRejectedValueOnce(new ApiError('Server error', 500))
      const store = useAuthStore()

      await expect(store.fetchMe()).rejects.toThrow('Server error')
    })
  })

  describe('role getters', () => {
    it('isAdmin is true for admin', async () => {
      vi.mocked(authApi.me).mockResolvedValueOnce(demoAdmin)
      const store = useAuthStore()
      await store.fetchMe()

      expect(store.isAdmin).toBe(true)
      expect(store.isSuperAdmin).toBe(false)
    })

    it('isAdmin AND isSuperAdmin are true for super_admin', async () => {
      vi.mocked(authApi.me).mockResolvedValueOnce({
        ...demoAdmin,
        role: 'super_admin',
      })
      const store = useAuthStore()
      await store.fetchMe()

      expect(store.isAdmin).toBe(true)
      expect(store.isSuperAdmin).toBe(true)
    })

    it('isAdmin is false for customer', async () => {
      vi.mocked(authApi.me).mockResolvedValueOnce(demoCustomer)
      const store = useAuthStore()
      await store.fetchMe()

      expect(store.isAdmin).toBe(false)
      expect(store.isSuperAdmin).toBe(false)
    })
  })
})
