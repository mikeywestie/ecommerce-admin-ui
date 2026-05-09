# 🛒 Ecommerce Admin UI

Enterprise-grade admin dashboard for the Ecommerce Platform ecosystem.

This application provides operational visibility and management capabilities for the Spring Boot–based ecommerce backend platform.

The UI simulates a real-world enterprise operations portal with analytics, monitoring, authentication, order management, payment visibility, inventory tracking, and system health monitoring.

---

# 🚀 Features

## 🔐 Authentication & Security

- JWT-based authentication
- Protected React routes
- Automatic token injection using Axios interceptors
- Logout functionality
- Role-based authorization support (`ADMIN`, `CUSTOMER`)

## 📊 Dashboard Analytics

- Total Orders
- Paid Orders
- Pending Orders
- Cancelled Orders
- Revenue Summary
- Inventory Alerts
- Order Status Chart

## 🛒 Orders Management

- View all orders
- Search orders
- Sorting
- Pagination
- Expandable order items
- Status badges

## 💳 Payments Management

- View payment transactions
- Payment method
- Payment status
- Payment timestamps

## 📦 Inventory Management

- Product pricing
- Quantity available
- Low stock indicators
- Stock status badges

## ❤️ System Health Monitoring

- Application status
- Database status
- Disk space status
- Readiness state
- Liveness state
- Health groups

---

# 🧰 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts
- Lucide React

---

# 🏗️ Related Projects

## Backend API

- `ecommerce-api`

## Supporting Infrastructure

- PostgreSQL
- Apache Kafka
- Docker Compose
- Spring Boot Actuator
- Swagger/OpenAPI

---

# 📁 Project Structure

```text
ecommerce-admin-ui
│
├── src
│   ├── components
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── StatCard.tsx
│   │
│   ├── layouts
│   │   └── MainLayout.tsx
│   │
│   ├── pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Orders.tsx
│   │   ├── Payments.tsx
│   │   ├── Inventory.tsx
│   │   └── SystemHealth.tsx
│   │
│   ├── services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── dashboardService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   ├── inventoryService.ts
│   │   └── systemHealthService.ts
│   │
│   ├── types
│   │   ├── Auth.ts
│   │   ├── DashboardSummary.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   ├── Inventory.ts
│   │   └── HealthStatus.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── README.md