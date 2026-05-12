import { http, HttpResponse } from 'msw'
import type { Item } from '@/schemas/item'
import { allSampleItems } from '@/mocks/fixtures/items'

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1'

/**
 * In-memory store of items, seeded with sample fixtures.
 * Resets on every page reload.
 *
 * @internal
 */
const mockItems: Item[] = [...allSampleItems]

interface CreateItemBody {
  contentType?: Item['contentType']
  title?: string
  content?: string
  sourceAuthor?: string
  thumbnailUrl?: string | null
  metadata?: Record<string, unknown>
}

type UpdateItemBody = Partial<CreateItemBody>

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * MSW handlers for the `/items/*` endpoints.
 *
 * @internal
 */
export const itemsHandlers = [
  http.get(`${baseUrl}/items`, () => {
    return HttpResponse.json(mockItems)
  }),

  http.get(`${baseUrl}/items/:id`, ({ params }) => {
    const item = mockItems.find((i) => i.id === params.id)
    if (!item) {
      return HttpResponse.json({ message: 'Item introuvable' }, { status: 404 })
    }
    return HttpResponse.json(item)
  }),

  http.post(`${baseUrl}/items`, async ({ request }) => {
    const body = (await request.json()) as CreateItemBody
    const now = new Date().toISOString()

    const newItem: Item = {
      id: crypto.randomUUID(),
      userId: '00000000-0000-4000-8000-000000000000',
      contentType: body.contentType ?? 'note',
      title: body.title ?? '',
      slug: slugify(body.title ?? 'untitled'),
      content: body.content ?? '',
      sourceAuthor: body.sourceAuthor ?? 'N.C',
      thumbnailUrl: body.thumbnailUrl ?? null,
      metadata: body.metadata ?? {},
      createdAt: now,
      updatedAt: null,
    }

    mockItems.push(newItem)
    return HttpResponse.json(newItem, { status: 201 })
  }),

  http.patch(`${baseUrl}/items/:id`, async ({ params, request }) => {
    const idx = mockItems.findIndex((i) => i.id === params.id)
    if (idx === -1) {
      return HttpResponse.json({ message: 'Item introuvable' }, { status: 404 })
    }

    const body = (await request.json()) as UpdateItemBody
    const existing = mockItems[idx]

    const updated: Item = {
      ...existing,
      ...(body.contentType ? { contentType: body.contentType } : {}),
      ...(body.title ? { title: body.title, slug: slugify(body.title) } : {}),
      ...(body.content !== undefined ? { content: body.content } : {}),
      ...(body.sourceAuthor !== undefined ? { sourceAuthor: body.sourceAuthor || 'N.C' } : {}),
      ...(body.thumbnailUrl !== undefined ? { thumbnailUrl: body.thumbnailUrl || null } : {}),
      ...(body.metadata !== undefined ? { metadata: body.metadata } : {}),
      updatedAt: new Date().toISOString(),
    }

    mockItems[idx] = updated
    return HttpResponse.json(updated)
  }),

  http.delete(`${baseUrl}/items/:id`, ({ params }) => {
    const idx = mockItems.findIndex((i) => i.id === params.id)
    if (idx === -1) {
      return HttpResponse.json({ message: 'Item introuvable' }, { status: 404 })
    }
    mockItems.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
