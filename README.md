# Ecommerce Backend API (NestJS + MongoDB + Redis + GraphQL + Stripe)

A clean, modular, and easy-to-understand e-commerce backend built with NestJS, Mongoose, Redis, GraphQL, and Stripe following the course structure.

---

## 📁 Folder Structure

```text
ecommerce-C46/
├── dist/
├── node_modules/
├── src/
│   ├── common/
│   │   ├── guard/
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interface/
│   │   │   ├── brand.interface.ts
│   │   │   ├── cart.interface.ts
│   │   │   ├── category.interface.ts
│   │   │   ├── coupon.interface.ts
│   │   │   ├── order.interface.ts
│   │   │   ├── product.interface.ts
│   │   │   └── user.interface.ts
│   │   ├── pipe/
│   │   │   └── parse-mongo-id.pipe.ts
│   │   └── services/
│   │       ├── redis.service.ts
│   │       ├── send-email.service.ts
│   │       ├── stripe.service.ts
│   │       └── token.service.ts
│   ├── config/
│   │   └── env.config.ts
│   ├── database/
│   │   ├── model/
│   │   │   ├── brand.model.ts
│   │   │   ├── cart.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── coupon.model.ts
│   │   │   ├── order.model.ts
│   │   │   ├── product.model.ts
│   │   │   └── user.model.ts
│   │   └── repository/
│   │       ├── brand.repository.ts
│   │       ├── cart.repository.ts
│   │       ├── category.repository.ts
│   │       ├── coupon.repository.ts
│   │       ├── order.repository.ts
│   │       ├── product.repository.ts
│   │       └── user.repository.ts
│   ├── logging/
│   │   └── logger.middleware.ts
│   ├── module/
│   │   ├── auth/
│   │   ├── brand/
│   │   ├── category/
│   │   ├── product/      # GraphQL + REST
│   │   ├── cart/
│   │   ├── coupon/
│   │   ├── order/        # GraphQL + REST + Stripe Payment
│   │   └── user/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── uploads/
├── .env.dev
├── .env.prod
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or on MongoDB Atlas
- Redis running locally (default port: 6379)

### 2. Environment Configuration
The project supports `.env.dev` and `.env.prod`.

Example `.env.dev`:
```env
PORT=3000
NODE_ENV=dev
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-c46-dev
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
JWT_ACCESS_SECRET=mySuperSecretAccessKey123
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_SECRET=mySuperSecretRefreshKey456
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_SUCCESS_URL=http://localhost:3000/orders/success
STRIPE_CANCEL_URL=http://localhost:3000/orders/cancel
```

### 3. Run the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## 📡 API Endpoints & GraphQL

### 🔮 GraphQL Endpoint (`/graphql`)
- **Products (`ProductResolver`)**
  - Queries: `products`, `product(id: ID!)`
  - Mutations: `createProduct(createProductInput)`, `updateProduct(id, updateProductInput)`, `removeProduct(id)`
- **Orders & Stripe Payment (`OrderResolver`)**
  - Queries: `myOrders`, `allOrders`, `order(id: ID!)`
  - Mutations: `createOrder(createOrderInput)`, `createCheckoutSession(orderId: ID!)`, `cancelOrder(orderId: ID!)`

### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register new user & generate OTP (sent via email + saved in Redis) |
| `POST` | `/auth/confirm-otp` | Verify OTP from Redis, activate user, returns Access & Refresh Tokens |
| `POST` | `/auth/resend-otp` | Generate new OTP and resend |
| `POST` | `/auth/signin` | Sign in with email & password, returns Access & Refresh Tokens |
| `POST` | `/auth/refresh-token` | Generate fresh Access Token using Refresh Token |
| `POST` | `/auth/forget-password` | Send password reset OTP to email |
| `POST` | `/auth/reset-password` | Verify OTP and set new password |

### 🏷️ Brands (`/brands`) & Categories (`/categories`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/brands` / `/categories` | ✅ Yes | Create brand / category |
| `GET` | `/brands` / `/categories` | ❌ No | Get all active brands / categories |
| `GET` | `/brands/:id` / `/categories/:id` | ❌ No | Get single item by ObjectId |
| `PUT` | `/brands/:id` / `/categories/:id` | ✅ Yes | Update details |
| `DELETE` | `/brands/:id` / `/categories/:id` | ✅ Yes | Soft-delete item |

### 📦 Products (`/products` & `/graphql`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/products` | ✅ Yes | Create product (calculates discount & finalPrice) |
| `GET` | `/products` | ❌ No | Get all active products |
| `GET` | `/products/:id` | ❌ No | Get single product |
| `PUT` | `/products/:id` | ✅ Yes | Update product |
| `DELETE` | `/products/:id` | ✅ Yes | Soft-delete product |

### 🛒 Cart (`/cart`) & 🎟️ Coupons (`/coupons`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/cart` | ✅ Yes | Add item to cart |
| `GET` | `/cart` | ✅ Yes | View current user cart |
| `DELETE` | `/cart/clear` | ✅ Yes | Clear cart |
| `DELETE` | `/cart/:productId` | ✅ Yes | Remove item from cart |
| `POST` | `/coupons` | ✅ Yes | Create discount coupon |
| `GET` | `/coupons` | ❌ No | List active coupons |

### 💳 Orders & Stripe Payment (`/orders` & `/graphql`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/orders` | ✅ Yes | Create order from cart (Cash or Card) |
| `POST` | `/orders/:id/checkout` | ✅ Yes | Create Stripe Checkout Session for card payment |
| `POST` | `/orders/webhook` | ❌ No | Stripe Webhook handler (`checkout.session.completed`) |
| `PATCH` | `/orders/:id/cancel` | ✅ Yes | Cancel order (restores stock & refunds Stripe if paid) |
| `GET` | `/orders/my-orders` | ✅ Yes | Get logged-in user orders |
| `GET` | `/orders` | ✅ Yes | Get all orders |

### 👤 Users (`/users`)
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/users/profile` | ✅ Yes | Get logged-in user profile |
| `PUT` | `/users/profile` | ✅ Yes | Update user profile |
| `GET` | `/users` | ✅ Yes (Admin) | List all users |
| `DELETE` | `/users/deactivate` | ✅ Yes | Deactivate user account |
