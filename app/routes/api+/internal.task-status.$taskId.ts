import { runs } from "@trigger.dev/sdk/v3";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const taskId = params.taskId;
  if (!taskId) {
    console.warn("Task status check attempted without taskId");
    return new Response(JSON.stringify({ error: "Task ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log(`Checking status for task: ${taskId}`);
    const run = await runs.retrieve(taskId);

    const response = {
      status: run.status,
      durationMs: run.durationMs,
      error: run.error,
    };

    console.log(`Task ${taskId} status:`, response.status);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to get run status:", {
      taskId,
      error: error instanceof Error ? error.message : error,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to get run status",
        details: error instanceof Error ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
