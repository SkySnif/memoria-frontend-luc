<script setup lang="ts">
const lastUpdate = '12 mai 2026'
</script>

<template>
  <main class="legal">
    <header class="legal-header">
      <h1>Mentions légales</h1>
      <p class="meta">Dernière mise à jour : {{ lastUpdate }}</p>
    </header>

    <div class="content">
      <section>
        <h2>Éditeur</h2>
        <p>
          Memoria est un projet open source à but pédagogique, sans entité juridique, développé dans
          le cadre d'une formation par
          <strong>[À COMPLÉTER : votre nom ou pseudo]</strong>.
        </p>
        <p>
          Contact :
          <a
            href="https://github.com/HelyaTam/memoria-spa-vuejs/issues"
            target="_blank"
            rel="noopener noreferrer"
            >via les issues GitHub du projet</a
          >.
        </p>
      </section>

      <section>
        <h2>Hébergeur</h2>
        <p>
          <strong>[À COMPLÉTER : hébergeur du frontend et du backend]</strong>
        </p>
        <p>Par exemple :</p>
        <ul>
          <li>
            <strong>Frontend</strong> : déployé sur AWS S3 + CloudFront — Amazon Web Services EMEA
            SARL, 38 avenue John F. Kennedy, L-1855 Luxembourg.
          </li>
          <li><strong>Backend</strong> : à compléter selon votre choix d'hébergement.</li>
        </ul>
      </section>

      <section>
        <h2>Code source</h2>
        <p>
          Le code source de Memoria est publié sous licence MIT et disponible publiquement :
          <a
            href="https://github.com/HelyaTam/memoria-spa-vuejs"
            target="_blank"
            rel="noopener noreferrer"
            >github.com/HelyaTam/memoria-spa-vuejs</a
          >
        </p>
      </section>

      <section>
        <h2>Crédits</h2>
        <p>
          Memoria utilise les technologies open source suivantes : Vue.js, TypeScript, Vite, Pinia,
          Zod, Vitest, PostgreSQL, Node.js, Express. Merci à toutes les communautés de mainteneurs.
        </p>
      </section>

      <section>
        <h2>Signaler un problème</h2>
        <p>
          Vous avez identifié un bug, une faille de sécurité, ou un contenu posant problème ?
          <a
            href="https://github.com/HelyaTam/memoria-spa-vuejs/issues"
            target="_blank"
            rel="noopener noreferrer"
            >Ouvrez une issue sur GitHub</a
          >.
        </p>
      </section>
    </div>

    <p class="back-link">
      <RouterLink to="/">← Retour à l'accueil</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.legal {
  max-width: 44rem;
  margin: 0 auto;
  padding: 3rem 2rem;
  line-height: 1.7;
}

.legal-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.legal-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.meta {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.content section {
  margin-bottom: 2rem;
}

.content h2 {
  font-size: 1.25rem;
  margin: 2rem 0 0.75rem;
}

.content p,
.content ul {
  color: #374151;
}

.content ul {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.content li {
  margin-bottom: 0.4rem;
}

.content a {
  color: #6366f1;
  text-decoration: underline;
}

.back-link {
  margin-top: 3rem;
  text-align: center;
}

.back-link a {
  color: #6366f1;
  text-decoration: none;
}
</style>
