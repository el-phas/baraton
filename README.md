# Baraton Hotel (baraton)

This repository contains the Baraton Hotel web application: frontend (client), admin frontend, and a Node.js + Express + Sequelize backend. It includes booking flows for lodging and conferences, Paystack payment integration, and a resilient email delivery pipeline (Redis-backed queue with PDF invoice generation).

This README documents the architecture, features, local development steps, production checks, environment variables (DB / Paystack / SMTP / Redis), how to run the app (client, admin, backend, worker), and how to use the application (admin and client features).

---

**Contents**
- **Stack & Tech**: Node.js, Express, Sequelize, MySQL, React + Vite, Paystack, Bull (Redis queue), Nodemailer, PDFKit
- **Services**: backend (API + webhook), client app (public site), admin app (admin dashboard)
- **Features**: bookings (lodging & conference), payment (Paystack), booking snapshots, role-based admin users, email confirmations with PDF invoices, background worker for reliable email delivery.

---

**Quick Local Dev (summary)**

- Start a local MySQL (or point to an existing DB).
- Configure `backend/.env` with your DB, Paystack test keys, and (optionally) Redis and SMTP credentials.
- Run seeds: `cd backend && npm run seed` to populate sample data and admin users.
- Start services: `cd backend && npm run dev` (backend), `cd client && npm run dev` (client), `cd admin && npm run dev` (admin).

See the detailed instructions below.

---

**Repository layout**

- `/backend` — Express + Sequelize API server, migrations, models, controllers, webhook and worker code.
- `/client` — Public React + Vite frontend.
- `/admin` — Admin React + Vite frontend.
- `/uploads` — file uploads stored in repo for dev (cloudinary is supported in production).

---

**Features (what this app provides)**

- Lodging booking CRUD and conference booking CRUD.
- When a booking is created the controller snapshots the referenced lodging/conference fields (prefixed `room_...` and `conference_...`) so records remain accurate even when the original listing changes.
- Payment initiation via Paystack: server receives `booking_snapshot` and stores it in `Payments.metadata` and initiates a Paystack transaction.
- Secure webhook endpoint that verifies Paystack signature and marks payments and bookings as confirmed on `charge.success`.
- Email confirmation pipeline: webhook enqueues a confirmation email with a generated PDF invoice. A background worker processes the queue and sends emails via SMTP.
- Email queueing supports Redis-backed queue (Bull) for production reliability; a DB-polling fallback exists for environments without Redis.
- Role-based admin users: seeded `admin-a` (full admin) and `admin-b` (viewer/read-only).

---

Environment / Configuration
---------------------------

Put environment variables in `backend/.env` for local development. Key variables:

- Database
	- `DB_HOST` (e.g. `127.0.0.1`)
	- `DB_PORT` (default `3306`)
	- `DB_NAME` (e.g. `baraton_dev`)
	- `DB_USER`
	- `DB_PASSWORD`

- App / Auth
	- `PORT` (backend port, default `5000`)
	- `JWT_SECRET` (strong secret for JWT)

- Paystack (test keys for local)
	- `PAYSTACK_PUBLIC_KEY`
	- `PAYSTACK_SECRET_KEY`

- SMTP (for sending real emails — optional in dev)
	- `SMTP_HOST`
	- `SMTP_PORT`
	- `SMTP_USER`
	- `SMTP_PASS`
	- `SMTP_SECURE` (true/false)
	- `EMAIL_FROM` (default: `no-reply@baraton.local`)

- Redis (optional — enables Bull queue)
	- Use either `REDIS_URL` (e.g. `redis://:password@host:6379`) or set `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`.

- Other
	- `CORS_WHITELIST` — comma-separated list of allowed origins
	- `EMAIL_MAX_ATTEMPTS` — max email retry attempts (default 5)
	- `EMAIL_WORKER_INTERVAL_MS` — poll interval for DB fallback worker

Notes:
- If `REDIS_HOST` or `REDIS_URL` is present, the backend will use a Redis-backed Bull queue for email processing (recommended for production). If not present, the worker falls back to DB polling (works for small scale/dev).
- If SMTP credentials are not provided, the worker will log email contents instead of sending (useful for dev).

---

Local Development (detailed)
----------------------------

1. Create and configure a local MySQL database (example using Docker):

```bash
docker run --name baraton-mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=baraton_dev -e MYSQL_USER=baraton -e MYSQL_PASSWORD=baratonpwd -p 3306:3306 -d mysql:8
```

