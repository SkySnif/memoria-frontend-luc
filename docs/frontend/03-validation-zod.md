# 🛡 Validation with Zod

> Schemas are the **single source of truth** for both runtime validation and TypeScript types.

## The core idea

In a traditional setup, you maintain two parallel definitions:

```ts
// 1. The runtime check
function validateItem(data: unknown) {
  if (typeof data !== 'object' || data === null) return false
  // ...
}

// 2. The type, kept in sync by hand
interface Item {
  id: string
  title: string
}
```

That's a recipe for drift. With Zod, you write the schema once and **derive the type**:

```ts
import { z } from 'zod'

export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string().datetime(),
})

export type Item = z.infer<typeof itemSchema>
//          ^? { id: string; title: string; created_at: string }
```

One source. The type follows the schema automatically.

## Where schemas live

All schemas go in `src/schemas/`, one file per **entity** (singular noun):

```text
schemas/
├─ item.ts
├─ user.ts
├─ tag.ts
└─ share.ts
```

Each file exports:

- The base entity schema.
- The inferred type with the same PascalCase name as the entity.
- Derived schemas for DTOs (create, update).

## A complete schema file

```ts
// src/schemas/item.ts
import { z } from 'zod'

/**
 * The shape of an Item as returned by the backend.
 *
 * @public
 */
export const itemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string(),
  slug: z.string(),
  author_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

/** Inferred TypeScript type for an Item. @public */
export type Item = z.infer<typeof itemSchema>

/**
 * Schema for creating a new Item. The backend assigns id, slug, timestamps.
 *
 * @public
 */
export const newItemSchema = itemSchema.pick({
  title: true,
  content: true,
})

/** Inferred type for an Item creation payload. @public */
export type NewItem = z.infer<typeof newItemSchema>

/**
 * Schema for updating an Item. All fields are optional.
 *
 * @public
 */
export const itemUpdateSchema = newItemSchema.partial()

/** Inferred type for an Item update payload. @public */
export type ItemUpdate = z.infer<typeof itemUpdateSchema>
```

## Using schemas with `api`

The api service takes the schema as a parameter and parses the response:

```ts
const item = await api.get(`/items/${id}`, itemSchema)
// `item` is typed as Item, AND has been validated at runtime
```

If the response doesn't match (e.g. backend drift, missing field), `ZodError` is thrown synchronously after parsing. This is _defensive coding_ — catches backend bugs before they propagate to the UI.

## Validating user input (forms)

The same schema can power form validation:

```ts
import { newItemSchema } from '@/schemas/item'

function validateForm(formData: unknown) {
  const result = newItemSchema.safeParse(formData)
  if (!result.success) {
    return { ok: false, errors: result.error.flatten().fieldErrors }
  }
  return { ok: true, data: result.data }
}
```

`safeParse` returns a discriminated union (`{ success: true, data }` or `{ success: false, error }`) instead of throwing — convenient for forms where errors are expected.

## Duplication with the backend

We **duplicate** schemas between this repo and the backend (deliberate choice, see project README). Implications:

- The backend remains the **source of truth** for the data model.
- This repo's schemas should mirror `backend/src/validators/*.js`.
- If a backend schema changes, update the matching frontend schema in the same PR.

To minimize drift:

- Keep field names identical (snake_case as the backend returns them).
- Use the same constraints (`.min(1)`, `.uuid()`, `.email()`, etc.).
- Document any intentional divergence in a comment.

When the project matures, we'll likely extract schemas into a shared package — for now, duplication keeps each repo autonomous.

## Common patterns

### Transforming values

```ts
const dateSchema = z
  .string()
  .datetime()
  .transform((s) => new Date(s))
// Use this when you want Date objects, not strings, in your views.
```

### Discriminated unions

```ts
const eventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('login'), user_id: z.string() }),
  z.object({ type: z.literal('logout'), user_id: z.string(), reason: z.string() }),
])
```

### Reusable building blocks

```ts
// src/schemas/_common.ts
export const uuidSchema = z.string().uuid()
export const timestampSchema = z.string().datetime()

// elsewhere
const userSchema = z.object({
  id: uuidSchema,
  created_at: timestampSchema,
  // ...
})
```

(Underscore prefix on the filename marks it as internal helpers within `schemas/`.)

### Arrays

For list endpoints, wrap the entity schema with `z.array`:

```ts
const itemListSchema = z.array(itemSchema)
const items = await api.get('/items', itemListSchema)
```

### Paginated responses

```ts
const paginatedItemsSchema = z.object({
  data: z.array(itemSchema),
  page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
})
type PaginatedItems = z.infer<typeof paginatedItemsSchema>
```

## What Zod doesn't do (and why that's fine)

- **Form library replacement** — Zod validates, but doesn't manage form state, dirty fields, or per-field error display. Pair it with vanilla refs or a form library (VeeValidate) when forms get complex.
- **Schema generation from the backend** — we mirror by hand. Tools exist (`drizzle-zod`, `zod-openapi`) but adding them now would be premature.
- **API contracts at the network level** — Zod runs _after_ fetch returns. For static contract checks across services, OpenAPI / GraphQL fit better. Not needed here.

## Related docs

- [`02-api-service.md`](./02-api-service.md) — how schemas pair with the HTTP client.
- [`../conventions/01-typescript-style.md`](../conventions/01-typescript-style.md) — naming for schemas and inferred types.

[⬆ Back to docs index](../README.md)

---

_Dernière mise à jour : 12/05/2026_
