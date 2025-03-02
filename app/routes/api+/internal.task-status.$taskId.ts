import { runs } from "@trigger.dev/sdk/v3";
import type { LoaderFunctionArgs } from "react-router";

// Validate the secret key from the request - supports both Authorization and x-sync-secret headers
function validateSecretKey(request: Request) {
  // Check for Authorization header (Bearer token)
  const authHeader = request.headers.get("Authorization");
  if (authHeader) {
    const [type, token] = authHeader.split(" ");
    if (type === "Bearer" && token === process.env.SYNC_SECRET_KEY) {
      return; // Valid authorization
    }
  }

  // Check for x-sync-secret header (used by the source application)
  const syncSecretHeader = request.headers.get("x-sync-secret");
  if (syncSecretHeader && syncSecretHeader === process.env.SYNC_SECRET_KEY) {
    return; // Valid authorization
  }

  // If we get here, neither header was valid
  throw new Response("Unauthorized: Invalid or missing secret key", {
    status: 401,
  });
}

// Define a simplified type for task run data
interface TaskRunData {
  id: string;
  status: string;
  durationMs?: number;
  startedAt?: Date;
  finishedAt?: Date;
  output?: any;
  error?: { message: string } | null;
  [key: string]: any; // Allow for other properties
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    // Validate the request
    validateSecretKey(request);

    const taskId = params.taskId;
    const url = new URL(request.url);
    const taskType = url.searchParams.get("type");
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const status = url.searchParams.get("status");

    // If a specific taskId is provided, return details for that task
    if (taskId && taskId !== "all") {
      console.log(`Checking status for specific task: ${taskId}`);
      const run = await runs.retrieve(taskId);

      // Extract relevant properties
      const response: TaskRunData = {
        id: run.id,
        status: run.status,
        durationMs: run.durationMs,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        output: run.output,
        error: run.error,
      };

      console.log(`Task ${taskId} status:`, response.status);

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Otherwise, list tasks with optional filtering
    console.log(
      `Listing tasks with filters: ${JSON.stringify({ taskType, limit, status })}`,
    );

    // Build filter options
    const filterOptions: Record<string, any> = { limit };
    if (taskType) {
      filterOptions.taskId = taskType;
    }
    if (status) {
      filterOptions.status = status;
    }

    // Get list of runs
    const runsList = await runs.list(filterOptions);

    // Map to a more concise format with type safety
    const tasksResponse = runsList.data.map((run) => {
      const taskData: TaskRunData = {
        id: run.id,
        status: run.status,
        durationMs: run.durationMs,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt,
        error: null,
      };

      // Add error information if available
      if ("error" in run && run.error) {
        taskData.error = {
          message:
            typeof run.error === "string"
              ? run.error
              : (run.error as any).message || "Unknown error",
        };
      }

      return taskData;
    });

    return new Response(
      JSON.stringify({
        tasks: tasksResponse,
        count: tasksResponse.length,
        filters: { taskType, limit, status },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    if (error instanceof Response) {
      console.error(
        `Authentication error: ${error.status} ${error.statusText}`,
      );
      throw error;
    }

    console.error("Failed to get task status:", {
      params,
      error: error instanceof Error ? error.message : error,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to get task status",
        details: error instanceof Error ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
