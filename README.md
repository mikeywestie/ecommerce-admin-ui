# 🖥️ Ecommerce Admin UI

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![JWT](https://img.shields.io/badge/Auth-JWT-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Grafana](https://img.shields.io/badge/Grafana-Monitoring-orange)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-red)

Enterprise-grade admin dashboard for the Ecommerce Platform ecosystem.

This frontend provides operational visibility and management capabilities for the Spring Boot backend, simulating a real-world operations portal used by support, engineering, and business teams.

Backend Repository:  
➡️ https://github.com/mikeywestie/ecommerce-api

---

## 🎯 Project Purpose

This project demonstrates:

- Secure JWT-based authentication
- Protected React routing
- Axios interceptors for token injection
- Operational dashboards and KPI visualizations
- Order, payment, and inventory management
- System health monitoring via Spring Boot Actuator
- Integration with Prometheus and Grafana
- Production-quality UI architecture

---

## 🚀 Current Release

**Latest Stable Release:** `v1.1.0 Observability Integration ✅`

**Next Major Release:** `v1.2.0 Deployment & CI/CD`

---

## 🗂️ Release Milestones

The frontend was built iteratively, beginning with static mock data and evolving into a fully integrated operations dashboard.

### Architectural Trade-Offs and Decisions

- **Static mock data first** to accelerate UI development before backend APIs were finalized.
- **LocalStorage for JWT tokens** for simplicity and transparency in a portfolio project.
- **Global Axios interceptor** to centralize authentication handling.
- **ProtectedRoute component** to keep authorization logic reusable and isolated.
- **Fixed sidebar layout** to emulate enterprise dashboard UX.
- **Client-side search, sorting, and pagination** for current dataset sizes, with a future option to move to server-side pagination.
- **Tailwind CSS** chosen for rapid iteration and maintainable styling.

---

### v1.0.0 Admin Dashboard Foundation ✅

#### Authentication
- Login page
- JWT token storage
- Protected routes
- Logout functionality
- Automatic redirect to login when unauthenticated

#### Dashboard
- KPI widgets
- Revenue metrics
- Bar charts using Recharts

#### Operations Pages
- Orders
- Payments
- Inventory
- System Health

#### User Experience
- Fixed sidebar
- Responsive layout
- Loading skeletons
- Error handling
- Status badges

**Why this milestone matters**  
Established a secure and scalable UI foundation before adding infrastructure integrations.

---

### v1.1.0 Observability Integration ✅

#### Monitoring Stack
- Prometheus metrics scraping
- Grafana dashboards
- System Health page integration

#### Operational Visibility
- Application health
- Database status
- Disk space usage
- JVM metrics
- HTTP request metrics

**Why this milestone matters**  
Introduced production-style observability, enabling real-time operational monitoring.

---

### v1.2.0 Deployment & CI/CD 🚀

Planned:
- Dockerized frontend
- Nginx production configuration
- GitHub Actions build pipeline

---

## 🛣️ Roadmap

### v1.2 Deployment & CI/CD
- Docker image
- Nginx
- GitHub Actions pipeline

### v1.3 Monitoring Enhancements
- Embedded Grafana links
- Prometheus widgets
- Kafka monitoring indicators

### v2.0 Enterprise Enhancements
- WebSocket real-time updates
- Role-based menu rendering
- Theme switching
- Notification center

---

## ✨ Features

### 🔐 Security
- JWT Authentication
- Protected Routes
- Axios Interceptors
- Logout

### 📊 Dashboard
- Orders summary
- Revenue metrics
- Inventory alerts
- Charts

### 🛒 Orders
- Search
- Sorting
- Pagination
- Expandable order items
- Status badges

### 💳 Payments
- Payment method visibility
- Payment status tracking
- Payment timestamps

### 📦 Inventory
- Product visibility
- Quantity available
- Low stock indicators

### ❤️ System Health
- Application status
- Database status
- Disk space
- Readiness and liveness probes

---

## 🏗️ Architecture

```text
React Admin UI
      │
      ▼
Spring Boot REST API
      │
 ┌────┼────────────┐
 ▼    ▼            ▼
JWT PostgreSQL   Kafka
      │
      ▼
Spring Actuator
      │
      ▼
Prometheus
      │
      ▼
Grafana