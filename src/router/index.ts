import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ─── Public landing ────────────────────────────────────────────
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { redirectAuthenticated: true },
    },

    // ─── Authenticated user area ───────────────────────────────────
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },

    // ─── Admin area ────────────────────────────────────────────────
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },

    // ─── Items ─────────────────────────────────────────────────────
    {
      path: '/items',
      name: 'items',
      component: () => import('@/views/items/ItemsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/new',
      name: 'item-create',
      component: () => import('@/views/items/ItemFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/items/:id/edit',
      name: 'item-edit',
      component: () => import('@/views/items/ItemFormView.vue'),
      meta: { requiresAuth: true },
    },

    // ─── Auth pages (guest only) ───────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { requiresGuest: true },
    },

    // ─── Legal pages (always public) ───────────────────────────────
    {
      path: '/cgu',
      name: 'cgu',
      component: () => import('@/views/legal/TermsView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/legal/PrivacyView.vue'),
    },
    {
      path: '/legal-notice',
      name: 'legal-notice',
      component: () => import('@/views/legal/LegalNoticeView.vue'),
    },

    // ─── 404 catch-all ─────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

/**
 * Global navigation guard.
 *
 * - `requiresAuth`             → redirect to /login when no session.
 * - `requiresGuest`            → redirect to /profile when already authenticated.
 * - `requiresAdmin`            → redirect to /profile when user is not admin/super_admin.
 * - `redirectAuthenticated`    → on landing, if logged in, go straight to /profile.
 */
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'profile' }
  }

  if (to.meta.redirectAuthenticated && auth.isAuthenticated) {
    return { name: 'profile' }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'profile' }
  }

  return true
})

export default router
