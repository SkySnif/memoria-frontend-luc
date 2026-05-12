# 📋 Tâches à reprendre

L'équipe précédente a posé des bonnes fondations mais n'a pas eu le temps de finir tout ce qui était prévu. Ce document liste ce qu'il reste à faire, classé par priorité.

Pour chaque tâche : **statut**, fichiers concernés, **complexité estimée** (⭐ à ⭐⭐⭐⭐⭐), et quelques notes pour s'orienter.

> 💡 Si tu débarques sur le projet, lis d'abord [`ONBOARDING.md`](./ONBOARDING.md).

---

## 🚧 Critique — bloquant pour la mise en production

### Brancher le vrai backend (remplacer MSW)

- **Statut** : pas commencé
- **Complexité** : ⭐⭐
- **Fichiers** : `.env`, `src/services/api.ts` (vérifier les headers), config Vite proxy si besoin

Aujourd'hui le frontend tape sur des mocks (`VITE_USE_MOCKS=true`). Pour passer en prod :

- Mettre `VITE_USE_MOCKS=false` dans le `.env` de production
- Pointer `VITE_API_BASE_URL` vers l'URL réelle du backend
- Tester chaque endpoint (login, register, items CRUD, etc.) sur le vrai backend
- Régler les divergences éventuelles (format des dates, casing des champs, erreurs)

⚠️ Beaucoup de bugs apparaîtront à ce moment. Avancer endpoint par endpoint, et garder MSW actif en parallèle (`VITE_USE_MOCKS=true` en dev local) tant que tout n'est pas validé sur le vrai backend.

### Responsive mobile

- **Statut** : pas du tout fait, l'app est desktop-only
- **Complexité** : ⭐⭐⭐
- **Fichiers** : tous les composants avec des styles fixes (`AppHeader.vue`, `PublicFooter.vue`, `LandingView.vue`, cards items, formulaires…)

Sur mobile l'app déborde et c'est inutilisable. À refactorer en mobile-first :

- Header : prévoir un menu hamburger pour les écrans < 640px
- Grilles cards : déjà en `auto-fit` côté items, à tester sur petit écran
- Formulaires : padding et largeurs à ajuster
- Footer : passer en 1 ou 2 colonnes sur mobile

Astuce : utiliser `clamp()` pour les tailles fluides, et des media queries `min-width` pour les breakpoints.

### Protection CSRF côté frontend

- **Statut** : middleware activé côté backend, header pas injecté côté frontend
- **Complexité** : ⭐⭐
- **Fichiers** : `src/services/api.ts`

Le backend attend un header `X-CSRF-Token` sur les requêtes POST/PATCH/DELETE. Aujourd'hui le frontend ne l'envoie pas → toutes les modifs vont échouer en prod.

Démarche :

- Récupérer le token via un endpoint dédié (`GET /api/v1/auth/csrf`) ou via un cookie `XSRF-TOKEN`
- L'injecter automatiquement dans `api.post/patch/delete`
- Penser à le rafraîchir si expiration

### Mentions légales — placeholders à remplir

- **Statut** : placeholders en place
- **Complexité** : ⭐
- **Fichiers** : `src/views/legal/LegalNoticeView.vue`

Rechercher les `[À COMPLÉTER]` dans le fichier et les remplacer par :

- Le nom de l'éditeur (ou pseudo si tu préfères rester anonyme)
- L'hébergeur réel quand le projet sera déployé

---

## ♿ Accessibilité numérique (RGAA / WCAG 2.1 AA / EAA)

> Cette section est **incontournable**. Même si ce projet pédagogique n'atteint pas les seuils légaux, la pratique de l'accessibilité fait partie du métier de dev frontend en 2026.

### Contexte légal — l'Acte Européen sur l'Accessibilité (EAA)

Depuis le **28 juin 2025**, l'Acte Européen sur l'Accessibilité (directive UE 2019/882) est en vigueur en France. Cette directive impose à de nombreuses entreprises privées de rendre leurs sites web et applications mobiles accessibles aux personnes en situation de handicap.

**Qui est concerné** : les entreprises privées de plus de 10 salariés ou réalisant plus de 2 millions d'euros de chiffre d'affaires, dans des secteurs comme l'e-commerce, le bancaire, le transport, la téléphonie, les médias audiovisuels. Les microentreprises sous ces seuils en sont exemptées. Les services publics restent soumis à des obligations antérieures depuis la loi Handicap de 2005.

