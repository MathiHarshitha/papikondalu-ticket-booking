# Papikondalu Ticket Booking

Full-stack tourism website and online ticket booking platform for **Aswini Godavari Travel & Tourism** — Papikondalu boat tour operator since 2004.

**Stack:** Next.js 14 (App Router) + Express.js + MongoDB Atlas + Razorpay

---

## Quick Start

```bash
# 1. Install all dependencies.
npm install
cd client && npm install
cd ../server && npm install
cd ..

# 2. Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env.local
# Edit both files with your real values

# 3. Start development  servers (both together)
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health check:** http://localhost:5000/health

---

## Project Structure

```
papikondalu-ticket-booking/
├── client/          # Next.js 14 App Router frontend
│   ├── src/app/     # Pages (homepage, packages, auth, dashboard, admin)
│   └── src/components/  # Shared UI components
├── server/          # Express.js REST API
│   ├── src/models/  # Mongoose schemas (User, Package, Booking, Payment, Refund, Ticket)
│   ├── src/routes/  # API route definitions
│   ├── src/controllers/ # Business logic
│   └── src/middleware/  # Auth, error handling
└── package.json     # Root workspace with concurrently
```

---

## Environment Setup

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_ACCESS_SECRET` | 64-char random string for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay test key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `GOOGLE_MAPS_API_KEY` | Google Places API key |
| `GOOGLE_PLACE_ID` | Google Place ID for the business |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads |
| `SMTP_*` | Email provider credentials |
| `ADMIN_BOOTSTRAP_TOKEN` | Secret token to enable admin user creation via seed |

### Client (`client/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay **public** key only |

---

## Seed Database

After setting `MONGODB_URI` and `ADMIN_BOOTSTRAP_TOKEN` in `server/.env`:

```bash
cd server
npx ts-node src/scripts/seed.ts
```

Creates 4 packages, 3 boats, and a SUPER_ADMIN user.
**Change the admin password immediately after first login.**

---

## API Endpoints

### Public
| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/packages` | List published packages |
| GET | `/api/v1/packages/:slug` | Package details |
| GET | `/health` | Server health |

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Create customer account |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/me` | Current user |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |

### Bookings (requires login)
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/bookings/hold` | Hold seats |
| POST | `/api/v1/bookings` | Complete booking details |
| GET | `/api/v1/bookings/my` | My bookings |
| GET | `/api/v1/bookings/my/:id` | Booking detail |
| POST | `/api/v1/bookings/my/:id/cancel-request` | Cancel request |
| GET | `/api/v1/bookings/:id/ticket` | Get ticket |

### Payments (requires login)
| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/payments/create-order` | Create Razorpay order |
| POST | `/api/v1/payments/verify` | Verify payment signature |
| POST | `/api/v1/payments/webhook` | Razorpay webhook |

---

## Pages

### Public
- `/` — Homepage (hero, packages, attractions, reviews, FAQ)
- `/packages` — All 9 packages with filters
- `/packages/[slug]` — Package detail with booking panel
- `/about` — About the company and fleet
- `/contact` — Contact form and details
- `/attractions` — Destinations guide
- `/gallery` — Photo gallery
- `/faq` — Frequently asked questions

### Auth
- `/login` — Customer login
- `/register` — Customer registration

### Customer Dashboard
- `/account` — Dashboard overview
- `/account/bookings` — Booking history
- `/account/tickets` — Digital tickets
- `/account/cancellations` — Cancellation requests
- `/account/refunds` — Refund tracking

### Admin
- `/admin` — Dashboard with metrics
- `/admin/packages` — Package management
- `/admin/departures` — Boat and departure management
- `/admin/bookings` — Booking management
- `/admin/refunds` — Refund approval workflow
- `/admin/checkin` — QR code check-in interface

---

## Business Information

| Detail | Value |
|---|---|
| **Company** | Aswini Godavari Travel & Tourism |
| **Phone / WhatsApp** | +91 98483 23488 |
| **Email** | aswinigodavari@gmail.com |
| **Location** | Rajahmundry, Andhra Pradesh 533101 |
| **Founded** | 2004 |
| **Travellers served** | 7 lakh+ |
| **Fleet** | MV Aswini (120), MV Sri Godavari (150), MV Srilaxmi (100) |
| **Best season** | October – March |
| **Google Reviews** | https://g.page/r/CXaRKQEsI6o2ECE/review |

### Pricing (from reference website, October 2026)
| Package | Price |
|---|---|
| Rajahmundry One Day | ₹1,500/person |
| Bhadrachalam Two Day | ₹2,300/person |
| Sirivaka Night Stay | ₹5,200/person |
| Other packages | Contact for pricing |

### Cancellation Policy
- **48+ hours before:** Full refund
- **24–48 hours before:** 50% refund
- **Within 24 hours:** No refund
- **Weather cancellation:** Full refund or rescheduled date

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy — `www.bhadradripapikondalu.com`

### Backend (Render / Railway)
1. Create a Web Service, build command: `npm run build`, start: `npm start`
2. Set environment variables
3. Configure custom domain: `api.bhadradripapikondalu.com`

### Database (MongoDB Atlas)
1. Create a cluster
2. Create a database user with read/write permissions
3. Whitelist your server IP
4. Copy the connection string to `MONGODB_URI`

---

## Pending External Dependencies

Before going live, the following require business owner action:

- [ ] MongoDB Atlas credentials → `MONGODB_URI`
- [ ] Razorpay merchant onboarding → `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- [ ] Razorpay webhook endpoint configuration → `RAZORPAY_WEBHOOK_SECRET`
- [ ] Google Places API key and Place ID verification → `GOOGLE_MAPS_API_KEY`, `GOOGLE_PLACE_ID`
- [ ] Cloudinary account → `CLOUDINARY_*`
- [ ] SMTP / transactional email provider → `SMTP_*`
- [ ] DNS configuration for production domains
- [ ] SSL/HTTPS (auto-provisioned by Vercel and Render)
