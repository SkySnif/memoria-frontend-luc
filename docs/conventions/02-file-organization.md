# 📂 File Organization

> Where things go, and why. When unsure, this is the reference.

## Top-level layout

```text
memoria-frontend/
├─ public/                  # Static assets served as-is (icons, robots.txt)
├─ src/                     # Application source
├─ tests/                   # Test files
├─ docs/                    # This documentation
├─ env.d.ts                 # Vite + PWA ambient types
├─ index.html               # HTML entry (referenced by Vite)
├─ package.json
├─ tsconfig*.json           # TS project references
├─ vite.config.ts
├─ vitest.config.ts
├─ eslint.config.js
└─ .prettierrc.json
```

## `src/` — application source

Each subfolder corresponds to one layer of the MVVM architecture.

```text
src/
├─ assets/        # CSS, fonts, images bundled by Vite (referenced from code)
├─ components/    # Reusable UI components (PascalCase.vue)
├─ composables/   # ViewModels — use*.ts
├─ router/        # Vue Router config + navigation guards
├─ schemas/       # Zod schemas — single source of truth for types
├─ services/      # HTTP / side-effecting code (xxxApi.ts)
├─ stores/        # Pinia stores (only for truly shared state)
├─ types/         # Cross-cutting TypeScript types
├─ views/         # Routed pages — XxxView.vue
├─ App.vue        # Root component
└─ main.ts        # Bootstrap
```

### When to put a file where

Decision tree:

```text
Is it a routed page?                  → src/views/
Is it a reusable UI element?          → src/components/
Is it reactive state + actions?       → src/composables/
Does it call the backend?             → src/services/
Is it a Zod schema or inferred type?  → src/schemas/
Is it shared state across views?      → src/stores/
Is it pure utility (no Vue, no HTTP)? → src/types/ or alongside the consumer
```

### Components vs. views

- **View**: tied to a route (`/items`, `/items/:id`). Mostly orchestration, calls composables, lays out components.
- **Component**: not tied to a route. Reusable. Props-driven. Emits events.

Heuristic: if you can use it in two different views, it's a component. If it represents _one page_, it's a view.

### Service files

One file per backend resource, named `xxxApi.ts`:

```text
services/
├─ api.ts            # The shared HTTP client (the `api` singleton)
├─ authApi.ts        # /auth/* endpoints
├─ itemsApi.ts       # /items/* endpoints
├─ tagsApi.ts        # /tags/* endpoints
└─ sharesApi.ts      # /shares/* endpoints
```

Each service exports a typed object with methods that map 1:1 to backend endpoints:

```ts
// services/itemsApi.ts
export const itemsApi = {
  list: () => api.get('/items', z.array(itemSchema)),
  get: (id: string) => api.get(`/items/${id}`, itemSchema),
  create: (data: NewItem) => api.post('/items', data, itemSchema),
  update: (id: string, data: ItemUpdate) => api.patch(`/items/${id}`, data, itemSchema),
  delete: (id: string) => api.delete(`/items/${id}`),
}
```

### Schema files

One file per _entity_, singular name:

```text
schemas/
├─ item.ts           # Item + NewItem + ItemUpdate schemas and types
├─ user.ts
├─ tag.ts
└─ share.ts
```

Each schema file exports:

- The base entity schema.
- Inferred type with the same name (PascalCase).
- Derived schemas for create/update DTOs.

```ts
export const itemSchema = z.object({
  /* ... */
})
export type Item = z.infer<typeof itemSchema>

export const newItemSchema = itemSchema.omit({ id: true, created_at: true })
export type NewItem = z.infer<typeof newItemSchema>
```

### Composables

One file per feature, prefix `use`:

```text
composables/
├─ useAuth.ts        # current user, login/logout actions
├─ useItems.ts       # items list, filters, pagination
├─ useItem.ts        # single item by id (detail view)
└─ useShare.ts       # share creation flow
```

Naming: `useThing` (singular) for one resource, `useThings` (plural) for collections.

### Stores

One file per shared concern. **Use sparingly**.

```text
stores/
├─ useAuthStore.ts   # current user (read by guards, navbar, profile)
└─ useFlashStore.ts  # global toasts/flash messages
```

If you think you need a third one, ask: is the state really shared, or just convenient? Most often: it's not.

## `tests/`

Mirrors `src/`:

```text
tests/
├─ unit/             # Pure logic: services, composables, utils
│  ├─ api.test.ts
│  ├─ itemsApi.test.ts
│  └─ useItems.test.ts
├─ components/       # Component-level tests with @vue/test-utils
│  └─ ItemCard.test.ts
├─ setup.ts          # Global setup (env stubs, custom matchers)
└─ e2e/              # Playwright tests (later)
```

## `docs/`

Mirrors the backend's `docs/` structure:

```text
docs/
├─ README.md                          # Index
├─ architecture.md                    # MVVM, layers, data flow
├─ frontend/
│  ├─ 01-getting-started.md
│  ├─ 02-api-service.md
│  ├─ 03-validation-zod.md
│  ├─ 04-testing-tdd.md
│  └─ 05-pwa-offline.md
└─ conventions/
   ├─ 01-typescript-style.md
   └─ 02-file-organization.md
```

Numbered prefixes (`01-`, `02-`) define reading order.

## Files that don't fit anywhere

If you can't decide where a file goes, it usually means **the file does too much**. Split it.

Concrete examples:

- A composable that also exports an API helper → split the helper into `services/`.
- A schema file that defines view-only types → keep the view-only type next to the view, the schema in `schemas/`.
- A utility used by exactly one component → put it in the same folder as the component, not in `types/` or a "shared" bucket.

## Related docs

- [`01-typescript-style.md`](./01-typescript-style.md) — naming and visibility.
- [`../architecture.md`](../architecture.md) — the layers behind the folder structure.

[⬆ Back to docs index](../README.md)

---

_Dernière mise à jour : 12/05/2026_
