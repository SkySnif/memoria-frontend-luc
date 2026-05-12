import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useItemsStore } from '@/stores/useItemsStore'
import { itemsApi } from '@/services/itemsApi'
import { ApiError } from '@/services/api'
import { allSampleItems, sampleBook, sampleNote } from '@/mocks/fixtures/items'

vi.mock('@/services/itemsApi', () => ({
  itemsApi: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('useItemsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('starts empty, not loading, not initialized', () => {
      const store = useItemsStore()
      expect(store.items).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.initialized).toBe(false)
    })

    it('count is 0 and isEmpty is false before init', () => {
      const store = useItemsStore()
      expect(store.count).toBe(0)
      expect(store.isEmpty).toBe(false)
    })
  })

  describe('fetchAll', () => {
    it('populates items on success', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      const store = useItemsStore()

      await store.fetchAll()

      expect(store.items).toHaveLength(3)
      expect(store.initialized).toBe(true)
      expect(store.count).toBe(3)
    })

    it('isEmpty becomes true after fetching empty', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce([])
      const store = useItemsStore()
      await store.fetchAll()
      expect(store.isEmpty).toBe(true)
    })

    it('sets error on ApiError', async () => {
      vi.mocked(itemsApi.list).mockRejectedValueOnce(new ApiError('Erreur serveur', 500))
      const store = useItemsStore()
      await expect(store.fetchAll()).rejects.toThrow()
      expect(store.error).toBe('Erreur serveur')
    })
  })

  describe('fetchOne', () => {
    it('returns the item and updates local cache if present', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      const updated = { ...sampleNote, content: 'updated content' }
      vi.mocked(itemsApi.get).mockResolvedValueOnce(updated)

      const store = useItemsStore()
      await store.fetchAll()

      const result = await store.fetchOne(sampleNote.id)
      expect(result).toEqual(updated)
      expect(store.findById(sampleNote.id)?.content).toBe('updated content')
    })
  })

  describe('create', () => {
    it('prepends the new item to the list', async () => {
      vi.mocked(itemsApi.create).mockResolvedValueOnce(sampleNote)
      const store = useItemsStore()

      const created = await store.create({
        contentType: 'note',
        title: 'New thing',
        content: 'Some content here',
      })

      expect(created).toEqual(sampleNote)
      expect(store.items[0]).toEqual(sampleNote)
    })

    it('sets error on failure', async () => {
      vi.mocked(itemsApi.create).mockRejectedValueOnce(new ApiError('Duplicate', 409))
      const store = useItemsStore()

      await expect(
        store.create({
          contentType: 'note',
          title: 'Dup',
          content: 'whatever',
        }),
      ).rejects.toThrow()

      expect(store.error).toBe('Duplicate')
    })
  })

  describe('update', () => {
    it('replaces the item in the local list', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      const updated = { ...sampleNote, title: 'New title' }
      vi.mocked(itemsApi.update).mockResolvedValueOnce(updated)

      const store = useItemsStore()
      await store.fetchAll()

      await store.update(sampleNote.id, { title: 'New title' })

      expect(store.findById(sampleNote.id)?.title).toBe('New title')
    })

    it('sets error on failure', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      vi.mocked(itemsApi.update).mockRejectedValueOnce(new ApiError('Not found', 404))
      const store = useItemsStore()
      await store.fetchAll()

      await expect(store.update(sampleNote.id, { title: 'x' })).rejects.toThrow()

      expect(store.error).toBe('Not found')
    })
  })

  describe('remove', () => {
    it('removes the item on success', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      vi.mocked(itemsApi.delete).mockResolvedValueOnce(undefined)

      const store = useItemsStore()
      await store.fetchAll()

      await store.remove(sampleNote.id)

      expect(store.count).toBe(2)
      expect(store.findById(sampleNote.id)).toBeUndefined()
    })

    it('keeps the item on failure', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      vi.mocked(itemsApi.delete).mockRejectedValueOnce(new ApiError('Not found', 404))

      const store = useItemsStore()
      await store.fetchAll()

      await expect(store.remove(sampleNote.id)).rejects.toThrow()
      expect(store.count).toBe(3)
    })
  })

  describe('byType', () => {
    it('filters items by content type', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      const store = useItemsStore()
      await store.fetchAll()

      expect(store.byType('livre')).toEqual([sampleBook])
      expect(store.byType('article')).toEqual([])
    })
  })

  describe('reset', () => {
    it('clears all state', async () => {
      vi.mocked(itemsApi.list).mockResolvedValueOnce(allSampleItems)
      const store = useItemsStore()
      await store.fetchAll()

      store.reset()

      expect(store.items).toEqual([])
      expect(store.initialized).toBe(false)
      expect(store.error).toBeNull()
    })
  })
})
