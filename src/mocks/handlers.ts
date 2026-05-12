import { authHandlers } from '@/mocks/handlers/auth'
import { itemsHandlers } from '@/mocks/handlers/items'

/**
 * Aggregated MSW handlers across all feature modules.
 *
 * @remarks
 * Each feature module owns its handlers under `./handlers/<feature>.ts`
 * and is wired up here. Keeping a single aggregator means tests and the
 * browser worker only need to import one symbol.
 *
 * @internal
 */
export const handlers = [...authHandlers, ...itemsHandlers]
