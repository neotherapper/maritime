# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Development Commands

### Package Manager

This project uses `pnpm` as the package manager.

### Common Development Tasks

- **Development server**: `pnpm dev` - Starts Vite development server with HMR
- **Build**: `pnpm build` - TypeScript compilation followed by Vite build
- **Linting**: `pnpm lint` - Runs ESLint on all files
- **Preview**: `pnpm preview` - Preview the production build locally

### Testing Strategy

- Unit tests for domain logic
- Component tests for React components using Storybook testing
- Integration tests for API routes
- E2E tests for critical user flows
- Unit tests should be placed in the same folder as the file they are testing against.
- **Run tests**: `pnpm test:run`
- **Watch tests**: `pnpm test`
- **UI mode**: `pnpm test:ui`

### E2E Testing with Playwright

- **Run tests**: `pnpm e2e`
- **UI mode**: `pnpm e2e:ui`
- **Debug mode**: `pnpm playwright test --debug` - Opens browser for debugging
- **Headed mode**: `pnpm playwright test --headed` - Shows browser during test execution

#### E2E Testing Notes for AI Agents

Since AI agents cannot see the browser UI during E2E tests, use these approaches for effective debugging:

1. **Use headed mode** (`--headed`) to see browser interactions in terminal output
2. **Add console.log statements** in test files to track execution flow
3. **Use Playwright's built-in assertions** which provide detailed error messages
4. **Check for element visibility issues** by adding explicit waits
5. **Verify routing** - ensure the app navigates to correct URLs
6. **Mock API responses** properly in `/src/mocks/handlers.ts`
7. **Check test data-testid attributes** match between components and tests

Common E2E issues to check:

- Missing or incorrect data-testid attributes
- Component import path issues after folder restructuring
- API mocking configuration
- Routing configuration
- Element timing and visibility

### Component Development with Storybook

- **Run Storybook**: `pnpm storybook`
- **Build Storybook**: `pnpm build-storybook`
- **Test stories**: `pnpm test:stories` - Test Storybook components with portable stories
- **Watch story tests**: `pnpm test:stories:watch`
- **Story test UI**: `pnpm test:stories:ui`

Stories use `tags: ['test']` and `composeStories` from `@storybook/react` for testing with Vitest.

### Type Checking

Run `tsc -b` for TypeScript compilation and type checking (this runs as part of the build process).

## Architecture

This is a React + TypeScript + Vite application with the following structure:

### Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **ESLint** with TypeScript support and React-specific rules
- **pnpm** workspace configuration
- **Tailwind CSS** for styling
- **Tanstack Form** for forms
- **Zod** for validation
- **Zustand** for client state,
- **TanStack Query** for server state

### Project Structure

- `src/` - Main application source code
  - `App.tsx` - Main React component
  - `main.tsx` - Application entry point with React StrictMode
  - `assets/` - Static assets (images, etc.)
- `public/` - Public static files served by Vite
- `pages/` - Route components
  - `QuoteWizard` - Main wizard page
- `components/` - Reusable UI components
  - `ui/` - Basic UI components
  - `forms/` - Form-specific components
  - `feedback/` - User feedback components
- `modules/` - Feature modules
  - `wizard/` - Quote Request Wizard
    - `components/` - Quote Request Wizard components
    - `context/` - Wizard-specific context
    - `hooks/` - Wizard hooks
    - `services/` - API services
    - `store/` - State management
    - `types/` - TypeScript types
    - `utils/` - Utility functions
    - `constants/` - Wizard constants
- `shared/` - Shared utilities
  - `components/` - Shared UI components
  - `hooks/` - Shared hooks
  - `services/` - Shared API services
  - `store/` - Shared state management
- TypeScript configuration split into `tsconfig.app.json` and `tsconfig.node.json`

### Configuration

- ESLint configured with modern flat config format in `eslint.config.js`
- Vite configuration in `vite.config.ts` uses the React plugin
- pnpm workspace configured with `onlyBuiltDependencies` for esbuild

### Development Notes

- The application uses React 19 with the latest patterns (StrictMode, createRoot)
- ESLint is configured with recommended rules for TypeScript, React Hooks, and React Refresh
- Vite provides fast HMR (Hot Module Replacement) during development

## General Instructions:

- When generating new TypeScript code, please follow the existing coding style.
- Ensure all new functions and classes have JSDoc comments.
- Prefer functional programming paradigms where appropriate.
- All code should be compatible with TypeScript 5.0 and Node.js 18+.
- Ensure all suggestions align with modern JavaScript/React best practices (e.g., ES6+, React 18).

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Always use strict equality (`===` and `!==`).
- Absolute imports with path mapping

# Styling

This project uses Tailwind CSS.

- Utility classes should be used directly in the JSX.
- The configuration is in `tailwind.config.js` and `postcss.config.js`.
- Global styles are in `src/index.css`.

# Workflow

- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance

## Regarding Dependencies:

- Avoid introducing new external dependencies unless absolutely necessary.
- If a new dependency is required, please state the reason.

# Commit Messages

This project adheres to the Conventional Commits specification.
Commit messages should be structured as follows:

```
<type>[optional scope]: <description>
```

**Type** must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
**Scope** (optional) indicates the affected part of the codebase (e.g., `wizard`, `components`).
**Description** is a concise summary of the change.
