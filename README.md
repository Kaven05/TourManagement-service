# 🏞️ Tour Management Service - Backend

This is the backend API for a complete Tour Management platform — built using Node.js, Express, MongoDB, and following modern REST API practices. It handles tour creation, booking, user authentication, review system, payments, and more.

---

## 🚀 Features

- 🧭 **Tour Management**
  - CRUD operations (create, read, update, delete)
  - Filtering, sorting, pagination
  - Geospatial queries (e.g. tours within a radius)

- 👥 **User Management**
  - JWT-based authentication & authorization
  - Secure password handling & reset functionality
  - Role-based access (admin, lead-guide, guide, user)

- 💬 **Reviews**
  - Users can review tours
  - Linked via virtual population

- 💳 **Bookings**
  - Stripe payment integration
  - Booking tracking

- 📸 **Image Uploads**
  - Upload & process user/tour images (Multer + Sharp)

- 🔐 **Security**
  - Rate limiting, sanitization, helmet, CORS
  - HTTP Parameter Pollution (HPP) protection

- 📧 **Email Notifications**
  - Password reset, welcome emails via Nodemailer

---

## 🧾 Technologies Used

- Node.js, Express
- MongoDB, Mongoose
- JSON Web Tokens (JWT)
- Stripe for payment
- Multer & Sharp for image upload
- Nodemailer
- Pug (if used for server-rendered frontend)
- Helmet, xss-clean, express-mongo-sanitize, etc.

---

## 📁 Project Structure

```bash
TourManagement-service/
│
├── controllers/        # Route logic
├── models/             # Mongoose schemas
├── routes/             # API route handlers
├── utils/              # Helper functions (email, API features, etc.)
├── public/             # Static assets (images, etc.)
├── views/              # Pug templates (if applicable)
├── config.env          # Environment variables
├── server.js           # Entry point
└── app.js              # Express app setup
