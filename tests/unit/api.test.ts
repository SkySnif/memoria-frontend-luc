import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import { api, ApiError } from '@/services/api'

/**
 * These tests demonstrate the TDD pattern used across the codebase:
 *   - Mock fetch with vi.fn (no real network).
 *   - Pass a Zod schema as the source of truth for the response shape.
 *   - Assert behavior (URL, method, body, credentials), not implementation details.
 *
 * When we wire real modules, we'll likely switch to MSW (Mock Service Worker)
 * for higher-fidelity request mocking. For now, replacing fetch keeps the scaffold lean.
 */

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

function mockResponse(body: unknown, init: { status?: number; contentType?: string } = {}) {
  const status = init.status ?? 200
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': init.contentType ?? 'application/json' },
  })
}

describe('api', () => {
  const originalFetch = globalThis.fetch
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  describe('get', () => {
    it('sends a GET with credentials and parses the response through the schema', async () => {
      const user = { id: 'u_1', email: 'ada@example.com' }
      fetchMock.mockResolvedValueOnce(mockResponse(user))

      const result = await api.get('/users/me', userSchema)

      expect(result).toEqual(user)
      expect(fetchMock).toHaveBeenCalledOnce()
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(url).toMatch(/\/users\/me$/)
      expect(init.method).toBe('GET')
      expect(init.credentials).toBe('include')
    })

    it('throws an ApiError on non-2xx responses', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({ message: 'Unauthorized' }, { status: 401 }))

      const error = await api.get('/users/me', userSchema).catch((e: unknown) => e)
      expect(error).toBeInstanceOf(ApiError)
      expect(error).toMatchObject({ status: 401, message: 'Unauthorized' })
    })

    it('throws if the response does not match the schema', async () => {
      fetchMock.mockResolvedValueOnce(mockResponse({ id: 'u_1', email: 'not-an-email' }))

      await expect(api.get('/users/me', userSchema)).rejects.toThrow()
    })
  })

  describe('post', () => {
    it('sends a JSON body and parses the response', async () => {
      const created = { id: 'u_2', email: 'grace@example.com' }
      fetchMock.mockResolvedValueOnce(mockResponse(created, { status: 201 }))

      const result = await api.post(
        '/users',
        { email: 'grace@example.com', password: 'secret' },
        userSchema,
      )

      expect(result).toEqual(created)
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(init.method).toBe('POST')
      expect(init.credentials).toBe('include')
      expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' })
      expect(init.body).toBe(JSON.stringify({ email: 'grace@example.com', password: 'secret' }))
    })
  })

  describe('delete', () => {
    it('does not require a schema', async () => {
      fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))

      await expect(api.delete('/items/42')).resolves.toBeUndefined()
      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit]
      expect(init.method).toBe('DELETE')
      expect(init.credentials).toBe('include')
    })
  })
})
