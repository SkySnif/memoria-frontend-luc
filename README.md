# 🐼 Memoria Frontend

Progressive Web App for [Memoria](../memoria-backend) — your second brain.

[![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-3.x-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)

---

## 🆕 Nouveau sur le projet ?

Si tu reprends ce projet, **commence par lire [`ONBOARDING.md`](./ONBOARDING.md)** : stack, setup, structure, conventions, par où commencer.

La liste des tâches en cours et à reprendre est dans [`TODO.md`](./TODO.md).

---

## 📚 Documentation

Full documentation is in the **[`docs/`](./docs/README.md)** folder, mirroring the backend's structure.

| Area                | Entry point                                                                              |
| :------------------ | :--------------------------------------------------------------------------------------- |
| **Architecture**    | [`docs/architecture.md`](./docs/architecture.md) — MVVM in depth                         |
| **Getting started** | [`docs/frontend/01-getting-started.md`](./docs/frontend/01-getting-started.md)           |
| **API service**     | [`docs/frontend/02-api-service.md`](./docs/frontend/02-api-service.md)                   |
| **Validation Zod**  | [`docs/frontend/03-validation-zod.md`](./docs/frontend/03-validation-zod.md)             |
| **Testing TDD**     | [`docs/frontend/04-testing-tdd.md`](./docs/frontend/04-testing-tdd.md)                   |
| **PWA & offline**   | [`docs/frontend/05-pwa-offline.md`](./docs/frontend/05-pwa-offline.md)                   |
| **TS style guide**  | [`docs/conventions/01-typescript-style.md`](./docs/conventions/01-typescript-style.md)   |
| **File layout**     | [`docs/conventions/02-file-organization.md`](./docs/conventions/02-file-organization.md) |
| **Git workflow**    | [`docs/conventions/03-git-workflow.md`](./docs/conventions/03-git-workflow.md)           |

## Architecture — MVVM, the Vue way

Vue 3 with Composition API implements MVVM naturally. No artificial layers:

```text
┌──────────────────────────────────────────────────────────────────┐
│  VIEW           src/views/*.vue + src/components/*.vue           │
│                 Templates declaratively bound to reactive state. │
├──────────────────────────────────────────────────────────────────┤
│  VIEW MODEL     src/composables/use*.ts                          │
│                 Reactive state + actions consumed by views.      │
├──────────────────────────────────────────────────────────────────┤
│  MODEL          src/services/*.ts    HTTP + side effects         │
│                 src/schemas/*.ts     Zod schemas + inferred types│
│                 src/stores/*.ts      Pinia stores (shared state) │
└──────────────────────────────────────────────────────────────────┘
```

**Rule of thumb:**

- A `.vue` file holds template + minimal glue, no business logic.
- Business logic lives in a `useXxx` composable next to the views that consume it, or in `src/composables/` if shared.
- HTTP is centralized in `src/services/api.ts`. Per-resource APIs (`authApi`, `itemsApi`…) live next to it.
- Zod schemas in `src/schemas/` are the **single source of truth** for both runtime validation and TypeScript types (`z.infer<typeof schema>`).

## Stack

| Layer       | Choice                           | Why                                                 |
| :---------- | :------------------------------- | :-------------------------------------------------- |
| Framework   | Vue 3 + Composition API          | Native MVVM, reactivity, TS-first.                  |
| Build       | Vite                             | Fast dev, ESM-native, plugin ecosystem.             |
| Language    | TypeScript (strict)              | Catch bugs at compile time, DRY with Zod inference. |
| Routing     | Vue Router 4                     | Standard, lazy-loadable.                            |
| State       | Pinia                            | Only for truly shared state (auth, flash).          |
| Validation  | Zod 4                            | Schemas = types. Industry standard for TS in 2026.  |
| PWA         | vite-plugin-pwa (Workbox)        | Manifest + service worker + offline strategies.     |
| Mocks       | MSW (Mock Service Worker)        | Run the frontend without the backend.               |
| Testing     | Vitest + @vue/test-utils + jsdom | Same runner as backend. TDD-friendly.               |
| Lint/Format | ESLint flat config + Prettier    | Standard Vue tooling.                               |
| Git hooks   | Husky + lint-staged + commitlint | Enforced workflow & commit hygiene.                 |

## 🌿 Workflow & quality

The project enforces a strict workflow via Husky hooks (activated on `pnpm install`):

- **Branches** follow `<type>/<description>` (e.g. `feature/auth-module`). `main` and `develop` are protected.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/) with mandatory scope: `feat(scope): subject ≥ 10 chars`.
- **pre-commit**: ESLint + Prettier on staged files via lint-staged.
- **commit-msg**: commitlint rejects invalid messages.
- **pre-push**: `pnpm typecheck` + `pnpm test:run`, blocks push to `main`/`develop`.

