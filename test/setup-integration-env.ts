import { config } from "dotenv";
import { beforeAll } from "vitest";

// Load test environment variables
beforeAll(() => {
  config({ path: ".env.test" });

  // Verify required environment variables
  const requiredEnvVars = [
    "SOURCE_API_URL",
    "TARGET_API_URL",
    "DATABASE_URL",
    "TRIGGER_DEV_API_URL",
    "TRIGGER_API_KEY",
    // 'TRIGGER_SECRET_KEY'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Required environment variable ${envVar} is not set`);
    }
  }
});
