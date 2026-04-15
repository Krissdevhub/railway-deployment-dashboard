# 🚀 Railway Deployment Dashboard

A production-grade, full-stack deployment dashboard inspired by Railway’s internal tooling.

👉 **Live Demo**: https://railway-deployment-dashboard-production.up.railway.app
👉 **GitHub**: https://github.com/Krissdevhub/railway-deployment-dashboard

---

## 💡 Why I Built This

Railway’s engineering culture focuses on **shipping real systems**, not solving isolated problems.

To align with that philosophy, I built a complete deployment dashboard that simulates how modern infrastructure platforms abstract complexity for developers.

This project focuses on:

* Translating complex deployment workflows into intuitive UI
* Handling asynchronous state transitions reliably
* Providing real-time system feedback via logs and status updates
* Designing a developer-first product experience

---

## ⚙️ Key Features

### 🧩 Service Management

* Navigate between services with real-time status indicators
* Consistent state across the entire UI

### 🔄 Deployment Lifecycle Simulation

* Full lifecycle tracking:
  `Building → Deploying → Success / Failed`
* Instant UI feedback + background state sync

### 🖥️ Live Logs Viewer

* Terminal-style interface
* Auto-scroll + pause/resume
* Severity highlighting (INFO / WARN / ERROR)

### 🎛️ Deployment Controls

* Deploy, stop, restart services
* Immediate UI response with async state handling

### 🧠 State Synchronization

* Unified state across:

  * Sidebar
  * Header
  * Logs
* Prevents UI inconsistency

### 🗺️ Infrastructure Visualization

* Visual mapping of services:

  * Web
  * Database
  * Cache
  * Workers

### 🔐 Environment Variables

* Secure key-value management
* Masking + controlled reveal/edit

### 🧪 Demo Mode + Live Mode

* Works without API key (mock data)
* Can connect to Railway GraphQL API

---

## 🏗️ Architecture & Technical Decisions

### Frontend

* React + TypeScript for scalability and maintainability
* Vite for fast builds and dev experience

### State Management

* Zustand → lightweight global UI state
* TanStack Query → server state, caching, polling

### API Layer

* GraphQL (Railway API v2)
* Clean abstraction layer
* Easy switching between mock and live data

### Async Workflow Handling

* Mutations trigger deployments
* UI reflects optimistic updates
* Background polling syncs real state
* Logs update periodically for real-time feel

### UI/UX Principles

* Developer-first interface (Railway/Vercel inspired)
* Dark theme for readability
* Clear system feedback (loading, success, error)
* Simplicity over visual clutter

---

## 🧰 Tech Stack

* **Frontend**: React 18, TypeScript, Vite
* **State**: Zustand, TanStack Query
* **API**: GraphQL (Railway Public API v2)
* **Styling**: Vanilla CSS (custom system)
* **Icons**: Lucide React
* **Fonts**: Inter, JetBrains Mono

---

## 🚀 Getting Started

### Install

```bash
npm install
```

### Run (Dev)

```bash
npm run dev
```

### Build

```bash
npm run build
```

---

## 🔑 Environment Setup (Optional)

```env
VITE_RAILWAY_TOKEN=your_token_here
```

👉 Without token → runs in **Demo Mode**

---

## 🚀 Deployment (Railway)

```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

---

## 🔮 Future Improvements

* WebSocket-based real-time logs
* Multi-region deployment view
* CI/CD pipeline integration
* Role-based access control
* Observability (metrics + traces)

---

## 📄 License

MIT
