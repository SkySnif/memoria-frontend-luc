<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="not-found">
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <RouterLink to="/">Back home</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 2rem;
}
h1 {
  font-size: 4rem;
  margin: 0;
}
p {
  color: #6b7280;
  margin: 0;
}
a {
  margin-top: 1rem;
  color: #1f2937;
  text-decoration: underline;
}
</style>
