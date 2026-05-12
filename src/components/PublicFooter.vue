<script setup lang="ts">
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="public-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>🐼 Memoria</h4>
        <p class="tagline">Votre second cerveau open source, dans le cadre d'une formation.</p>
      </div>

      <div class="footer-section">
        <h4>Produit</h4>
        <ul>
          <li><RouterLink to="/">Accueil</RouterLink></li>
          <li><RouterLink to="/register">Créer un compte</RouterLink></li>
          <li><RouterLink to="/login">Se connecter</RouterLink></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Légal</h4>
        <ul>
          <li><RouterLink to="/cgu">Conditions d'utilisation</RouterLink></li>
          <li><RouterLink to="/privacy">Politique de confidentialité</RouterLink></li>
          <li><RouterLink to="/legal-notice">Mentions légales</RouterLink></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Code</h4>
        <ul>
          <li>
            <a
              href="https://github.com/HelyaTam/memoria-spa-vuejs"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub →
            </a>
          </li>
          <li>
            <a
              href="https://github.com/HelyaTam/memoria-spa-vuejs/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Signaler un bug
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© {{ currentYear }} Memoria — Projet pédagogique open source.</p>
    </div>
  </footer>
</template>

<style scoped>
.public-footer {
  background: #111827;
  color: #d1d5db;
  padding: 3rem 2rem 1.5rem;
  margin-top: auto;
}

.footer-content {
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 2.5rem;
}

.footer-section h4 {
  color: white;
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-section a {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s;
}

.footer-section a:hover {
  color: white;
}

.tagline {
  color: #9ca3af;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.footer-bottom {
  max-width: 72rem;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid #374151;
  text-align: center;
}

.footer-bottom p {
  color: #9ca3af;
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 48rem) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
