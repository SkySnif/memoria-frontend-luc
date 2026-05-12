<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPasswordPayloadSchema } from '@/schemas/user'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const tokenFromUrl = computed(() => {
  const t = route.query.token
  return typeof t === 'string' ? t : ''
})

const password = ref('')
const passwordConfirm = ref('')
const fieldErrors = ref<Record<string, string>>({})
const submitted = ref(false)

async function handleSubmit(): Promise<void> {
  fieldErrors.value = {}

  if (password.value !== passwordConfirm.value) {
    fieldErrors.value.passwordConfirm = 'Les mots de passe ne correspondent pas'
    return
  }

  const result = resetPasswordPayloadSchema.safeParse({
    token: tokenFromUrl.value,
    password: password.value,
  })
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string') {
        fieldErrors.value[field] = issue.message
      }
    }
    return
  }

  try {
    await auth.resetPassword(result.data)
    submitted.value = true
    setTimeout(() => router.push('/login'), 2000)
  } catch {
    // auth.error already set
  }
}
</script>

<template>
  <main class="reset">
    <h1>Nouveau mot de passe</h1>

    <div v-if="submitted" class="success" role="status">
      <p>Mot de passe modifié. Redirection vers la connexion…</p>
    </div>

    <div v-else-if="!tokenFromUrl" class="error-box" role="alert">
      <p>
        Le lien est invalide ou incomplet. Demandez un nouveau lien depuis
        <RouterLink to="/forgot-password">cette page</RouterLink>.
      </p>
    </div>

    <form v-else @submit.prevent="handleSubmit" novalidate>
      <div class="field">
        <label for="password">Nouveau mot de passe</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
        />
        <p v-if="fieldErrors.password" class="error">
          {{ fieldErrors.password }}
        </p>
      </div>

      <div class="field">
        <label for="passwordConfirm">Confirmer le mot de passe</label>
        <input
          id="passwordConfirm"
          v-model="passwordConfirm"
          type="password"
          autocomplete="new-password"
          required
        />
        <p v-if="fieldErrors.passwordConfirm" class="error">
          {{ fieldErrors.passwordConfirm }}
        </p>
      </div>

      <p v-if="fieldErrors.token" class="error">{{ fieldErrors.token }}</p>
      <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Enregistrement…' : 'Réinitialiser' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.reset {
  max-width: 24rem;
  margin: 2rem auto;
  padding: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error {
  color: #c00;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
.error-box {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 1rem 1.25rem;
}
.success {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 6px;
  padding: 1rem 1.25rem;
}
button {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
