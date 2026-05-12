<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="public-header">
    <RouterLink to="/" class="brand">🐼 Memoria</RouterLink>

    <nav class="actions">
      <RouterLink to="/login" class="link">Connexion</RouterLink>
      <RouterLink to="/register" class="cta">Créer un compte</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.public-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  color: inherit;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.link {
  color: #4b5563;
  text-decoration: none;
  font-size: 0.95rem;
}

.link:hover {
  color: #111827;
}

.cta {
  padding: 0.45rem 1rem;
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
</style>
