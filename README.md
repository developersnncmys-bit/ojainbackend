# OJAIN Admin — Backend API

REST API for the OJAIN admin panel, built with **Express + MongoDB (Mongoose)** in a clean MVC structure.

## Stack
- Express 4 · Mongoose 8 · JWT auth · bcryptjs · CORS · morgan
- ES modules (`"type": "module"`), Node 18+

## Project structure
```
server/
├── src/
│   ├── server.js              # entry — loads env, connects DB, starts server
│   ├── app.js                 # express app, middleware, route mounting
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # Mongoose schemas (User, Product, Category, …)
│   ├── controllers/           # request handlers (thin, use handlerFactory)
│   ├── routes/                # express routers + index.js aggregator
│   ├── middleware/            # auth (JWT), error handler, 404
│   ├── utils/                 # asyncHandler, ApiError, handlerFactory, token
│   └── seed/                  # seed data + seed script
└── .env.example
```

## Setup
```bash
cd server
npm install
cp .env.example .env          # then edit values (Mongo URI, JWT secret)
npm run seed                  # populate DB + create the admin user
npm run dev                   # start with auto-reload (nodemon)
```
Requires a running MongoDB (local `mongodb://127.0.0.1:27017` or an Atlas URI).

Default admin after seeding: **admin@ojain.in / admin123**

## Auth
Send `Authorization: Bearer <token>` on all `/api/*` resource routes.
Get a token from `POST /api/auth/login`.

## Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create an admin user |
| POST | `/api/auth/login` | Login → returns `{ token, user }` |
| GET | `/api/auth/me` | Current user (protected) |
| GET/POST | `/api/products` | List (paginated, `?search=&status=&page=&limit=`) / create |
| GET/PUT/DELETE | `/api/products/:id` | Read / update / delete |
| POST | `/api/products/bulk` | Bulk create (CSV import) |
| … | `/api/categories`, `/api/orders`, `/api/customers`, `/api/vendors`, `/api/reviews`, `/api/banners`, `/api/coupons` | Same CRUD pattern |
| PATCH | `/api/orders/:id/status` | Update order status |
| PATCH | `/api/vendors/:id/status` | Approve / reject vendor |
| PATCH | `/api/reviews/:id/approve` | Publish a review |
| PATCH | `/api/banners/:id/toggle` | Toggle active state |
| GET | `/api/dashboard/stats` · `/overview` · `/reports` | Aggregated KPIs |

## List response shape
```json
{ "success": true, "total": 42, "page": 1, "pages": 5, "count": 10, "data": [ ... ] }
```

## Connecting the React frontend
Point the frontend at `http://localhost:5000/api`, store the JWT from login, and
replace the mock-data imports with `fetch`/axios calls. Set `CLIENT_URL` in `.env`
to your Vite dev origin (default `http://localhost:5173`) for CORS.
