# 🏛 Architecture — MVVM, the Vue way

> **TL;DR**: Vue 3's Composition API _is_ MVVM. The pattern emerges from the file structure rather than being imposed by ceremony.

## Why MVVM (and not MVP)

MVVM (Model–View–ViewModel) and MVP (Model–View–Presenter) are siblings — both separate UI from logic. The difference is in how they communicate:

- **MVP** uses a Presenter that manually pushes data to a passive View. Common in Android (historical) and WPF without binding.
- **MVVM** uses two-way data binding between View and ViewModel. The View observes the ViewModel reactively.

Vue 3 ships with reactivity (`ref`, `reactive`, `computed`) and binding (`v-model`) **as core primitives**. This means MVVM is the natural fit — implementing MVP would mean fighting the framework.

## The three layers

```text
┌──────────────────────────────────────────────────────────────────┐
│  VIEW           src/views/*.vue + src/components/*.vue           │
│                 Templates declaratively bound to reactive state. │
│                 No business logic. No fetch. No domain rules.    │
├──────────────────────────────────────────────────────────────────┤
│  VIEW MODEL     src/composables/use*.ts                          │
│                 Reactive state + actions consumed by views.      │
│                 Calls services, exposes refs/computed/methods.   │
├──────────────────────────────────────────────────────────────────┤
│  MODEL          src/services/*.ts    HTTP + side effects         │
│                 src/schemas/*.ts     Zod schemas + inferred types│
│                 src/stores/*.ts      Pinia stores (shared state) │
│                                                                  │
│                 The Model is pure: no DOM, no Vue components.    │
└──────────────────────────────────────────────────────────────────┘
```

## Concrete mapping

For a feature like "list my items", the layers look like this:

```ts
// MODEL — src/schemas/item.ts
export const itemSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string().datetime(),
})
export type Item = z.infer<typeof itemSchema>

// MODEL — src/services/itemsApi.ts
export const itemsApi = {
  list: () => api.get('/items', z.array(itemSchema)),
}

// VIEW MODEL — src/composables/useItems.ts
export function useItems() {
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    loading.value = true
    try {
      items.value = await itemsApi.list()
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, load }
}

// VIEW — src/views/ItemsListView.vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useItems } from '@/composables/useItems'

const { items, loading, error, load } = useItems()
onMounted(load)
</script>

<template>
  <p v-if="loading">Loading…</p>
  <p v-else-if="error">{{ error }}</p>
  <ul v-else>
    <li v-for="item in items" :key="item.id">{{ item.title }}</li>
  </ul>
</template>
```

Three files, three responsibilities, zero ceremony. The View never knows fetch exists. The ViewModel never builds DOM. The Model never touches Vue reactivity.

## Pinia: when (and when not)

Pinia is for **truly shared state** across unrelated views. Examples:

- ✅ Current authenticated user (`useAuthStore`) — needed everywhere.
- ✅ Flash messages / global toasts (`useFlashStore`).
- ✅ Theme / preferences.

It is **not** the default container for every piece of state. A list of items, the form being edited, modal open/close state — all of that belongs in a composable scoped to the views that use it. Spawning a store per entity is anti-KISS.

**Rule:** start with a composable. Promote to a store only when at least two unrelated views need the same state.

## Why composables instead of services + DI containers

In a Java/Spring world, you'd see `@Service`, `@Autowired`, an interface, an implementation, maybe a factory. In Vue 3:

- A **composable** (`useXxx`) plays the role of the service for a given view family.
- "Injection" happens via plain imports — ESM modules are already singletons.
- Testing happens by mocking the imported modules (or passing dependencies explicitly to the composable factory).

No container, no decorators, no `@Inject`. Less code, same testability.

## Data flow

```text
                  User action
                       │
                       ▼
            ┌──────────────────┐
            │      VIEW        │  (button click, v-model update)
            └─────────┬────────┘
                      │ calls method
                      ▼
            ┌──────────────────┐
            │   VIEW MODEL     │  (composable: mutates ref, calls service)
            └─────────┬────────┘
                      │ HTTP / schema
                      ▼
            ┌──────────────────┐
            │      MODEL       │  (api.ts + Zod + backend)
            └─────────┬────────┘
                      │ parsed + typed data
                      ▼
            ┌──────────────────┐
            │   VIEW MODEL     │  (assigns to ref → reactivity)
            └─────────┬────────┘
                      │ reactive re-render
                      ▼
            ┌──────────────────┐
            │      VIEW        │  (template updates)
            └──────────────────┘
```

## Design patterns in use

Deliberate choices, _not_ cargo-culted:

- **Module / Singleton (implicit)** — `export const api = { ... }`. ESM guarantees one instance per bundle.
- **Facade** — `api` hides fetch, headers, serialization, error handling, validation behind a small public surface.
- **Dependency Injection (by parameter)** — Zod schemas are passed to `api.get(path, schema)`. No container.
- **Strategy (light)** — different schemas = different validation strategies.
- **Closure pattern** — composables encapsulate reactive state in their closure scope.

Deliberately **avoided**:

- ❌ Factory — no justification, would add noise.
- ❌ Builder / method chaining — `api.builder().withHeaders().send()` is theater.
- ❌ Class-based singletons with `getInstance()` — anti-pattern in ESM.
- ❌ Repository pattern — handled backend-side; on the front, `services/` is enough.
- ❌ Observer manually wired — Vue reactivity already does this.

## Related docs

- [`frontend/02-api-service.md`](./frontend/02-api-service.md) — the HTTP client in depth.
- [`frontend/03-validation-zod.md`](./frontend/03-validation-zod.md) — schemas as the source of truth.
- [`conventions/01-typescript-style.md`](./conventions/01-typescript-style.md) — code style and visibility.

[⬆ Back to docs index](./README.md)

---

_Dernière mise à jour : 12/05/2026_
