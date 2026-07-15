# Frontend Progress

## Completed

- React + Vite setup
- Material UI
- Routing
- Sidebar
- Navbar
- Dashboard Foundation
- Theme
- Feature-based Architecture
- Reusable Components
- Mock API Structure
- Initial Feature Pages
- Build Verified

## Current Folder Structure

- **`src/assets/`**: Contains static assets like images, fonts, and global CSS files.
- **`src/components/`**: Houses reusable global UI components (e.g., `MetricCard`, `StatusChip`) that are shared across multiple features.
- **`src/contexts/`**: Contains React Context providers (`ThemeContext`, `SidebarContext`) used for global state management.
- **`src/features/`**: The core of the application. Organized by domain (Dashboard, Topology, Simulation, etc.) where each folder contains its own components, hooks, and views.
- **`src/hooks/`**: Custom React hooks (like `useApi`) that encapsulate reusable logic.
- **`src/layouts/`**: Structural layout components (`AppLayout`, `Navbar`, `Sidebar`) that wrap the main application content.
- **`src/pages/`**: Top-level page components, such as `NotFound`, that do not belong to a specific feature domain.
- **`src/routes/`**: Centralized application routing configuration for mapping URLs to components.
- **`src/services/`**: API integration layers and mock data services that abstract away data fetching logic.
- **`src/theme/`**: Material UI theme configuration, including custom color palettes and design tokens.
- **`src/utils/`**: Helper functions, formatters, and global constants used throughout the app.

## Tech Stack

- **React**: Chosen for its robust component-based architecture and widespread ecosystem.
- **Vite**: Used for its incredibly fast development server and optimized build processes compared to older bundlers.
- **Material UI**: Selected to rapidly build a professional, accessible, and responsive user interface using a proven design system.
- **React Router DOM**: The standard for handling client-side routing in React applications.
- **Axios**: Preferred over the native fetch API for its automatic JSON transformation, interceptors, and error handling capabilities.
- **Recharts**: Chosen for creating composable, responsive, and easy-to-implement charts for dashboard metrics.
- **React Flow**: The ideal library for building highly interactive and customizable node-based graphs (essential for the Topology feature).
- **Framer Motion**: Used to add fluid, production-ready micro-animations that enhance the user experience without sacrificing performance.
- **React Icons**: A convenient library to pull in high-quality SVG icons from various popular icon sets.

## Current Architecture

The frontend follows a **Feature-based Architecture**. Instead of grouping files by type (e.g., all components in one folder, all hooks in another), the codebase is organized by feature domain (e.g., `dashboard`, `cost`, `topology`). Each feature folder acts as an independent module containing its own specific components, logic, and views. This approach improves maintainability, prevents the codebase from becoming an unmanageable monolith, and allows developers to work on isolated features without causing merge conflicts. Global state is managed lightly via the Context API, while data fetching is encapsulated within custom hooks and a centralized API service layer.

## Remaining Work

- **Infrastructure Topology**: Completing the interactive graph visualization using React Flow.
- **Simulation**: Finalizing the "what-if" scenario runner and deployment simulator logic.
- **Prediction**: Implementing AI-driven forecasting visualizations.
- **Risk**: Completing the risk assessment and vulnerability scoring views.
- **Cost**: Finalizing cloud expense breakdowns and optimization tables.
- **History**: Completing the chronological audit log and event timeline.
- **Backend API Integration**: Replacing the mock API layer with real Spring Boot backend endpoints.
- **Testing**: Implementing unit and integration tests for critical components.

## Git Workflow

Teammates must create branches for any new work.

### Example
```bash
git checkout -b feature/topology
git checkout -b feature/simulation
git checkout -b feature/dashboard
```

### Rules
- **Never commit directly to main.**
- Always create Pull Requests.
- Always run `npm run build` before pushing to ensure the build remains clean.
