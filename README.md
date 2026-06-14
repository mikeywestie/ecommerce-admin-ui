# 🖥️ Ecommerce Platform UI

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![JWT](https://img.shields.io/badge/Auth-JWT-green)
![GitHub Pages](https://img.shields.io/badge/Hosted-GitHub_Pages-success)
![Build Tracking](https://img.shields.io/badge/Build-Metadata-orange)
![GitHub Issues](https://img.shields.io/badge/Bug_Reporting-GitHub_Issues-black)

Production-style React and TypeScript frontend for a full-stack e-commerce platform.

This application includes both an **Admin Portal** and a **Customer Storefront**, integrated with a deployed Spring Boot backend. It demonstrates secure authentication, role-based routing, product browsing, cart checkout, order history, operational dashboards, build/version tracking, and GitHub-based bug reporting.

---

## 🚀 Live Demo

| Resource             | URL                                               |
| -------------------- | ------------------------------------------------- |
| Frontend Application | https://mikeywestie.github.io/ecommerce-admin-ui/ |
| Backend API          | https://ecommerce-api-xrkk.onrender.com           |
| Backend Repository   | https://github.com/mikeywestie/ecommerce-api      |

---

## 📦 Current Release

| Component   | Version  |
| ----------- | -------- |
| Frontend UI | `v1.3.0` |
| Backend API | `v1.8.0` |

---

## 🎯 Project Purpose

This project was built to showcase full-stack application development from the frontend perspective.

It demonstrates:

- React application architecture
- TypeScript development
- Secure JWT authentication
- Role-based protected routing
- REST API integration with Axios
- Admin and customer experiences in one application
- Shopping cart and checkout flows
- Payment success and payment failure simulation
- Operational dashboards and monitoring views
- Frontend/backend build metadata visibility
- In-app GitHub bug reporting
- GitHub Pages deployment

---

## 🧰 Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide Icons
- html2canvas

### Backend Integration

- Spring Boot REST API
- JWT Authentication
- PostgreSQL-backed commerce data
- Spring Actuator health endpoint
- GitHub Issues API integration

---

## 🔐 Authentication and Roles

The application supports separate experiences for admin and customer users.

### Admin Portal

Admins can access:

- Dashboard
- Orders
- Payments
- Inventory
- Coupons
- System Health
- Storefront preview

### Customer Storefront

Customers can access:

- Products
- Product Details
- Cart
- Checkout
- Order History
- Bug Reporting

Authentication is handled using:

- JWT token storage
- Axios request interceptors
- Protected routes
- Role-aware navigation
- Role-based redirects

---

## 📸 Application Screenshots

### Login

The login page includes demo account selection, live API health visibility, and credentials for the admin/customer walkthrough.

![Login](docs/screenshots/01-login.png)

---

### Customer Product Catalog

Customers can browse products, filter the catalog, view pricing, and add items to the cart.

![Customer Products](docs/screenshots/02-customer-products.png)

---

### Product Details

The product details screen includes product image, price, live stock check, quantity selection, and cart actions.

![Product Details](docs/screenshots/03-product-details.png)

---

### Shopping Cart

The cart page allows customers to review selected products, update quantities, refresh stock, remove items, and continue to checkout.

![Shopping Cart](docs/screenshots/04-shopping-cart.png)

---

### Checkout With Coupon

Checkout supports coupon application and recalculates totals before placing a demo order.

![Checkout With Coupon](docs/screenshots/05-checkout-with-coupon.png)

---

### Successful Payment Flow

A successful payment simulation creates a paid order and updates the checkout result page.

![Successful Payment](docs/screenshots/06-payment-success.png)

---

### Failed Payment Simulation

The checkout screen can simulate a failed payment outcome to test failed payment handling.

![Failed Payment Checkout](docs/screenshots/07-checkout-payment-failed.png)

---

### Payment Failed Result

Failed payment orders are clearly marked as `PAYMENT_FAILED`.

![Payment Failed](docs/screenshots/08-payment-failed.png)

---

### Customer Order History

Customers can only view their own orders. The order history screen includes order status, totals, expandable line items, and cancel/refund actions for paid orders.

![Customer Order History](docs/screenshots/09-customer-order-history-expanded.png)

---

### Admin Dashboard

The admin dashboard displays operational metrics including total orders, paid orders, pending orders, inventory alerts, revenue, and order status charts.

![Admin Dashboard](docs/screenshots/10-admin-dashboard.png)

---

### Admin Orders

Admins can review customer orders, search/filter orders, view statuses, and inspect order line items.

![Admin Orders](docs/screenshots/11-admin-orders.png)

---

### Payments Monitoring

The payments page provides visibility into payment records, methods, amounts, statuses, and timestamps.

![Payments](docs/screenshots/12-payments.png)

---

### Inventory Management

Admins can manage product stock, search/filter inventory, identify low stock products, and update stock levels.

![Inventory](docs/screenshots/13-inventory.png)

---

### Add Product

Admins can create products from the UI with category, price, stock quantity, image URL, and active product status.

![Add Product](docs/screenshots/14-add-product-modal.png)

---

### Edit Product

Admins can edit product information and preview image URLs.

![Edit Product](docs/screenshots/15-edit-product-modal.png)

---

### Stock Update

Admins can quickly update stock quantities from the inventory screen.

![Stock Update](docs/screenshots/16-stock-update-dialog.png)

---

### Coupon Management

Admins can create and monitor coupons, usage limits, active coupons, redemptions, and discount values.

![Coupons](docs/screenshots/17-coupons.png)

---

### System Health and Build Information

The system health page shows frontend and backend build information, commit hashes, build timestamps, and production health visibility.

![System Health](docs/screenshots/18-system-health-build-info.png)

---

### In-App Bug Reporting

Users can submit a bug report directly from the UI. The report includes message, reproduction steps, route, user role, build versions, commit hashes, and optional screenshot context.

![Bug Report Dialog](docs/screenshots/19-bug-report-dialog.png)

---

### Generated GitHub Issue

Submitted bug reports automatically create GitHub issues with labels and structured context.

![Generated GitHub Issue](docs/screenshots/20-github-issue-created.png)

---

## 🛒 Customer Workflow

```text
Customer signs in
      ↓
Browses products
      ↓
Views product details
      ↓
Adds item to cart
      ↓
Reviews cart
      ↓
Applies optional coupon
      ↓
Chooses payment simulation outcome
      ↓
Places demo order
      ↓
Views success or failed payment result
      ↓
Reviews customer order history
```

---

## 📊 Admin Workflow

```text
Admin signs in
      ↓
Reviews dashboard metrics
      ↓
Monitors orders
      ↓
Reviews payments
      ↓
Manages inventory
      ↓
Creates and monitors coupons
      ↓
Checks system health and build versions
      ↓
Reports bugs directly to GitHub if needed
```

---

## 🔨 Build Metadata

The application displays frontend and backend build metadata inside the UI.

Tracked values include:

- Frontend version
- Frontend commit hash
- Frontend build time
- Backend version
- Backend commit hash
- Backend build time
- Backend environment

This makes it easier to verify exactly which release is deployed during demos, bug reports, and testing.

---

## 🐞 GitHub Bug Reporting

The frontend includes a built-in bug reporting workflow.

Bug reports include:

- User-entered bug description
- Steps to reproduce
- Current route
- User email
- User role
- Frontend version
- Frontend commit
- Frontend build time
- Backend version
- Backend commit
- Backend build time
- Browser information
- Viewport size
- Optional screenshot capture

The backend securely creates a GitHub issue using a server-side token, keeping secrets out of the frontend.

---

## 🏗 Architecture

```text
React + TypeScript + Vite
          │
          ▼
React Router Protected Routes
          │
          ▼
Axios API Client
          │
          ▼
Spring Boot REST API
          │
 ┌────────┼────────┬───────────┐
 ▼        ▼        ▼           ▼
JWT   Products   Orders     Payments
          │
          ▼
PostgreSQL + Flyway
          │
          ▼
Actuator Health + Build Info
          │
          ▼
GitHub Issue Reporting
```

---

## 🚀 Deployment

The frontend is deployed using GitHub Pages.

Typical deployment command:

```bash
npm run deploy
```

The app is configured with:

- GitHub Pages base path
- Production API URL
- Generated frontend build metadata
- SPA fallback support

---

## 🧪 Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Deploy:

```bash
npm run deploy
```

---

## 🗂 Release History

### v1.0.0

- Login page
- Protected routes
- Admin dashboard
- Orders page
- Payments page
- Inventory page
- System health page

---

### v1.1.0

- Improved monitoring visibility
- Dashboard improvements
- Health integration
- Operational UI refinements

---

### v1.2.0

- Customer storefront
- Product catalog
- Product details
- Cart
- Checkout
- Customer order history
- Build metadata display
- Bug report dialog

---

### v1.3.0

- GitHub issue creation from in-app bug reports
- Frontend/backend build version visibility
- Payment success and failure walkthroughs
- Coupon checkout flow
- Customer-only order history
- Admin product creation and editing screens
- Inventory stock update workflow
- Updated README and screenshots

---

## 🛣 Roadmap

### v1.4

- Product image upload flow
- Improved admin product media handling
- Enhanced search and filtering
- Sales analytics and reporting widgets

### v2.0

- Microservice-aware frontend views
- Real payment provider integration
- Distributed tracing visibility
- Advanced admin reporting
- Customer account management

---

## 💼 Portfolio Value

This project demonstrates frontend and full-stack engineering capability through a real product-style workflow.

It shows:

- React and TypeScript application design
- Secure authentication flows
- Role-based routing
- API integration with a Spring Boot backend
- Customer-facing commerce workflows
- Admin operational tooling
- Build/version traceability
- Production deployment
- GitHub-based bug reporting
- Practical product thinking

This is the frontend companion to the Spring Boot Ecommerce API and is designed to be reviewed as part of a full-stack portfolio.

---

## 👨‍💻 Author

**Michael Westman**

Full Stack Software Developer

- Java
- Spring Boot
- React
- TypeScript
- PostgreSQL
- Docker
- REST APIs
- Full-Stack Web Applications

GitHub: https://github.com/mikeywestie

Portfolio: https://mikeywestie.github.io
