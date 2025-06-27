/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'storybook',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: [
      'src/**/*.stories.{ts,tsx}',
      'src/**/*.stories.test.{ts,tsx}'
    ],
    exclude: ['./e2e/**', 'node_modules/**'],
  },
})