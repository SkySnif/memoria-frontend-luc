import 'vue-router'

/**
 * Typed route metadata for the app.
 *
 * @remarks
 * Augments `vue-router`'s `RouteMeta` so `to.meta.requiresAuth` etc. are
 * fully typed in route guards. Add new flags here whenever a new
 * meta-based behavior is introduced.
 *
 * @public
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** Route requires an authenticated user; otherwise redirect to /login. */
    requiresAuth?: boolean
    /** Route requires a non-authenticated user; otherwise redirect to /. */
    requiresGuest?: boolean
    /** Route requires admin or super_admin role; otherwise redirect to /. */
    requiresAdmin?: boolean
  }
}

export {}
