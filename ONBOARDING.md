# 👋 Bienvenue dans le projet Memoria

Tu reprends le développement frontend de **Memoria**, une application "second cerveau" qui permet à ses utilisateurs de capturer, organiser et retrouver leurs pépites de savoir (livres, podcasts, articles, vidéos, notes).

L'équipe précédente a posé des fondations solides — auth complet, layout public/privé, module items — mais plusieurs fonctionnalités n'ont pas pu être finies dans les délais. Ce document te donne les clés pour comprendre rapidement le projet et savoir où mettre les pieds.

> 📋 La liste des tâches à reprendre est dans [`TODO.md`](./TODO.md).

## 🎯 Le produit en 30 secondes

- Une PWA installable (utilisable hors-ligne sur mobile/desktop)
- Un compte utilisateur permet de stocker ses « pépites » (5 types : livre, podcast, article, vidéo, note)
- Les pépites sont taguées, recherchables, partageables _(le partage n'est pas encore implémenté)_
- Une zone admin permet de gérer la plateforme _(à implémenter par la nouvelle équipe)_

## 🛠 Setup en 3 minutes

**Prérequis** : Node.js 20+ et pnpm 10+ (`npm install -g pnpm` si tu ne l'as pas).

```bash
git clone <repo-url>
cd memoria-frontend
pnpm install
cp .env.example .env
pnpm dev
```

L'app tourne sur http://localhost:5173.

### Comptes de démo

Quand `VITE_USE_MOCKS=true` dans le `.env` (cas par défaut), tu peux te connecter avec :

| Email               | Mot de passe | Rôle     |
| :------------------ | :----------- | :------- |
| `demo@memoria.dev`  | `demo1234`   | customer |
| `admin@memoria.dev` | `admin1234`  | admin    |

⚠️ Ces comptes n'existent que côté mock. Quand tu brancheras le vrai backend, il faudra créer des comptes via le formulaire d'inscription.

## 🏗 Stack technique

| Couche     | Choix                       | Pourquoi                                 |
| :--------- | :-------------------------- | :--------------------------------------- |
| Framework  | **Vue 3** (Composition API) | Apprentissage rapide, écosystème solide  |
| Build      | **Vite 6**                  | DX excellent, hot-reload instantané      |
| Langage    | **TypeScript strict**       | Sécurité de type, refactoring sûr        |
| Routing    | **Vue Router 4**            | Standard                                 |
| State      | **Pinia 3**                 | Stores typés, devtools                   |
| Validation | **Zod 4**                   | Schémas runtime + types inférés          |
| Mocks dev  | **MSW**                     | API simulée en attendant le vrai backend |
| Tests      | **Vitest**                  | Rapide, compatible Vite                  |
| PWA        | **vite-plugin-pwa**         | Service worker auto-généré               |
| Lint       | **ESLint + Prettier**       | Hooks Husky pour appliquer auto          |
| Commits    | **Commitlint**              | Conventional commits obligatoires        |

**Tu ne connais pas Vue ?** Pas grave. La [doc officielle](https://vuejs.org/guide/introduction.html) parcourue en 1h te donne les bases. Ensuite, explorer le code de ce projet te fera apprendre en contexte. Tu peux aussi suivre les patterns déjà en place : repérer un fichier qui marche (ex: `ItemsListView.vue`) et t'en inspirer pour ton propre code.

## 📁 Structure du projet

```text
src/
├─ App.vue              # Shell racine (gère header public vs auth + footer)
├─ main.ts              # Bootstrap : Pinia, router, MSW si activé
├─ assets/main.css      # Styles globaux
├─ components/          # Composants UI réutilisables
├─ composables/         # Logique réutilisable (vide pour l'instant)
├─ mocks/               # MSW : handlers + fixtures pour simuler l'API
├─ router/index.ts      # Routes + guards (auth, admin, guest)
├─ schemas/             # Schémas Zod (validation runtime + types TS inférés)
├─ services/            # Couche d'accès API
├─ stores/              # Pinia stores
├─ types/               # Déclarations TS globales
├─ utils/               # Helpers (logger)
└─ views/               # Pages liées à des routes
   ├─ auth/             # Login, Register, ForgotPassword, ResetPassword
   ├─ items/            # ItemsList, ItemForm
   ├─ legal/            # CGU, Privacy, Mentions légales
   ├─ LandingView       # Page d'accueil publique
   ├─ ProfileView       # Profil utilisateur authentifié
   ├─ DashboardView     # ⚠️ Zone admin (placeholder, à implémenter)
   └─ NotFoundView      # 404
```

## 🔄 Architecture en 3 couches

```text
   Views (Vue components)
         │
         │ utilise
         ▼
   Stores (Pinia) — état partagé, actions
         │
         │ appelle
         ▼
   Services (API) — fetch + validation Zod
         │
         │ requête HTTP
         ▼
   Backend (vrai ou MSW selon VITE_USE_MOCKS)
```

**Règle d'or** : une vue n'appelle jamais directement un service. Elle passe par un store. Le store gère le loading/error et appelle le service.

Exemple concret : `LoginView.vue` → `useAuthStore.login()` → `authApi.login()` → `api.post()` → fetch (intercepté par MSW si activé).

## 📝 Conventions de code

Les conventions sont **enforcées automatiquement** par les hooks git (Husky) :

- À chaque **commit** → ESLint + Prettier sur les fichiers staged (`lint-staged`)
- Sur le **message de commit** → conventional commits avec scope obligatoire (`commitlint`)
- Avant chaque **push** → typecheck + tests (pre-push hook)

Si un commit/push est refusé, lis le message d'erreur — il te dit pile ce qui cloche.

### Format de commit (obligatoire)

```text
<type>(<scope>): <subject minuscule sans point final>
```

- **type** : feat, fix, refactor, test, chore, docs, style, perf, build, ci, revert
- **scope** : 2-25 caractères (ex: items, auth, layout)
- **subject** : 10 caractères minimum, minuscule, sans point final

Exemples valides :

```text
feat(items): add tag filtering on list view
fix(auth): handle 401 silently on fetch me
refactor(stores): extract loading state to composable
```

### Branches

```text
<type>/<description-kebab-case>
```

Exemples : `feat/admin-dashboard-users`, `feat/dark-mode`, `fix/login-redirect`.

⚠️ Les branches `main` et `develop` sont **protégées**. Tu ne peux pas y pusher directement, tu dois passer par une PR.

## 🧪 Tests

```bash
pnpm test:run        # une fois
pnpm test            # mode watch
```

Les tests sont dans `tests/unit/`. Quand tu ajoutes une feature, **ajoute aussi un test** au minimum pour la logique critique (store, service). Les vues sont moins couvertes actuellement — bon endroit pour contribuer.

## 📖 Documentation interne

Dans `docs/` tu trouves :

- `architecture.md` — vue d'ensemble du pattern MVVM
- `conventions/01-typescript-style.md` — style TS
- `conventions/02-file-organization.md` — organisation des fichiers
- `conventions/03-git-workflow.md` — workflow git détaillé
- `frontend/01-getting-started.md` — démarrer
- `frontend/02-api-service.md` — couche service
- `frontend/03-validation-zod.md` — schémas Zod
- `frontend/04-testing-tdd.md` — TDD avec Vitest
- `frontend/05-pwa-offline.md` — PWA et hors-ligne

Lis ça **dans cet ordre** avant de toucher au code, ça t'évitera de réinventer ce qui existe déjà.

## 🎯 Par où commencer concrètement ?

1. **Setup + explore** — lance l'app, navigue entre les pages, essaie le login/register, ajoute une pépite. Repère ce qui marche et ce qui semble pas fini.

2. **Code-trace** un parcours complet, par exemple « se connecter » :
   - `LoginView.vue` (vue, formulaire)
   - → `useAuthStore.login()` (store, gère loading et error)
   - → `authApi.login()` (service, fetch + validation Zod)
   - → `api.post()` (helper bas niveau)
   - → MSW handler dans `mocks/handlers/auth.ts` (mock backend)

3. **Lis** au moins `docs/architecture.md` et `docs/frontend/02-api-service.md`.

4. **Choisis une tâche** dans [`TODO.md`](./TODO.md) et lance-toi sur une branche `feat/<ta-tache>`.

Bonne route ! 🚀

---

_Dernière mise à jour : 12/05/2026_
