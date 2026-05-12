<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginPayloadSchema } from '@/schemas/user'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const fieldErrors = ref<Record<string, string>>({})

async function handleSubmit() {
  fieldErrors.value = {}

  const result = loginPayloadSchema.safeParse({
    email: email.value,
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
    await auth.login(result.data)
    const redirect = (route.query.redirect as string) || '/profile'
    router.push(redirect)
  } catch {
    // auth.error is already set by the store
  }
}
</script>

<template>
  <main class="login">
    <h1>Connexion</h1>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
        <p v-if="fieldErrors.email" class="error">{{ fieldErrors.email }}</p>
      </div>

      <div class="field">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
        <p v-if="fieldErrors.password" class="error">
          {{ fieldErrors.password }}
        </p>
      </div>

      <div class="forgot-link">
        <RouterLink to="/forgot-password">Mot de passe oublié ?</RouterLink>
      </div>

      <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Connexion…' : 'Se connecter' }}
      </button>
    </form>

    <p class="footer">
      Pas encore inscrit ?
      <RouterLink to="/register">Créer un compte</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.login {
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
.forgot-link {
  text-align: right;
  margin-bottom: 1rem;
  font-size: 0.875rem;
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
