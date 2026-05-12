<script setup lang="ts">
const lastUpdate = '12 mai 2026'
</script>

<template>
  <main class="legal">
    <header class="legal-header">
      <h1>Politique de confidentialité</h1>
      <p class="meta">Dernière mise à jour : {{ lastUpdate }}</p>
    </header>

    <div class="content">
      <section class="intro">
        <p>
          Cette politique explique de manière transparente quelles données personnelles Memoria
          collecte, pourquoi, comment elles sont stockées, et quels sont vos droits.
        </p>
        <p>
          Memoria est un projet open source à but pédagogique. Le code étant public, vous pouvez
          vérifier vous-même que tout ce qui est décrit ici correspond à ce que fait réellement
          l'application.
        </p>
      </section>

      <section>
        <h2>1. Données collectées</h2>
        <p>Memoria collecte uniquement les données suivantes :</p>
        <ul>
          <li>
            <strong>À l'inscription</strong> : adresse email, pseudo, mot de passe (stocké
            uniquement sous forme de hash bcrypt — jamais en clair).
          </li>
          <li>
            <strong>Pendant l'utilisation</strong> : vos pépites (titre, contenu, type, auteur,
            tags), créées par vous-même.
          </li>
          <li>
            <strong>Données techniques</strong> : timestamps de création et modification de vos
            données, statut RGPD (date d'acceptation).
          </li>
        </ul>
        <p><strong>Memoria ne collecte pas</strong> :</p>
        <ul>
          <li>Votre adresse IP (au-delà des logs serveur standards)</li>
          <li>Vos données de navigation (pas de tracking analytique)</li>
          <li>Vos données de localisation</li>
          <li>Aucune information auprès de tiers (réseaux sociaux, etc.)</li>
        </ul>
      </section>

      <section>
        <h2>2. Pourquoi ces données ?</h2>
        <ul>
          <li>
            <strong>Email</strong> : identifiant unique pour la connexion + envoi du lien de
            réinitialisation du mot de passe.
          </li>
          <li><strong>Pseudo</strong> : affichage dans l'interface et identifiant visible.</li>
          <li>
            <strong>Hash du mot de passe</strong> : authentification sécurisée (jamais lu en clair).
          </li>
          <li>
            <strong>Pépites</strong> : c'est le service que vous utilisez — stockage et restitution
            de vos contenus.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Pas de partage à des tiers</h2>
        <p>
          Vos données ne sont
          <strong>jamais vendues, louées ou partagées</strong> à des tiers. Memoria étant un projet
          pédagogique sans modèle commercial, il n'existe aucun intérêt à monétiser vos données.
        </p>
        <p>
          Vos pépites ne sont visibles que par vous, sauf si vous générez explicitement un lien de
          partage pour une pépite donnée.
        </p>
      </section>

      <section>
        <h2>4. Durée de conservation</h2>
        <p>Vos données sont conservées :</p>
        <ul>
          <li><strong>Tant que votre compte est actif</strong> : vous gardez le contrôle.</li>
          <li>
            <strong>Supprimées immédiatement</strong> et de façon irréversible si vous supprimez
            votre compte depuis votre tableau de bord.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Cookies et stockage local</h2>
        <p>Memoria utilise :</p>
        <ul>
          <li>
            <strong>Un cookie de session</strong> (HTTP-only, contenant un JWT) pour vous garder
            connecté. Strictement nécessaire au fonctionnement.
          </li>
          <li>
            <strong>Aucun cookie tiers, aucun tracker, aucune publicité.</strong>
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (Règlement UE 2016/679),
          vous disposez des droits suivants :
        </p>
        <ul>
          <li>
            <strong>Droit d'accès</strong> : consulter vos données depuis votre tableau de bord à
            tout moment.
          </li>
          <li>
            <strong>Droit de rectification</strong> : modifier vos pépites depuis l'interface.
          </li>
          <li>
            <strong>Droit à l'effacement</strong> (article 17) : supprimer votre compte et toutes
            vos données en un clic.
          </li>
          <li>
            <strong>Droit à la portabilité</strong> : sur demande via GitHub, export de vos données
            au format JSON.
          </li>
          <li>
            <strong>Droit de réclamation</strong> : vous pouvez introduire une réclamation auprès de
            la <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Sécurité</h2>
        <p>Memoria met en œuvre les bonnes pratiques de sécurité suivantes :</p>
        <ul>
          <li>Mots de passe stockés en hash bcrypt (jamais en clair)</li>
          <li>Communications chiffrées (HTTPS obligatoire)</li>
          <li>Cookies de session HTTP-only (protection contre XSS)</li>
          <li>Protection CSRF activée côté backend</li>
        </ul>
        <p>
          Cependant, Memoria étant un projet pédagogique, nous ne pouvons pas garantir l'absence
          totale de failles. Si vous découvrez une vulnérabilité, merci de nous en informer via
          <a
            href="https://github.com/HelyaTam/memoria-spa-vuejs/issues"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub</a
          >.
        </p>
      </section>

      <section>
        <h2>8. Modifications</h2>
        <p>
          Cette politique peut évoluer. Toute modification substantielle vous sera notifiée par
          email.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Pour exercer vos droits ou poser une question :
          <a
            href="https://github.com/HelyaTam/memoria-spa-vuejs/issues"
            target="_blank"
            rel="noopener noreferrer"
            >ouvrir une issue sur GitHub</a
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

.intro p {
  color: #4b5563;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.content section {
  margin-bottom: 2rem;
}

.content h2 {
  font-size: 1.25rem;
  margin: 2rem 0 0.75rem;
  color: #111827;
}

.content p {
  color: #374151;
  margin: 0.75rem 0;
}

.content ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
  color: #374151;
}

.content li {
  margin-bottom: 0.4rem;
}

.content a {
  color: #6366f1;
  text-decoration: underline;
}

.content a:hover {
  color: #4f46e5;
}

.back-link {
  margin-top: 3rem;
  text-align: center;
}

.back-link a {
  color: #6366f1;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
