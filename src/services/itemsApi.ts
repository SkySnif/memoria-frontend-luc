import { api } from '@/services/api'
import {
  itemSchema,
  itemListSchema,
  type CreateItemPayload,
  type Item,
  type UpdateItemPayload,
} from '@/schemas/item'

/**
 * Items API — CRUD operations on user-owned items.
 *
 * @remarks
 * All requests go through the `api` service (session cookies, Zod
 * validation). The backend filters by the authenticated user
 * automatically.
 *
 * @public
 */
export const itemsApi = {
  /**
   * GET /items — list all items for the current user.
   *
   * @public
   */
  async list(): Promise<Item[]> {
    return api.get('/items', itemListSchema)
  },

  /**
   * GET /items/:id — fetch a single item by id.
   *
   * @throws {ApiError} 404 if the item doesn't exist or belongs to another user.
   *
   * @public
   */
  async get(id: string): Promise<Item> {
    return api.get(`/items/${id}`, itemSchema)
  },

  /**
   * POST /items — create a new item.
   *
   * @public
   */
  async create(payload: CreateItemPayload): Promise<Item> {
    return api.post('/items', payload, itemSchema)
  },

  /**
   * PATCH /items/:id — partial update of an item.
   *
   * @public
   */
  async update(id: string, payload: UpdateItemPayload): Promise<Item> {
    return api.patch(`/items/${id}`, payload, itemSchema)
  },

  /**
   * DELETE /items/:id — remove an item.
   *
   * @public
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/items/${id}`)
  },
}
