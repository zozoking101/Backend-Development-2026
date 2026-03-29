# Ledger Commerce API

> Fullstack Ecommerce REST API with User, Product, and Order Management

A fully containerised RESTful commerce backend built with **Node.js**, **Express**, and **MongoDB**, orchestrated via **Docker Compose**. This API powers a complete e-commerce platform with a built-in financial ledger system that gates order processing behind real account balances — ensuring no order can be placed without sufficient funds.

[![Node.js](https://img.shields.io/badge/Node.js-v24-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v5-lightgrey)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8-green)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docker.com)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white)


---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Services](#api-services)
- [Error Structure](#error-structure)
- [Testing Order](#testing-order)
- [Postman Documentation](#postman-documentation)

---

## Overview

The Ledger Commerce API is designed around six core services — Users, Products, Orders, Accounts, Categories, and Reviews — each owning its domain entirely through a modular subrouter architecture. The standout feature is its internal financial ledger: every user has an account with a real USD balance, and orders are only processed if the buyer has sufficient funds. Account debits, stock deductions, refunds, and stock restorations are all handled automatically as part of the order and returns lifecycle.

---

## Features

- 👤 **User management** with role-based access (`user` / `admin`), ban controls, and profile management
- 🔐 **Password security** via bcrypt hashing with `select: false` schema protection
- 📦 **Product catalogue** with category assignment, image arrays, stock tracking, and availability flags
- 🗂️ **Category management** with nested subcategory support via self-referencing parent field and auto-generated URL slugs
- ⭐ **Product reviews** with 1–5 star ratings, verified purchase flags, admin approval, and average rating aggregation
- 📊 **Inventory management** with configurable low-stock threshold filtering globally and by category
- 💳 **Financial ledger** with per-user accounts, immutable transaction history, and `balanceAfter` snapshots
- 🧾 **Balance-gated orders** — account balance is verified before order creation, then debited automatically
- 📦 **Automatic stock deduction** on order creation and restoration on successful refund
- 🔄 **Full returns flow** — request, approve, reject, and refund with automatic account credit
- 🐳 **Fully containerised** with Docker Compose for both the API and MongoDB services
- 🧱 **Structured error system** with consistent `PayloadError` (400) and `InternalError` (500) response shapes

---

## Architecture
```
ledger-commerce-api/
├── .env.development          # Root environment variables
├── docker-compose.yaml       # Docker orchestration config
├── README.md                 # Project documentation

├── api/
│   ├── .env.development      # API-specific environment variables
│   ├── Dockerfile            # Container definition for API
│   ├── package.json          # Dependencies and scripts
│   ├── package-lock.json     # Dependency lock file
│   ├── node_modules/         # Installed packages
│   │   └── ...
│   └── src/
│       ├── index.js          # Entry point

│       ├── errors/           # Custom error handling
│       │   ├── Errors.js
│       │   └── index.js

│       ├── lib/              # Core application logic
│       │   ├── config.js     # App configuration
│       │   ├── server.js     # Express server setup

│       │   ├── initializers/ # App bootstrapping (DB, routes, etc.)
│       │   │   ├── index.js
│       │   │   ├── mongo.js  # MongoDB connection setup

│       │   │   ├── controllers/   # Route handlers (grouped by domain)
│       │   │   │   ├── accounts/  # Accounts, funding, transactions
│       │   │   │   │   ├── accounts.controller.js
│       │   │   │   │   ├── funding.controller.js
│       │   │   │   │   └── transactions.controller.js
│       │   │   │   ├── orders/    # Orders, returns, tracking
│       │   │   │   │   ├── orders.controller.js
│       │   │   │   │   ├── returns.controller.js
│       │   │   │   │   └── tracking.controller.js
│       │   │   │   ├── products/  # Products, categories, inventory, reviews
│       │   │   │   │   ├── products.controller.js
│       │   │   │   │   ├── categories.controller.js
│       │   │   │   │   ├── inventory.controller.js
│       │   │   │   │   └── reviews.controller.js
│       │   │   │   └── users/     # Auth, profile, admin
│       │   │   │       ├── users.controller.js
│       │   │   │       ├── auth.controller.js
│       │   │   │       ├── profile.controller.js
│       │   │   │       └── admin.controller.js

│       │   │   ├── middleware/    # Express middleware
│       │   │   │   ├── logger.middleware.js
│       │   │   │   └── notFound.middleware.js

│       │   │   └── routes/        # Route definitions (per domain)
│       │   │       ├── accounts/
│       │   │       │   ├── accounts.router.js
│       │   │       │   ├── funding.router.js
│       │   │       │   └── transactions.router.js
│       │   │       ├── orders/
│       │   │       │   ├── orders.router.js
│       │   │       │   ├── returns.router.js
│       │   │       │   └── tracking.router.js
│       │   │       ├── products/
│       │   │       │   ├── products.router.js
│       │   │       │   ├── categories.router.js
│       │   │       │   ├── inventory.router.js
│       │   │       │   └── reviews.router.js
│       │   │       └── users/
│       │   │           ├── users.router.js
│       │   │           ├── auth.router.js
│       │   │           ├── profile.router.js
│       │   │           └── admin.router.js

│       │   └── services/     # Business logic / DB interaction layer
│       │       ├── AccountService.js
│       │       ├── CategoryService.js
│       │       ├── OrderService.js
│       │       ├── ProductService.js
│       │       ├── ReviewService.js
│       │       └── UserService.js

│       └── models/           # Mongoose schemas
│           ├── AccountSchema.js
│           ├── CategorySchema.js
│           ├── OrderSchema.js
│           ├── ProductSchema.js
│           ├── ReviewSchema.js
│           └── UserSchema.js

└── data/                     # External/static data 
    └── ...
```

### Key Architectural Decisions

**Modular subrouter pattern** — each major service is split into focused subrouters, keeping controllers small and making it straightforward to apply middleware at the subrouter level in future (e.g. auth guards, rate limiting).

**Service layer separation** — controllers never interact with Mongoose directly. All database operations live in service files, keeping controllers focused on HTTP concerns only.

**Balance-gated ordering** — before any order is written to the database, the buyer's account balance is verified. If insufficient, the order is rejected before any write occurs.

**Immutable transaction ledger** — every credit and debit uses `document.save()` rather than `findByIdAndUpdate`, ensuring the `balanceAfter` snapshot is always calculated and stored atomically alongside the balance change.

**Cascading deletes** — deleting a category automatically deletes all associated products via `Product.deleteMany({ category: id })`, preventing orphaned documents.

**Structured errors** — all errors extend a `BaseError` class producing a consistent JSON shape across every service, making client-side error handling predictable.

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) (optional, for testing)

### Clone the Repository
```bash
git clone https://github.com/zozoking101/Backend-Development-2026.git
cd Backend-Development-2026/ledger-commerce-api/api
```

### Running with Docker
```bash
docker compose up --build
```

This starts two containers:
- **api** — the Node.js Express server on port `3000`
- **mongo** — the MongoDB instance on port `27017`

To stop the containers:
```bash
docker compose down
```

To stop and remove all data volumes:
```bash
docker compose down -v
```

### Verify the API is Running
```
GET http://localhost:3000/
```

Expected response:
```json
{
  "message": "👋🏽 API running",
  "service": "ledger-commerce-api",
  "version": "1.0.0",
  "endpoints": {
    "base": "/api/v1",
    "users": "/api/v1/users",
    "products": "/api/v1/products",
    "orders": "/api/v1/orders",
    "accounts": "/api/v1/accounts"
  }
}
```

---

## Environment Variables

Create a `.env.development` file inside the `api/` directory with the following variables:
```env
PORT=3000

DB_PROTOCOL=mongodb
DB_USERNAME=user
DB_PASSWORD=password
DB_HOST=mongo
DB_PORT=27017
DB_DATABASE=ledger-commerce-db
```

> **Note:** The `DB_HOST` value must be `mongo` (the Docker service name) when running inside Docker. Use `localhost` when connecting via MongoDB Compass from your host machine.

---

## API Services

**Base URL:** `http://localhost:3000/api/v1`

---

### 👤 Users `/api/v1/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login with email and password |
| POST | `/auth/logout` | Logout current session |
| POST | `/auth/forgot-password` | Request a password reset link |
| POST | `/auth/reset-password` | Reset password with token |
| POST | `/auth/refresh-token` | Refresh access token |
| GET | `/admin/all` | Get all users (admin) |
| GET | `/admin/:id` | Get a user by id (admin) |
| PUT | `/admin/ban/:id` | Ban a user (admin) |
| PUT | `/admin/unban/:id` | Unban a user (admin) |
| DELETE | `/admin/delete/:id` | Delete a user (admin) |
| GET | `/profile/:id` | Get own profile |
| PUT | `/profile/update/:id` | Update own profile |
| PUT | `/profile/change-password/:id` | Change own password |
| PUT | `/profile/deactivate/:id` | Deactivate own account |

---

### 📦 Products `/api/v1/products`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/new` | Create a new product |
| GET | `/all` | Get all products |
| GET | `/:id` | Get a product by id |
| PUT | `/update/:id` | Update a product |
| DELETE | `/delete/:id` | Delete a product |
| POST | `/categories/new` | Create a category |
| GET | `/categories/all` | Get all categories |
| GET | `/categories/:id` | Get a category by id |
| PUT | `/categories/update/:id` | Update a category |
| DELETE | `/categories/delete/:id` | Delete a category and its products |
| GET | `/inventory/all` | Get all products with stock levels |
| GET | `/inventory/low-stock` | Get low stock products (global) |
| GET | `/inventory/low-stock/:id` | Get low stock products by category |
| PUT | `/inventory/restock/:id` | Add stock to a product |
| PUT | `/inventory/deduct/:id` | Deduct stock from a product |
| POST | `/reviews/new/:productId` | Submit a product review |
| GET | `/reviews/all/:productId` | Get all reviews for a product |
| GET | `/reviews/rating/:productId` | Get average rating for a product |
| PUT | `/reviews/update/:id` | Update a review |
| DELETE | `/reviews/delete/:id` | Delete a review |

---

### 🧾 Orders `/api/v1/orders`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/new` | Create an order (debits account + deducts stock) |
| GET | `/all` | Get all orders |
| GET | `/:id` | Get an order by id |
| PUT | `/update/:id` | Update an order |
| DELETE | `/delete/:id` | Delete an order |
| GET | `/tracking/:orderId` | Get current order status |
| PUT | `/tracking/status/:orderId` | Update order status |
| GET | `/tracking/history/:orderId` | Get order status history |
| PUT | `/returns/request/:orderId` | Request a return |
| GET | `/returns/all` | Get all return requests |
| PUT | `/returns/approve/:id` | Approve a return |
| PUT | `/returns/reject/:id` | Reject a return |
| PUT | `/returns/refund/:id` | Process refund (credits account + restores stock) |

---

### 💳 Accounts `/api/v1/accounts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/new` | Create an account for a user |
| GET | `/all` | Get all accounts |
| GET | `/:id` | Get an account by id |
| PUT | `/update/:id` | Update account settings |
| DELETE | `/delete/:id` | Delete an account |
| POST | `/funding/deposit/:userId` | Deposit funds into account |
| POST | `/funding/withdraw/:userId` | Withdraw funds from account |
| GET | `/funding/balance/:userId` | Get current account balance |
| GET | `/transactions/all/:accountId` | Get full transaction history |
| GET | `/transactions/:id` | Get a single transaction |
| GET | `/transactions/filter/:accountId` | Filter transactions by type or date |

---

## Error Structure

All errors across every service return a consistent JSON shape:
```json
{
  "type": "payload | internal",
  "timestamp": "2026-03-22T15:35:51.402Z",
  "code": 400,
  "messages": ["Descriptive error message"],
  "key": "the_field_that_caused_the_error",
  "service": "the_service_that_threw_the_error"
}
```

| Type | Status | Cause |
|------|--------|-------|
| `payload` | 400 | Invalid input, duplicate key, validation failure, insufficient balance |
| `internal` | 500 | Unexpected server or database error |

---

## Testing Order

To test the complete order and refund lifecycle end-to-end, create resources in this sequence:
```
1. POST   /api/v1/users/auth/register          → create a user
2. POST   /api/v1/accounts/new                 → create an account for that user
3. POST   /api/v1/accounts/funding/deposit     → fund the account
4. POST   /api/v1/products/categories/new      → create a category
5. POST   /api/v1/products/new                 → create a product
6. POST   /api/v1/orders/new                   → place an order (account debited + stock deducted)
7. PUT    /api/v1/orders/tracking/status/:id   → update status to 'delivered'
8. PUT    /api/v1/orders/returns/request/:id   → request a return
9. PUT    /api/v1/orders/returns/approve/:id   → approve the return
10. PUT   /api/v1/orders/returns/refund/:id    → process refund (account credited + stock restored)
```

---

## Postman Documentation

The full Postman collection with saved request examples and response bodies is available here:

**[View Postman Documentation →](https://documenter.getpostman.com/view/31555318/2sBXijKs84#73346ec7-07c1-4a8e-85e9-587f50151a79)**

The collection includes:
- All endpoints organised by service
- At least 2 randomised request body examples per endpoint
- Saved success and error response examples
- Full end-to-end testing order guidance

---

## Built With

| Technology | Purpose |
|---|---|
| Node.js v24 | Runtime |
| Express.js v5 | HTTP framework |
| MongoDB v8 | Database |
| Mongoose | ODM / schema validation |
| Docker & Docker Compose | Containerisation |
| bcrypt | Password hashing |
| validate.js | Input validation |
| nodemon | Development server |