# 🖥️ Ecommerce Admin UI

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![JWT](https://img.shields.io/badge/Auth-JWT-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)

Enterprise-grade admin dashboard for the Ecommerce Platform ecosystem.

This frontend provides operational visibility and management capabilities for the Spring Boot backend.

Backend Repository:
➡️ https://github.com/mikeywestie/ecommerce-api

---

## 🎯 Project Purpose

This project demonstrates:

- Secure authentication flows
- Protected React routing
- API integration with JWT
- Operational dashboards
- Analytics visualization
- Monitoring and observability
- Production-quality UI architecture

---

## 🚀 Current Release

**Latest Stable Release:** `v1.0.0 Admin Dashboard Foundation ✅`

**Next Major Release:** `v1.1.0 Observability & Monitoring`

---

## 🗂️ Release Milestones

### v1.0.0 Admin Dashboard Foundation ✅

#### Authentication
- Login page
- JWT storage
- Axios interceptor
- Protected routes
- Logout

#### Dashboard
- KPI widgets
- Revenue metrics
- Charts

#### Operations Pages
- Orders
- Payments
- Inventory
- System Health

#### UX
- Fixed sidebar
- Loading states
- Error handling
- Status badges

**Why this milestone matters**  
Demonstrates enterprise frontend architecture and secure integration with a protected backend.

---

### v1.1.0 Observability & Monitoring 🚀

Planned:
- Prometheus dashboards
- Grafana dashboards
- Kafka monitoring

---

## 🛣️ Roadmap

### v1.1 Monitoring
- Prometheus
- Grafana
- Metrics widgets

### v1.2 Deployment
- Docker image
- Nginx

### v1.3 DevOps
- GitHub Actions CI/CD

### v2.0 Enterprise Enhancements
- WebSocket updates
- Role-based menus
- Theme switching

---

## ✨ Features

### Security
- JWT Authentication
- Protected Routes
- Logout

### Dashboard
- Orders summary
- Revenue
- Inventory alerts
- Charts

### Orders
- Search
- Sorting
- Pagination
- Expandable order items

### Payments
- Payment status and timestamps

### Inventory
- Low stock alerts

### System Health
- Spring Boot Actuator integration

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
````

---

## 🧰 Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router
* Recharts
* Lucide React

---

## 📁 Project Structure

```text
src
├── components
├── layouts
├── pages
├── services
├── types
├── App.tsx
└── main.tsx
```

---

## 🌐 Pages

| Page          | Description          |
| ------------- | -------------------- |
| Login         | Authentication       |
| Dashboard     | KPIs and charts      |
| Orders        | Order management     |
| Payments      | Payment monitoring   |
| Inventory     | Stock visibility     |
| System Health | Actuator integration |

---

## 🔗 Backend Endpoints Used

| Endpoint                     | Purpose   |
| ---------------------------- | --------- |
| `POST /api/auth/login`       | Login     |
| `GET /api/dashboard/summary` | KPIs      |
| `GET /api/orders`            | Orders    |
| `GET /api/payments`          | Payments  |
| `GET /api/inventory`         | Inventory |
| `GET /actuator/health`       | Health    |

---

## 🔑 Demo Credentials

```text
Email: admin2@ecommerce.local
Password: Admin@12345
```

---

## ▶️ Running the Application

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Open Browser

```text
http://localhost:5173
```

---

## 🐞 Debugging Tips

### Clear Authentication

Delete the following keys from Local Storage:

* token
* email
* role

### Useful Commands

```bash
npm run dev
```

```bash
npm run build
```

---

## 📚 Helpful Resources

* React: [https://react.dev/](https://react.dev/)
* TypeScript: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
* Vite: [https://vite.dev/](https://vite.dev/)
* Tailwind CSS: [https://tailwindcss.com/](https://tailwindcss.com/)
* Recharts: [https://recharts.org/](https://recharts.org/)

---

## 👨‍💻 Author

**Michael Westman**

* GitHub: [https://github.com/mikeywestie](https://github.com/mikeywestie)
* LinkedIn: [https://www.linkedin.com/in/michael-westman-219178188/](https://www.linkedin.com/in/michael-westman-219178188/)

---

## ⭐ Support

If you found this project useful, please consider starring both repositories.