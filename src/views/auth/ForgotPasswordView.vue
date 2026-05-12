<script setup lang="ts">
import { ref } from 'vue'
import { forgotPasswordPayloadSchema } from '@/schemas/user'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

const email = ref('')
const fieldErrors = ref<Record<string, string>>({})
const submitted = ref(false)

async function handleSubmit(): Promise<void> {
  fieldErrors.value = {}

  const result = forgotPasswordPayloadSchema.safeParse({ email: email.value })
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
    await auth.forgotPassword(result.data)
    submitted.value = true
  } catch {
    // auth.error already set by the store
  }
}
</script>

<template>
  <main class="forgot">
    <h1>Mot de passe oublié</h1>

    <div v-if="submitted" class="success" role="status">
      <p>
        Si un compte existe pour cette adresse, un email contenant un lien de réinitialisation vient
        d'être envoyé.
      </p>
      <p>
        <RouterLink to="/login">Retour à la connexion</RouterLink>
      </p>
    </div>

    <form v-else @submit.prevent="handleSubmit" novalidate>
      <p class="hint">
        Entrez votre adresse email. Si un compte existe, vous recevrez un lien pour définir un
        nouveau mot de passe.
      </p>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
        <p v-if="fieldErrors.email" class="error">{{ fieldErrors.email }}</p>
      </div>

      <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Envoi…' : 'Envoyer le lien' }}
      </button>

      <p class="footer">
        <RouterLink to="/login">Retour à la connexion</RouterLink>
      </p>
    </form>
  </main>
</template>

<style scoped>
.forgot {
  max-width: 24rem;
  margin: 2rem auto;
  padding: 1rem;
}
.hint {
  color: #4b5563;
  font-size: 0.9rem;
  margin-bottom: 1rem;
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
.footer {
  margin-top: 1.5rem;
  text-align: center;
}
</style>
