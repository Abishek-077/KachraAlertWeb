# KachraAlert Web ♻️🚨

KachraAlert Web is a smart waste-management platform with a Next.js frontend and a Node/Express + MongoDB backend. This repo now includes both applications with a secure JWT auth flow, refresh token rotation, and a fully wired UI.

---

## ✨ Overview
- **Frontend**: Next.js App Router, Tailwind CSS, React Hook Form + Zod.
- **Backend**: Node/Express, MongoDB/Mongoose, JWT access + refresh tokens, token rotation, rate limiting, and security middleware.

---

## 🗂️ Repository Structure
```
KachraAlertWeb/
├─ front-end/                 # Next.js app
└─ back-end/                  # Express API
```

---

## ✅ Getting Started

### 1) Backend (API)

**Install dependencies**
```
cd back-end
npm install
```

**Create env file**
```
cp .env.example .env
```

**Run the API**
```
npm run dev
```

The API runs on **http://localhost:4000** by default.

### 2) Frontend (Next.js)

**Install dependencies**
```
cd front-end
npm install
```

**Create env file**
```
cp .env.example .env.local
```

**Run the app**
```
npm run dev
```

The UI runs on **http://localhost:3000** by default.

---

## 🔐 Auth API Reference (Base: `/api/v1/auth`)

### `POST /register`
Registers a user and returns access token + user. Sets refresh token cookie.

### `POST /login`
Logs in and returns access token + user. Sets refresh token cookie. Supports `remember` for longer refresh TTL.

### `GET /me`
Requires access token header. Returns current user.

### `POST /refresh`
Rotates refresh token. Returns new access token + user.

### `POST /logout`
Revokes refresh token and clears cookie.

### `POST /forgot-password`
Returns success message. In dev, includes `devResetToken` in response.

### `POST /reset-password`
Resets password using reset token.

### `GET /oauth/:provider/start` and `GET /oauth/:provider/callback`
Returns 501 (OAuth not configured).

---

## 🌐 Example cURL Requests

**Register**
```bash
curl -i -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"accountType":"resident","name":"Test User","email":"user@example.com","phone":"9800000000","password":"StrongPass1!","society":"Green Valley","building":"Block A","apartment":"A-12","terms":true}'
```

**Login (remember me)**
```bash
curl -i -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongPass1!","remember":true}'
```

**Me (requires access token)**
```bash
curl -i http://localhost:4000/api/v1/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Refresh**
```bash
curl -i -X POST http://localhost:4000/api/v1/auth/refresh \
  --cookie "refreshToken=<REFRESH_TOKEN>"
```

**Logout**
```bash
curl -i -X POST http://localhost:4000/api/v1/auth/logout \
  --cookie "refreshToken=<REFRESH_TOKEN>"
```

**Forgot password**
```bash
curl -i -X POST http://localhost:4000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Reset password**
```bash
curl -i -X POST http://localhost:4000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"<RESET_TOKEN>","password":"NewStrongPass1!"}'
```

---

## ✅ Test Checklist
- Register as **resident**
- Register as **admin_driver**
- Login (normal)
- Login with **remember me** and verify refresh cookie lifetime
- Refresh token flow after page reload
- Logout invalidates session
- Forgot/reset password flow in dev mode (copy `devResetToken` into reset page)

---

## 🛡️ Security Highlights
- JWT access tokens with short TTL
- HttpOnly refresh cookie with rotation + reuse detection
- Rate limiting on login + forgot-password
- Password hashing (bcrypt)
- Centralized error handling + Zod validation
- CORS with credentials + Helmet

---

## 🔧 Environment Notes
- The frontend expects `NEXT_PUBLIC_API_URL` to point to the backend.
- Backend requires `MONGODB_URI`, JWT secrets, and `FRONTEND_URL`.

---

## 📌 Reminder
This repo is configured for local development. Production deployments should:
- Set `COOKIE_SECURE=true`
- Use HTTPS-only cookies
- Move secrets to a secure secret manager
- Configure a real email provider for reset links
