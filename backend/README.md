


# Baraton Oasis Backend

This is the Node.js + Express backend for the **Baraton Oasis Booking System**, supporting lodging and conference bookings, image uploads, admin management, and secure payment processing.

---

## 🚀 Features

- Lodging rooms CRUD operations
- Conference rooms CRUD operations
- Paystack payment integration
- Cloudinary image upload and storage
- Admin authentication (JWT-based)

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
````

---

### 2. Environment Configuration

Create a `.env` file in the root of your project and add the following environment variables:

```env
### MySQL Database Configuration
DB_HOST=your-database-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

### Cloudinary Configuration (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

### Paystack API Keys
# ➤ Go to https://dashboard.paystack.com -> Settings -> API Keys & Webhooks
# ➤ Use TEST keys during development and switch to LIVE keys for production

PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key

### Application Settings
PORT=5000
JWT_SECRET=your_jwt_secret_key

### Frontend URL
FRONTEND_URL=https://your-frontend-domain.com
```

> ⚠️ **DO NOT** commit your `.env` file to version control.

---

### 3. Start the Development Server

```bash
npm run dev
```

This will run your backend locally at:
`http://localhost:5000`

---

## 💳 Paystack Integration

### ✅ Setting up your Paystack keys

1. Log in to your Paystack dashboard: [https://dashboard.paystack.com](https://dashboard.paystack.com)
2. Navigate to **Settings → API Keys & Webhooks**
3. Copy your **Secret Key** and **Public Key** into your `.env` file under:

```env
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
```

---

### 🔁 Set up your Paystack Webhook

> Webhooks allow Paystack to notify your backend when a payment is successful.

1. On the same page (`Settings → API Keys & Webhooks`), scroll to the **Webhook URL** section.
2. Add your backend webhook URL:

```text
https://your-frontend-domain.com/api/webhook
```

> Make sure this matches the `FRONTEND_URL` value in your `.env` and that your `/api/webhook` endpoint is correctly implemented in your backend to verify and process payments.

---

## 📁 Project Structure

```
baraton-backend/
├── controllers/
├── routes/
├── models/
├── middleware/
├── utils/
├── config/
└── server.js
```

---

## 🧰 Built With

* Node.js
* Express
* MySQL
* Paystack API
* Cloudinary SDK
* JSON Web Tokens (JWT)

---

## 🛡️ Security Notes

* Use HTTPS in production.
* Always keep your API keys and secrets out of the frontend.
* Secure your webhook endpoint by verifying the Paystack signature.


## ✉️ Email (SMTP) Configuration & Invoicing

This backend supports sending booking confirmation emails with a generated PDF invoice. Emails are queued in the database and processed by a background worker with retry logic.

Environment variables to configure SMTP (add to `backend/.env`):

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_SECURE=false # true for port 465
EMAIL_FROM="Baraton <no-reply@yourdomain.com>"
```

If SMTP is not configured the worker will log the email content (useful for development). Once SMTP credentials are provided, the worker will send emails and automatically retry failed sends.

### Test email endpoint

You can test SMTP by calling the test route:

```bash
curl -X POST http://localhost:5000/api/test-email \
	-H 'Content-Type: application/json' \
	-d '{"to":"you@example.com","subject":"Test","text":"Hello"}'
```

### Migrations

We added migrations to support `Payments.metadata` and the `EmailQueues` table. If you use migrations instead of `sequelize.sync`, run:

```bash
# Using sequelize-cli (if configured):
npx sequelize db:migrate
```

If you rely on `sequelize.sync()` (development), the tables will be created automatically when the server starts.

---
