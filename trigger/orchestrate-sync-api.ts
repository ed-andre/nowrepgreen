import { task, SubtaskUnwrapError } from "@trigger.dev/sdk/v3";

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

      // Explicitly check the success property
      if (transformResult.success !== true) {
        console.error("Data transformation failed", {
          transformedEntities: transformResult.transformedEntities,
          failedEntities: (transformResult as any).failedEntities || [],
          error: (transformResult as any).error || "Unknown error",
        });

        // Return a failure result with detailed information
        return {
          success: false,
          stage: "transform",
          syncResult,
          transformResult,
          error:
            (transformResult as any).error ||
            "Transform task failed without specific error",
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
