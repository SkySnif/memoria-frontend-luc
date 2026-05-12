# 🧪 Testing & TDD

> Red. Green. Refactor. The cycle is non-negotiable for any non-trivial code.

## The TDD loop

```text
        ┌────────────┐
        │   RED      │  Write a failing test.
        │            │  Run it. Confirm it fails for the right reason.
        └─────┬──────┘
              │
              ▼
        ┌────────────┐
        │   GREEN    │  Write the minimum code to make the test pass.
        │            │  Resist the urge to add "while I'm here…".
        └─────┬──────┘
              │
              ▼
        ┌────────────┐
        │  REFACTOR  │  Improve the design, keep tests green.
        │            │  Tests are your safety net.
        └─────┬──────┘
              │
              └──→ Next test.
```

Run tests in watch mode while coding: `pnpm test`.

## Three test layers

| Layer      | Folder              | Tool                     | What we test                           |
| :--------- | :------------------ | :----------------------- | :------------------------------------- |
| Unit       | `tests/unit/`       | Vitest                   | Services, composables, pure functions  |
| Component  | `tests/components/` | Vitest + @vue/test-utils | Component behavior (rendering, events) |
| End-to-end | `tests/e2e/`        | Playwright (later)       | Critical user flows in a real browser  |

**Where to spend effort, in priority order:** unit > component > e2e.

The unit layer is where your business logic lives (services, composables). It's fast (sub-second), deterministic, and forces good design. Don't over-test components — they're mostly glue. Don't write e2e for everything — keep it for the flows that would break the business.

## Unit tests: services

The canonical example is `tests/unit/api.test.ts`. Pattern:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('itemsApi', () => {
  const originalFetch = globalThis.fetch
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    fetchMock = vi.fn()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('list() fetches /items and returns parsed items', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: '1', title: 'Foo' /*…*/ }]), {
        headers: { 'content-type': 'application/json' },
      }),
    )

    const items = await itemsApi.list()

    expect(items).toHaveLength(1)
    expect(items[0].title).toBe('Foo')
  })
})
```

What we assert:

- **Behavior**, not internals. The test doesn't care that `api.get` is used internally — it cares that the result is correct.
- The **fetch call** (URL, method, body, credentials) when those are part of the contract.
- The **return value** type and content.

## Unit tests: composables

Composables are pure functions returning reactive state. Test them like any other function:

```ts
import { describe, it, expect, vi } from 'vitest'
import { useItems } from '@/composables/useItems'
import { itemsApi } from '@/services/itemsApi'

vi.mock('@/services/itemsApi')

describe('useItems', () => {
  it('load() sets items and toggles loading', async () => {
    vi.mocked(itemsApi.list).mockResolvedValueOnce([{ id: '1', title: 'Hello' } as Item])

    const { items, loading, load } = useItems()

    expect(loading.value).toBe(false)
    const promise = load()
    expect(loading.value).toBe(true)

    await promise
    expect(loading.value).toBe(false)
    expect(items.value).toHaveLength(1)
  })

  it('load() captures errors', async () => {
    vi.mocked(itemsApi.list).mockRejectedValueOnce(new ApiError(500, 'boom'))

    const { error, load } = useItems()
    await load()

    expect(error.value).toBe('boom')
  })
})
```

Mock the **service layer**, not fetch — this isolates the composable from HTTP details.

## Component tests

Use `@vue/test-utils` to mount components and inspect their behavior:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ItemCard from '@/components/ItemCard.vue'

describe('ItemCard', () => {
  it('renders the title', () => {
    const wrapper = mount(ItemCard, {
      props: { item: { id: '1', title: 'Hello' /*…*/ } },
    })

    expect(wrapper.text()).toContain('Hello')
  })

  it('emits delete when the delete button is clicked', async () => {
    const wrapper = mount(ItemCard, {
      props: { item: { id: '1', title: 'Hello' /*…*/ } },
    })

    await wrapper.find('[data-test="delete"]').trigger('click')

    expect(wrapper.emitted('delete')).toEqual([['1']])
  })
})
```

**Tips**:

- Add `data-test="..."` attributes to elements you query in tests. CSS classes can change for design reasons; `data-test` is stable.
- Test what the user can do (click, type) and what they see (text, presence of elements). Don't test internal state.
- Don't snapshot-test entire components — snapshots are brittle and rarely catch real bugs. Use them only for stable, well-defined output.

## Mocking strategies, from cheap to fancy

| Strategy                                    | When                                                                                                                                            |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Replace `globalThis.fetch` with `vi.fn`** | Testing the HTTP client itself.                                                                                                                 |
| **`vi.mock('@/services/...')`**             | Testing composables — isolate from HTTP.                                                                                                        |
| **MSW (Mock Service Worker)**               | When you want to keep `fetch` real but intercept at network level. Useful for integration-flavored tests. _Not yet installed; add when needed._ |

## Test setup

`tests/setup.ts` runs before every test file. Currently it stubs `VITE_API_BASE_URL` so URL construction works in tests. Add global mocks or custom matchers there if needed.

## Coverage

```bash
pnpm coverage
```

Generates an HTML report in `coverage/`. We don't enforce a coverage threshold (yet) — coverage is a smell detector, not a goal. **Aim for testing what matters, not for a number.**

## What NOT to test

- Vue framework internals (`v-if`, `v-for` — the framework is tested).
- Trivial getters / pure pass-through code.
- Generated types — TypeScript already checks them.
- Implementation details (private methods, internal state).

## What's worth testing every time

- ✅ Service methods: URL, method, body, headers, error handling.
- ✅ Composables: state transitions, error paths.
- ✅ Schemas: edge cases (`undefined`, empty strings, dates).
- ✅ Components: emitted events, prop-driven rendering, user interactions.
- ✅ Router guards: who can access what.

## Naming

```ts
describe('subject under test', () => {
  it('verb-first description of the expected behavior', () => {
    /* ... */
  })
})
```

Examples:

- ✅ `it('returns null when no user is logged in')`
- ✅ `it('throws ApiError on a 401 response')`
- ❌ `it('test 1')` / `it('should work')`

## Related docs

- [`02-api-service.md`](./02-api-service.md) — the service being tested in `api.test.ts`.
- [`../conventions/01-typescript-style.md`](../conventions/01-typescript-style.md) — TSDoc style applied to test files too.

[⬆ Back to docs index](../README.md)

---

_Dernière mise à jour : 12/05/2026_
