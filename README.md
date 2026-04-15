# Railway Deployment Dashboard

A production-grade, full-stack deployment dashboard inspired by Railway’s internal tooling. This project simulates a real-world developer platform for managing services, triggering deployments, and monitoring system behavior through a clean, developer-focused interface.

---

## Why I Built This

Railway’s hiring process emphasizes building real systems rather than solving isolated problems.
To align with that, I built a complete deployment dashboard that reflects how modern infrastructure tools abstract complexity for developers.

The goal was to:

* Simplify complex deployment workflows into intuitive UI interactions
* Handle asynchronous deployment states reliably
* Provide real-time feedback through logs and status updates
* Design a system that feels like an actual production tool

---

## Key Features

* **Service Management**
  Browse and switch between services across projects with real-time status indicators.

* **Deployment Lifecycle Simulation**
  Trigger deployments and observe full lifecycle transitions:
  `Building → Deploying → Success / Failed`

* **Live Logs Viewer**
  Terminal-style log streaming with:

  * Auto-scroll
  * Pause/resume
  * Severity highlighting (INFO, WARN, ERROR)

* **Deployment Controls**
  Deploy, stop, and restart services with immediate UI feedback and state synchronization.

* **State Synchronization Across UI**
  Deployment state is reflected consistently across:

  * Sidebar indicators
  * Header badges
  * Logs

* **Infrastructure Visualization**
  Visual representation of services (web, database, cache, workers)

* **Environment Variables Management**
  Secure key-value handling with masking and editing support

* **Demo Mode + Live Mode**

  * Works without API key using realistic mock data
  * Can connect to Railway GraphQL API for real data

---

## Architecture & Technical Decisions

### Frontend

* **React + TypeScript** for type safety and maintainability
* **Vite** for fast builds and development

### State Management

* **Zustand** → lightweight global UI state
* **TanStack Query** → server state, caching, polling, async flows

### API Layer

* **GraphQL (Railway API v2)** via a dedicated service layer
* Clean abstraction for queries and mutations
* Easy switch between mock and live API

### Async Workflow Handling

* Deploy actions trigger mutations
* UI immediately reflects loading state
* Background polling updates deployment status
* Logs refresh every few seconds for real-time feel

### UI/UX Design Principles

* Developer-first interface (inspired by Railway/Vercel)
* Dark theme for readability
* Clear feedback for every action (loading, success, error)
* Simplicity over visual complexity

---

## Tech Stack

* **Frontend**: React 18, TypeScript, Vite
* **State**: Zustand, TanStack Query
* **Styling**: Vanilla CSS (custom design system)
* **API**: GraphQL (Railway Public API v2)
* **Icons**: Lucide React
* **Fonts**: Inter, JetBrains Mono

---

## Getting Started

### Prerequisites

* Node.js (v18+)

### Installation

```bash
npm install
```

### Environment Setup (Optional)

```env
VITE_RAILWAY_TOKEN=your_token_here
```

If no token is provided, the app runs in **Demo Mode**.

---

## Development

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Deployment

Deploy directly to Railway:

```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

---

## Future Improvements

* WebSocket-based real-time logs (instead of polling)
* Multi-region deployment visualization
* CI/CD pipeline integration
* Role-based access control
* Advanced observability (metrics, traces)

---

## License

MIT
