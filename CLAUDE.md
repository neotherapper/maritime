# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Manager
This project uses `pnpm` as the package manager.

### Common Development Tasks
- **Development server**: `pnpm dev` - Starts Vite development server with HMR
- **Build**: `pnpm build` - TypeScript compilation followed by Vite build
- **Linting**: `pnpm lint` - Runs ESLint on all files
- **Preview**: `pnpm preview` - Preview the production build locally

### Type Checking
Run `tsc -b` for TypeScript compilation and type checking (this runs as part of the build process).

## Architecture

This is a React + TypeScript + Vite application with the following structure:

### Tech Stack
- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **ESLint** with TypeScript support and React-specific rules
- **pnpm** workspace configuration

### Project Structure
- `src/` - Main application source code
  - `App.tsx` - Main React component
  - `main.tsx` - Application entry point with React StrictMode
  - `assets/` - Static assets (images, etc.)
- `public/` - Public static files served by Vite
- TypeScript configuration split into `tsconfig.app.json` and `tsconfig.node.json`

### Configuration
- ESLint configured with modern flat config format in `eslint.config.js`
- Vite configuration in `vite.config.ts` uses the React plugin
- pnpm workspace configured with `onlyBuiltDependencies` for esbuild

### Development Notes
- The application uses React 19 with the latest patterns (StrictMode, createRoot)
- ESLint is configured with recommended rules for TypeScript, React Hooks, and React Refresh
- Vite provides fast HMR (Hot Module Replacement) during development