2. Copy `backend/.env.example` to `backend/.env` (or create `backend/.env`) and fill values. Example minimal `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=baraton_dev
DB_USER=baraton
DB_PASSWORD=baratonpwd
PORT=5000
JWT_SECRET=your_jwt_secret_here
PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
# Optional: Redis
# REDIS_URL=redis://:password@host:6379
# Optional: SMTP
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=user
# SMTP_PASS=pass
# SMTP_SECURE=false
# EMAIL_FROM=no-reply@baraton.local
```

3. Install dependencies and run the seed script (creates sample data and admin users):

```bash
cd backend
npm install
npm run seed
```

Default seeded admin users:
- `admin-a` — full admin (password: `admin123`) — can edit
- `admin-b` — viewer (password: `viewer123`) — read-only

4. Start backend and frontends in separate terminals:

```bash
# backend
cd backend
npm run dev

# client (public site)
cd client
npm run dev

# admin frontend
cd admin
npm run dev
```

5. Test email sending (after providing SMTP/Redis credentials) using the test endpoint:

```bash
curl -X POST http://localhost:5000/api/test-email \
	-H 'Content-Type: application/json' \
	-d '{"to":"you@example.com","subject":"Test email","text":"Hello from Baraton"}'
```

Or perform a booking through the client and complete the Paystack flow (or simulate the webhook) to trigger the confirmation email + PDF invoice.

---

Production Readiness Analysis
-----------------------------

The app contains core pieces needed for production, but there are tasks and checks you should complete before going live.

What is present / good:
- Auth with JWT and seeded roles (admin/viewer).
- Paystack integration with webhook signature verification.
- Email delivery pipeline is robust: Redis-backed queue (Bull) with retries/backoff; DB auditing remains available.
- Booking snapshots to prevent stale data when listings change.
- Sequelize migrations added for schema changes (run them in production).

Recommended production tasks (before go-live):
- Use a secure secrets system (not .env in plain text). Ensure `JWT_SECRET`, DB credentials, SMTP and Redis creds are kept secret.
- Configure and secure Redis (auth & network), and set `REDIS_URL` in `backend/.env`.
- Provide SMTP credentials and test end-to-end email delivery.
- Run Sequelize migrations (`npx sequelize db:migrate`) instead of relying on `sequelize.sync()` in production.
- Use HTTPS and configure a reverse proxy (nginx) or platform-managed TLS.
- Add proper logging & monitoring (structured logs, Sentry or similar for exceptions).
- Harden CORS, ensure allowed origins are set in `CORS_WHITELIST`.
- Configure rate limiting and request size limits for public endpoints.
- Consider replacing SQLite/DB polling with a production queue (Redis/Bull is implemented here) and consider a managed queue worker (Kubernetes Cron or systemd service).
- Run security scans (`npm audit`, dependency updates) and fix high/critical vulnerabilities.

---

How to use the app (user-facing features)
----------------------------------------

Client (public):
- Browse lodgings and conference rooms.
- Create lodging or conference bookings (checkout with Paystack).
- After successful payment, you'll receive a booking confirmation email and PDF invoice (if SMTP configured).

Admin dashboard:
- Login with seeded admin credentials or create an admin user.
- `admin-a` can create/edit/delete lodgings, conferences and view bookings.
- `admin-b` is a viewer and can only view bookings and analytics.

---

Developer notes & common tasks
------------------------------
- Run migrations: `npx sequelize db:migrate --env production` (configure `config/config.js` appropriately).
- Start worker in production: the backend process calls `startEmailWorker()` after DB sync; in production run this process as a service (systemd, PM2, or in a container) so the worker is active. If you prefer a dedicated worker process, require `startEmailWorker()` in a separate worker runner.
- If you use Redis, set `REDIS_URL` and the app will use Bull queue automatically.

---

If you want, I can:
- Add a small `docker-compose.yml` that brings up MySQL, Redis, and the backend for local development.
- Add a dedicated worker entrypoint (separate process) and PM2 config for production.
- Improve the email HTML templates and invoice layout before you provide SMTP credentials.

---

Thanks — if you'd like I can now:
- configure the worker to run as a separate process, or
- add a `docker-compose.yml` to run MySQL + Redis + backend + frontends locally, or
- update `backend/.env.example` with the full set of variables for convenience.
