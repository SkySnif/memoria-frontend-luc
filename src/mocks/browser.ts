/**
 * MSW Service Worker setup for browser/dev mode.
 * Started conditionally in `src/main.ts` based on `VITE_USE_MOCKS`.
 * @module mocks/browser
 */

import { setupWorker } from 'msw/browser'
import { handlers } from '@/mocks/handlers'

/** @public */
export const worker = setupWorker(...handlers)
