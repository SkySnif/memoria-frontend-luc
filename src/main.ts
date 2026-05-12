import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/useAuthStore'
import { logger } from '@/utils/logger'
import '@/assets/main.css'

async function bootstrap() {
  // ─── 1. Start MSW worker if mocks are enabled ───────────────────
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
    logger.info('MSW worker started')
  }

  // ─── 2. Create the app + Pinia ──────────────────────────────────
  const app = createApp(App)
  app.use(createPinia())

  // ─── 3. Hydrate the auth session BEFORE installing the router ───
  //
  // Router guards (`requiresAuth`, `requiresGuest`) read the store, so the
  // store must reflect the real session before the very first navigation.
  // A failed hydration is logged but never blocks the mount — the app
  // simply renders as unauthenticated.
  const auth = useAuthStore()
  try {
    await auth.fetchMe()
  } catch (e) {
    logger.error('Auth hydration failed', e)
  }

  // ─── 4. Install router and mount ────────────────────────────────
  app.use(router)
  app.mount('#app')
}

bootstrap()
