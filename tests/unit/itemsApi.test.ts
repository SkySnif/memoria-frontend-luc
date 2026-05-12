import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { itemsApi } from '@/services/itemsApi'
import { ApiError } from '@/services/api'
import { sampleBook, sampleNote } from '@/mocks/fixtures/items'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('itemsApi', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('list', () => {
    it('returns an array of items', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse([sampleNote, sampleBook]))

      const items = await itemsApi.list()

      expect(items).toHaveLength(2)
      expect(items[0]).toEqual(sampleNote)
    })

    it('returns an empty array when user has no items', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse([]))

      const items = await itemsApi.list()
      expect(items).toEqual([])
    })
  })

  describe('get', () => {
    it('returns a single item', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(sampleNote))

      const item = await itemsApi.get(sampleNote.id)
      expect(item).toEqual(sampleNote)
    })

    it('throws ApiError on 404', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'Not found' }, 404))

      await expect(itemsApi.get('missing-id')).rejects.toBeInstanceOf(ApiError)
    })
  })

  describe('create', () => {
    it('sends the payload and returns the created item', async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(jsonResponse(sampleNote, 201))

      const item = await itemsApi.create({
        contentType: 'note',
        title: 'My new note',
        content: 'Some content',
      })

      expect(item).toEqual(sampleNote)
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/items'),
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('delete', () => {
    it('issues a DELETE request', async () => {
      const fetchMock = vi.mocked(fetch)
      fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))

      await itemsApi.delete(sampleNote.id)

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`/items/${sampleNote.id}`),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })
})
