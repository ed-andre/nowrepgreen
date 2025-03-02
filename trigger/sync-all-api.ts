import { task } from "@trigger.dev/sdk/v3";

import { API_CONFIG } from "./config";

interface EndpointConfig {
  name: string;
  endpoint: string;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    name: "boards",
    endpoint: API_CONFIG.endpoints.boards,
  },
  {
    name: "boardsTalents",
    endpoint: API_CONFIG.endpoints.boardsTalents,
  },
  {
    name: "boardsPortfolios",
    endpoint: API_CONFIG.endpoints.boardsPortfolios,
  },
  {
    name: "portfoliosMedia",
    endpoint: API_CONFIG.endpoints.portfoliosMedia,
  },
  {
    name: "talents",
    endpoint: API_CONFIG.endpoints.talents,
  },
  {
    name: "talentsPortfolios",
    endpoint: API_CONFIG.endpoints.talentsPortfolios,
  },
  {
    name: "talentsMeasurements",
    endpoint: API_CONFIG.endpoints.talentsMeasurements,
  },
  {
    name: "talentsSocials",
    endpoint: API_CONFIG.endpoints.talentsSocials,
  },
  {
    name: "mediaTags",
    endpoint: API_CONFIG.endpoints.mediaTags,
  },
];

// Function to call server API to store the data
async function callServerToStoreData(config: EndpointConfig, data: any) {
  try {
    // Get the target API URL from environment variables with fallback
    // In development, if TARGET_API_URL is not set, use localhost:5173
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

    // Get the sync secret key from environment variables
    const syncSecretKey = process.env.SYNC_SECRET_KEY;
    if (!syncSecretKey) {
      throw new Error("SYNC_SECRET_KEY environment variable is not set");
    }

    console.log(`Using target API URL: ${targetApiUrl}`);

    // Capitalize the first letter of the model name to match the API's expected format
    const capitalizedName =
      config.name.charAt(0).toUpperCase() + config.name.slice(1);
    const modelName = `${capitalizedName}Json`;

    // Call our server API endpoint to store the JSON data
    try {
      const storeResponse = await fetch(
        `${targetApiUrl}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${syncSecretKey}`,
          },
          body: JSON.stringify({
            modelName,
            data: data,
            keepCount: 3, // Keep only the 3 most recent records, matching the original implementation
          }),
        },
      );

      if (!storeResponse.ok) {
        const errorText = await storeResponse.text();
        throw new Error(
          `Failed to store data: ${storeResponse.status} - ${errorText}`,
        );
      }

      const responseData = await storeResponse.json();
      return responseData;
    } catch (fetchError: unknown) {
      // Provide more detailed error for fetch failures
      if (
        fetchError instanceof TypeError &&
        fetchError.message.includes("fetch")
      ) {
        throw new Error(
          `Network error connecting to ${targetApiUrl}: ${fetchError.message}. Make sure the server is running and accessible.`,
        );
      }
      throw fetchError;
    }
  } catch (error) {
    throw new Error(
      `Error storing data for ${config.name}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function fetchAndStoreData(config: EndpointConfig) {
  try {
    // Fetch data from the external API
    console.log(`Fetching data from ${config.endpoint}...`);
    const response = await fetch(API_CONFIG.getFullUrl(config.endpoint));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`,
      );
    }

    const data = await response.json();
    console.log(
      `Successfully fetched data for ${config.name} (${Array.isArray(data) ? data.length : "object"} items)`,
    );

    // Call server-side function to store the data instead of using Prisma directly
    console.log(`Storing data for ${config.name}...`);
    const result = await callServerToStoreData(config, data);
    console.log(`Successfully stored data for ${config.name}:`, result);

    return {
      name: config.name,
      success: true,
      result,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing ${config.name}:`, errorMessage);

    // Return detailed error information
    return {
      name: config.name,
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      phase: errorMessage.includes("Fetching") ? "fetch" : "store",
    };
  }
}

export const syncAllJsonApi = task({
  id: "sync-all-json-api",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    console.log("Starting API-driven sync process...");

    // Check required environment variables
    const targetApiUrl =
      process.env.TARGET_API_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : undefined);
    const syncSecretKey = process.env.SYNC_SECRET_KEY;
    const sourceApiUrl = process.env.SOURCE_API_URL || API_CONFIG.baseUrl;

    // Log environment variables (without sensitive values)
    console.log("Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      TARGET_API_URL: targetApiUrl || "Not set",
      SYNC_SECRET_KEY: syncSecretKey ? "Set" : "Not set",
      SOURCE_API_URL: sourceApiUrl || "Not set",
    });

    // Validate required environment variables
    if (!targetApiUrl) {
      console.error("TARGET_API_URL environment variable is not set");
      return {
        success: false,
        syncedEndpoints: [],
        error: "TARGET_API_URL environment variable is not set",
      };
    }

    if (!syncSecretKey) {
      console.error("SYNC_SECRET_KEY environment variable is not set");
      return {
        success: false,
        syncedEndpoints: [],
        error: "SYNC_SECRET_KEY environment variable is not set",
      };
    }

    if (!sourceApiUrl) {
      console.error(
        "SOURCE_API_URL environment variable is not set and no fallback available",
      );
      return {
        success: false,
        syncedEndpoints: [],
        error:
          "SOURCE_API_URL environment variable is not set and no fallback available",
      };
    }

    const results = await Promise.all(ENDPOINTS.map(fetchAndStoreData));

    const failures = results.filter((result) => !result.success);
    if (failures.length > 0) {
      console.error("Sync failures:", failures);

      // Check if all endpoints failed
      if (failures.length === ENDPOINTS.length) {
        console.error("ALL ENDPOINTS FAILED - This is a critical error");
      }

      // Return a failure result instead of throwing an error
      // This ensures the task is marked as failed but still returns data
      const failureResult = {
        success: false,
        syncedEndpoints: results.filter((r) => r.success).map((r) => r.name),
        failedEndpoints: failures.map((f) => f.name),
        errors: failures.map((f) => `${f.name}: ${f.error}`),
      };

      // Log the failure result for debugging
      console.error("Returning failure result:", failureResult);

      return failureResult;
    }

    console.log("API-driven sync completed successfully");
    return {
      success: true,
      syncedEndpoints: results.map((r) => r.name),
    };
  },
});
