# KachraAlert API

Public backend repository for KachraAlert.

## Live services

- Frontend: deployed separately from a private repository
- Backend API: https://kachraalertserver.onrender.com

## Repository structure

```text
KachraAlertWeb/
└─ back-end/   # Express API
```

## Local development

```bash
cd back-end
npm install
.env
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Required backend environment variables

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `COOKIE_SECURE`

Optional:

- `ALLOW_VERCEL_PREVIEW_ORIGINS`
- `COOKIE_DOMAIN`

## Auth routes

Base path: `/api/v1/auth`

- `POST /register`
- `POST /login`
- `GET /me`
- `POST /refresh`
- `POST /logout`
- `POST /forgot-password`
- `POST /reset-password`

## Production notes

- Use HTTPS-only cookies
- Keep secrets outside the repository
- Point `FRONTEND_URL` at the deployed frontend domain
