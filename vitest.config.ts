import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load test environment variables before any tests run
config({ path: resolve(process.cwd(), '.env.test') })

export default defineConfig({
    plugins: [react()],
    resolve: {
        tsconfigPaths: true
    },
    test: {
        include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
        exclude:  ['**/node_modules/**, **/.git/**'],
        globals: true,
        testTimeout: 10_000,// after 10 seconds
        globalSetup: ['./tests/setup/globalSetup.ts'],
        setupFiles:['./tests/setup/setup.ts'],
        // Automatically clean up after each test to ensure isolation
        clearMocks: true,
        restoreMocks: true,
        // Use node environment by default (needed for crypto, prisma, etc)
        environment: 'node',
        // UI tests need jsdom - mark with @vitest/ui tag
        environments: ['node', 'jsdom'],
        environmentMatchGlobs: [
            ['tests/ui/**', 'jsdom'],
            ['tests/unit/dashboard/**', 'jsdom'],
            ['tests/integration/mentor-dashboard.test.tsx', 'jsdom'],
        ],
        // Ensure tests run sequentially to avoid database conflicts
        pool: 'threads',
        coverage: {
            provider: 'v8'
        }
    },
});