/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup-unit-env.ts"],
    include: ["./app/**/*.test.{ts,tsx}", "./trigger/**/*.test.{ts,tsx}"],
    exclude: [
      ".*\\/node_modules\\/.*",
      ".*\\/build\\/.*",
      "./app/**/__test-integrations__/**",
      "./app/**/__test-integrations/**",
      "**/test-integrations/**",
      "**/__test-integrations/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
