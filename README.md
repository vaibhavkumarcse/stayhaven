# 🌌 StayHaven: TURA Edition

[![Stripe](https://img.shields.io/badge/Payments-Stripe-6772e5?style=for-the-badge&logo=stripe)](https://stripe.com)
[![React](https://img.shields.io/badge/Frontend-React-61dafb?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

StayHaven is a premium, high-end property rental platform designed with the **TURA** aesthetic—a sophisticated, glassmorphic dark theme that redefines the luxury travel experience.

## ✨ Key Features

- **💎 Elite UI/UX**: State-of-the-art dark theme with glassmorphism, smooth micro-animations, and high-contrast typography.
- **💳 Multi-Channel Payments**: Integrated with **Stripe Elements** for secure card payments and a dedicated **UPI QR Code** gateway for instant mobile payments.
- **🏠 Property Management**: Robust hosting system for property owners to list, manage, and track reservations.
- **📅 Advanced Booking**: Real-time availability checking with a seamless calendar-driven reservation flow.
- **🔍 Intelligent Search**: Filter by destination, property type (Villa, Apartment, Cabin), and amenities.
- **👤 User Profiles**: Dedicated guest and host dashboards to manage trips and listings.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React, React Query, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Security**: JWT Authentication, SSL Encryption, Stripe Secure Checkout.
- **Media**: Cloudinary (Image Hosting).

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/stayhaven.git
   ```

2. **Setup Server**
   ```bash
   cd stayhaven/server
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

## 🔐 Environment Variables

### Server (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 📸 Preview

*(Add your screenshots here!)*

---

Developed with ❤️ by StayHaven Team.
