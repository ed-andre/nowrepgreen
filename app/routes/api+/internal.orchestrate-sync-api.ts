import { tasks } from "@trigger.dev/sdk/v3";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { orchestrateSyncApi } from "../../../trigger/orchestrate-sync-api";

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

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Validate the request
    validateSecretKey(request);

    console.log(
      "Secret key validation successful, triggering orchestration task",
    );

    // Log the request headers for debugging (without sensitive information)
    const headers = Array.from(request.headers.entries())
      .filter(
        ([key]) =>
          !key.toLowerCase().includes("authorization") &&
          !key.toLowerCase().includes("secret"),
      )
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    console.log("Request headers:", headers);

    // Trigger the orchestration task
    const task = await tasks.trigger<typeof orchestrateSyncApi>(
      "orchestrate-sync-api",
      undefined,
      {},
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Orchestration task triggered successfully",
        taskId: task.id,
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

    console.error("Error triggering orchestration task:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Disallow GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
