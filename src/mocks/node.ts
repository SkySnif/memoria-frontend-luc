/**
 * MSW Node server setup — for use in Vitest when high-fidelity request
 * interception is needed (instead of replacing `globalThis.fetch`).
 *
 * Not wired by default. To enable in tests, import in `tests/setup.ts`:
 *
 * ```ts
 * import { beforeAll, afterEach, afterAll } from 'vitest'
 * import { server } from '@/mocks/node'
 *
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 *
 * @module mocks/node
 */

import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'

/** @public */
export const server = setupServer(...handlers)
