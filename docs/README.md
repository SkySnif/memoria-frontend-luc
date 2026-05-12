# 📚 Memoria Frontend — Documentation

> Welcome to the Memoria Frontend documentation. This is your map.

This documentation mirrors the structure of the backend's `docs/` folder for consistency. It is organized into three areas: **architecture**, **frontend guides**, and **conventions**.

---

## 🏛 Architecture

The high-level picture of how the app is structured and how data flows.

| Document                               | Topic                                                               |
| :------------------------------------- | :------------------------------------------------------------------ |
| [`architecture.md`](./architecture.md) | MVVM pattern applied to Vue 3, layers, data flow, design decisions. |

---

## 🎨 Frontend guides

Practical, hands-on guides for working in the codebase.

| Document                                                    | Topic                                |
| :---------------------------------------------------------- | :----------------------------------- |
| [`01-getting-started.md`](./frontend/01-getting-started.md) | Install, run, scripts, dev workflow. |
| [`02-api-service.md`](./frontend/02-api-service.md)         | The HTTP client, usage, extension.   |
| [`03-validation-zod.md`](./frontend/03-validation-zod.md)   | Zod schemas as the source of truth.  |
| [`04-testing-tdd.md`](./frontend/04-testing-tdd.md)         | TDD workflow, mocking, conventions.  |
| [`05-pwa-offline.md`](./frontend/05-pwa-offline.md)         | Service worker, offline strategy.    |

---

## 📐 Conventions

The "how we write code here" reference. Read this before contributing.

| Document                                                           | Topic                                      |
| :----------------------------------------------------------------- | :----------------------------------------- |
| [`01-typescript-style.md`](./conventions/01-typescript-style.md)   | TSDoc, visibility, naming, file structure. |
| [`02-file-organization.md`](./conventions/02-file-organization.md) | Where things go and why.                   |
| [`03-git-workflow.md`](./conventions/03-git-workflow.md)           | Branches, commit messages, husky hooks.    |

---

## 🧭 Reading order

If you're new to the project, read in this order:

1. **[`architecture.md`](./architecture.md)** — understand the big picture.
2. **[`conventions/03-git-workflow.md`](./conventions/03-git-workflow.md)** — internalize the workflow before your first commit.
3. **[`frontend/01-getting-started.md`](./frontend/01-getting-started.md)** — get the app running.
4. **[`conventions/01-typescript-style.md`](./conventions/01-typescript-style.md)** — internalize the code style.
5. **[`frontend/02-api-service.md`](./frontend/02-api-service.md)** + **[`frontend/03-validation-zod.md`](./frontend/03-validation-zod.md)** — understand the Model layer.
6. **[`frontend/04-testing-tdd.md`](./frontend/04-testing-tdd.md)** — write your first feature, TDD-style.

---

[⬆ Back to project root](../README.md)

---

_Dernière mise à jour : 12/05/2026_