**Sanctions** : amende pouvant atteindre 50 000 euros par service en ligne non conforme, plus 25 000 euros en cas de manquement aux obligations déclaratives. Le délai de mise en conformité est de 6 mois après une éventuelle sanction.

**Référentiels à respecter** :

- **RGAA** (Référentiel Général d'Amélioration de l'Accessibilité) — référentiel français, 106 critères techniques précis, niveau cible AA
- **WCAG 2.1 niveau AA** (Web Content Accessibility Guidelines) — standard international
- **EN 301 549** — norme européenne harmonisée

> 📚 Documentation officielle : [accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/) et le [RGAA en ligne](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/).

### Pourquoi on l'applique ici, même sans obligation légale

- **Compétence professionnelle** : tout dev frontend doit savoir produire du code accessible
- **Bénéfices SEO** : un site accessible est mieux référencé (Google récompense la sémantique correcte)
- **Qualité du code** : forcer l'accessibilité, c'est forcer une structure HTML propre, des contrastes lisibles, du focus management — ça améliore la qualité globale
- **Inclusion** : 12 millions de personnes en situation de handicap en France, soit environ 18% de la population

### Audit initial RGAA

- **Statut** : aucun audit fait
- **Complexité** : ⭐⭐
- **Fichiers** : toute l'app

Pour mesurer où on en est. Plusieurs outils complémentaires :

