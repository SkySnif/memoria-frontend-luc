<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useItemsStore } from '@/stores/useItemsStore'

const auth = useAuthStore()
const items = useItemsStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  await auth.logout()
  items.reset()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <RouterLink to="/profile" class="brand">🐼 Memoria</RouterLink>

    <nav class="main-nav">
      <RouterLink to="/profile" active-class="active">Profil</RouterLink>
      <RouterLink to="/items" active-class="active">Mes pépites</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/dashboard" active-class="active" class="admin-link">
        🛠️ Dashboard
      </RouterLink>
    </nav>

    <nav class="user-nav">
      <span class="pseudo">
        {{ auth.currentUser?.pseudo }}
        <span v-if="auth.isAdmin" class="badge" title="Administrateur">🛡️</span>
      </span>

      <button type="button" class="logout" :disabled="auth.loading" @click="handleLogout">
        {{ auth.loading ? 'Déconnexion…' : 'Se déconnecter' }}
      </button>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
  gap: 2rem;
}

.brand {
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}

.main-nav {
  display: flex;
  gap: 1.25rem;
  flex: 1;
}

.main-nav a {
  text-decoration: none;
  color: #4b5563;
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.main-nav a:hover {
  color: #111827;
}

.main-nav a.active {
  color: #111827;
  border-bottom-color: #111827;
}

.admin-link {
  color: #92400e !important;
}

.admin-link:hover {
  color: #78350f !important;
}

.admin-link.active {
  border-bottom-color: #f59e0b !important;
}

.user-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pseudo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.badge {
  font-size: 0.9rem;
}

.logout {
  padding: 0.4rem 0.9rem;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.logout:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
