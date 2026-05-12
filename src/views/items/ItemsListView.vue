<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useItemsStore } from '@/stores/useItemsStore'
import type { ContentType } from '@/schemas/item'

const store = useItemsStore()
const router = useRouter()

onMounted(() => {
  if (!store.initialized) {
    store.fetchAll()
  }
})

const typeLabels: Record<ContentType, string> = {
  livre: '📚 Livre',
  podcast: '🎙️ Podcast',
  article: '📰 Article',
  video: '🎬 Vidéo',
  note: '📝 Note',
}

async function handleDelete(id: string, title: string): Promise<void> {
  if (!confirm(`Supprimer "${title}" ?`)) return
  await store.remove(id)
}

function handleEdit(id: string): void {
  router.push(`/items/${id}/edit`)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <main class="items">
    <header class="page-header">
      <div class="page-title">
        <h1>Mes pépites</h1>
        <span v-if="store.initialized" class="count">{{ store.count }}</span>
      </div>

      <RouterLink to="/items/new" class="cta-create">+ Nouvelle pépite</RouterLink>
    </header>

    <div v-if="store.loading && !store.initialized" class="state">Chargement…</div>

    <div v-else-if="store.error" class="state state-error" role="alert">
      {{ store.error }}
    </div>

    <div v-else-if="store.isEmpty" class="state state-empty">
      <p>Aucune pépite pour l'instant.</p>
      <RouterLink to="/items/new" class="cta-create"> Créer ma première pépite </RouterLink>
    </div>

    <ul v-else class="list">
      <li v-for="item in store.items" :key="item.id" class="card">
        <img v-if="item.thumbnailUrl" :src="item.thumbnailUrl" :alt="item.title" class="thumb" />
        <div class="body">
          <header class="card-header">
            <span class="type">{{ typeLabels[item.contentType] }}</span>
            <time class="date" :datetime="item.createdAt">
              {{ formatDate(item.createdAt) }}
            </time>
          </header>

          <h2 class="title">{{ item.title }}</h2>
          <p class="author">par {{ item.sourceAuthor }}</p>
          <p class="content">{{ item.content }}</p>

          <div class="card-actions">
            <button
              type="button"
              class="edit"
              :disabled="store.loading"
              @click="handleEdit(item.id)"
            >
              Éditer
            </button>
            <button
              type="button"
              class="delete"
              :disabled="store.loading"
              @click="handleDelete(item.id, item.title)"
            >
              Supprimer
            </button>
          </div>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.items {
  max-width: 72rem;
  margin: 2rem auto;
  padding: 1rem 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.page-title {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.count {
  font-size: 0.9rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
}

.cta-create {
  background: #111827;
  color: #fff;
  padding: 0.55rem 1.1rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.15s;
}

.cta-create:hover {
  background: #1f2937;
}

.state {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.state-error {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
}

.state-empty {
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.thumb {
  width: 100%;
  height: 12rem;
  object-fit: cover;
  background: #f3f4f6;
}

.body {
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.type {
  color: #4b5563;
}

.date {
  color: #9ca3af;
}

.title {
  margin: 0.25rem 0;
  font-size: 1.05rem;
  line-height: 1.3;
}

.author {
  margin: 0;
  font-size: 0.85rem;
  color: #6b7280;
  font-style: italic;
}

.content {
  margin: 0.4rem 0 0.75rem;
  font-size: 0.92rem;
  color: #374151;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.edit,
.delete {
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
}

.edit {
  border: 1px solid #d1d5db;
  color: #374151;
}

.edit:hover:not(:disabled) {
  background: #f9fafb;
}

.delete {
  border: 1px solid #fca5a5;
  color: #b91c1c;
}

.delete:hover:not(:disabled) {
  background: #fef2f2;
}

.edit:disabled,
.delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
