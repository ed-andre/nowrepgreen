import { orchestrateSyncTask } from "trigger/orchestrator";
import { tasks } from "@trigger.dev/sdk/v3";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

// Handle GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  const handle = await tasks.trigger<typeof orchestrateSyncTask>("orchestrate-sync", undefined, {});
  return new Response(
    JSON.stringify({ message: "Sync triggered successfully", handle }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}

// Handle POST requests
export async function action({ request }: ActionFunctionArgs) {
  const handle = await tasks.trigger<typeof orchestrateSyncTask>("orchestrate-sync", undefined, {});
  return new Response(
    JSON.stringify({ message: "Sync triggered successfully", handle }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
