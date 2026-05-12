import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { itemsApi } from '@/services/itemsApi'
import { ApiError } from '@/services/api'
import type { ContentType, CreateItemPayload, Item, UpdateItemPayload } from '@/schemas/item'

/**
 * Pinia store managing the user's items.
 *
 * @remarks
 * Setup-style store. Holds the in-memory list, plus loading/error flags
 * for UI binding. `initialized` distinguishes "never fetched" from
 * "fetched, empty list".
 *
 * @public
 */
export const useItemsStore = defineStore('items', () => {
  // ─── state ─────────────────────────────────────────────────────
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // ─── getters ───────────────────────────────────────────────────
  const count = computed(() => items.value.length)
  const isEmpty = computed(() => initialized.value && items.value.length === 0)

  function byType(type: ContentType): Item[] {
    return items.value.filter((i) => i.contentType === type)
  }

  function findById(id: string): Item | undefined {
    return items.value.find((i) => i.id === id)
  }

  // ─── actions ───────────────────────────────────────────────────

  async function fetchAll(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      items.value = await itemsApi.list()
      initialized.value = true
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur lors du chargement'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single item by id. Used by the edit form when the item isn't
   * already in `items` (e.g. direct navigation, page reload).
   */
  async function fetchOne(id: string): Promise<Item> {
    loading.value = true
    error.value = null
    try {
      const item = await itemsApi.get(id)
      // Keep the local cache in sync if we have it.
      const idx = items.value.findIndex((i) => i.id === id)
      if (idx >= 0) items.value[idx] = item
      return item
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur lors du chargement'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CreateItemPayload): Promise<Item> {
    loading.value = true
    error.value = null
    try {
      const created = await itemsApi.create(payload)
      items.value.unshift(created)
      return created
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur lors de la création'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, payload: UpdateItemPayload): Promise<Item> {
    loading.value = true
    error.value = null
    try {
      const updated = await itemsApi.update(id, payload)
      const idx = items.value.findIndex((i) => i.id === id)
      if (idx >= 0) items.value[idx] = updated
      return updated
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur lors de la mise à jour'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await itemsApi.delete(id)
      items.value = items.value.filter((i) => i.id !== id)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur lors de la suppression'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    items.value = []
    loading.value = false
    error.value = null
    initialized.value = false
  }

  return {
    // state
    items,
    loading,
    error,
    initialized,
    // getters
    count,
    isEmpty,
    byType,
    findById,
    // actions
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    reset,
  }
})
