<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerPayloadSchema } from '@/schemas/user'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const pseudo = ref('')
const password = ref('')
const gdprConsent = ref(false)
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  fieldErrors.value = {}

  const result = registerPayloadSchema.safeParse({
    email: email.value,
    pseudo: pseudo.value,
    password: password.value,
    gdprConsent: gdprConsent.value,
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
    await auth.register(result.data)
    router.push('/profile')
  } catch {
    // auth.error is already set by the store
  }
}
</script>

<template>
  <main class="register">
    <h1>Créer un compte</h1>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
        <p v-if="fieldErrors.email" class="error">{{ fieldErrors.email }}</p>
      </div>

      <div class="field">
        <label for="pseudo">Pseudo</label>
        <input id="pseudo" v-model="pseudo" type="text" autocomplete="nickname" required />
        <p v-if="fieldErrors.pseudo" class="error">{{ fieldErrors.pseudo }}</p>
      </div>

      <div class="field">
        <label for="password">Mot de passe</label>
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

      <div class="field-checkbox">
        <label>
          <input v-model="gdprConsent" type="checkbox" />
          J'accepte les
          <RouterLink to="/cgu" target="_blank">conditions d'utilisation</RouterLink>
          et la
          <RouterLink to="/privacy" target="_blank">politique de confidentialité</RouterLink>
        </label>
        <p v-if="fieldErrors.gdprConsent" class="error">
          {{ fieldErrors.gdprConsent }}
        </p>
      </div>

      <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Création…' : 'Créer mon compte' }}
      </button>
    </form>

    <p class="footer">
      Déjà inscrit ?
      <RouterLink to="/login">Se connecter</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.register {
  max-width: 24rem;
  margin: 2rem auto;
  padding: 1rem;
}
.field,
.field-checkbox {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}
.field-checkbox label {
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.4;
}
.field-checkbox a {
  color: #6366f1;
}
input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[type='checkbox'] {
  padding: 0;
  margin-top: 0.2rem;
}
.error {
  color: #c00;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
.footer {
  margin-top: 1.5rem;
  text-align: center;
}
</style>
