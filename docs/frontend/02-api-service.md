# 🌐 The API Service

> The single point through which the frontend talks to the backend.

## Overview

`src/services/api.ts` exports two things:

- **`api`** — the HTTP client object. **This is what you use.**
- **`ApiError`** — typed error thrown on any non-2xx response.

```ts
import { api, ApiError } from '@/services/api'
```

Plus a few types: `ApiRequestOptions` for typing options bags.

## Why an object (not a class)

The HTTP client is exported as an **object literal**, not a class. This matches the idiomatic Vue 3 / ESM style: encapsulation is provided by the module boundary itself (the `rawRequest` helper is not exported, therefore not reachable from outside the file), and the entire codebase stays consistent — composables and Pinia stores are also function/object-based.

A class would have given us real `private` modifiers, but at the cost of stylistic inconsistency with the rest of the app. The TSDoc tags (`@public`, `@internal`) document visibility explicitly without changing the runtime style.

## Public API

Every verb method takes a Zod schema and returns its inferred type:

```ts
api.get<T>(path, schema, options?)        → Promise<T>
api.post<T>(path, body, schema, options?) → Promise<T>
api.put<T>(path, body, schema, options?)  → Promise<T>
api.patch<T>(path, body, schema, options?) → Promise<T>
api.delete(path, options?)                → Promise<void>
```

Options are uniform:

```ts
interface ApiRequestOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
}
```

## Conventions baked in

What the client does **automatically**, so you never repeat it:

- ✅ Prefixes the URL with `VITE_API_BASE_URL`.
- ✅ Sends session cookies (`credentials: 'include'`).
- ✅ Sets `Accept: application/json` on every request.
- ✅ Sets `Content-Type: application/json` and JSON-stringifies the body when present.
- ✅ Parses JSON responses (with a text fallback for non-JSON).
- ✅ Validates the response body against the provided Zod schema.
- ✅ Throws `ApiError(status, message, body)` on non-2xx.

## Usage examples

### Simple GET

```ts
import { z } from 'zod'
import { api } from '@/services/api'

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
})

const me = await api.get('/users/me', userSchema)
// `me` is fully typed: { id: string; email: string }
```

### POST with a body

```ts
const createdItem = await api.post(
  '/items',
  { title: 'New idea', content: 'Lorem ipsum…' },
  itemSchema,
)
```

### DELETE (no schema)

```ts
await api.delete(`/items/${id}`)
```

### Cancellation with AbortSignal

```ts
const controller = new AbortController()

onUnmounted(() => controller.abort())

const items = await api.get('/items', z.array(itemSchema), {
  signal: controller.signal,
})
```

This is how composables that fetch on mount can cancel their request when the view unmounts.

### Error handling

```ts
try {
  await api.get('/users/me', userSchema)
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      router.push('/login')
      return
    }
    flash.error(err.message)
    return
  }
  throw err // re-throw unknown errors
}
```

## Extending per-resource

We don't call `api.*` directly from views. Instead, each backend resource gets its own service file that wraps `api`:

```ts
// src/services/itemsApi.ts
import { z } from 'zod'
import { api } from './api'
import { itemSchema, type NewItem } from '@/schemas/item'

const itemListSchema = z.array(itemSchema)

/**
 * Items API — wraps `api` for the `/items` resource.
 *
 * @public
 */
export const itemsApi = {
  list: () => api.get('/items', itemListSchema),
  get: (id: string) => api.get(`/items/${id}`, itemSchema),
  create: (data: NewItem) => api.post('/items', data, itemSchema),
  update: (id: string, data: Partial<NewItem>) => api.patch(`/items/${id}`, data, itemSchema),
  remove: (id: string) => api.delete(`/items/${id}`),
}
```

This pattern gives us:

- **DRY**: the path and the schema are stated once.
- **Discoverable**: IDE autocomplete shows everything the backend offers for this resource.
- **Mockable**: tests mock `itemsApi`, not raw fetch.

## CSRF — pending

The Memoria backend uses CSRF protection via `csrfMiddleware`. The current `api` does **not** inject a CSRF token — that's intentional and tracked as work for the auth module.

The planned approach (when wired):

1. On app start (and after every login), fetch the CSRF token from `/api/csrf-token`.
2. Store it in memory (not localStorage — too easy to extract).
3. Inject as `X-CSRF-Token` header on every mutating request (POST/PUT/PATCH/DELETE).
4. Refresh on 403 with a CSRF error code.

This will be added by extending `rawRequest` once the backend exposes the endpoint.

## Testing

The test file `tests/unit/api.test.ts` shows the canonical pattern. The recipe:

1. Replace `globalThis.fetch` with a `vi.fn()` in `beforeEach`.
2. Configure the mock with `mockResolvedValueOnce(...)`.
3. Call the API method.
4. Assert both the **return value** (was the schema applied?) and the **fetch call** (URL, method, headers, body, credentials).

When the codebase grows, we'll switch to **MSW** (Mock Service Worker) which intercepts requests at the network layer — closer to integration testing. For the foundation, fetch replacement keeps the test suite tiny and fast.

## Performance notes

- The schema parse happens on **every** response. For typical payloads this is sub-millisecond.
- For huge arrays (>10k items), prefer paginating server-side rather than schema-parsing the whole thing at once.
- The client doesn't deduplicate concurrent requests. If you need that (e.g. fetching the same resource from two composables simultaneously), implement it at the composable layer or introduce a request-cache later.

## Related docs

- [`03-validation-zod.md`](./03-validation-zod.md) — how the schemas paired with `api` work.
- [`04-testing-tdd.md`](./04-testing-tdd.md) — the test patterns.
- [`../architecture.md`](../architecture.md) — where `api` sits in the architecture.

[⬆ Back to docs index](../README.md)

---

_Dernière mise à jour : 12/05/2026_
