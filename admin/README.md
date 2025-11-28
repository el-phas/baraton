
# Baraton Admin Panel

A modern React + TypeScript admin dashboard for Baraton Oasis Hotel.

## Features

- Room and conference management (CRUD)
- Booking management (with details and status tabs)
- Secure admin authentication
- Responsive, modern UI (Tailwind CSS)
- Ready for deployment (Vite, TypeScript, production build)

## Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- Backend API (see `.env` for `VITE_BACKEND_URL`)

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd admin_baraton
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env` (if not present).
   - Set `VITE_BACKEND_URL` to your backend API root (e.g. `https://baratonbackend-production.up.railway.app/api`).

4. **Run in development:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:8081` (or as configured in `vite.config.ts`).

5. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```
   The output will be in the `dist/` folder.

6. **Preview production build:**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## Creating an Admin User

- Use your backend API or database to create an admin user.
- The frontend expects an authentication endpoint at `${VITE_BACKEND_URL}/auth`.
- You may need to register or seed an admin user directly in your backend.

## Deployment

- Deploy the `dist/` folder to any static hosting (Vercel, Netlify, Railway, etc.).
- Ensure your backend API is accessible from the deployed frontend (CORS, HTTPS, etc.).
- Set the correct `VITE_BACKEND_URL` in your production environment.


---
