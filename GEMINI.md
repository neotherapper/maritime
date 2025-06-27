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

### Testing

- Unit tests should be placed in the same folder as the file they are testing against.
- **Run tests**: `pnpm test:run`
- **Watch tests**: `pnpm test`
- **UI mode**: `pnpm test:ui`

### E2E Testing with Playwright

- **Run tests**: `pnpm e2e`
- **UI mode**: `pnpm e2e:ui`

### Component Development with Storybook

- **Run Storybook**: `pnpm storybook`
- **Build Storybook**: `pnpm build-storybook`

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

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Always use strict equality (`===` and `!==`).

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
