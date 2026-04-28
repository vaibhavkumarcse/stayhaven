# 🏠 StayHaven — Property Booking Platform

A full-stack MERN property listing and booking platform. Book hotels, villas, apartments, and unique stays worldwide.

---

## ⚡ Quick Start (5 steps)

### Step 1 — Clone or unzip the project
```bash
cd stayhaven
```

### Step 2 — Set up the server
```bash
cd server
npm install
cp .env.example .env
# → Open .env and fill in your values (see below)
```

### Step 3 — Set up the client
```bash
cd ../client
npm install
cp .env.example .env
# → Open .env and add VITE_API_URL=http://localhost:5000/api
```

### Step 4 — Run both (two terminals)
```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

### Step 5 — Open the app
```
http://localhost:5173
```

---

## 🔑 Environment Variables

### server/.env
| Variable | Where to get it |
|----------|----------------|
| `MONGO_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Create cluster → Connect → Drivers |
| `JWT_SECRET` | Any long random string (e.g. `openssl rand -base64 32`) |
| `CLOUDINARY_CLOUD_NAME` | [Cloudinary Dashboard](https://cloudinary.com) → Settings |
| `CLOUDINARY_API_KEY` | Same as above |
| `CLOUDINARY_API_SECRET` | Same as above |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Add endpoint |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Gmail App Password (not your regular password — [create one here](https://myaccount.google.com/apppasswords)) |

### client/.env
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `http://localhost:5000/api` (dev) or your Render URL (prod) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys → Publishable key |

---

## 🗂 Project Structure

```
stayhaven/
├── server/                  # Express + Node.js backend
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── cloudinary.js    # Cloudinary SDK setup
│   ├── models/
│   │   ├── User.js          # User schema (guest/host/admin)
│   │   ├── Property.js      # Property/listing schema
│   │   ├── Booking.js       # Booking schema
│   │   └── Review.js        # Review + rating schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   └── paymentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verify + role check
│   │   ├── errorMiddleware.js   # Global error handler
│   │   └── uploadMiddleware.js  # Multer image upload
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── uploadToCloudinary.js
│   │   ├── availabilityChecker.js
│   │   └── sendEmail.js
│   └── server.js            # Express entry point
│
└── client/                  # React + Vite frontend
    └── src/
        ├── components/
        │   ├── layout/      # Navbar, Footer
        │   ├── common/      # Spinner, ProtectedRoute
        │   ├── property/    # PropertyCard
        │   └── booking/     # BookingWidget
        ├── pages/
        │   ├── Home.jsx
        │   ├── PropertyListing.jsx
        │   ├── PropertyDetail.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── MyBookings.jsx
        │   ├── Dashboard.jsx
        │   ├── ListingForm.jsx
        │   ├── Profile.jsx
        │   ├── Wishlist.jsx
        │   └── NotFound.jsx
        ├── services/        # All API calls (axios)
        ├── store/           # Zustand auth store
        └── utils/           # Helpers, formatters
```

---

## 🚀 Deployment

### Frontend → Vercel
1. Push the `client/` folder to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set root to `client`
4. Add environment variables in Vercel dashboard

### Backend → Render
1. Push the `server/` folder to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables

### Database → MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` in Network Access (for Render)
3. Copy the connection string to `MONGO_URI`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |
| PUT | `/api/auth/become-host` | Private |

### Properties
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/properties` | Public |
| GET | `/api/properties/search` | Public |
| GET | `/api/properties/:id` | Public |
| POST | `/api/properties` | Host |
| PUT | `/api/properties/:id` | Host (owner) |
| DELETE | `/api/properties/:id` | Host (owner) |
| GET | `/api/properties/my-listings` | Host |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/bookings` | Private |
| GET | `/api/bookings/my` | Private |
| GET | `/api/bookings/host` | Host |
| PATCH | `/api/bookings/:id/cancel` | Private |
| PATCH | `/api/bookings/:id/confirm` | Host |

### Payments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/payments/create-intent` | Private |
| POST | `/api/payments/confirm` | Private |
| POST | `/api/payments/webhook` | Stripe |

---

## 🛠 Tech Stack

**Backend:** Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · Multer · Cloudinary · Stripe · Nodemailer

**Frontend:** React 18 · Vite · Tailwind CSS · React Router v6 · Axios · React Query · Zustand · React Hook Form · React Date Range · React Hot Toast

**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas (database) · Cloudinary (images) · Stripe (payments)

---

## 🐞 Troubleshooting

**MongoDB connection fails** — Check your IP is whitelisted in Atlas Network Access. Use `0.0.0.0/0` for development.

**Images not uploading** — Verify your three Cloudinary env vars are correct. Check the cloud name matches exactly.

**CORS errors** — Make sure `CLIENT_URL` in server `.env` matches exactly where your React app is running (including port).

**Stripe errors** — Use test keys (`sk_test_...` / `pk_test_...`) in development. Use test card `4242 4242 4242 4242`.
