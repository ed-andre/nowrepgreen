/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Load integration environment variables
const env = config({ path: ".env.test" }).parsed || {};

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    testTimeout: 15000,
    env: {
      DATABASE_URL: env.DATABASE_URL,
      SOURCE_API_URL: env.SOURCE_API_URL || "http://localhost:3000",
      TARGET_API_URL: env.TARGET_API_URL,
      TRIGGER_API_KEY: env.TRIGGER_API_KEY,
      TRIGGER_SECRET_KEY: env.TRIGGER_SECRET_KEY,
    },
    setupFiles: ["./test/setup-integration-env.ts"],
    include: ["./test/__test-integrations__/**/*.test.{ts,tsx}"],
    exclude: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      ".*\\/postgres-data\\/.*",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
