/**
 * Lightweight frontend logger.
 *
 * Thin wrapper around `console.*` with three concerns:
 *  - Prefix every line with `[Memoria]` for easy filtering.
 *  - Honor `VITE_LOG_LEVEL` (`debug` | `info` | `warn` | `error` | `silent`).
 *  - Single point to plug in a remote reporter (backend AppEvents, Sentry...) later.
 *
 * @module utils/logger
 */

const LEVELS = ['debug', 'info', 'warn', 'error', 'silent'] as const
type Level = (typeof LEVELS)[number]

const PREFIX = '[Memoria]'

/** Resolved at module load. Defaults: `info` in dev, `warn` in prod. @internal */
const currentLevel: Level = (() => {
  const fromEnv = import.meta.env.VITE_LOG_LEVEL as Level | undefined
  if (fromEnv && LEVELS.includes(fromEnv)) return fromEnv
  return import.meta.env.DEV ? 'info' : 'warn'
})()

/** @internal */
function shouldLog(level: Exclude<Level, 'silent'>): boolean {
  return LEVELS.indexOf(level) >= LEVELS.indexOf(currentLevel)
}

/**
 * Application logger. Use instead of `console.*`.
 *
 * @example
 * ```ts
 * import { logger } from '@/utils/logger'
 *
 * logger.info('User logged in', { id: user.id })
 * logger.error('Failed to fetch items', err)
 * ```
 *
 * @public
 */
export const logger = {
  debug(...args: unknown[]): void {
    if (shouldLog('debug')) console.debug(PREFIX, ...args)
  },
  info(...args: unknown[]): void {
    if (shouldLog('info')) console.info(PREFIX, ...args)
  },
  warn(...args: unknown[]): void {
    if (shouldLog('warn')) console.warn(PREFIX, ...args)
  },
  error(...args: unknown[]): void {
    if (shouldLog('error')) console.error(PREFIX, ...args)
    // Future hook: forward to backend AppEvents / Sentry here.
  },
}
