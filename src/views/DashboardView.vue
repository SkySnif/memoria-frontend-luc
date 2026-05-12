<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
</script>

<template>
  <section class="admin-dashboard">
    <header class="admin-header">
      <h1>🛠️ Dashboard administrateur</h1>
      <p class="meta">
        Connecté en tant que <strong>{{ auth.currentUser?.pseudo }}</strong>
        —
        <span class="role-badge">{{ auth.currentUser?.role }}</span>
      </p>
    </header>

    <div class="construction-banner">
      <h2>🚧 Espace en cours de construction</h2>
      <p>
        Cet espace est réservé à l'administration de la plateforme. Il sera développé dans le cadre
        d'un atelier pédagogique par les étudiant·es de la formation.
      </p>
    </div>

    <div class="features-grid">
      <article class="feature-todo">
        <div class="feature-icon">👥</div>
        <h3>Gestion des utilisateurs</h3>
        <p>
          Lister, rechercher, suspendre ou supprimer des comptes utilisateurs. Modifier les rôles
          (customer / admin / super_admin).
        </p>
        <span class="todo-badge">À implémenter</span>
      </article>

      <article class="feature-todo">
        <div class="feature-icon">📊</div>
        <h3>Statistiques de la plateforme</h3>
        <p>
          Visualiser le nombre d'utilisateurs actifs, de pépites créées par type de contenu, taux
          d'engagement, etc.
        </p>
        <span class="todo-badge">À implémenter</span>
      </article>

      <article class="feature-todo">
        <div class="feature-icon">📜</div>
        <h3>Journal d'audit</h3>
        <p>
          Consulter l'historique des connexions, créations et suppressions de comptes, actions
          sensibles.
        </p>
        <span class="todo-badge">À implémenter</span>
      </article>

      <article class="feature-todo">
        <div class="feature-icon">🚩</div>
        <h3>Modération du contenu</h3>
        <p>
          Examiner les pépites signalées, retirer du contenu inapproprié, gérer les signalements
          RGPD.
        </p>
        <span class="todo-badge">À implémenter</span>
      </article>

      <article v-if="auth.isSuperAdmin" class="feature-todo super">
        <div class="feature-icon">⚙️</div>
        <h3>Configuration globale</h3>
        <p>
          Paramètres système, gestion des admins, sauvegardes — réservé au super-administrateur.
        </p>
        <span class="todo-badge">À implémenter</span>
      </article>
    </div>

    <footer class="admin-footer">
      <p>
        💡 Tip pédagogique : commencez par la <strong>gestion des utilisateurs</strong>
        (CRUD), c'est l'atelier le plus formateur pour appliquer les guards Pinia + Vue Router et
        les appels API authentifiés.
      </p>
    </footer>
  </section>
</template>

<style scoped>
.admin-dashboard {
  max-width: 64rem;
  margin: 2rem auto;
  padding: 1rem 2rem;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.meta {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.role-badge {
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
  padding: 0.1rem 0.5rem;
  background: #f3f4f6;
  border-radius: 3px;
}

.construction-banner {
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.construction-banner h2 {
  margin: 0 0 0.5rem;
  color: #92400e;
  font-size: 1.1rem;
}

.construction-banner p {
  margin: 0;
  color: #78350f;
  line-height: 1.5;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feature-todo {
  position: relative;
  padding: 1.5rem;
  background: #fff;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
}

.feature-todo.super {
  border-color: #8b5cf6;
  background: #faf5ff;
}

.feature-icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.feature-todo h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.feature-todo p {
  color: #4b5563;
  font-size: 0.9rem;
  line-height: 1.55;
  margin: 0 0 1rem;
}

.todo-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.feature-todo.super .todo-badge {
  background: #ede9fe;
  color: #5b21b6;
}

.admin-footer {
  padding: 1rem 1.25rem;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  border-radius: 4px;
}

.admin-footer p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #1e3a8a;
}
</style>
