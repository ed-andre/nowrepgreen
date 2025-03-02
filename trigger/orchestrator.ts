// import { task, SubtaskUnwrapError } from "@trigger.dev/sdk/v3";

// import { syncAllJson } from "./sync-all";
// import { transformAllData } from "./transform-all";

// interface SyncResult {
//   success: boolean;
//   syncedEndpoints: string[];
//   errors?: string[];
// }

// interface TaskError extends SubtaskUnwrapError {
//   attemptNumber?: number;
// }

// // Debug environment variables
// // console.log('Debug: Environment variables in orchestrator task:', {
// //   TRIGGER_API_KEY: process.env.TRIGGER_API_KEY?.slice(0, 10) + '...',
// //   NODE_ENV: process.env.NODE_ENV
// // });

// export const orchestrateSyncTask = task({
//   id: "orchestrate-sync",
//   run: async () => {
//     try {
//       // Run sync and wait for result (includes all retry attempts)
//       const syncResult = (await syncAllJson
//         .triggerAndWait()
//         .unwrap()) as SyncResult;

//       if (syncResult.success) {
//         // Only run transform if sync was successful after all attempts
//         await transformAllData.triggerAndWait().unwrap();
//       } else {
//         console.error("Sync failed after all retry attempts", {
//           errors: syncResult.errors,
//           syncedEndpoints: syncResult.syncedEndpoints,
//         });
//       }
//     } catch (error) {
//       if (error instanceof SubtaskUnwrapError) {
//         const taskError = error as TaskError;
//         console.error("Task failed completely", {
//           runId: taskError.runId,
//           taskId: taskError.taskId,
//           cause: taskError.cause,
//           attemptNumber: taskError.attemptNumber,
//         });
//       }
//       throw error;
//     }
//   },
// });
