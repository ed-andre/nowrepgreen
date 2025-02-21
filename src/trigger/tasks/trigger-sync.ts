import { task } from "@trigger.dev/sdk/v3";

export const triggerSyncTask = task({
  id: "trigger-sync",
  run: async () => {
    const targetUrl = process.env.TARGET_TRIGGER_URL;
    const targetApiKey = process.env.TARGET_TRIGGER_API_KEY;

    if (!targetUrl || !targetApiKey) {
      throw new Error("Missing target environment configuration");
    }

    const response = await fetch(`${targetUrl}/api/internal/orchestrate-sync`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${targetApiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to trigger sync: ${response.statusText}`);
    }

    return await response.json();
  }
});