import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/services/authApi'
import { ApiError } from '@/services/api'
import { logger } from '@/utils/logger'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/schemas/user'

/**
 * Pinia store managing the authenticated user.
 *
 * @public
 */
export const useAuthStore = defineStore('auth', () => {
  // ─── state ─────────────────────────────────────────────────────
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // ─── getters ───────────────────────────────────────────────────
  const isAuthenticated = computed(() => currentUser.value !== null)
  const isAdmin = computed(
    () => currentUser.value?.role === 'admin' || currentUser.value?.role === 'super_admin',
  )
  const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin')

  // ─── actions ───────────────────────────────────────────────────

  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await authApi.login(payload)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur de connexion'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(payload: RegisterPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await authApi.register(payload)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : "Erreur d'inscription"
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    try {
      await authApi.logout()
    } catch (e) {
      logger.error('Logout API call failed', e)
    } finally {
      currentUser.value = null
      loading.value = false
    }
  }

  async function fetchMe(): Promise<void> {
    loading.value = true
    try {
      currentUser.value = await authApi.me()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        currentUser.value = null
      } else {
        logger.error('fetchMe failed', e)
        throw e
      }
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await authApi.forgotPassword(payload)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await authApi.resetPassword(payload)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur de réinitialisation'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteAccount(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await authApi.deleteAccount()
      currentUser.value = null
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Erreur de suppression'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    currentUser,
    loading,
    error,
    initialized,
    // getters
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    // actions
    login,
    register,
    logout,
    fetchMe,
    forgotPassword,
    resetPassword,
    deleteAccount,
  }
})
