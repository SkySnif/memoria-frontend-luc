<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contentTypeSchema, createItemPayloadSchema, type ContentType } from '@/schemas/item'
import { useItemsStore } from '@/stores/useItemsStore'

const route = useRoute()
const router = useRouter()
const store = useItemsStore()

// ─── Mode detection (create vs edit) ───────────────────────────────
const itemId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : null
})
const isEditMode = computed(() => itemId.value !== null)

// ─── Form state ────────────────────────────────────────────────────
const contentType = ref<ContentType>('note')
const title = ref('')
const content = ref('')
const sourceAuthor = ref('')
const thumbnailUrl = ref('')
const fieldErrors = ref<Record<string, string>>({})
const submitting = ref(false)

const contentTypes = contentTypeSchema.options
const contentTypeLabels: Record<ContentType, string> = {
  livre: '📚 Livre',
  podcast: '🎙️ Podcast',
  article: '📰 Article',
  video: '🎬 Vidéo',
  note: '📝 Note',
}

// ─── Load existing item in edit mode ───────────────────────────────
onMounted(async () => {
  if (!isEditMode.value || !itemId.value) return

  let item = store.findById(itemId.value)
  if (!item) {
    try {
      item = await store.fetchOne(itemId.value)
    } catch {
      router.push('/items')
      return
    }
  }

  contentType.value = item.contentType
  title.value = item.title
  content.value = item.content
  sourceAuthor.value = item.sourceAuthor === 'N.C' ? '' : item.sourceAuthor
  thumbnailUrl.value = item.thumbnailUrl ?? ''
})

// ─── Submit ────────────────────────────────────────────────────────
async function handleSubmit(): Promise<void> {
  fieldErrors.value = {}

  const rawPayload = {
    contentType: contentType.value,
    title: title.value,
    content: content.value,
    ...(sourceAuthor.value ? { sourceAuthor: sourceAuthor.value } : {}),
    ...(thumbnailUrl.value ? { thumbnailUrl: thumbnailUrl.value } : {}),
  }

  // Validate against the create schema in both modes — the form requires
  // all fields regardless of mode, so partial validation isn't useful here.
  const result = createItemPayloadSchema.safeParse(rawPayload)

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string') {
        fieldErrors.value[field] = issue.message
      }
    }
    return
  }

  submitting.value = true
  try {
    if (isEditMode.value && itemId.value) {
      await store.update(itemId.value, result.data)
    } else {
      await store.create(result.data)
    }
    router.push('/items')
  } catch {
    // store.error already populated for display
  } finally {
    submitting.value = false
  }
}

function handleCancel(): void {
  router.push('/items')
}
</script>

<template>
  <main class="form-page">
    <header class="page-header">
      <h1>{{ isEditMode ? 'Éditer la pépite' : 'Nouvelle pépite' }}</h1>
    </header>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="field">
        <label for="contentType">Type</label>
        <select id="contentType" v-model="contentType" required>
          <option v-for="t in contentTypes" :key="t" :value="t">
            {{ contentTypeLabels[t] }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="title">Titre <span class="req">*</span></label>
        <input id="title" v-model="title" type="text" maxlength="200" required />
        <p v-if="fieldErrors.title" class="error">{{ fieldErrors.title }}</p>
      </div>

      <div class="field">
        <label for="content">Contenu <span class="req">*</span></label>
        <textarea id="content" v-model="content" rows="8" required></textarea>
        <p v-if="fieldErrors.content" class="error">
          {{ fieldErrors.content }}
        </p>
      </div>

      <div class="field">
        <label for="sourceAuthor">Auteur (optionnel)</label>
        <input
          id="sourceAuthor"
          v-model="sourceAuthor"
          type="text"
          maxlength="50"
          placeholder="N.C si laissé vide"
        />
        <p v-if="fieldErrors.sourceAuthor" class="error">
          {{ fieldErrors.sourceAuthor }}
        </p>
      </div>

      <div class="field">
        <label for="thumbnailUrl">URL de la vignette (optionnel)</label>
        <input
          id="thumbnailUrl"
          v-model="thumbnailUrl"
          type="url"
          maxlength="255"
          placeholder="https://…"
        />
        <p v-if="fieldErrors.thumbnailUrl" class="error">
          {{ fieldErrors.thumbnailUrl }}
        </p>
      </div>

      <p v-if="store.error" class="error" role="alert">{{ store.error }}</p>

      <div class="actions">
        <button type="button" class="cancel" @click="handleCancel">Annuler</button>
        <button type="submit" class="primary" :disabled="submitting">
          {{ submitting ? 'Enregistrement…' : isEditMode ? 'Enregistrer' : 'Créer' }}
        </button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.form-page {
  max-width: 40rem;
  margin: 2rem auto;
  padding: 1rem 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.25rem;
}

label {
  margin-bottom: 0.35rem;
  font-weight: 500;
  font-size: 0.95rem;
}

.req {
  color: #b91c1c;
}

input,
select,
textarea {
  padding: 0.55rem 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
  background: #fff;
}

textarea {
  resize: vertical;
  min-height: 8rem;
  line-height: 1.5;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.error {
  color: #b91c1c;
  font-size: 0.85rem;
  margin: 0.3rem 0 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

button {
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;
}

.cancel {
  background: transparent;
  border-color: #d1d5db;
  color: #4b5563;
}

.cancel:hover {
  background: #f9fafb;
}

.primary {
  background: #111827;
  color: #fff;
}

.primary:hover:not(:disabled) {
  background: #1f2937;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
