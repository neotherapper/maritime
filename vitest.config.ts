/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['./e2e/**'],
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.stories.test.{ts,tsx}'],
  },
})