# Contributing to DevOps Digital Twin Platform

Welcome! We are excited to have you contribute to the DevOps Digital Twin Platform. To ensure a smooth collaboration process and maintain a high-quality codebase, please adhere to the following guidelines.

## Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pavanpyatla/devops-digital-twin.git
   cd devops-digital-twin
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Branch Naming

All branches must follow a standardized naming convention:
- `feature/<feature-name>` (e.g., `feature/topology-graph`)
- `bugfix/<bug-name>` (e.g., `bugfix/sidebar-overlap`)
- `hotfix/<critical-bug>` (e.g., `hotfix/api-crash`)
- `docs/<documentation-update>` (e.g., `docs/update-readme`)

## Commit Message Format

We follow a structured format for commit messages:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests

**Example:**
`feat: add new network visualization node to topology map`

## Pull Request Process

1. **Ensure your code builds successfully:** Always run `npm run build` before pushing your branch.
2. **Resolve all linter warnings:** Run `npm run lint` and ensure there are 0 warnings/errors.
3. **Open a Pull Request:** Target the `main` branch.
4. **Request Review:** Assign at least one team member to review your code.
5. **Never push directly to `main`.**

## Coding Conventions

- **JavaScript/React:** Follow modern ES6+ syntax. Use functional components and React Hooks.
- **State Management:** Use Context API for global state minimally. Prefer local state (`useState`, `useReducer`) where possible.
- **Styling:** Use Material UI's `sx` prop or `styled` components. Do not use plain CSS or arbitrary inline styles unless absolutely necessary.
- **Memoization:** Wrap expensive computations in `useMemo` and stable callbacks in `useCallback`.

## Folder Conventions

We use a feature-based architecture. 
- Global UI components go in `src/components/`.
- Domain-specific logic goes into `src/features/<feature-name>/`.
- Do not cross-contaminate feature folders (e.g., the `dashboard` feature should not import directly from the `cost` feature's internal components).

## Component Conventions

- **File Naming:** Use PascalCase for component files (e.g., `MetricCard.jsx`).
- **Exports:** Use default exports for top-level page components, and named exports or default exports for smaller subcomponents.
- **Props:** Destructure props clearly in the function signature.

## How to Create Reusable Components

If a UI element is used in more than one feature, it belongs in `src/components/`.
1. Create a new file (e.g., `src/components/MyNewButton.jsx`).
2. Make it highly generic (accept props like `label`, `onClick`, `color`).
3. Ensure it uses the global MUI theme variables.

## How to Create New Pages

1. Create a new feature folder if it represents a distinct domain (e.g., `src/features/reports/Reports.jsx`).
2. Build your feature components inside that folder.
3. Import your top-level feature component into `src/routes/index.jsx`.
4. Define the new route in the `routes` array inside `index.jsx` using `lazy` loading for performance.
5. Add the new route to the sidebar navigation in `src/utils/constants.js`.

## How to Connect APIs

1. Define your mock or actual API endpoints inside `src/services/api.js`.
2. Do not call `axios` directly from your components.
3. Use the custom `useApi` hook located in `src/hooks/useApi.js` to handle data fetching, loading states, and error handling safely.

Example:
```javascript
import { useApi } from '../../hooks/useApi';
import { dashboardApi } from '../../services/api';

const { data, loading, error } = useApi(dashboardApi.getMetrics);
```

## How to Run the Project

- **Development:** `npm run dev`
- **Linting:** `npm run lint`
- **Production Build:** `npm run build`
- **Preview Build:** `npm run preview`
