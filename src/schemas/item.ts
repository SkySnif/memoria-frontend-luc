import { z } from 'zod'

/**
 * Type of content stored in an item.
 *
 * @remarks
 * Mirrors the backend `content_type_enum`.
 *
 * @public
 */
export const contentTypeSchema = z.enum(['livre', 'podcast', 'article', 'video', 'note'])

/**
 * Inferred TypeScript type for a ContentType.
 *
 * @public
 */
export type ContentType = z.infer<typeof contentTypeSchema>

/**
 * Free-form JSONB metadata stored alongside an item.
 *
 * @remarks
 * Typical fields by content type (purely conventional, the backend
 * doesn't validate the shape):
 * - `livre`   → `{ isbn, pages, language }`
 * - `podcast` → `{ duration, channel, episode }`
 * - `video`   → `{ duration, channel, source_url }`
 * - `article` → `{ source_url, published_at }`
 * - `note`    → anything the user wants
 *
 * @public
 */
export const itemMetadataSchema = z.object({}).catchall(z.unknown())

/**
 * Inferred TypeScript type for ItemMetadata.
 *
 * @public
 */
export type ItemMetadata = z.infer<typeof itemMetadataSchema>

/**
 * Field-level validators — the single source of truth for each item field's
 * validation rules and error messages.
 *
 * @remarks
 * Composed into the public schemas below (`createItemPayloadSchema`,
 * `updateItemPayloadSchema`, `itemSchema`). To change a rule or message for
 * a given field, edit it here once and all derived schemas update.
 *
 * Server-managed fields (`id`, `userId`, `slug`, timestamps) are NOT in this
 * object — they live in `itemSchema` directly since they're never user-edited.
 *
 * @internal
 */
const fields = {
  contentType: contentTypeSchema,
  title: z
    .string()
    .min(1, 'Le titre est obligatoire')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  content: z.string().min(1, 'Le contenu est obligatoire'),
  sourceAuthor: z.string().max(50, "L'auteur ne peut pas dépasser 50 caractères"),
  thumbnailUrl: z.url('URL invalide').max(255).nullable(),
  metadata: itemMetadataSchema,
} as const

/**
 * Full Item shape as returned by the API.
 *
 * @remarks
 * Mirrors the `items` table with snake_case columns mapped to camelCase
 * (`id_item` → `id`, `user_id` → `userId`, etc.). The backend always
 * returns all fields populated (defaults applied for optional inputs).
 *
 * @public
 */
export const itemSchema = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  slug: z.string().min(1),
  contentType: fields.contentType,
  title: fields.title,
  content: fields.content,
  sourceAuthor: fields.sourceAuthor, // always populated server-side (default 'N.C')
  thumbnailUrl: fields.thumbnailUrl, // nullable but never undefined
  metadata: fields.metadata,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
})

/**
 * Inferred TypeScript type for an Item.
 *
 * @public
 */
export type Item = z.infer<typeof itemSchema>

/**
 * Response shape for `GET /items` — an array of items.
 *
 * @public
 */
export const itemListSchema = z.array(itemSchema)

/**
 * Payload for `POST /items` — creating a new item.
 *
 * @remarks
 * Picks the user-editable subset of fields. Required: `contentType`, `title`,
 * `content`. Optional (server applies defaults): `sourceAuthor` (→ 'N.C'),
 * `thumbnailUrl` (→ null), `metadata` (→ {}).
 *
 * The backend auto-generates `id`, `slug` (from title), `userId` (from
 * session), and timestamps.
 *
 * @public
 */
export const createItemPayloadSchema = z.object({
  contentType: fields.contentType,
  title: fields.title,
  content: fields.content,
  sourceAuthor: fields.sourceAuthor.optional(),
  thumbnailUrl: fields.thumbnailUrl.optional(),
  metadata: fields.metadata.optional(),
})

/**
 * Inferred TypeScript type for the create payload.
 *
 * @public
 */
export type CreateItemPayload = z.infer<typeof createItemPayloadSchema>

/**
 * Payload for `PATCH /items/:id` — partial update.
 *
 * @remarks
 * All fields optional (typical PATCH semantics). The slug is regenerated
 * server-side if the title changes.
 *
 * @public
 */
export const updateItemPayloadSchema = createItemPayloadSchema.partial()

/**
 * Inferred TypeScript type for the update payload.
 *
 * @public
 */
export type UpdateItemPayload = z.infer<typeof updateItemPayloadSchema>