| Outil                                                                        | Type                      | Usage                                                             |
| :--------------------------------------------------------------------------- | :------------------------ | :---------------------------------------------------------------- |
| [**axe DevTools**](https://www.deque.com/axe/devtools/)                      | Extension Chrome/Firefox  | Audit automatique d'une page (60% des critères)                   |
| [**WAVE**](https://wave.webaim.org/)                                         | Extension navigateur      | Visualisation des erreurs sur la page                             |
| [**Lighthouse**](https://developer.chrome.com/docs/lighthouse/accessibility) | Intégré à Chrome DevTools | Audit complet, donne un score                                     |
| [**ARA**](https://ara.numerique.gouv.fr/)                                    | Outil officiel DINUM      | Audit RGAA manuel guidé, complet                                  |
| Tests **clavier seul**                                                       | Manuel                    | Naviguer toute l'app avec Tab/Shift+Tab/Enter/Escape uniquement   |
| Tests **lecteur d'écran**                                                    | Manuel                    | NVDA (Windows gratuit), VoiceOver (macOS/iOS), TalkBack (Android) |

Démarche :

1. Faire tourner axe DevTools sur les pages principales (Landing, Login, Profile, ItemsList, ItemForm)
2. Lighthouse → onglet Accessibility → noter le score actuel
3. Tester la navigation au clavier seul sur un parcours complet (login → ajouter pépite → supprimer)
4. Lister tous les problèmes trouvés dans une issue GitHub par page

### Corrections d'accessibilité prioritaires

- **Statut** : pas commencé
- **Complexité** : ⭐⭐⭐
- **Fichiers** : tous les composants Vue

Voici les problèmes les plus courants qu'il faudra fixer, classés par catégorie WCAG :

**1. Perceptible**

- Toutes les images doivent avoir un `alt=""` (vide pour décoratives) ou `alt="description"` (informatives)
- Contrastes de couleurs : viser ratio 4.5:1 minimum pour le texte normal, 3:1 pour le grand texte. Tester avec [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Ne jamais transmettre une info uniquement par la couleur (ex: erreurs en rouge → ajouter une icône ou un texte)

**2. Utilisable**

- Tous les éléments interactifs doivent être accessibles au clavier (Tab pour naviguer, Enter/Space pour activer)
- Indicateur de focus visible (pas de `outline: none` sans alternative claire)
- Pas de pièges au clavier (l'utilisateur ne doit jamais être bloqué dans un élément)
- Liens et boutons doivent avoir un texte explicite (pas juste « cliquez ici » ou une icône seule)

**3. Compréhensible**

- Langue de la page déclarée : `<html lang="fr">` (vérifier dans `index.html`)
- Labels associés à chaque input (`<label for="email">` + `<input id="email">`)
- Messages d'erreur clairs, associés au champ via `aria-describedby`
- Structure de titres hiérarchique (`<h1>` → `<h2>` → `<h3>`, pas de saut)

**4. Robuste**

- HTML valide (pas de balises mal fermées)
- Rôles ARIA utilisés correctement (`role="alert"` pour les erreurs, `aria-live` pour les zones dynamiques)
- Composants custom : implémenter les patterns ARIA officiels ([WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/))

### Déclaration d'accessibilité (obligatoire pour les sites concernés)

- **Statut** : pas faite
- **Complexité** : ⭐⭐
- **Fichiers** : nouvelle page `src/views/legal/AccessibilityView.vue` + lien dans le footer

Pour les sites légalement concernés, la déclaration d'accessibilité est **obligatoire et publique**. Elle doit contenir :

- Le nom et l'organisme qui édite le site
- Le niveau de conformité RGAA (Totalement / Partiellement / Non conforme)
- L'état d'avancement (résultat de l'audit)
- Les contenus non accessibles et leurs raisons
- Le contact pour signaler un problème
- Le recours en cas de non-réponse (Défenseur des droits)

Modèle officiel : [modèle de déclaration sur accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/methodologie/).

### Schéma pluriannuel et plan d'action annuel

- **Statut** : pas fait
- **Complexité** : ⭐
- **Fichiers** : nouveau dans `docs/`

Pour les sites concernés légalement, un **schéma pluriannuel** (3 ans) et un **plan d'action annuel** doivent être publiés et accessibles. Pour le projet pédagogique, c'est un exercice de rédaction de doc utile.

---

## 🌱 Éco-conception du service numérique

> Le numérique représente environ 4% des émissions mondiales de gaz à effet de serre, en croissance rapide. L'éco-conception consiste à réduire cet impact dès la conception. C'est aussi une compétence de plus en plus demandée et bientôt réglementée.

### Contexte et référentiels

Référentiels et lois en vigueur en France :

- **RGESN** (Référentiel Général d'Écoconception de Services Numériques) — référentiel officiel de la DINUM, [ecoresponsable.numerique.gouv.fr](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/)
- **Loi REEN** (Réduction de l'Empreinte Environnementale du Numérique) du 15 novembre 2021 — impose aux collectivités > 50 000 habitants de produire une stratégie numérique responsable
- **Loi Climat et résilience** (août 2021) — obligation d'information environnementale renforcée
- **GR491** — Guide de référence de conception responsable de services numériques (INR, Institut du Numérique Responsable)

### Mesurer la baseline du projet

- **Statut** : aucune mesure faite
- **Complexité** : ⭐⭐
- **Fichiers** : aucun, c'est de l'audit

Outils gratuits pour mesurer l'empreinte d'une page web :

| Outil                                                                      | Mesure                   | Usage                                            |
| :------------------------------------------------------------------------- | :----------------------- | :----------------------------------------------- |
| [**EcoIndex**](https://www.ecoindex.fr/)                                   | Note A-G + g CO2e/visite | Extension navigateur + site, simple et rapide    |
| [**Website Carbon Calculator**](https://www.websitecarbon.com/)            | g CO2 par visite         | Note simple, basée sur le poids et l'hébergement |
| [**GreenFrame**](https://greenframe.io/)                                   | Mesure réelle de conso   | Plus précis, payant                              |
| [**Lighthouse**](https://developer.chrome.com/docs/lighthouse/performance) | Performance score        | Indicateur indirect (perfs ≈ empreinte)          |

Démarche :

1. Mesurer la note EcoIndex actuelle des pages principales (Landing, ItemsList)
2. Noter le score, le poids transféré, le nombre de requêtes
3. Cet état initial servira de référence pour mesurer les améliorations

### Principes d'éco-conception à appliquer

- **Statut** : pas commencé, à appliquer en continu
- **Complexité** : ⭐⭐⭐
- **Fichiers** : transverse

**Sobriété fonctionnelle** (la plus impactante)

- Chaque feature ajoutée doit être justifiée par un vrai usage. La feature non utilisée mais qui existe = code à charger, à maintenir, à exécuter
- Préférer le pull au push (l'utilisateur charge ce qu'il veut, on n'envoie pas de notifs intempestives)
- Pas de carrousels auto-play, pas de vidéos auto-play
- Pas de polling agressif côté frontend (préférer le SSE / WebSocket pour le temps-réel)

**Sobriété technique**

- **Bundle JS minimal** : analyser avec [vite-bundle-visualizer](https://github.com/btd/rollup-plugin-visualizer). Cibler < 150 Ko gzippé pour l'initial
- **Lazy load** des routes (déjà fait via `() => import(...)` dans `router/index.ts`, à maintenir)
- **Tree shaking** : importer nominativement (`import { ref } from 'vue'`), pas en wildcard
- **Pas de polyfills inutiles** : Vite cible déjà les navigateurs modernes par défaut

**Médias**

- Voir la section [Optimisation des images](#optimisation-des-images-webp-avif-svg-png) plus haut
- Pas de fonts custom si le système peut faire l'affaire (`font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` est utilisé dans le projet, bon réflexe)
- Si fonts custom indispensable : variable font + un seul fichier WOFF2 + `font-display: swap`
- Vidéos : préférer un lien externe (YouTube, Vimeo) à l'auto-hébergement pour économiser bande passante et stockage

**Requêtes réseau**

- Cache HTTP agressif sur les assets statiques (already done by Vite for hashed files)
- Service worker pour mettre en cache l'app shell (vite-plugin-pwa fait déjà ça)
- Pagination ou lazy load des listes (pour les items, si la liste devient longue)
- Désactiver les requêtes inutiles (analytics tiers, scripts marketing, pixels de tracking)

**Pas de tracking ni d'analytics tiers**

- Le projet n'en a déjà aucun, c'est très bien ✅
- Si besoin d'analytics, préférer une solution privacy-friendly et légère type [Plausible](https://plausible.io/) (autohébergeable) ou [Umami](https://umami.is/)

**Compatibilité ascendante**

- Tester l'app sur un navigateur de 3-4 ans (pas le tout dernier Chrome)
- Vérifier sur connexion lente (Chrome DevTools → Network → Slow 3G)
- L'app doit dégrader proprement, pas se casser

### Hébergement vert

- **Statut** : à choisir au déploiement
- **Complexité** : ⭐
- **Fichiers** : aucun, c'est une décision opérationnelle

Quand on déploiera, choisir un hébergeur :

- Alimenté par des énergies renouvelables (vérifiable sur [The Green Web Foundation](https://www.thegreenwebfoundation.org/))
- Localisé géographiquement proche des utilisateurs (latence + empreinte transport)
- Pour la France : [Infomaniak](https://www.infomaniak.com/fr) (Suisse, énergie verte certifiée), [OVHcloud](https://www.ovhcloud.com/fr/) (data centers verts en France), [Scaleway](https://www.scaleway.com/) (Paris)

### Lifetime / durabilité du code

- **Statut** : à intégrer dans la culture projet
- **Complexité** : transverse

- Code lisible et bien documenté → maintenable plus longtemps → moins de reécriture coûteuse
- Tests automatisés → refactor sans peur → durabilité
- Dépendances stables et bien choisies → moins de churn
- Privilégier les standards web (HTML/CSS/JS natifs) plutôt que des libs lourdes quand possible

### Page « Notre engagement éco-responsable » (bonus)

- **Statut** : pas faite
- **Complexité** : ⭐
- **Fichiers** : nouvelle page `src/views/legal/EcoResponsibilityView.vue`

Une page publique qui détaille :

- Les choix techniques faits pour réduire l'empreinte (mesures EcoIndex, optimisations)
- Les principes d'éco-conception appliqués
- Le score EcoIndex actuel (avec lien vers l'audit)
- Le bilan annuel des améliorations

C'est à la fois bon pour la marque, transparent pour l'utilisateur, et formateur à rédiger.

---

## 🎨 Assets statiques, SEO & optimisation images

> Cette section est **autant un sujet que le code lui-même**. Une app non référencée, sans favicon brandé et avec des images de 3 Mo, c'est pas un projet pro.

### Favicon et icônes (toutes plateformes)

- **Statut** : favicon Vite par défaut (logo Vite générique)
- **Complexité** : ⭐
- **Fichiers** : `public/`, `index.html`

L'onglet navigateur affiche aujourd'hui le logo Vite — pas pro. Il faut un pack complet, généré à partir d'une source maître :

**Source maître à créer** : un SVG du logo Memoria en 512×512 (panda 🐼 stylisé, cerveau, ou les deux). SVG car vectoriel, redimensionnable sans perte.

**Pack à générer** depuis cette source (via [realfavicongenerator.net](https://realfavicongenerator.net) ou équivalent) :

| Fichier                      | Taille               | Usage                                |
| :--------------------------- | :------------------- | :----------------------------------- |
| `favicon.ico`                | multi (16, 32, 48)   | Vieux navigateurs, onglet par défaut |
| `favicon-16x16.png`          | 16×16                | Onglet navigateur                    |
| `favicon-32x32.png`          | 32×32                | Onglet navigateur HD                 |
| `apple-touch-icon.png`       | 180×180              | iOS, ajout à l'écran d'accueil       |
| `android-chrome-192x192.png` | 192×192              | Android, PWA                         |
| `android-chrome-512x512.png` | 512×512              | PWA splash screen, stores            |
| `safari-pinned-tab.svg`      | vectoriel monochrome | Safari onglet épinglé                |

**Convention de nommage à respecter** : kebab-case partout (`apple-touch-icon.png`, pas `AppleTouchIcon.png` ni `apple_touch_icon.png`). C'est la convention web standard et c'est ce qu'attendent les outils de génération.

Mise à jour de `index.html` :

```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366F1" />
<meta name="theme-color" content="#6366F1" />
```

### Manifest PWA et icônes installables

- **Statut** : généré automatiquement par `vite-plugin-pwa`, mais valeurs par défaut
- **Complexité** : ⭐⭐
- **Fichiers** : `vite.config.ts` (section `VitePWA`), `public/`

Le plugin PWA génère `manifest.webmanifest` à partir de la config Vite. À personnaliser :

- `name` : "Memoria — Votre second cerveau"
- `short_name` : "Memoria"
- `description` : la même que dans les balises meta
- `theme_color` : `#6366F1` (cohérent avec le CSS)
- `background_color` : `#FFFFFF` (splash screen)
- `display` : `standalone` (ressemble à une app native installée)
- `icons` : référencer `android-chrome-192x192.png` et `android-chrome-512x512.png` avec `purpose: "any maskable"`

Pour tester : `pnpm build && pnpm preview`, puis ouvrir Chrome DevTools → onglet "Application" → "Manifest". Tout doit être vert.

### Open Graph et Twitter Cards (partage social)

- **Statut** : aucune balise Open Graph présente
- **Complexité** : ⭐⭐
- **Fichiers** : `index.html`, `public/og-image.png`

Aujourd'hui, si quelqu'un colle l'URL de Memoria dans Slack, Discord, Twitter ou LinkedIn, le lien apparaît nu, sans aperçu. Il faut ajouter les balises Open Graph + une image dédiée.

**Image à créer** : `public/og-image.png`, **1200×630 px** (ratio 1.91:1, standard Open Graph). Doit contenir :

- Le logo Memoria
- Le tagline "Votre second cerveau"
- Un fond cohérent avec l'identité visuelle (gradient indigo → violet par exemple)

Outils suggérés : Figma, Canva, ou même Photoshop. Exporter en PNG, optimiser ensuite (voir section optimisation ci-dessous).

**Balises à ajouter dans `index.html`** :

```html
<!-- Open Graph (Facebook, LinkedIn, Slack, Discord…) -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Memoria — Votre second cerveau" />
<meta
  property="og:description"
  content="Capturez, organisez et retrouvez vos pépites de savoir : livres, podcasts, articles, vidéos, notes."
/>
<meta property="og:image" content="https://memoria.example.com/og-image.png" />
<meta property="og:url" content="https://memoria.example.com" />
<meta property="og:site_name" content="Memoria" />
<meta property="og:locale" content="fr_FR" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Memoria — Votre second cerveau" />
<meta
  name="twitter:description"
  content="Capturez, organisez et retrouvez vos pépites de savoir."
/>
<meta name="twitter:image" content="https://memoria.example.com/og-image.png" />
```

⚠️ L'URL de l'image **doit être absolue** (avec `https://...`), pas relative. Sinon les scrapers de réseaux sociaux ne la trouvent pas.

**Tester** : utiliser [opengraph.xyz](https://www.opengraph.xyz/) ou le [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

### SEO de base (balises meta)

- **Statut** : seul `<title>` est rempli, le reste vide
- **Complexité** : ⭐⭐
- **Fichiers** : `index.html`, et plus tard un mécanisme dynamique par route

**Phase 1 — balises statiques dans `index.html`** :

```html
<title>Memoria — Votre second cerveau</title>
<meta
  name="description"
  content="Capturez, organisez et retrouvez vos pépites de savoir : livres, podcasts, articles, vidéos, notes. App open source, RGPD-compliant."
/>
<meta
  name="keywords"
  content="second cerveau, knowledge management, notes, productivité, pkm, second brain"
/>
<meta name="author" content="[À COMPLÉTER]" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://memoria.example.com" />
```

**Phase 2 — meta dynamiques par route** (plus avancé, ⭐⭐⭐) :
Utiliser [`@unhead/vue`](https://unhead.unjs.io/) ou [`vue-meta`](https://github.com/nuxt/vue-meta) pour qu'une route `/cgu` affiche `<title>CGU — Memoria</title>` au lieu du titre par défaut. Important pour le référencement et l'expérience utilisateur (onglets distinguables).

### robots.txt et sitemap.xml

- **Statut** : aucun
- **Complexité** : ⭐
- **Fichiers** : `public/robots.txt`, `public/sitemap.xml`

**`public/robots.txt`** (à créer) :

```text
User-agent: *
Allow: /
Disallow: /profile
Disallow: /dashboard
Disallow: /items
Disallow: /items/
Disallow: /reset-password

Sitemap: https://memoria.example.com/sitemap.xml
```

Logique : on autorise l'indexation des pages publiques (landing, CGU, privacy, mentions, login, register), on bloque les pages authentifiées (qui de toute façon redirigent sans session, mais bon signal pour les crawlers).

**`public/sitemap.xml`** (à créer) — pour un projet pédagogique, version statique suffit :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://memoria.example.com/</loc><priority>1.0</priority></url>
  <url><loc>https://memoria.example.com/login</loc><priority>0.5</priority></url>
  <url><loc>https://memoria.example.com/register</loc><priority>0.5</priority></url>
  <url><loc>https://memoria.example.com/cgu</loc><priority>0.3</priority></url>
  <url><loc>https://memoria.example.com/privacy</loc><priority>0.3</priority></url>
  <url><loc>https://memoria.example.com/legal-notice</loc><priority>0.3</priority></url>
</urlset>
```

### Optimisation des images (WebP, AVIF, SVG, PNG)

- **Statut** : aucune image custom encore, mais une politique à définir maintenant
- **Complexité** : ⭐⭐
- **Fichiers** : tous les futurs `public/*.png`, `src/assets/images/*`

Choisir le **bon format selon l'usage**, sinon le bundle explose, le score Lighthouse chute, et l'empreinte écologique grimpe :

| Type de contenu                                     | Format optimal                          | Pourquoi                                              |
| :-------------------------------------------------- | :-------------------------------------- | :---------------------------------------------------- |
| Icônes, logos, illustrations simples                | **SVG**                                 | Vectoriel, scalable, ultra léger, modifiable au CSS   |
| Photos réalistes (couvertures de livres, paysages)  | **WebP** (fallback JPEG)                | Compression supérieure à JPEG, supporté partout       |
| Photos en haute qualité (héro de page)              | **AVIF** (fallback WebP, fallback JPEG) | Encore mieux que WebP, mais support navigateur récent |
| Captures d'écran, images avec texte ou transparence | **PNG** (ou WebP lossless)              | Sans perte, supporte alpha                            |
| Animations légères                                  | **SVG animé** ou **WebM**               | Pas de GIF (énorme)                                   |
| Favicons multi-tailles                              | **ICO** + **PNG**                       | Standards historiques + modernes                      |

**Règle de poids cible** :

- Une image au-dessus du fold (visible immédiatement) : **< 100 Ko** idéalement
- Une image sous le fold (chargée plus tard) : **< 300 Ko**
- Un asset PWA (icône installable) : **< 50 Ko** par taille
- L'image Open Graph : **< 500 Ko** (compromise qualité/poids car partagée souvent)

**Outils suggérés** :

- [Squoosh](https://squoosh.app/) (Google, dans le navigateur) — pour optimiser image par image
- [SVGOMG](https://jakearchibald.github.io/svgomg/) — pour minifier les SVG (vire les métadonnées, optimise les paths)
- [TinyPNG](https://tinypng.com/) — compression PNG/JPEG sans perte visible
- [vite-plugin-image-optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer) — pour automatiser à la build (à ajouter au projet)

**Convention de nommage des images** :

- kebab-case : `hero-illustration.webp`, pas `HeroIllustration.webp`
- préciser la dimension si plusieurs versions : `og-image-1200x630.png`
- préfixe contextuel : `icon-`, `logo-`, `bg-`, `hero-` pour repérer vite leur rôle
- pas d'espaces, pas d'accents, pas de majuscules

**Élément `<picture>` pour servir le format optimal** (à utiliser dès qu'on a des photos) :

```html
<picture>
  <source srcset="/images/book-cover.avif" type="image/avif" />
  <source srcset="/images/book-cover.webp" type="image/webp" />
  <img
    src="/images/book-cover.jpg"
    alt="Couverture du livre"
    loading="lazy"
    width="200"
    height="300"
  />
</picture>
```

Attributs `loading="lazy"` + `width`/`height` explicites : critiques pour les performances, le Cumulative Layout Shift (CLS) ET pour l'accessibilité (le navigateur réserve la place avant que l'image charge).

### Organisation du dossier `public/` et `src/assets/`

- **Statut** : `public/` quasi vide, à organiser
- **Complexité** : ⭐

**Règle générale** :

- `public/` → fichiers servis **tels quels**, jamais bundlés par Vite (favicons, robots.txt, sitemap.xml, manifest, og-image, mockServiceWorker.js)
- `src/assets/` → fichiers **importés** dans le code, bundlés et optimisés par Vite (CSS, images utilisées dans des composants, fonts)

**Structure cible** :

```text
public/
├─ favicon.ico
├─ favicon-16x16.png
├─ favicon-32x32.png
├─ apple-touch-icon.png
├─ android-chrome-192x192.png
├─ android-chrome-512x512.png
├─ safari-pinned-tab.svg
├─ og-image.png                 # Image Open Graph
├─ robots.txt
├─ sitemap.xml
└─ mockServiceWorker.js          # généré par MSW, ne pas toucher

src/assets/
├─ main.css                      # déjà là
├─ images/                       # NOUVEAU dossier à créer
│  ├─ logo-memoria.svg
│  ├─ illustrations/
│  │  ├─ hero-second-brain.svg
│  │  └─ empty-state-items.svg
│  └─ icons/                     # icônes UI personnalisées
└─ fonts/                        # NOUVEAU si on customise les fonts plus tard
```

---

## 🔨 Features en cours / à terminer

### Dashboard administrateur

- **Statut** : placeholder en place, avec liste des features prévues
- **Complexité** : ⭐⭐⭐⭐
- **Fichiers** : `src/views/DashboardView.vue` et beaucoup de nouveaux à créer

La vue admin n'est qu'un placeholder. Quatre features prévues (dans l'ordre suggéré de difficulté croissante) :

- **Gestion des utilisateurs** (CRUD users, changement de rôle) — bon premier exercice
- **Statistiques de la plateforme** (nb users actifs, nb pépites par type, etc.)
- **Journal d'audit** (historique des actions sensibles)
- **Modération du contenu** (signalements, retrait de pépites)

Suivre le pattern du module items :

- Schémas Zod dans `src/schemas/admin.ts`
- Service dans `src/services/adminApi.ts`
- Store Pinia dans `src/stores/useAdminStore.ts`
- Handlers MSW dans `src/mocks/handlers/admin.ts`
- Composants dans `src/views/admin/`

### Module Tags

- **Statut** : pas commencé (les tables SQL existent côté backend)
- **Complexité** : ⭐⭐⭐
- **Fichiers** : à créer

Les pépites doivent pouvoir être taguées (relation many-to-many users ↔ tags ↔ items). Démarche :

- Schéma Zod pour `Tag` (`{id, tagName, userId, createdAt, updatedAt}`)
- Service `tagsApi.ts` (CRUD)
- Store `useTagsStore`
- Mise à jour de `ItemFormView.vue` pour ajouter un multi-select de tags
- Filtrage par tag sur `ItemsListView.vue`

C'est la suite naturelle du module items qui existe déjà. Copier-adapter ce pattern est un exercice formateur.

### Lecteur audio pour les podcasts

- **Statut** : pas commencé
- **Complexité** : ⭐⭐
- **Fichiers** : `src/views/items/ItemsListView.vue`, `src/schemas/item.ts` (ajouter `audioUrl`)

Quand une pépite est de type `podcast`, on aimerait afficher un lecteur audio HTML5 natif dans la card.

Démarche :

- Ajouter `audioUrl` au schéma item (optionnel)
- Mettre à jour `ItemFormView.vue` pour saisir cette URL si type = podcast
- Dans `ItemsListView.vue`, afficher `<audio controls :src="item.audioUrl" v-if="item.contentType === 'podcast'" />`

### Export de mes données (RGPD)

- **Statut** : endpoint backend prêt (à confirmer), bouton frontend à ajouter
- **Complexité** : ⭐⭐
- **Fichiers** : `src/views/ProfileView.vue`, `src/services/authApi.ts`

Le RGPD impose le droit à la portabilité. Ajouter dans ProfileView (à côté de la zone dangereuse) un bouton « Télécharger mes données » qui :

- Appelle `GET /api/v1/users/me/export`
- Reçoit un JSON avec toutes les données de l'utilisateur
- Déclenche un téléchargement côté navigateur (Blob + lien temporaire)

Snippet de référence pour le download :

```js
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `memoria-export-${Date.now()}.json`
a.click()
URL.revokeObjectURL(url)
```

### Recherche / filtre sur les pépites

- **Statut** : pas commencé
- **Complexité** : ⭐⭐
- **Fichiers** : `src/views/items/ItemsListView.vue`

Dans la liste des pépites, ajouter :

- Une barre de recherche (filtre par titre ou contenu)
- Un sélecteur de type (livre/podcast/article/vidéo/note)
- Tri par date (croissant / décroissant)

Tout peut se faire côté frontend (filter sur le tableau d'items du store, computed properties). Pas besoin de backend.

---

## 💡 Idées et features avancées (pas urgent)

### Module Partage (Shares)

- **Complexité** : ⭐⭐⭐⭐

Les tables SQL `shares` sont prévues côté backend. Permettre de partager une pépite via un lien temporaire (token + expiration). Le destinataire (sans compte) la consulte en lecture seule.

### Vue Graphe style Obsidian

- **Complexité** : ⭐⭐⭐⭐⭐

Visualiser les connexions entre pépites via les tags partagés. Lib suggérée : `vis-network`, `vue-flow` ou `d3-force`. Nécessite que le module Tags soit fini.

### Mode sombre

- **Complexité** : ⭐⭐⭐

Refactor de tous les composants pour utiliser des variables CSS au lieu de couleurs en dur. Toggle dans le profil, respect de `prefers-color-scheme`, persistence en `localStorage`. **Bonus éco-conception** : sur écran OLED, le mode sombre consomme jusqu'à 60% d'énergie en moins.

### Internationalisation (i18n)

- **Complexité** : ⭐⭐⭐

L'app est tout en français aujourd'hui. Pour ouvrir à d'autres langues, ajouter `vue-i18n` et extraire les chaînes dans des fichiers de traduction.

### PWA hors-ligne avancée

- **Complexité** : ⭐⭐⭐⭐

Le PWA est installable mais l'expérience hors-ligne est minimale. Stratégies à mettre en place :

- Cache stale-while-revalidate sur les pépites
- File d'attente pour les modifs faites offline (synchro au retour de connexion)
- Indicateur « vous êtes hors-ligne » dans l'UI

---

## 🐛 Bugs / petits soucis connus

### Navigation header non centrée

Les liens « Profil » / « Mes pépites » sont collés à gauche du header. Idéalement centrés horizontalement entre la brand et la zone user-nav.

### Lien de reset password loggé dans la console

En mode mock, le lien de réinitialisation s'affiche dans la console DevTools (au lieu d'un vrai email). C'est volontaire pour le dev, mais à vérifier que le vrai backend envoie bien un email en prod.

### Pas de feedback visuel sur les actions longues

Les boutons indiquent `loading: true` via leur texte (`Connexion…`), mais pas de spinner global. Sur des actions lentes (réseau saturé), l'utilisateur peut croire que rien ne se passe.

---

## 📚 Dette technique

- **Couverture de tests** : bonne sur les stores et services, quasi inexistante sur les vues. Idéal pour ajouter des tests d'intégration avec `@vue/test-utils`.
- **Performances** : pas optimisé. Code splitting via les imports dynamiques du router déjà en place. Mesurer le bundle size avec `pnpm build` et `dist/stats.html`.
- **Lighthouse audit** : faire tourner Lighthouse (Chrome DevTools → onglet Lighthouse) sur la prod et viser **90+** sur les 4 catégories (Performance, Accessibility, Best Practices, SEO). C'est aussi une bonne checklist de ce qui peut encore être amélioré.
- **Documentation TSDoc** : la majorité des fonctions publiques sont commentées, mais inégal. À compléter sur les nouveaux modules.

---

## 🤝 Pour contribuer

Workflow attendu :

1. Choisir une tâche dans cette liste
2. Créer une branche `feat/<nom-tâche-kebab-case>` (ou `fix/<…>` pour un bug)
3. Coder, tester (au moins un test unitaire si tu touches à un store ou service)
4. Commits conventionnels (voir `ONBOARDING.md` pour le format)
5. Pousser, ouvrir une PR vers `develop`
6. Demander une review, merger

Si tu repères un nouveau besoin ou un nouveau bug, ajoute-le directement à ce fichier dans la PR. C'est un document vivant.

---

_Dernière mise à jour : 12/05/2026_
