<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="landing">
    <!-- ─── HERO ─────────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-content">
        <span class="badge">🎓 Projet open source — formation</span>
        <h1>
          Votre <span class="accent">second cerveau</span>,<br />
          à portée de clic.
        </h1>
        <p class="tagline">
          Memoria capture, organise et relie vos pépites de savoir — livres, podcasts, articles,
          vidéos, notes — pour les retrouver à l'instant où vous en avez besoin.
        </p>
        <div class="cta-group">
          <RouterLink to="/register" class="cta cta-primary"> Créer mon compte </RouterLink>
          <RouterLink to="/login" class="cta cta-secondary"> J'ai déjà un compte </RouterLink>
        </div>
        <p class="gdpr-note">
          🛡️ Vos données vous appartiennent. RGPD-compliant. Code source public.
        </p>
      </div>
    </section>

    <!-- ─── FEATURES ─────────────────────────────────────────────────── -->
    <section class="features">
      <h2>Une mémoire qui ne flanche pas</h2>
      <div class="features-grid">
        <article class="feature">
          <div class="feature-icon">📚</div>
          <h3>Capturez sans friction</h3>
          <p>
            Livres, podcasts, articles, vidéos, notes : un seul endroit pour tout consigner, en
            quelques secondes.
          </p>
        </article>

        <article class="feature">
          <div class="feature-icon">🔍</div>
          <h3>Retrouvez en un instant</h3>
          <p>
            Recherche puissante par titre, auteur, contenu ou tag. Plus jamais « j'avais lu ça
            quelque part… ».
          </p>
        </article>

        <article class="feature">
          <div class="feature-icon">🕸️</div>
          <h3>Connectez les idées</h3>
          <p>
            Visualisez les liens entre vos pépites grâce aux tags partagés et à la vue graphe. Votre
            savoir prend forme.
          </p>
        </article>

        <article class="feature">
          <div class="feature-icon">📱</div>
          <h3>Partout, hors-ligne</h3>
          <p>
            PWA installable sur votre téléphone, vos pépites restent consultables même sans réseau.
          </p>
        </article>

        <article class="feature">
          <div class="feature-icon">🔗</div>
          <h3>Partagez avec contrôle</h3>
          <p>
            Envoyez une pépite à un ami avec un lien temporaire. Vous gardez la main sur la durée et
            l'accès.
          </p>
        </article>

        <article class="feature">
          <div class="feature-icon">🛡️</div>
          <h3>Vos données, votre cerveau</h3>
          <p>
            Code source ouvert, pas de pub, pas d'algorithme manipulant vos usages. Vous voyez
            exactement ce qui se passe.
          </p>
        </article>
      </div>
    </section>

    <!-- ─── HOW IT WORKS ─────────────────────────────────────────────── -->
    <section class="how">
      <h2>Comment ça marche</h2>
      <ol class="steps">
        <li class="step">
          <span class="step-num">1</span>
          <h3>Créez votre compte</h3>
          <p>Gratuit, en 30 secondes. Email + pseudo, c'est tout.</p>
        </li>
        <li class="step">
          <span class="step-num">2</span>
          <h3>Ajoutez vos pépites</h3>
          <p>
            Un livre qui vous a marqué, un podcast inspirant, une note rapide… tout est capturable.
          </p>
        </li>
        <li class="step">
          <span class="step-num">3</span>
          <h3>Retrouvez-les à la demande</h3>
          <p>Recherchez par mot-clé, filtrez par type, suivez les tags. Votre mémoire augmentée.</p>
        </li>
      </ol>
    </section>

    <!-- ─── FINAL CTA ────────────────────────────────────────────────── -->
    <section class="final-cta">
      <h2>Prêt à enrichir votre second cerveau ?</h2>
      <RouterLink to="/register" class="cta cta-primary cta-large">
        Commencer maintenant
      </RouterLink>
      <p class="reassurance">Aucune carte requise. Compte supprimable à tout moment.</p>
    </section>
  </main>
</template>

<style scoped>
.landing {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #111827;
}

/* ─── HERO ────────────────────────────────────────────────────────── */
.hero {
  padding: 4rem 2rem 5rem;
  background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
  text-align: center;
}

.hero-content {
  max-width: 48rem;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 999px;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.15;
  margin: 0 0 1rem;
  font-weight: 700;
}

.accent {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.tagline {
  font-size: 1.15rem;
  line-height: 1.6;
  color: #4b5563;
  margin: 1.5rem auto 2rem;
  max-width: 36rem;
}

.cta-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.cta {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.cta:hover {
  transform: translateY(-1px);
}

.cta-primary {
  background: #111827;
  color: white;
}

.cta-primary:hover {
  background: #1f2937;
  box-shadow: 0 4px 12px rgba(17, 24, 39, 0.2);
}

.cta-secondary {
  background: white;
  color: #111827;
  border: 1px solid #d1d5db;
}

.cta-secondary:hover {
  border-color: #9ca3af;
}

.cta-large {
  padding: 1rem 2rem;
  font-size: 1.05rem;
}

.gdpr-note {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* ─── FEATURES ────────────────────────────────────────────────────── */
.features {
  padding: 5rem 2rem;
  max-width: 72rem;
  margin: 0 auto;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 2rem;
}

.feature {
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.feature h3 {
  margin: 0.5rem 0;
  font-size: 1.15rem;
}

.feature p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* ─── HOW IT WORKS ────────────────────────────────────────────────── */
.how {
  padding: 5rem 2rem;
  background: #f9fafb;
}

.how h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.steps {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 2rem;
  list-style: none;
  padding: 0;
}

.step {
  text-align: center;
  padding: 1rem;
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #111827;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  margin-bottom: 1rem;
}

.step h3 {
  margin: 0.5rem 0;
}

.step p {
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

/* ─── FINAL CTA ───────────────────────────────────────────────────── */
.final-cta {
  padding: 5rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #ede9fe 0%, #f9fafb 100%);
}

.final-cta h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.reassurance {
  margin-top: 1rem;
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
