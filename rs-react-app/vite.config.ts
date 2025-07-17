/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/REACT2025Q3/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setup.ts',
    coverage: {
      provider: 'v8',
      include: ['src//*.{js,jsx,ts,tsx}'],
      exclude: [
        'src//.test.{js,jsx,ts,tsx}',
        'src/**/.spec.{js,jsx,ts,tsx}',
        'src/index.{js,jsx,ts,tsx}',
        'src/setupTests.{js,ts}',
        'src/*/.d.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
});
