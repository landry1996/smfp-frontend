# SMFP Frontend

**Système de Management Financier et Paiements** — Interface web Angular 21 pour la gestion bancaire multi-services.

---

## Table des matières

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Démarrage rapide](#démarrage-rapide)
- [Configuration des environnements](#configuration-des-environnements)
- [Structure des dossiers](#structure-des-dossiers)
- [Fonctionnalités par module](#fonctionnalités-par-module)
- [Système de routing et guards](#système-de-routing-et-guards)
- [Authentification et sécurité](#authentification-et-sécurité)
- [Services HTTP et intercepteurs](#services-http-et-intercepteurs)
- [Pipes partagés](#pipes-partagés)
- [Modèles de données](#modèles-de-données)
- [Communication temps réel](#communication-temps-réel)
- [Intégration backend](#intégration-backend)
- [Conventions de code](#conventions-de-code)
- [Scripts disponibles](#scripts-disponibles)

---

## Aperçu

SMFP Frontend est une SPA (Single Page Application) Angular 21 conçue pour gérer l'ensemble des opérations d'une plateforme bancaire numérique : comptes, paiements, prêts, détection de fraude, audit, orchestration de jobs, assistance IA et bien plus.

L'application est pensée pour trois types d'utilisateurs :

| Rôle    | Accès                                                                      |
|---------|---------------------------------------------------------------------------|
| `CLIENT` | Dashboard, Comptes, Paiements, Prêts, Documents, Notifications, Profil   |
| `AGENT`  | Tout CLIENT + Géolocalisation, Workflow, Rapports                         |
| `ADMIN`  | Tout AGENT + Fraude, Orchestration, Audit, Administration (RBAC)          |

---

## Stack technique

| Technologie          | Version    | Usage                                            |
|----------------------|------------|--------------------------------------------------|
| Angular              | 21.x       | Framework principal, composants standalone       |
| TypeScript           | 5.9        | Typage statique                                  |
| Bootstrap            | 5.3        | Design system — grille, composants, utilitaires  |
| Bootstrap Icons      | 1.11       | Icones SVG (`bi bi-*`)                           |
| RxJS                 | 7.8        | Gestion des flux asynchrones                     |
| Angular Signals      | 21.x       | Gestion d'etat reactive (`signal`, `computed`)   |
| ngx-toastr           | 20.x       | Notifications toast                              |
| Leaflet              | 1.9        | Cartographie geolocalisation                     |
| STOMP / SockJS       | 7.x / 1.6  | WebSocket chatbot temps reel                     |
| Prettier             | —          | Formatage du code                                |

---

## Architecture du projet

L'application suit une architecture **Feature-Driven** avec séparation stricte des responsabilités :

```
src/app/
├── core/               # Singleton : guards, intercepteurs, services globaux, modèles
├── layout/             # Shell de l'application (sidebar + topbar)
├── shared/             # Composants et pipes réutilisables
└── features/           # Modules fonctionnels (lazy-loaded)
    ├── auth/
    ├── dashboard/
    ├── accounts/
    ├── payments/
    ├── loans/
    ├── notifications/
    ├── documents/
    ├── profile/
    ├── geolocation/
    ├── workflow/
    ├── reports/
    ├── fraud/
    ├── orchestration/
    ├── audit/
    ├── admin/
    └── chatbot/
```

### Principes architecturaux appliqués

- **Standalone Components** — Aucun `NgModule`. Chaque composant, pipe et directive est autonome.
- **Lazy Loading** — Chaque feature est chargée à la demande via `loadComponent()` / `loadChildren()`.
- **Signals** — État réactif via `signal<T>()` et `computed()` (Angular 21).
- **Séparation template/logique** — Tous les composants utilisent `templateUrl` (`.html` dédié).
- **Service layer** — `HttpClient` est injecté uniquement dans les services, jamais dans les composants.
- **Source unique de vérité** — Les types partagés sont définis dans `core/models/`, réexportés par les services features.

---

## Démarrage rapide

### Prérequis

- Node.js ≥ 22
- npm ≥ 11
- Angular CLI ≥ 21 (`npm install -g @angular/cli`)
- Backend SMFP démarré sur `http://localhost:8080` (API Gateway)

### Installation

```bash
cd smfp-frontend
npm install
```

### Lancement en développement

```bash
npm start
# ou
ng serve
```

L'application est accessible sur `http://localhost:4200`.

Le proxy Angular redirige automatiquement `/api/**` vers `http://localhost:8080/api` et `/ws/**` vers le service WebSocket.

### Build de production

```bash
ng build
# Artefacts dans dist/smfp-frontend/
```

---

## Configuration des environnements

| Clé              | Développement    | Production |
|-----------------|-----------------|------------|
| `production`     | `false`          | `true`     |
| `apiUrl`         | `/api`           | `/api`     |
| `wsUrl`          | `/ws/chat`       | `/ws/chat` |
| `appName`        | `SMFP`           | `SMFP`     |
| `refreshTokenKey`| `smfp_refresh_token` | `smfp_refresh_token` |

> Le proxy Angular CLI (`proxy.conf.json`) est utilisé en développement pour éviter les problèmes CORS.
> En production, le reverse proxy (nginx / API Gateway) prend en charge le routage `/api`.

---

## Structure des dossiers

```
smfp-frontend/
├── src/
│   ├── app/
│   │   ├── app.ts                    # Composant racine
│   │   ├── app.routes.ts             # Routes principales
│   │   ├── app.config.ts             # Configuration applicative
│   │   │
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts     # Redirige vers /auth/login si non authentifié
│   │   │   │   └── role.guard.ts     # Redirige vers /forbidden si rôle insuffisant
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts    # Injection du Bearer token + refresh automatique
│   │   │   │   └── error.interceptor.ts  # Toast d'erreur selon code HTTP
│   │   │   ├── models/
│   │   │   │   ├── account.models.ts
│   │   │   │   ├── auth.models.ts
│   │   │   │   ├── chatbot.models.ts
│   │   │   │   ├── fraud.models.ts
│   │   │   │   ├── loan.models.ts
│   │   │   │   ├── notification.models.ts
│   │   │   │   ├── orchestration.models.ts
│   │   │   │   └── payment.models.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts   # Login, logout, 2FA, refresh token, session
│   │   │       └── token.service.ts  # Gestion JWT (mémoire + localStorage)
│   │   │
│   │   ├── layout/
│   │   │   └── shell/
│   │   │       ├── shell.component.ts   # Sidebar + topbar + navigation filtrée par rôle
│   │   │       └── shell.component.html
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── forbidden/        # Page 403
│   │   │   │   └── not-found/        # Page 404
│   │   │   └── pipes/
│   │   │       ├── currency-format.pipe.ts   # Formatage monétaire XAF/EUR/USD
│   │   │       └── status-badge.pipe.ts      # Classes Tailwind selon statut
│   │   │
│   │   └── features/
│   │       ├── auth/
│   │       │   ├── login/            # Formulaire de connexion
│   │       │   ├── register/         # Inscription utilisateur
│   │       │   └── two-factor/       # Vérification code 2FA
│   │       ├── dashboard/            # Vue d'ensemble personnalisée par rôle
│   │       ├── accounts/
│   │       │   ├── accounts-list/    # Liste des comptes de l'utilisateur
│   │       │   └── account-detail/   # Détail d'un compte
│   │       ├── payments/
│   │       │   ├── payments-list/    # Historique des paiements
│   │       │   ├── transfer/         # Formulaire de virement
│   │       │   └── mobile-money/     # Paiement Mobile Money
│   │       ├── loans/
│   │       │   ├── loans-list/       # Mes prêts
│   │       │   ├── loan-apply/       # Demande de prêt
│   │       │   ├── loan-simulator/   # Simulateur de remboursement
│   │       │   └── loan-detail/      # Détail et plan d'amortissement
│   │       ├── notifications/        # Centre de notifications
│   │       ├── documents/            # Gestion documentaire
│   │       ├── profile/              # Profil utilisateur + sécurité
│   │       ├── geolocation/          # Suivi géographique des agents
│   │       ├── workflow/
│   │       │   ├── tasks/            # Tâches workflow
│   │       │   └── approvals/        # Circuit de validation
│   │       ├── reports/
│   │       │   ├── reports-list/     # Liste des rapports
│   │       │   └── analytics/        # Tableaux de bord analytiques
│   │       ├── fraud/
│   │       │   ├── fraud-dashboard/  # Vue d'ensemble fraude
│   │       │   ├── fraud-alerts/     # Alertes actives (NEW/ACKNOWLEDGED)
│   │       │   ├── fraud-rules/      # Règles de détection
│   │       │   └── fraud-patterns/   # Patterns détectés
│   │       ├── orchestration/
│   │       │   ├── jobs/             # Exécutions de jobs planifiés
│   │       │   └── dags/             # Graphes de tâches (DAGs)
│   │       ├── audit/                # Journal d'audit avec recherche
│   │       ├── admin/
│   │       │   ├── users/            # Gestion des utilisateurs
│   │       │   └── rbac/             # Rôles et permissions
│   │       ├── chatbot/              # Widget chatbot temps réel (WebSocket + IA)
    └── ai-assistant/         # Assistant IA — chat, résumé, explication fraude
│   │
│   ├── environments/
│   │   ├── environment.ts            # Développement
│   │   └── environment.prod.ts       # Production
│   └── styles.css                    # Styles globaux Tailwind
│
├── package.json
└── README.md
```

---

## Fonctionnalités par module

### Authentification (`/auth`)

| Route              | Composant              | Description                          |
|-------------------|------------------------|--------------------------------------|
| `/auth/login`      | `LoginComponent`       | Connexion email/mot de passe         |
| `/auth/register`   | `RegisterComponent`    | Inscription nouvel utilisateur       |
| `/auth/2fa`        | `TwoFactorComponent`   | Saisie du code OTP 6 chiffres        |

Flux d'authentification :
1. `POST /api/auth/login` → si `requiresTwoFactor: true`, redirection vers `/auth/2fa`
2. `POST /api/auth/verify-2fa` → obtention des tokens JWT
3. `GET /api/auth/me` → chargement du profil utilisateur dans `AuthService`

### Dashboard (`/dashboard`)

Vue d'ensemble personnalisée selon le rôle :
- **CLIENT/AGENT** : solde total, comptes actifs, notifications non lues, actions rapides
- **ADMIN** : + alertes fraude actives, transactions analysées, taux de fraude

### Comptes (`/accounts`)

- Liste des comptes filtrés par `userId` (`GET /api/accounts/user/{userId}`)
- Détail d'un compte avec historique de solde
- Types supportés : `SAVINGS`, `CHECKING`, `LOAN`, `INVESTMENT`

### Paiements (`/payments`)

| Sous-route         | Description                                      | Endpoint backend            |
|-------------------|--------------------------------------------------|-----------------------------|
| `/payments`        | Historique des transactions                      | `GET /payments/user/{id}`   |
| `/payments/transfer` | Virement bancaire (`fromAccountId`/`toAccountId`) | `POST /payments/transfer`   |
| `/payments/mobile-money` | Paiement Orange/MTN/Express Union          | `POST /payments/mobile-money` |

### Prêts (`/loans`)

| Sous-route           | Description                             | Endpoint backend         |
|---------------------|-----------------------------------------|--------------------------|
| `/loans`             | Liste des prêts de l'utilisateur        | `GET /loans/user/{id}`   |
| `/loans/apply`       | Demande de prêt (purpose + employment)  | `POST /loans`            |
| `/loans/simulator`   | Simulation d'amortissement              | `POST /loans/simulate`   |
| `/loans/:id`         | Détail d'un prêt                        | `GET /loans/{id}`        |

Champs du formulaire de demande : `purpose` (PERSONAL/HOME/BUSINESS/AUTO/EDUCATION), `employment` (EMPLOYED/SELF_EMPLOYED/UNEMPLOYED), `loanAmount`, `durationMonths`.

### Assistant IA (`/ai-assistant`) — ADMIN uniquement

Interface d'accès direct à l'`ai-orchestration-service` :

| Sous-route              | Description                                                          |
|------------------------|----------------------------------------------------------------------|
| `/ai-assistant`         | Chat libre avec Mistral 7B (questions bancaires, conseil financier)  |
| `/ai-assistant/summarize` | Résumé automatique d'un texte ou document                          |
| `/ai-assistant/fraud`   | Explication en langage naturel d'une alerte fraude                   |

Endpoints backend utilisés via `AiService` :

```
POST /api/ai/chat          → AiChatRequest  → AiChatResponse
POST /api/ai/summarize     → AiSummarizeRequest → AiChatResponse
POST /api/ai/fraud/explain → FraudExplainRequest → AiChatResponse
```

Le champ `fallback: true` dans la réponse indique qu'Ollama etait indisponible — un message de dégradation gracieuse est affiché à l'utilisateur.

### Fraude (`/fraud`) — ADMIN uniquement

| Sous-route              | Description                                     |
|------------------------|-------------------------------------------------|
| `/fraud`                | Tableau de bord : KPIs, taux, alertes récentes  |
| `/fraud/alerts`         | Alertes actives — résolution via `PUT .../status` |
| `/fraud/rules`          | Activation/désactivation des règles (`POST .../enable`, `.../disable`) |
| `/fraud/patterns`       | Patterns de fraude détectés par ML              |

Statuts d'alerte backend : `NEW` → `ACKNOWLEDGED` → `RESOLVED` → `CLOSED`.

### Orchestration (`/orchestration`) — ADMIN uniquement

- **Jobs** : suivi des exécutions planifiées (`GET /job-executions`)
- **DAGs** : graphes de tâches avec planification cron (`GET /dags`)

### Audit (`/audit`) — ADMIN uniquement

Journal d'audit complet avec recherche full-text et filtre par type d'action.
Endpoint : `POST /api/audit/search` (pas de `GET /audit`).

### Administration (`/admin`) — ADMIN uniquement

- **Utilisateurs** : liste, activation (`POST /users/{id}/activate`), suspension (`POST /users/{id}/suspend`)
- **RBAC** : consultation des rôles et permissions

---

## Système de routing et guards

```
/                       → redirect /dashboard
/auth/**                → public (LOGIN, REGISTER, 2FA)
/dashboard              → authGuard
/accounts/**            → authGuard
/payments/**            → authGuard
/loans/**               → authGuard
/documents              → authGuard
/notifications          → authGuard
/profile                → authGuard
/geolocation            → authGuard + roleGuard [AGENT, ADMIN]
/workflow/**            → authGuard + roleGuard [AGENT, ADMIN]
/reports/**             → authGuard + roleGuard [AGENT, ADMIN]
/fraud/**               → authGuard + roleGuard [ADMIN]
/orchestration/**       → authGuard + roleGuard [ADMIN]
/audit                  → authGuard + roleGuard [ADMIN]
/admin/**               → authGuard + roleGuard [ADMIN]
/forbidden              → public (page 403)
/**                     → public (page 404)
```

Tous les composants enfants du shell sont chargés en **lazy loading** via `loadComponent()` ou `loadChildren()`.

---

## Authentification et sécurité

### Stockage des tokens

| Token          | Stockage           | Raison                                      |
|---------------|--------------------|---------------------------------------------|
| Access Token   | Mémoire (variable) | Protège contre XSS (non accessible depuis JS externe) |
| Refresh Token  | `localStorage`     | Persiste entre les onglets/sessions         |

### `TokenService`

- `getAccessToken()` / `setAccessToken()` — mémoire volatile
- `getRefreshToken()` / `setRefreshToken()` — `localStorage`
- `isAccessTokenExpired()` — décodage du payload JWT (base64)
- `clear()` — nettoyage complet à la déconnexion

### `AuthService`

Signals exposés :

```typescript
currentUser:      Signal<CurrentUser | null>   // utilisateur connecté
isAuthenticated:  Signal<boolean>
isAdmin:          Signal<boolean>              // role === 'ADMIN'
isAgent:          Signal<boolean>              // role === 'AGENT' || isAdmin
loading:          Signal<boolean>
```

Méthodes principales :
- `register(req)` — `POST /api/users/register`
- `login(req)` — `POST /api/auth/login` (gère le flag `requiresTwoFactor`)
- `verifyTwoFactor(code)` — `POST /api/auth/verify-2fa`
- `refreshToken()` — `POST /api/auth/refresh`
- `loadCurrentUser()` — `GET /api/auth/me`
- `logout()` / `logoutAll()`

---

## Services HTTP et intercepteurs

### Intercepteur JWT (`jwt.interceptor.ts`)

- Injecte automatiquement le header `Authorization: Bearer <token>` sur toutes les requêtes non publiques
- URLs publiques exemptées : `/api/auth/login`, `/api/auth/verify-2fa`, `/api/users/register`
- En cas de `401` : tente un refresh automatique du token, puis relance la requête originale
- En cas d'échec du refresh : appelle `logout()` et redirige vers `/auth/login`
- En cas de `403` : redirige vers `/forbidden`

### Intercepteur d'erreurs (`error.interceptor.ts`)

Affiche un toast `ngx-toastr` selon le code HTTP :

| Code   | Message affiché                                      |
|--------|------------------------------------------------------|
| `0`    | Impossible de contacter le serveur (réseau)          |
| `400`  | Requête invalide (validation)                        |
| `404`  | Ressource introuvable                                |
| `408` / `503` | Service indisponible (circuit breaker)        |
| `500`  | Erreur interne du serveur                            |
| `401` / `403` | Gérés par `jwt.interceptor.ts` (pas de toast) |

### Services feature

Chaque module possède son service dédié. Aucun composant n'injecte `HttpClient` directement.

| Service                  | Feature      | Endpoints principaux                                       |
|--------------------------|-------------|-------------------------------------------------------------|
| `AccountService`         | accounts    | `GET /accounts/user/{id}`, `GET /accounts/{id}`             |
| `PaymentService`         | payments    | `GET /payments/user/{id}`, `POST /payments/transfer`, `POST /payments/mobile-money` |
| `LoanService`            | loans       | `GET /loans/user/{id}`, `POST /loans`, `POST /loans/simulate` |
| `FraudService`           | fraud       | `GET /fraud/dashboard/overview`, `/fraud/alerts`, `/fraud/rules`, `/fraud/patterns` |
| `NotificationService`    | notifications | `GET /notifications/user/{id}`, `POST /notifications/user/{id}/read-all` |
| `DocumentService`        | documents   | `GET /documents`, `/documents/loans/{id}`                  |
| `AuditService`           | audit       | `POST /audit/search`, `POST /audit/export`                 |
| `WorkflowService`        | workflow    | `/workflow/tasks`, `/workflow/approvals`                   |
| `AdminService`           | admin       | `/users`, `POST /users/{id}/activate`, `POST /users/{id}/suspend` |
| `ReportService`          | reports     | `GET /reports`, `GET /analytics`                           |
| `OrchestrationService`   | orchestration | `GET /job-executions`, `GET /dags`                       |
| `GeolocationService`     | geolocation    | `GET /locations`, `GET /locations/stats`                       |
| `ProfileService`         | profile        | `GET /auth/me`, `GET /users/{id}`                              |
| `AiService`              | ai-assistant   | `POST /ai/chat`, `POST /ai/summarize`, `POST /ai/fraud/explain` |

---

## Pipes partagés

### `CurrencyFormatPipe` — `| currencyFormat`

Formate un montant selon la locale camerounaise (fr-CM) :

```html
{{ account.balance | currencyFormat }}          <!-- XAF 1 250 000 -->
{{ payment.amount | currencyFormat:'EUR' }}      <!-- 1 250 € -->
```

### `StatusBadgePipe` — `| statusBadge`

Retourne les classes Tailwind CSS correspondant à un statut. Utilisé pour les badges colorés :

```html
<span [class]="loan.status | statusBadge">{{ loan.status }}</span>
```

Statuts supportés :

| Catégorie    | Valeurs                                               | Couleur       |
|-------------|-------------------------------------------------------|---------------|
| Générique   | `ACTIVE`, `VERIFIED`, `RESOLVED`, `COMPLETED`         | Vert          |
| Attention   | `PENDING`, `APPLIED`, `MEDIUM`, `ACKNOWLEDGED`, `RETRYING` | Jaune    |
| Information | `APPROVED`, `DISBURSED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RUNNING` | Bleu |
| Repayment   | `REPAYING`                                            | Indigo        |
| Alerte      | `SUSPENDED`, `HIGH`                                   | Orange        |
| Danger      | `BLOCKED`, `REJECTED`, `FAILED`, `CRITICAL`, `NEW`, `DEFAULTED` | Rouge |
| Neutre      | `INACTIVE`, `CLOSED`, `CANCELLED`, `ARCHIVED`         | Gris          |

---

## Modèles de données

Tous les types TypeScript sont définis dans `src/app/core/models/` et constituent la source unique de vérité.

### `account.models.ts`
```typescript
AccountType    = 'SAVINGS' | 'CHECKING' | 'LOAN' | 'INVESTMENT'
AccountStatus  = 'ACTIVE' | 'BLOCKED' | 'CLOSED' | 'PENDING'
Account        { id, accountNumber, type, balance, currency, status, userId, createdAt }
Transaction    { id, accountId, amount, type: 'CREDIT'|'DEBIT', description, createdAt }
BalanceHistory { id, accountId, recordDate, openingBalance, closingBalance, ... }
```

### `auth.models.ts`
```typescript
Role           = 'CLIENT' | 'AGENT' | 'ADMIN'
CurrentUser    { userId, email, firstName, lastName, role }
LoginRequest   { email, password }
LoginResponse  { accessToken, refreshToken, requiresTwoFactor, twoFactorToken?, ... }
```

### `loan.models.ts`
```typescript
LoanPurpose    = 'PERSONAL' | 'HOME' | 'BUSINESS' | 'AUTO' | 'EDUCATION'
LoanEmployment = 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED'
LoanStatus     = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED' | 'DEFAULTED'
LoanRequest    { userId, loanAmount, durationMonths, purpose, employment }
LoanResponse   { id, userId, loanAmount, interestRate (%), status, durationMonths, ... }
SimulateRequest { principal, annualInterestRate, durationMonths, amortizationType? }
```

> **Important** : `interestRate` est déjà en pourcentage (ex: `8.5` = 8,5%). Ne pas multiplier par 100.

### `payment.models.ts`
```typescript
TransferRequest     { fromAccountId, toAccountId, amount, description? }
MobileMoneyRequest  { fromAccountId, phoneNumber, operator: 'ORANGE'|'MTN'|'EXPRESS_UNION', amount }
Payment             { id, amount, currency, status, direction: 'CREDIT'|'DEBIT', createdAt }
```

### `fraud.models.ts`
```typescript
FraudRiskLevel    = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
FraudAlertStatus  = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CLOSED'
FraudAlert        { id, transactionId?, riskLevel, status, createdAt }
FraudDashboardOverview { totalChecks, openAlerts, criticalAlerts, fraudRate (0-1), ... }
```

### `orchestration.models.ts`
```typescript
JobStatus  = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING'
JobExecution { id, jobName?, status, startedAt?, finishedAt?, durationMs? }
Dag          { name?, paused, schedule?, lastRun?, nextRun? }
```

### `ai.models.ts`
```typescript
AiChatRequest       { message, sessionId?, userId?, language? }
AiSummarizeRequest  { text, maxWords, language, context? }
FraudExplainRequest { transactionId, amount, riskScore, riskLevel, triggeredRules, location?, userId?, language? }
AiChatResponse      { response, model, durationMs, tokenCount, fallback, timestamp }
```

> `fallback: true` signifie qu'Ollama etait indisponible — afficher un message degrade a l'utilisateur.
> Le modele `"mistral"` est retourne dans `model` lorsque la reponse est reelle.

---

## Communication temps réel

Le **chatbot** (`/features/chatbot`) utilise WebSocket via **STOMP over SockJS** :

- Connexion : `wss://<host>/ws/chat` (proxyfié via `/ws/chat` en dev)
- Publication : `SEND /app/chat/{sessionId}`
- Abonnement : `SUBSCRIBE /topic/chat/{sessionId}`
- Librairies : `@stomp/stompjs` + `sockjs-client`

Le **chatbot-service** backend peut s'appuyer sur l'`ai-orchestration-service` pour la detection d'intention via Mistral 7B (NLP), avec fallback automatique sur la detection par mots-cles si Ollama est indisponible.

---

## Intégration backend

L'application frontend communique avec le **backend SMFP** composé de microservices Spring Boot exposés via une API Gateway sur le port `8080`.

| Microservice               | Port  | Routes frontend concernées                     |
|---------------------------|-------|------------------------------------------------|
| API Gateway               | 8080  | Toutes (point d'entrée unique `/api`)          |
| user-service              | 8081  | `/auth`, `/admin/users`                        |
| account-service           | 8082  | `/accounts`                                    |
| payment-service           | 8083  | `/payments`                                    |
| loan-service              | 8084  | `/loans`                                       |
| fraud-detection-service   | 8087  | `/fraud`                                       |
| notification-service      | 8091  | `/notifications`                               |
| chatbot-service           | 8094  | `/chatbot` (WebSocket + REST)                  |
| ai-orchestration-service  | 8098  | `/ai-assistant` — chat, résumé, explication IA |

> En développement, configurer le proxy Angular pour rediriger `/api/**` vers `http://localhost:8080`.

---

## Conventions de code

### Composants
- Standalone uniquement (`standalone: true`)
- Template dans un fichier `.html` séparé (`templateUrl`)
- État réactif via `signal<T>()` et `computed()`
- Injection via `inject()` (pas de constructeur DI)

```typescript
@Component({ selector: 'app-foo', standalone: true, templateUrl: './foo.component.html' })
export class FooComponent implements OnInit {
  private svc = inject(FooService);
  data = signal<Foo[]>([]);
  ngOnInit() { this.svc.getAll().subscribe({ next: d => this.data.set(d) }); }
}
```

### Services
- `@Injectable({ providedIn: 'root' })` — tous les services sont root-scoped
- Types de retour explicites
- Commentaires JSDoc sur chaque méthode publique

### Naming
- Composants : `PascalCase` + suffixe `Component`
- Services : `PascalCase` + suffixe `Service`
- Fichiers : `kebab-case.component.ts`, `kebab-case.service.ts`
- Interfaces : `PascalCase` sans préfixe `I`
- Types union : `PascalCase` sans préfixe

### Imports dans les templates
Les pipes partagés sont importés directement dans le décorateur `@Component` :
```typescript
imports: [CommonModule, CurrencyFormatPipe, StatusBadgePipe]
```

---

## Scripts disponibles

```bash
# Démarrer le serveur de développement
npm start               # alias ng serve — http://localhost:4200

# Build de production
npm run build           # ng build — dist/smfp-frontend/

# Build en mode watch (développement)
npm run watch           # ng build --watch --configuration development

# Tests unitaires (Vitest)
npm test                # ng test
```

---

## Variables d'environnement clés

| Variable          | Valeur défaut        | Description                                   |
|------------------|----------------------|-----------------------------------------------|
| `apiUrl`          | `/api`               | Base URL de l'API (proxyfié en dev)           |
| `wsUrl`           | `/ws/chat`           | Endpoint WebSocket chatbot                    |
| `aiUrl`           | `/api/ai`            | Base URL de l'AI Orchestration Service        |
| `refreshTokenKey` | `smfp_refresh_token` | Clé localStorage pour le refresh token       |

---

*Généré le 21 mars 2026 — SMFP Frontend v0.0.0 | AI Integration : Ollama/Mistral via ai-orchestration-service*
