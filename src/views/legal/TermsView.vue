<script setup lang="ts">
const lastUpdate = '12 mai 2026'
</script>

<template>
  <main class="legal">
    <header class="legal-header">
      <h1>Conditions Générales d'Utilisation</h1>
      <p class="meta">Dernière mise à jour : {{ lastUpdate }}</p>
    </header>

    <div class="content">
      <section>
        <h2>1. Présentation du service</h2>
        <p>
          Memoria est une application web open source à but pédagogique, développée dans le cadre
          d'une formation. Elle permet à ses utilisateurs de capturer, organiser et retrouver des «
          pépites » de savoir (livres, podcasts, articles, vidéos, notes).
        </p>
        <p>
          Le code source est librement consultable sur
          <a
            href="https://github.com/HelyaTam/memoria-spa-vuejs"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub</a
          >.
        </p>
      </section>

      <section>
        <h2>2. Acceptation des conditions</h2>
        <p>
          En créant un compte sur Memoria, vous acceptez les présentes CGU ainsi que la
          <RouterLink to="/privacy">politique de confidentialité</RouterLink>. Si vous n'acceptez
          pas ces conditions, n'utilisez pas le service.
        </p>
      </section>

      <section>
        <h2>3. Création de compte</h2>
        <p>
          L'inscription nécessite une adresse email valide, un pseudo et un mot de passe. Vous vous
          engagez à :
        </p>
        <ul>
          <li>Fournir des informations exactes lors de l'inscription</li>
          <li>Maintenir la confidentialité de votre mot de passe</li>
          <li>Notifier toute utilisation non autorisée de votre compte</li>
        </ul>
        <p>
          L'usage du service est strictement personnel. Vous êtes seul responsable du contenu que
          vous y consignez.
        </p>
      </section>

      <section>
        <h2>4. Contenu utilisateur</h2>
        <p>
          Vous restez propriétaire de toutes les pépites, notes et données que vous publiez sur
          Memoria. Vous nous accordez une licence non exclusive pour stocker et afficher ce contenu
          dans le cadre du fonctionnement du service.
        </p>
        <p>Vous vous engagez à ne pas publier de contenu :</p>
        <ul>
          <li>Illégal, diffamatoire, ou violant le droit d'autrui</li>
          <li>Faisant la promotion de la haine ou de la violence</li>
          <li>Violant des droits de propriété intellectuelle</li>
          <li>Contenant des données personnelles de tiers sans leur accord</li>
        </ul>
      </section>

      <section>
        <h2>5. Disponibilité du service</h2>
        <p>
          Memoria étant un projet pédagogique, le service est fourni
          <strong>« en l'état »</strong> sans aucune garantie de disponibilité, de continuité ou
          d'absence de bugs. Le service peut être interrompu à tout moment pour maintenance ou
          modification.
        </p>
        <p>
          Nous recommandons de ne pas confier à Memoria des données dont la perte serait critique
          pour vous, et de conserver vos propres sauvegardes.
        </p>
      </section>

      <section>
        <h2>6. Suppression de compte</h2>
        <p>
          Vous pouvez supprimer votre compte à tout moment depuis votre profil. La suppression
          entraîne l'effacement définitif de toutes vos données (pépites, tags, partages) sans
          possibilité de récupération.
        </p>
      </section>

      <section>
        <h2>7. Responsabilité</h2>
        <p>
          Memoria est un projet bénévole et pédagogique. Aucun engagement de niveau de service (SLA)
          n'est pris. La responsabilité de l'éditeur ne peut être engagée pour les dommages
          indirects résultant de l'utilisation ou de l'indisponibilité du service.
        </p>
      </section>

      <section>
        <h2>8. Propriété intellectuelle</h2>
        <p>
          Le code source de Memoria est distribué sous licence MIT, librement consultable sur
          GitHub. La marque « Memoria » et son identité visuelle appartiennent à leurs créateurs.
        </p>
      </section>

      <section>
        <h2>9. Modifications des CGU</h2>
        <p>
          Les présentes CGU peuvent être modifiées à tout moment. Les modifications substantielles
          seront notifiées par email aux utilisateurs inscrits. La poursuite de l'utilisation du
          service après modification vaut acceptation des nouvelles conditions.
        </p>
      </section>

      <section>
        <h2>10. Droit applicable</h2>
        <p>
          Les présentes CGU sont régies par le droit français. Tout litige relatif à leur
          interprétation ou exécution relève de la compétence des tribunaux français.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Pour toute question relative aux présentes CGU :
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