See [`docs/conventions/03-git-workflow.md`](./docs/conventions/03-git-workflow.md) for the full reference.

## Project structure

```text
memoria-frontend/
├─ public/                  # Static assets served as-is (icons, mockServiceWorker.js)
├─ src/
│  ├─ assets/               # CSS, fonts, images bundled by Vite
│  ├─ components/           # Reusable UI components
│  ├─ composables/          # ViewModels (use*.ts)
│  ├─ mocks/                # MSW handlers (per-feature)
│  ├─ router/               # Vue Router setup + guards
│  ├─ schemas/              # Zod schemas (single source of truth)
│  ├─ services/             # HTTP layer (api.ts + per-resource APIs)
│  ├─ stores/               # Pinia stores (auth, flash...)
│  ├─ types/                # Cross-cutting TS types
│  ├─ utils/                # Logger and other helpers
│  ├─ views/                # Routed pages
│  ├─ App.vue
│  └─ main.ts
├─ tests/
│  ├─ unit/                 # Composables, services, pure functions
│  └─ setup.ts              # Global test setup
├─ .husky/                  # Git hooks
├─ env.d.ts                 # Vite + PWA client types
├─ vite.config.ts           # Build config + PWA plugin
├─ vitest.config.ts         # Test config (extends vite)
├─ commitlint.config.js     # Commit message rules
└─ tsconfig*.json           # TS project references (app + node)
```

## Getting started

```bash
# 1. Install (also activates Husky hooks via the prepare script)
pnpm install

# 2. Configure
cp .env.example .env
# Tweak VITE_API_BASE_URL, VITE_USE_MOCKS, VITE_LOG_LEVEL as needed

# 3. Run dev server (proxies /api to localhost:3000)
pnpm dev

# 4. Run tests
pnpm test:watch            # watch mode (TDD)
pnpm test:run        # single run
pnpm coverage        # with coverage report
```

To run **without the backend**, set `VITE_USE_MOCKS=true` in `.env` — MSW will intercept all `/api/*` calls locally.

## TDD workflow

The full cycle on a new feature:

1. **Write the schema first** in `src/schemas/` — defines the contract.
2. **Write a failing test** in `tests/unit/` (or component test).
3. **Write the smallest code that passes** in the corresponding service/composable.
4. **Refactor** keeping tests green.

See `tests/unit/api.test.ts` for the reference pattern (fetch mocking, schema-validated assertions). MSW is also available for higher-fidelity request mocking (see `src/mocks/node.ts`).

## On schema duplication front/back

We made the deliberate choice to **duplicate** Zod schemas between this repo and the backend rather than share via a monorepo. Trade-offs:

- ✅ Each side stays autonomous, no shared package to publish.
- ✅ The frontend can validate API responses defensively — useful if the backend ever drifts.
- ❌ Two places to update when a payload shape changes. The backend remains the source of truth: when in doubt, mirror what's in `backend/src/validators/`.

## PWA & offline strategy

The current config does the basics:

- App shell is cached automatically by Workbox.
- API calls (`/api/v1/*`) use `NetworkFirst` with a 5s timeout and 24h cache — fresh when online, cached when offline.

Future work (when relevant):

- **IndexedDB** for storing items locally (`idb` or `dexie`).
- **Offline action queue** for creating/editing items without a connection.
- **Background sync** when the connection returns.

These are intentionally not built yet — they'll be added once the core flows are in place.

## Backend connection

This frontend talks to the Memoria backend (Node.js/Express + PostgreSQL) via REST. Session cookies are sent automatically (`credentials: 'include'`).

**CSRF**: the backend exposes a CSRF middleware. When we wire auth, we'll either fetch a token from `/api/v1/csrf-token` or use a double-submit cookie pattern, depending on what the backend serves. Currently not implemented in `api.ts` — pending the auth module.

## License

MIT.

---

_Dernière mise à jour : 12/05/2026_
