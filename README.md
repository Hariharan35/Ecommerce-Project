# MyShop: Full-Stack E-Commerce Application

MyShop is a full-stack online store. Customers can browse products, search and filter, add items to a cart, place orders with a shipping address, track order status and recover a forgotten password by email OTP. The frontend is built with React and Vite; the backend is a REST API built with Node.js, Express and MongoDB.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Adding Sample Products](#adding-sample-products)
7. [API Reference](#api-reference)
8. [Data Models](#data-models)
9. [How It Works](#how-it-works)
10. [Frontend Overview](#frontend-overview)
11. [Known Issues and Next Steps](#known-issues-and-next-steps)

---

## Features

**Customer features**

- Sign up and log in (JWT authentication)
- Browse products with search, category filter, price and stock filters, sorting and pagination
- Product details page with image, price, discount and stock status
- Cart with quantity controls limited by stock
- Checkout with validated shipping address (cash on delivery)
- Order history with a status timeline and order cancellation
- Forgot password with a 4-digit email OTP
- Wishlist (stored in the browser)

**Design (redesigned frontend)**

- Navy and gold theme with a serif display font
- Announcement bar, sticky navbar, hero slider, trust bar, category tiles, promo banner and richer footer
- Responsive layout for desktop, tablet and mobile

**Backend features**

- Role-based access control (customer and admin routes)
- Stock is reserved when an order is placed and restored when it is cancelled
- Passwords hashed with bcrypt; tokens signed with JWT
- Password reset that never reveals whether an email is registered

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Context API, react-icons, plain CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose 9 |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Email | Nodemailer (Gmail) |
| Tooling | ESLint, nodemon, Postman collection |

---

## Project Structure

```
NodeExample/
├── app.js                      # Express server, CORS, route mounting
├── config/db.js                # MongoDB connection
├── routes/                     # auth, user, product, cart, order routes
├── controllers/                # Request handlers
├── services/                   # Business logic
├── models/                     # user, product, cart, order, otp schemas
├── middleware/                 # auth (JWT) and role checks
├── jwt/token.service.js        # Token creation
├── email/                      # Nodemailer service and OTP template
├── postman/                    # Postman collection for API testing
├── .env                        # Environment variables (do not commit)
└── Front-end/
    ├── index.html
    └── src/
        ├── main.jsx, App.jsx   # Entry point and routes
        ├── pages/              # Products, ProductDetails, Cart, Checkout,
        │                       # Orders, Login, Signup, ForgotPassword,
        │                       # ResetPassword, NotFound
        ├── components/         # Navbar, TopBar, Carousel, TrustBar,
        │                       # CategoryTiles, PromoBanner, ProductCard,
        │                       # ProductRow, FilterSidebar, Pagination,
        │                       # PriceDetails, ConfirmModal, Footer, ...
        ├── context/            # Auth, Cart, Toast, Wishlist providers
        ├── services/api.js     # All backend calls in one place
        ├── styles/             # variables, base, layout, components,
        │                       # sections, pages (CSS)
        └── utils/format.js     # Price and category helpers
```

---

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local MongoDB or a MongoDB Atlas connection string)
- A Gmail account with an app password (only needed for the forgot-password email)

### 1. Install and run the backend

```bash
cd NodeExample
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)), then start the server:

```bash
npm start
```

The API runs on the port set in `.env` (the frontend expects **2000**). When it works you will see `Connected to MongoDB successfully` and `Server running on port 2000`.

### 2. Install and run the frontend

Open a second terminal:

```bash
cd NodeExample/Front-end
npm install
npm run dev
```

Open the link Vite prints, normally `http://localhost:5173`.

### Useful frontend scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create `NodeExample/.env` with these keys (use your own values):

```env
PORT=2000
MONGO_URL=mongodb://127.0.0.1:27017/myshop
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1h
USER_EMAIL=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

| Variable | Purpose |
|---|---|
| `PORT` | Port the API listens on (frontend expects 2000) |
| `MONGO_URL` | MongoDB connection string (`MONGO_URI` also works) |
| `JWT_SECRET` | Secret used to sign login tokens |
| `JWT_EXPIRES_IN` | Token lifetime, for example `1h` or `7d` (default `1h`) |
| `USER_EMAIL` | Gmail address that sends OTP emails |
| `EMAIL_PASSWORD` | Gmail app password (not your normal password) |

> **Security:** never commit `.env` or share it in a zip. Add it to `.gitignore`.

---

## Adding Sample Products

Product creation is admin-only through the API, and the user schema currently allows only the `customer` role (see [Known Issues](#known-issues-and-next-steps)). The quickest way to add data is directly in MongoDB (mongosh or Compass):

```js
db.products.insertMany([
  { name: "Wireless Headphones", description: "Over-ear, noise reducing", price: 2999,
    category: "electronics", image: "https://example.com/headphones.jpg",
    stock: 50, isActive: true },
  { name: "Classic Denim Jacket", description: "Slim fit", price: 1799,
    category: "men's clothing", image: "https://example.com/jacket.jpg",
    stock: 30, isActive: true }
])
```

The frontend category filters use these exact values: `electronics`, `men's clothing`, `women's clothing`, `jewelery`.

`stock` defaults to `0`, and products with zero stock show as **Out of stock**. To give every product 50 units:

```js
db.products.updateMany({}, { $set: { stock: 50 } })
```

---

## API Reference

Base URL: `http://localhost:2000/api`. Protected routes need the header `Authorization: Bearer <token>`.

### Auth (public)

| Method | Endpoint | Body |
|---|---|---|
| POST | `/auth/signup` | `name`, `email`, `password` (min 8 characters) |
| POST | `/auth/login` | `email`, `password`; returns `user` and `token` |
| POST | `/auth/forgot-password` | `email` |
| POST | `/auth/reset-password` | `email`, `otp`, `newPassword` |

### Users

| Method | Endpoint | Access |
|---|---|---|
| GET | `/users/getuserprofile` | Logged in |

### Products

| Method | Endpoint | Access |
|---|---|---|
| GET | `/products?search=&category=&page=1&limit=12` | Public |
| GET | `/products/:id` | Public |
| POST | `/products` | Admin |
| PUT | `/products/:id` | Admin |
| DELETE | `/products/:id` | Admin |

The list response contains `products`, `total`, `page` and `totalPages`. The page size (`limit`) is between 1 and 50, default 12.

### Cart (logged in)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get cart with item subtotals and total |
| POST | `/cart` | Add an item (`productId`, `quantity`) |
| PATCH | `/cart/:productId` | Change quantity |
| DELETE | `/cart/:productId` | Remove one item |
| DELETE | `/cart` | Clear the cart |

### Orders

| Method | Endpoint | Access |
|---|---|---|
| POST | `/orders` | Logged in; body is the shipping address |
| GET | `/orders` | Logged in; your orders, newest first |
| GET | `/orders/:id` | Logged in; one of your orders |
| PATCH | `/orders/:id/cancel` | Logged in; only while status is `placed` |
| PATCH | `/orders/:id/status` | Admin; `shipped` or `delivered` |

Shipping address body: `fullName`, `phone`, `addressLine`, `city`, `pincode`.

A Postman collection is included in `NodeExample/postman/` for testing these endpoints.

---

## Data Models

**User**: `name`, `email` (unique), `password` (hashed, hidden from queries), `role`, `isActive`

**Product**: `name`, `description`, `price`, `category`, `image`, `stock`, `isActive`

**Cart**: `userId`, `productId`, `quantity`; unique per user and product

**Order**: `userId`, `items[]` (product, name, image, price at purchase, quantity), `totalAmount`, `shippingAddress`, `paymentMethod` (COD), `status` (`placed`, `shipped`, `delivered`, `cancelled`)

**Otp**: `email`, `OTP`, `Used`, `expiresAt` (10 minutes)

---

## How It Works

### Request flow

```
React page -> services/api.js -> Express route -> middleware (JWT, role)
           -> controller -> service -> Mongoose model -> MongoDB
```

### Authentication

1. Signup stores the user with a bcrypt-hashed password (12 rounds).
2. Login returns a JWT, which the frontend keeps in `localStorage`.
3. `api.js` adds the token to protected requests. If the API answers 401, the frontend clears the login and redirects to `/login`.

### Cart and orders

- Adding to the cart is rejected if the quantity would exceed stock.
- Placing an order validates the address, reduces stock for each item, stores the price at purchase time, creates the order and clears the cart. If any item lacks stock, earlier reductions are undone.
- Cancelling a `placed` order restores the stock.

### Password reset

1. The user enters an email; the backend creates a 4-digit OTP valid for 10 minutes and emails it.
2. The user submits email, OTP and a new password.
3. The backend checks the OTP is unused and not expired, saves the new hashed password and marks the OTP as used.

---

## Frontend Overview

**Routes**

| Path | Page | Access |
|---|---|---|
| `/home` | Products (home and listing) | Public |
| `/product/:id` | Product details | Public |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Authentication | Public |
| `/cart`, `/checkout`, `/orders` | Shopping flow | Login required |

**State (React Context)**: `AuthContext` (user and token), `CartContext` (items and count), `ToastContext` (notifications), `WishlistContext` (saved products, browser only).

**Styling**: all colours, fonts and spacing live in `src/styles/variables.css`. Change `--navy` and `--gold` to re-theme the whole app.

---

## Known Issues and Next Steps

1. **Cart and orders fail until this is fixed.** In `services/cart.service.js` and `services/order.service.js` the line `const Product = require("../models/product.model");` is commented out, which causes a `Product is not defined` error. Remove the `//` in both files.
2. **Admin routes cannot be used.** In `models/user.model.js` the role enum is `["customer"]`. Add `"admin"` to the list, then promote a user in MongoDB (`db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })`).
3. **Frontend package name.** `Front-end/package.json` is still named `college-portal`; rename it to `myshop-frontend`.
4. **Hard-coded URLs.** The API URL (`src/services/api.js`) and the CORS origin (`app.js`) are set to localhost. Move them to environment variables before deploying.
5. **Placeholders.** Ratings and MRP prices are generated in `src/utils/format.js`; the wishlist is stored only in the browser; footer links, the newsletter form and "Save for later" do not do anything yet.
6. **Secrets.** Rotate any credentials that were ever shared (database password, JWT secret, email app password).

Ideas for later: online payments, an admin dashboard, product reviews, image uploads, automated tests and deployment.
