# 🚀 Getting Started

## Requirements

- **Node.js 20+** (we recommend 22 LTS).
- **pnpm 10+** — see below if you don't have it.
- The **Memoria backend** running locally, by default on `http://localhost:3000` (or run with `VITE_USE_MOCKS=true` to skip the backend entirely — see [Running without the backend](#running-without-the-backend) below).

### Installing pnpm

The project pins its pnpm version via the `packageManager` field in `package.json`. The cleanest way to use it is via **Corepack** (ships with Node 16.13+):

```bash
corepack enable
corepack prepare pnpm@10.30.2 --activate
```

Alternative (manual install):

```bash
npm install -g pnpm
```

Verify:

```bash
pnpm --version
node --version
```

> **Note**: pnpm 11 was released in April 2026 and requires Node.js 22+. This project pins pnpm 10.30.2 for broader Node compatibility. You can bump to pnpm 11 once your environment is on Node 22+.

## Install

```bash
git clone <your-repo-url> memoria-frontend
cd memoria-frontend
pnpm install
```

This creates `node_modules/` (hard-linked from pnpm's content-addressable store — disk-efficient) and `pnpm-lock.yaml`. Commit the lockfile.

**Important**: the `pnpm install` step also activates the Husky git hooks via the `prepare` script. From this point on your commits and pushes are validated automatically:

- formatting via `lint-staged` (pre-commit),
- commit messages via `commitlint` (commit-msg),
- branch names via `post-checkout`,
- typecheck + tests via `pre-push`.

See [`../conventions/03-git-workflow.md`](../conventions/03-git-workflow.md) for the full reference on conventions and how the hooks behave.

## Configure

```bash
cp .env.example .env
```

`.env` contains three variables:

| Variable            | Default       | Purpose                                                             |
| :------------------ | :------------ | :------------------------------------------------------------------ |
| `VITE_API_BASE_URL` | `/api/v1`     | Prefix prepended to every HTTP call.                                |
| `VITE_USE_MOCKS`    | `false`       | Set to `true` to intercept `/api/*` with MSW (run without backend). |
| `VITE_LOG_LEVEL`    | `info` in dev | Logger verbosity (`debug` / `info` / `warn` / `error` / `silent`).  |

In dev, Vite proxies `/api` to `http://localhost:3000` (see `vite.config.ts`). In production, set `VITE_API_BASE_URL` to the absolute URL of your deployed backend (e.g. `https://api.memoria.example.com/v1`).

## Run

```bash
pnpm dev
```

The app opens on `http://localhost:5173`. Hot-reload is on. API calls to `/api/*` are proxied to your local backend.

### Running without the backend

If you don't have the backend running, enable mocks in your `.env`:

```bash
VITE_USE_MOCKS=true
```

Restart `pnpm dev`. MSW will intercept all `/api/*` calls locally. Each feature module declares its own handlers in `src/mocks/handlers/`.

## Scripts

| Script            | Purpose                                                 |
| :---------------- | :------------------------------------------------------ |
| `pnpm dev`        | Vite dev server with HMR.                               |
| `pnpm build`      | Typecheck + production build to `dist/`.               |
| `pnpm preview`    | Preview the production build locally.                   |
| `pnpm test`       | Vitest in watch mode (TDD).                             |
| `pnpm test:run`   | Vitest single run (CI mode).                            |
| `pnpm test:ui`    | Vitest interactive UI in the browser.                   |
| `pnpm coverage`   | Run tests with V8 coverage report (`coverage/`).        |
| `pnpm lint`       | ESLint with auto-fix.                                   |
| `pnpm format`     | Prettier write on `src/` and `tests/`.                  |
| `pnpm typecheck` | `vue-tsc --noEmit` — type check without emitting files. |

> With pnpm, `run` is optional for non-reserved script names. `pnpm dev` works; `pnpm run dev` also works. For scripts that share a name with a pnpm command (e.g. `test`, `install`), pnpm still routes to the script.

## Project tour

After `pnpm install`, the structure is:

```text
memoria-frontend/
├─ src/             # Application source (Vue + TS)
├─ tests/           # Vitest tests
├─ docs/            # This documentation
├─ public/          # Static assets served as-is (includes mockServiceWorker.js)
├─ index.html       # HTML entry point
├─ vite.config.ts   # Build config + PWA plugin
├─ .husky/          # Git hooks (managed by Husky)
└─ ...              # tsconfig, eslint, prettier, commitlint, etc.
```

See [`../conventions/02-file-organization.md`](../conventions/02-file-organization.md) for the detailed layout.

## First feature, end-to-end

Adding a feature follows this loop (TDD-first):

1. **Create the branch**: `git checkout -b feature/<name> develop`.
2. **Define the schema** in `src/schemas/<entity>.ts`.
3. **Write a failing test** in `tests/unit/<feature>.test.ts`.
4. **Add the service method** in `src/services/<entity>Api.ts`.
5. **Add MSW handlers** in `src/mocks/handlers/<entity>.ts` and wire them in `src/mocks/handlers.ts`.
6. **Add a composable / Pinia store** in `src/composables/` or `src/stores/`.
7. **Wire a view** in `src/views/<Feature>View.vue` + add the route.
8. **Refactor** with tests green.

See [`04-testing-tdd.md`](./04-testing-tdd.md) for the test patterns and [`../conventions/03-git-workflow.md`](../conventions/03-git-workflow.md) for the branch and commit conventions.

## Adding dependencies

```bash
pnpm add <package>            # runtime dependency
pnpm add -D <package>         # dev dependency
pnpm remove <package>         # remove
pnpm update                   # update within ranges
pnpm outdated                 # check for newer versions
```

## Build for production

```bash
pnpm build
```

Output is in `dist/`. It's static — deploy anywhere that serves files:

- AWS S3 + CloudFront (the deploy target for this project).
- Cloudflare Pages, Vercel, Netlify — all work out of the box.

**Critical deploy settings:**

- **SPA fallback**: 403/404 → `/index.html` so deep links work after refresh.
- **Cache headers**:
  - `assets/*.js`, `assets/*.css` (filename-hashed) → `Cache-Control: public, max-age=31536000, immutable`
  - `index.html`, `sw.js`, `registerSW.js`, `manifest.webmanifest`, `mockServiceWorker.js` → `Cache-Control: no-cache`
- **Compression**: Brotli or gzip enabled.

## Troubleshooting

| Symptom                                          | Likely cause                                                     |
| :----------------------------------------------- | :--------------------------------------------------------------- |
| `pnpm: command not found`                        | Corepack not enabled. Run `corepack enable`.                     |
| API calls fail with CORS errors in dev           | Backend isn't on `localhost:3000`. Adjust `vite.config.ts`.      |
| Service worker serves stale content after deploy | Missing `no-cache` on `index.html` / `sw.js` (see above).        |
| Tests fail with "VITE_API_BASE_URL undefined"    | `tests/setup.ts` must be referenced in `vitest.config.ts`.       |
| `Unsupported engine` warning on install          | Node version below 20. Upgrade Node, or relax `engines`.         |
| Git hooks don't fire on commit / push            | Run `pnpm install` again — the `prepare` script activates husky. |
| Commit rejected with "scope may not be empty"    | Add a scope: `feat(scope): message` not `feat: message`.         |

## Related docs

- [`02-api-service.md`](./02-api-service.md) — the HTTP layer.
- [`04-testing-tdd.md`](./04-testing-tdd.md) — the testing workflow.
- [`../conventions/03-git-workflow.md`](../conventions/03-git-workflow.md) — branches, commits, hooks.

[⬆ Back to docs index](../README.md)

---

_Dernière mise à jour : 12/05/2026_
