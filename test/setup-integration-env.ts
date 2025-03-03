import { config } from "dotenv";
import { beforeAll } from "vitest";

// Load test environment variables
beforeAll(() => {
  // Only load from .env.test if not in CI environment
  if (!process.env.CI) {
    config({ path: ".env.test" });
  }

  // Verify required environment variables
  const requiredEnvVars = [
    "SOURCE_API_URL",
    "TARGET_API_URL",
    "DATABASE_URL",
    "TRIGGER_API_KEY",
    "SYNC_SECRET_KEY",
    // 'TRIGGER_SECRET_KEY'
  ];

  const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error("Missing environment variables:", missingVars);
    throw new Error(
      `Required environment variables are not set: ${missingVars.join(", ")}`,
    );
  }
});
