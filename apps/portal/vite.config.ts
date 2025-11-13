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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Vendor chunks - optimize for caching
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

          // Feature-specific chunks for lazy loading
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
          if (id.includes("src/pages")) {
            // Split pages into separate chunks
            const pageMatch = id.match(/src\/pages\/([^/]+)/);
            if (pageMatch) {
              return `page-${pageMatch[1]}`;
            }
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
        // Optimize chunk file names for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
    },
    chunkSizeWarningLimit: 750,
    // Enable source maps only in development
    sourcemap: process.env.NODE_ENV !== 'production',
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
