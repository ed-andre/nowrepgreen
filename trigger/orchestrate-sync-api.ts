import { task, SubtaskUnwrapError } from "@trigger.dev/sdk/v3";

import { validateBoardsData, handleEmptyDataScenario } from "./data-validation";
import { syncAllJsonApi } from "./sync-all-api";
import { transformAllDataApi } from "./transform-all-api";

interface TaskError extends SubtaskUnwrapError {
  attemptNumber?: number;
}

export const orchestrateSyncApi = task({
  id: "orchestrate-sync-api",
  run: async () => {
    console.log("Starting API-driven orchestration process...");

    try {
      // Step 0: Validate if boards data is available
      console.log("Step 0: Validating data availability...");
      const validationResult = await validateBoardsData();

      if (!validationResult.hasData) {
        console.warn(
          "No boards data available from source API:",
          validationResult.message,
        );
        console.log("Proceeding with empty data handling...");

        // Handle empty data scenario by creating empty tables
        const emptyDataResult = await handleEmptyDataScenario();

        if (!emptyDataResult.success) {
          console.error(
            "Failed to handle empty data scenario:",
            emptyDataResult.message,
          );
          return {
            success: false,
            stage: "validation",
            error: emptyDataResult.message,
            completedAt: new Date().toISOString(),
          };
        }

        console.log("Successfully handled empty data scenario:", {
          message: emptyDataResult.message,
          processedEntities: emptyDataResult.entities,
        });

        // Return success with empty data handling information
        return {
          success: true,
          stage: "empty_data_handling",
          message: "Successfully created empty tables due to no source data",
          validationResult,
          emptyDataResult,
          completedAt: new Date().toISOString(),
        };
      }

      console.log("Data validation successful:", validationResult.message);

      // Step 1: Sync all JSON data from external API
      console.log("Step 1: Syncing JSON data...");
      const syncResult = await syncAllJsonApi.triggerAndWait().unwrap();

      // Explicitly check the success property
      if (syncResult.success !== true) {
        console.error("JSON sync failed", {
          syncedEndpoints: syncResult.syncedEndpoints || [],
          failedEndpoints: (syncResult as any).failedEndpoints || [],
          errors: (syncResult as any).errors || [],
        });

        // Return a failure result with detailed information
        return {
          success: false,
          stage: "sync",
          syncResult,
          error: Array.isArray((syncResult as any).errors)
            ? (syncResult as any).errors.join("; ")
            : "Sync failed without specific error",
          completedAt: new Date().toISOString(),
        };
      }

      console.log("JSON sync completed successfully");

      // Step 2: Transform all data
      console.log("Step 2: Transforming data...");
      const transformResult = await transformAllDataApi
        .triggerAndWait()
        .unwrap();

      // Check if transform had failures but still completed
      if (transformResult.success !== true) {
        console.warn("Data transformation completed with some failures", {
          transformedEntities: transformResult.transformedEntities,
          failedEntities: (transformResult as any).failedEntities || [],
          error: (transformResult as any).error || "Unknown error",
        });

        // Return a partial success result with detailed information
        return {
          success: true, // Mark as success even with partial failures
          partialFailures: true,
          stage: "transform",
          syncResult,
          transformResult,
          failedEntities: (transformResult as any).failedEntities || [],
          error: (transformResult as any).error || "Some transforms failed",
          completedAt: new Date().toISOString(),
        };
      }

      console.log("Data transformation completed successfully");

      // Return the combined results
      return {
        success: true,
        syncResult,
        transformResult,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof SubtaskUnwrapError) {
        const taskError = error as TaskError;
        console.error("Task failed completely", {
          runId: taskError.runId,
          taskId: taskError.taskId,
          cause: taskError.cause,
          attemptNumber: taskError.attemptNumber,
        });
      } else {
        console.error("Orchestration failed with error:", error);
      }

      // Return a failure result
      return {
        success: false,
        stage: "orchestration",
        error: error instanceof Error ? error.message : String(error),
        completedAt: new Date().toISOString(),
      };
    }
  },
});
