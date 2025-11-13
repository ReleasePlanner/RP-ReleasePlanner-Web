/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/portal',
  server:{
    port: 5173,
    host: 'localhost',
  },
  preview:{
    port: 5173,
    host: 'localhost',
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Vendor chunks
          if (
            id.includes("node_modules/@mui/material") ||
            id.includes("node_modules/@emotion")
          ) {
            return "vendor-mui";
          }
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor-react";
          }
          if (
            id.includes("node_modules/@reduxjs") ||
            id.includes("node_modules/react-redux") ||
            id.includes("node_modules/redux")
          ) {
            return "vendor-redux";
          }
          if (
            id.includes("node_modules/@tanstack") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/react-hook-form")
          ) {
            return "vendor-other";
          }

          // Feature-specific chunks
          if (
            id.includes("src/features/releasePlans/components/Gantt") ||
            id.includes("src/features/releasePlans/components/GanttChart")
          ) {
            return "feature-gantt";
          }
          if (
            id.includes("src/features/releasePlans/components/Plan") ||
            id.includes("src/features/releasePlans/components/PlanCard")
          ) {
            return "feature-plans";
          }

          // Shared utilities and constants
          if (
            id.includes("src/features/releasePlans/lib") ||
            id.includes("src/features/releasePlans/utils") ||
            id.includes("src/constants")
          ) {
            return "utils-shared";
          }
        },
      },
    },
    chunkSizeWarningLimit: 750,
  },
  test: {
    name: 'portal',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/portal',
      provider: 'v8' as const,
      reporter: ['text', 'text-summary', 'html', 'lcov', 'json'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        '**/test-utils.tsx',
        '**/setup.ts',
        '**/server.ts',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
}));
