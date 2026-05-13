# 🖥️ Ecommerce Admin UI

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![JWT](https://img.shields.io/badge/Auth-JWT-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![Grafana](https://img.shields.io/badge/Grafana-Monitoring-orange)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-red)

## 📸 Application Screenshots

### 🔐 Login Screen
![Login Screen](docs/screenshots/01-login.png)

### 📊 Admin Dashboard
![Admin Dashboard](docs/screenshots/02-admin-dashboard.png)

### 🛒 Orders Management
![Orders Management](docs/screenshots/03-orders.png)

### 💳 Payments Monitoring
![Payments Monitoring](docs/screenshots/04-payments.png)

### 📦 Inventory Management
![Inventory Management](docs/screenshots/05-inventory.png)

### ❤️ System Health Monitoring
![System Health Monitoring](docs/screenshots/06-system-health.png)

Enterprise-grade React admin dashboard for the Ecommerce Platform ecosystem.

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
- Prometheus and Grafana integration
- Production-quality UI architecture

---

## 🚀 Current Release

**Latest Stable Release:** `v1.1.0 Observability Integration ✅`  
**Next Major Release:** `v1.2.0 Deployment & CI/CD 🚀`

---

## 🗂️ Release Milestones

The frontend was built iteratively, beginning with static mock data and evolving into a fully integrated operations dashboard.

### v1.0.0 Admin Dashboard Foundation ✅
- Login page
- JWT token storage
- Protected routes
- KPI widgets and charts
- Orders, Payments, Inventory, and System Health pages
- Responsive layout and sidebar navigation

### v1.1.0 Observability Integration ✅
- Prometheus metrics visibility
- Grafana dashboard integration
- Application health indicators

### v1.2.0 Deployment & CI/CD 🚀
Planned:
- Dockerized frontend
- Nginx production configuration
- GitHub Actions pipeline

---

## 🏗️ Architecture

```text
React + TypeScript + Vite
           │
           ▼
      Axios API Client
           │
           ▼
Spring Boot REST API
           │
 ┌─────────┼─────────┐
 ▼         ▼         ▼
JWT   PostgreSQL   Kafka
           │
           ▼
Spring Actuator
           │
           ▼
Prometheus
           │
           ▼
Grafana
```

---

## 💼 Portfolio Value

This project demonstrates that I can build polished, production-style frontend applications that integrate securely with enterprise backend services and expose meaningful operational insights.
