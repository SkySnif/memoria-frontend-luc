<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import AppHeader from '@/components/AppHeader.vue'
import PublicHeader from '@/components/PublicHeader.vue'
import PublicFooter from '@/components/PublicFooter.vue'

const auth = useAuthStore()
const route = useRoute()

/**
 * Header selection:
 * - Authenticated routes (`requiresAuth: true`) → AppHeader (with profile + nav).
 * - All other routes (landing, legal, auth pages) → PublicHeader.
 *
 * The footer is shown on every page so the legal/contact links remain
 * accessible regardless of authentication status.
 */
const isAuthenticatedLayout = computed(() => {
  return auth.isAuthenticated && route.meta.requiresAuth === true
})
</script>

<template>
  <div class="app-shell">
    <AppHeader v-if="isAuthenticatedLayout" />
    <PublicHeader v-else />

    <main class="app-main">
      <RouterView />
    </main>

    <PublicFooter />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
}
</style>
