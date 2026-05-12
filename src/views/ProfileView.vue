<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useItemsStore } from '@/stores/useItemsStore'

const auth = useAuthStore()
const items = useItemsStore()
const router = useRouter()

async function handleDeleteAccount(): Promise<void> {
  const confirmed = confirm(
    'Êtes-vous absolument sûr ?\n\n' +
      'Cette action est irréversible.\n' +
      'Toutes vos pépites et données seront définitivement supprimées.',
  )
  if (!confirmed) return

  try {
    await auth.deleteAccount()
    items.reset()
    router.push('/login')
  } catch {
    // auth.error already set
  }
}
</script>

<template>
  <section class="profile">
    <header class="profile-header">
      <h1>Mon profil</h1>
      <p class="welcome">Bienvenue, {{ auth.currentUser?.pseudo }} 👋</p>
    </header>

    <div class="info-card">
      <h2>Informations du compte</h2>
      <dl class="info-list">
        <dt>Pseudo</dt>
        <dd>{{ auth.currentUser?.pseudo }}</dd>

        <dt>Email</dt>
        <dd>{{ auth.currentUser?.email }}</dd>

        <dt>Rôle</dt>
        <dd>
          <span class="role-badge">{{ auth.currentUser?.role }}</span>
          <span v-if="auth.isSuperAdmin" class="badge badge-super"> ⚡ Super-admin </span>
          <span v-else-if="auth.isAdmin" class="badge badge-admin"> 🛡️ Admin </span>
        </dd>

        <dt>Méthode d'authentification</dt>
        <dd>{{ auth.currentUser?.authProvider }}</dd>
      </dl>
    </div>

    <div class="cta-card">
      <h2>Votre second cerveau</h2>
      <p>
        Le module <em>Items</em> est en place — vous pouvez consigner livres, podcasts, articles,
        vidéos et notes.
      </p>
      <RouterLink to="/items" class="cta">Voir mes pépites →</RouterLink>
    </div>

    <div class="danger-zone">
      <h2>Zone dangereuse</h2>
      <p class="danger-hint">
        Supprimer votre compte effacera définitivement votre profil et toutes vos pépites. Cette
        action ne peut pas être annulée.
      </p>
      <button
        type="button"
        class="danger-button"
        :disabled="auth.loading"
        @click="handleDeleteAccount"
      >
        Supprimer définitivement mon compte
      </button>
      <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>
    </div>
  </section>
</template>

<style scoped>
.profile {
  max-width: 48rem;
  margin: 2rem auto;
  padding: 1rem 2rem;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  margin: 0 0 0.4rem;
  font-size: 1.75rem;
}

.welcome {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.info-card,
.cta-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-card h2,
.cta-card h2,
.danger-zone h2 {
  margin: 0 0 1rem;
  font-size: 1.15rem;
}

.info-list {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 0.6rem 1rem;
  margin: 0;
}

.info-list dt {
  color: #6b7280;
  font-size: 0.9rem;
}

.info-list dd {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.role-badge {
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  padding: 0.1rem 0.5rem;
  background: #f3f4f6;
  border-radius: 3px;
}

.badge {
  font-size: 0.85rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
}

.badge-admin {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}

.badge-super {
  background: #ede9fe;
  color: #5b21b6;
  border: 1px solid #8b5cf6;
}

.cta-card p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 1rem;
}

.cta {
  display: inline-block;
  padding: 0.55rem 1.1rem;
  background: #111827;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: background 0.15s;
}

.cta:hover {
  background: #1f2937;
}

.danger-zone {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1.5rem;
}

.danger-zone h2 {
  color: #991b1b;
}

.danger-hint {
  color: #7f1d1d;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.danger-button {
  padding: 0.55rem 1.1rem;
  background: #fff;
  color: #b91c1c;
  border: 1px solid #b91c1c;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s;
}

.danger-button:hover:not(:disabled) {
  background: #b91c1c;
  color: #fff;
}

.danger-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error {
  color: #c00;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
