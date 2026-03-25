# MasjidConnect Ethiopia — Backend Implementation Plan

**Stack:** Node.js, Express, TypeScript, Prisma (ORM), PostgreSQL, Redis (Caching/Sessions)

This plan outlines the architecture for a scalable backend to support the MasjidConnect Ethiopia mobile app.

---

## Folder Structure (Modular)

The project will follow a feature-based folder structure where each module contains its own routes and controller.

```
masjidconnect-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── profile/
│   │   │   ├── profile.router.ts
│   │   │   ├── profile.controller.ts
│   │   │   └── profile.service.ts
│   │   ├── mosque/
│   │   │   ├── mosque.router.ts
│   │   │   ├── mosque.controller.ts
│   │   │   └── mosque.service.ts
│   │   ├── imam/
│   │   │   ├── imam.router.ts
│   │   │   ├── imam.controller.ts
│   │   │   └── imam.service.ts
│   │   ├── event/
│   │   │   ├── event.router.ts
│   │   │   ├── event.controller.ts
│   │   │   └── event.service.ts
│   │   ├── khutbah/
│   │   │   ├── khutbah.router.ts
│   │   │   ├── khutbah.controller.ts
│   │   │   └── khutbah.service.ts
│   │   ├── community/
│   │   │   ├── community.router.ts
│   │   │   ├── community.controller.ts
│   │   │   └── community.service.ts
│   │   └── donation/
│   │       ├── donation.router.ts
│   │       ├── donation.controller.ts
│   │       └── donation.service.ts
│   ├── middlewares/          # Auth, Error handling, Validation
│   ├── config/               # Database, Redis, Firebase Admin
│   ├── utils/                # Prayer time utils, Logger
│   └── index.ts              # Entry point
├── prisma/
│   └── schema.prisma         # Database schema
├── .env                      # Environment variables
└── package.json
```

---

## Tech Stack Details

| Technology | Purpose |
|---|---|
| **Express.js** | Fast, unopinionated web framework for Node.js. |
| **TypeScript** | Static typing for enterprise-grade reliability. |
| **Prisma** | Modern ORM for type-safe database access (PostgreSQL). |
| **Redis** | In-memory data store for caching prayer times and session management. |
| **Zod** | Schema validation for API requests. |
| **Firebase Admin** | For verifying ID tokens from the mobile app. |
| **Cloudinary/S3** | For storing mosque photos and khutbah audio recordings. |

---

## Technical Features

### 1. Authentication
- JWT-based authentication using Firebase ID tokens (verified on backend).
- Middleware to protect routes: `isAuthenticated`, `isAdmin`, `isImam`.

### 2. Prayer Times Caching (Redis)
- High-frequency calculation offloading.
- Cache prayer times for major Ethiopian cities for 24 hours.
- Key: `prayer_times:{city}:{date}`.

### 3. Database Schema (Prisma)
- **User:** id, email, phone, role (USER, ADMIN, IMAM), mosqueId.
- **Mosque:** id, name, location (Geographic types), city, prayerTimings.
- **Khutbah:** id, title, audioUrl, duration, imamId, mosqueId.
- **Donation:** id, amount, userId, campaignId, status (PENDING, SUCCESS).

### 4. Real-time Community Noticeboard
- CRUD for posts with image support.
- Redis-backed "Likes" counter for high performance.
- Global notice broadcasting via Push Notifications.

---

## API Endpoints (Samples)

### Auth & Profile
- `POST /api/auth/verify` - Verify Firebase token and create/get user.
- `GET /api/profile` - Get current user profile.

### Mosques & Imams
- `GET /api/mosques` - Search mosques by name or vicinity.
- `GET /api/imams` - Filtered list of Ethiopian imams.

### Donations
- `POST /api/donations/initiate` - Create a donation record for Telebirr/Bank.
- `POST /api/donations/verify` - Webhook or manual verification of transfer.

---

## Development Workflow
1. Initialize project with `npm init -y` and `npx tsc --init`.
2. Set up Prisma: `npx prisma init`.
3. Define modular folders and basic Express server.
4. Implement standard middleware (helmet, cors, morgan).
5. Deploy to a VPS or specialized Node.js hosting (Railway, Render, AWS).
