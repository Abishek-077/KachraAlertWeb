# KachraAlert Web Backend API ♻️🚨

This repository now contains the **backend service only** for KachraAlert Web.  
It is a Node.js + Express + TypeScript API backed by MongoDB, with JWT auth, refresh-token rotation, admin/user workflows, and real-time messaging support through Socket.IO.

---

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 4
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (access + refresh token flow)
- **Validation**: Zod
- **Security**: Helmet, CORS allowlist, HttpOnly cookies, bcrypt password hashing, rate limiting
- **Realtime**: Socket.IO

---

## 🗂️ Project Structure

```text
KachraAlertWeb/
└─ back-end/
   ├─ src/
   │  ├─ app.ts                 # Express app + middleware + route registration
   │  ├─ server.ts              # DB connection + HTTP/Socket server bootstrap
   │  ├─ config/                # env parsing and configuration
   │  ├─ controllers/           # request/response orchestration
   │  ├─ services/              # business logic helpers
   │  ├─ repositories/          # DB interaction abstraction
   │  ├─ dto/                   # Zod schemas for validation
   │  ├─ middleware/            # auth, validation, error handling, upload, rate limits
   │  ├─ models/                # Mongoose models
   │  ├─ routes/                # API route definitions
   │  └─ utils/                 # shared utility functions (jwt, socket, crypto, etc.)
   └─ tests/
      ├─ unit/
      └─ integration/
```

---

## 🚀 Getting Started

### 1) Install dependencies

```bash
cd back-end
npm install
```

### 2) Create environment file

```bash
cp .env.example .env
```

### 3) Required environment variables

These are required by `src/config/env.ts`:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL` (comma-separated origins supported)

Common optional variables:

- `PORT` (default: `4000`)
- `NODE_ENV` (default: `development`)
- `ACCESS_TOKEN_TTL` (default: `15m`)
- `REFRESH_TOKEN_TTL_DAYS` (default: `7`)
- `REFRESH_TOKEN_TTL_DAYS_REMEMBER` (default: `30`)
- `ALLOW_VERCEL_PREVIEW_ORIGINS` (`true|false`)
- `COOKIE_DOMAIN`
- `COOKIE_SECURE` (`true|false`)

### 4) Run in development

```bash
npm run dev
```

API default URL: `http://localhost:4000`

### 5) Build and run production

```bash
npm run build
npm start
```

---

## 🧭 Available Scripts

From `back-end/package.json`:

- `npm run dev` → start dev server with `tsx watch`
- `npm run build` → compile TypeScript to `dist/`
- `npm start` → run compiled server
- `npm test` → run all tests in `tests/**/*.test.ts`
- `npm run test:watch` → watch mode tests

---

## 🔐 Authentication Flow

Base path: `/api/v1/auth`

- `POST /register` — create account
- `POST /login` — authenticate user
- `GET /me` — get current user (requires access token)
- `POST /refresh` — rotate refresh token and issue new access token
- `POST /logout` — invalidate refresh token
- `POST /forgot-password` — request password reset
- `POST /reset-password` — reset password with token
- `GET /oauth/:provider/start` and `/callback` — OAuth placeholders (not configured)

Security details:

- Access tokens are short-lived JWTs.
- Refresh tokens are persisted and rotated.
- Refresh tokens are handled via cookies for browser clients.
- Login/forgot-password endpoints have request-rate limiting.

---

## 📚 API Modules (Route Groups)

All routes are mounted in `src/app.ts` under `/api/v1`:

- `/auth` → authentication and account bootstrap
- `/alerts` → alert listing, broadcast (admin), read/ack actions
- `/reports` → report CRUD-style workflows with attachments
- `/invoices` → invoice creation/listing/payment/fee updates
- `/users` → self profile + admin user listing/detail
- `/schedules` → schedule list + admin schedule management
- `/admin` → admin-only user management endpoints
- `/messages` → contact list + conversation + message CRUD actions
- `/service-ratings` → rating submission + summary

---

## 🛡️ Security and Middleware

Configured in `src/app.ts` and middleware modules:

- `helmet()` for secure HTTP headers
- CORS with dynamic allowlist (`isAllowedCorsOrigin`)
- `express.json({ limit: "12mb" })` payload limit
- `cookie-parser` for cookie handling
- `morgan` request logging
- centralized error middleware (`errorHandler`)
- auth middleware (`requireAuth`, `requireAdmin`)
- Zod request validation (`validateBody`)

---

## 🔄 Real-Time Messaging

Socket.IO is initialized in `src/server.ts` through `initSocket(httpServer)`.  
This enables real-time communication features alongside REST endpoints.

---

## 🧪 Testing

Run:

```bash
cd back-end
npm test
```

Test folders:

- `tests/unit` for utility/schema/middleware-level behavior
- `tests/integration` for route-level behavior

---

## ✅ Health Checks

- `GET /` returns service metadata
- `GET /api/v1/health` returns basic health status

Example:

```bash
curl -i http://localhost:4000/api/v1/health
```

---

## 📌 Notes for Deployment

- Use a production MongoDB instance and secure secrets management.
- Set `COOKIE_SECURE=true` in HTTPS environments.
- Configure `FRONTEND_URL` with the exact deployed client origins.
- If deployed behind a proxy/load-balancer, production mode enables `trust proxy`.
