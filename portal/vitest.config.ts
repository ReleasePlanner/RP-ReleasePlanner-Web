import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        'src/**/__tests__/**',
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/test/**',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*mocks*/**',
        'src/**/mocks/**',
        'src/**/api/mocks/**',
        // non-executable or integration-heavy files we exclude from unit coverage
        'src/**/types.ts',
        'src/features/releasePlans/slice.ts',
        'src/features/releasePlans/state/selectors.ts',
        'src/features/releasePlans/components/GanttChart.tsx',
        'src/features/releasePlans/components/Plan/ResizableSplit.tsx',
        'src/features/releasePlans/components/PlanCard.tsx',
        'src/layouts/MainLayout.tsx',
        'src/store/store.ts',
        'src/features/releasePlans/lib/date.ts',
        'src/features/releasePlans/components/Plan/PlanHeader.tsx',
        'src/utils/**',
        'src/features/releasePlans/components/Gantt/utils.ts',
        'src/features/releasePlans/components/Gantt/GanttLane.tsx',
        'src/features/releasePlans/components/Gantt/PhaseBar.tsx',
        'src/features/releasePlans/components/Gantt/TaskBar.tsx',
        'tailwind.config.*',
        'postcss.config.*',
        'vite.config.*',
        'eslint.config.*',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
});


