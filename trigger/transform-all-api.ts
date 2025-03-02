import { task } from "@trigger.dev/sdk/v3";

import { API_CONFIG } from "./config";

interface TransformResult {
  entity: string;
  success: boolean;
  error?: string;
  version?: number;
}

// Function to call server-side transform endpoint
async function callServerTransform(entity: string): Promise<TransformResult> {
  try {
    console.log(`Calling transform API for ${entity}...`);

    // Get the target API URL from environment variables with fallback
    const targetApiUrl =
      process.env.TARGET_API_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : undefined);

    if (!targetApiUrl) {
      throw new Error(
        "TARGET_API_URL environment variable is not set and no fallback is available",
      );
    }

    console.log(`Using target API URL: ${targetApiUrl}`);

    // Call our server API endpoint to transform the data
    const response = await fetch(
      `${targetApiUrl}/api/internal/transform/${entity.toLowerCase()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SYNC_SECRET_KEY || "nrep_dev_iZh2ORNKZpbbWNjBDkU4"}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transform API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log(`Transform API response for ${entity}:`, result);

    if (!result.success) {
      throw new Error(
        `Transform API returned failure for ${entity}: ${result.error || "Unknown error"}`,
      );
    }

    return result;
  } catch (error) {
    console.error(`Transform error for ${entity}:`, error);
    return {
      entity,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export const transformAllDataApi = task({
  id: "transform-all-data-api",
  run: async () => {
    console.log("Starting API-driven transform process...");

    // Log environment variables (without sensitive values)
    const targetApiUrl =
      process.env.TARGET_API_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : undefined);

    console.log("Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      TARGET_API_URL: targetApiUrl ? targetApiUrl : "Not set",
      SYNC_SECRET_KEY: process.env.SYNC_SECRET_KEY
        ? "Set"
        : "Not set (using fallback)",
    });

    // Define entities in the order they should be transformed
    // This maintains the same dependency order as the original implementation
    const entities = [
      "talents",
      "talentsmeasurements",
      "talentsportfolios",
      "boards",
      "boardstalents",
      "boardsportfolios",
      "portfoliosmedia",
      "mediatags",
      "talentssocials",
    ];

    const results: TransformResult[] = [];
    let hasFailures = false;
    let firstError = "";

    try {
      // Transform entities in sequence to maintain dependencies
      for (const entity of entities) {
        console.log(`Starting transform for ${entity}...`);
        const result = await callServerTransform(entity);
        results.push(result);

        if (!result.success) {
          hasFailures = true;
          firstError = `Transform failed for ${result.entity}: ${result.error}`;
          console.error(firstError);
          break; // Stop processing after first failure
        }

        console.log(`Successfully transformed ${entity}`);
      }

      if (hasFailures) {
        throw new Error(firstError);
      }

      console.log("API-driven transform completed successfully");
      return {
        success: true,
        transformedEntities: results,
      };
    } catch (error) {
      console.error("Transform process failed with error:", error);

      // Ensure we're explicitly returning a failure result
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // This will be returned to the orchestration task
      const failureResult = {
        success: false,
        transformedEntities: results,
        error: errorMessage,
        failedEntities: results.filter((r) => !r.success).map((r) => r.entity),
      };

      // Log the failure result for debugging
      console.error("Returning failure result:", failureResult);

      return failureResult;
    }
  },
});
