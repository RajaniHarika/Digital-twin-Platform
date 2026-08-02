# 🚀 DevOps Digital Twin Platform

## 📌 Project Overview

The **DevOps Digital Twin Platform** is a cloud-native platform designed to create a "Digital Twin" (a virtual replica) of a Kubernetes-based infrastructure. 

**Why it exists:** Modern cloud architectures are highly complex, making it difficult to predict the outcomes of deployments, scaling events, or system failures. 
**The real-world problem it solves:** Deploying directly to production carries inherent risks of downtime and runaway costs. This platform allows DevOps engineers to simulate deployments, predict infrastructure behavior, identify risks, and estimate cloud costs *before* deploying changes to production.
**Expected outcome:** Safer deployments, optimized infrastructure spending, proactive risk mitigation, and greater confidence in system resilience.

## ✨ Features

The following frontend features have been fully implemented:

- React + Vite Setup
- Material UI
- Responsive Layout
- Sidebar
- Navbar
- Dashboard
- Theme
- Routing
- Feature-based Architecture
- Reusable Components
- Mock API Layer
- Production Build Verified

## 🛠 Technology Stack

### Frontend
- React
- Vite
- Material UI
- React Router DOM
- Axios
- Recharts
- React Flow
- Framer Motion
- React Icons

### Backend (Upcoming)
- pending

## 📂 Folder Structure

```text
src/
├── assets/         # Static assets like images and global CSS styles
├── components/     # Reusable global UI components (MetricCard, StatusChip, etc.)
├── contexts/       # React Context providers (ThemeContext, SidebarContext)
├── features/       # Feature-based modules encapsulating distinct domains
│   ├── cost/       # Cloud cost breakdown and optimization suggestions
│   ├── dashboard/  # High-level overview and system health metrics
│   ├── history/    # Audit log and chronological timeline of events
│   ├── prediction/ # AI-driven forecasting for resource utilization
│   ├── risk/       # Continuous evaluation of vulnerabilities and compliance
│   ├── simulation/ # Deployment simulation engine for what-if scenarios
│   └── topology/   # Interactive visual mapping of the infrastructure
├── hooks/          # Custom React hooks for data fetching and state management
├── layouts/        # Structural layout components (AppLayout, Navbar, Sidebar)
├── pages/          # Top-level page components (NotFound)
├── routes/         # Centralized application routing configuration
├── services/       # API integration layers and mock data services
├── theme/          # Material UI theme configuration (Light/Dark mode)
└── utils/          # Helper functions, formatters, and global constants
```

## ⚙ Installation

To get started locally, follow these steps:

```bash
git clone https://github.com/pavanpyatla/devops-digital-twin.git
cd devops-digital-twin
npm install
npm run dev
```

## 🏗 Build

To build the project for production:

```bash
npm run build
```

## 📊 Current Progress

| Module | Status |
|--------|--------|
| Project Setup | ✅ Completed |
| Dashboard | ✅ Completed |
| Routing | ✅ Completed |
| Sidebar | ✅ Completed |
| Navbar | ✅ Completed |
| Theme | ✅ Completed |
| Reusable Components | ✅ Completed |
| Topology | 🚧 In Progress |
| Simulation | 🚧 In Progress |
| Prediction | 🚧 In Progress |
| Risk | 🚧 In Progress |
| Cost | 🚧 In Progress |
| History | 🚧 In Progress |
| Backend Integration | 🕒 Upcoming |

## 👥 Team Responsibilities

### Frontend Developer 1 (Pavan)
**Completed:**
- Project Setup
- Dashboard
- Layout
- Routing
- Theme
- Sidebar
- Navbar
- Reusable Components

### Frontend Developer 2
**Responsible for:**
<!-- pending -->

### Backend Developer 1
**Responsible for:**
<!-- pending -->

### Backend Developer 2
**Responsible for:**
<!-- pending -->

## 🌿 Git Workflow

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Create a feature branch before making any changes. Use descriptive naming:
   ```bash
   git checkout -b feature/topology
   ```
4. Run `npm run build` locally before pushing any changes to ensure the build remains clean.
5. **Never commit directly to the `main` branch.**
6. Always open a Pull Request (PR) for review before merging.

## 📸 Screenshots

*(Add screenshots of the Dashboard, Topology map, and Simulation engine here)*

## 🚀 Future Scope

The project will continue to evolve with the following planned enhancements:

- Backend Integration
- Real-time Monitoring
- AI-based Prediction
- Risk Assessment
- Cost Optimization
- Docker
- Kubernetes
- AWS Deployment







## 📌 Current Status

✅ Frontend foundation completed.

🚧 Ready for frontend feature development and backend integration.

📅 Last Updated: 17 July 2026
