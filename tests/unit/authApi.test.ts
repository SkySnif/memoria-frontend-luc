import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authApi } from '@/services/authApi'
import { ApiError } from '@/services/api'
import { demoCustomer } from '@/mocks/fixtures/users'

/**
 * JSON Response helper — ensures Content-Type is set so `api.ts`
 * parses the body as JSON rather than passing the raw string through.
 */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('authApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('login', () => {
    it('sends credentials and returns the user', async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(jsonResponse(demoCustomer))

      const user = await authApi.login({
        email: 'demo@memoria.dev',
        password: 'demo1234',
      })

      expect(user).toEqual(demoCustomer)
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        }),
      )
    })

    it('throws ApiError on 401', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'bad creds' }, 401))

      await expect(authApi.login({ email: 'x@y.z', password: 'wrongpwd1' })).rejects.toBeInstanceOf(
        ApiError,
      )
    })
  })

  describe('register', () => {
    it('sends payload and returns the new user', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(demoCustomer, 201))

      const user = await authApi.register({
        email: 'new@memoria.dev',
        pseudo: 'Newbie',
        password: 'newpwd1234',
        gdprConsent: true,
      })

      expect(user).toEqual(demoCustomer)
    })
  })

  describe('logout', () => {
    it('POSTs to /auth/logout', async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }))

      await authApi.logout()

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('me', () => {
    it('returns the current user', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(demoCustomer))

      const user = await authApi.me()
      expect(user).toEqual(demoCustomer)
    })

    it('throws ApiError on 401', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }))

      await expect(authApi.me()).rejects.toBeInstanceOf(ApiError)
    })
  })
})
