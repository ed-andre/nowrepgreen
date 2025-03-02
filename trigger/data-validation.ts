import { API_CONFIG } from "./config";

/**
 * Validates if the boards API endpoint returns data
 * This serves as our "anchor check" before proceeding with sync
 */
export async function validateBoardsData(): Promise<{
  hasData: boolean;
  message: string;
}> {
  try {
    console.log("Validating boards data availability...");
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.boards));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${errorText}`
      );
    }

    const data = await response.json();

    // Check if data is an array with items or an object with a data property that's an array with items
    const hasData = Array.isArray(data)
      ? data.length > 0
      : Array.isArray((data as any)?.data)
        ? (data as any).data.length > 0
        : false;

    console.log(`Boards data validation result: ${hasData ? "Data available" : "No data available"}`);

    return {
      hasData,
      message: hasData
        ? `Found ${Array.isArray(data) ? data.length : (data as any)?.data?.length || 0} boards`
        : "No boards data available from source API"
    };
  } catch (error) {
    console.error("Error validating boards data:", error);
    return {
      hasData: false,
      message: `Error validating boards data: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Handles the case when no data is available by creating empty tables
 * and updating views to point to these empty tables
 */
export async function handleEmptyDataScenario(): Promise<{
  success: boolean;
  message: string;
  entities: string[];
}> {
  try {
    console.log("Handling empty data scenario via server API...");

    // Get the target API URL from environment variables with fallback
    const targetApiUrl =
      process.env.TARGET_API_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : undefined);

    if (!targetApiUrl) {
      throw new Error(
        "TARGET_API_URL environment variable is not set and no fallback is available"
      );
    }

    // Get the sync secret key from environment variables
    const syncSecretKey = process.env.SYNC_SECRET_KEY ;

    console.log(`Using target API URL: ${targetApiUrl}`);

    // Call our server API endpoint to handle empty data
    const response = await fetch(
      `${targetApiUrl}/api/internal/empty-data-handler`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${syncSecretKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Empty data handler API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log(`Empty data handler API response:`, result);

    if (!result.success) {
      throw new Error(
        `Empty data handler API returned failure: ${result.message || "Unknown error"}`
      );
    }

    return {
      success: true,
      message: result.message || "Successfully handled empty data scenario",
      entities: result.entities || [],
    };
  } catch (error) {
    console.error("Error handling empty data scenario:", error);
    return {
      success: false,
      message: `Error handling empty data: ${error instanceof Error ? error.message : String(error)}`,
      entities: [],
    };
  }
}