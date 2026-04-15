import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from '@vitest/browser-playwright'
import { config } from "dotenv";
import { resolve } from "path";


// Load test environment variables before any tests run
config({ path: resolve(process.cwd(), ".env.test") });

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },

  test: {
    exclude: ["**/node_modules/**", "**/.git/**"],
    globals: true,
    coverage: { provider: "v8" },
    globalSetup: ["./tests/setup/globalSetup.ts"],
    setupFiles: ["./tests/setup/setup.ts"],
    // Automatically clean up after each test to ensure isolation
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 10_000, // after 10 seconds
    // projects
    projects: [
      {
        resolve: {tsconfigPaths: true},
        test: {
          name: {label: "unit-tests", color:'magenta'},
          environment: "node",
          include: ["./tests/unit/**/*.test.ts"],
        },
      },
      {
        resolve: {tsconfigPaths: true},
        test: {
          name: {label: "integration-tests", color:"green"},
          environment: "node",
          include: ["./tests/integration/*.test.ts"],
          pool:'threads'
        },
      },
      { resolve: {tsconfigPaths: true},
        test: {
          name: {label: "component-tests", color:"yellow"},
          include: ["./tests/ui/**/*.test.tsx"],
          browser: {
            enabled:true,
            provider: playwright(),
            instances:[
                {browser: 'chromium', name:'CHROME'},
                {browser:'firefox', name: "FIRE FOX"}
            ]
          }
        },
      },
    ],
  },
});
