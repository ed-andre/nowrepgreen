import { tasks } from "@trigger.dev/sdk/v3";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { orchestrateSyncTask } from "trigger/orchestrator";

// Validate secret key from request headers
function validateSecretKey(request: Request) {
  const authHeader = request.headers.get("x-sync-secret");
  const expectedSecret = process.env.SYNC_SECRET_KEY;

  if (!authHeader || authHeader !== expectedSecret) {
    throw new Error("Unauthorized: Invalid or missing secret key");
  }
}

// Handle GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    validateSecretKey(request);
    console.log(
      "Debug: Triggering sync task in environment:",
      process.env.NODE_ENV,
    );

    const handle = await tasks.trigger<typeof orchestrateSyncTask>(
      "orchestrate-sync",
      undefined,
      {},
    );
    return new Response(
      JSON.stringify({ message: "Sync triggered successfully", handle }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to trigger sync task:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to trigger sync task",
        details: error instanceof Error ? error.message : undefined,
      }),
      {
        status:
          error instanceof Error && error.message.includes("Unauthorized")
            ? 401
            : 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Handle POST requests
export async function action({ request }: ActionFunctionArgs) {
  try {
    validateSecretKey(request);
    const handle = await tasks.trigger<typeof orchestrateSyncTask>(
      "orchestrate-sync",
      undefined,
      {},
    );
    return new Response(
      JSON.stringify({ message: "Sync triggered successfully", handle }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to trigger sync task:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to trigger sync task",
        details: error instanceof Error ? error.message : undefined,
      }),
      {
        status:
          error instanceof Error && error.message.includes("Unauthorized")
            ? 401
            : 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
