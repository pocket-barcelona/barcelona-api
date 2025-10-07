import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['node_modules/**'],
    coverage: {
      provider: 'v8',
      enabled: true,
      // all: false, // Vitest 1.0 changed to true
      thresholds: {
        functions: 80,
        branches: 80,
        lines: 80,
        statements: 10
      },
      include: ['src/**/*'],
      exclude: [
        ...configDefaults.exclude,
        '**/*.stories.*',
        '**/*.data.*',
        '**/*.enum.ts',
        '**/*.model.ts',
        '**/*.d.ts',
        '**/generated/**/*',
        'src/config.ts',
        'src/collections/**/*',
        'src/data/**/*',
        'src/email/**/*',
        'src/routes/**/*',
        '**/index.ts',
      ]
    }
  },
})