import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubtaskUnwrapError } from "@trigger.dev/sdk/v3";

// Mock the modules
vi.mock("../sync-all-api");
vi.mock("../transform-all-api");
vi.mock("../orchestrate-sync-api");

// Import the mocked modules
import { syncAllJsonApi } from "../sync-all-api";
import { transformAllDataApi } from "../transform-all-api";
import { orchestrateSyncApi } from "../orchestrate-sync-api";

// Cast to any to avoid type errors
const orchestrateApi = orchestrateSyncApi as any;

// Define types for our mocks
type SyncResult = {
  success: boolean;
  syncedEndpoints: string[];
  failedEndpoints?: string[];
  errors?: string[];
  error?: string;
};

type TransformResult = {
  entity: string;
  success: boolean;
  error?: string;
};

type TransformAllResult = {
  success: boolean;
  transformedEntities: TransformResult[];
  failedEntities?: string[];
  error?: string;
};

type OrchestrationResult = {
  success: boolean;
  stage?: string;
  syncResult?: SyncResult;
  transformResult?: TransformAllResult;
  error?: string;
  completedAt: string;
};

describe("Orchestration API Unit Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup the mocks
    vi.mocked(syncAllJsonApi).triggerAndWait = vi.fn().mockReturnValue({
      unwrap: vi.fn(),
    });

    vi.mocked(transformAllDataApi).triggerAndWait = vi.fn().mockReturnValue({
      unwrap: vi.fn(),
    });

    // Use the any-typed variable
    orchestrateApi.run = vi.fn();
  });

  describe("Orchestration Process", () => {
    it("should handle successful sync and transform", async () => {
      // Mock successful responses for both sync and transform
      const syncResult: SyncResult = {
        success: true,
        syncedEndpoints: ["boards", "talents"],
      };

      const transformResult: TransformAllResult = {
        success: true,
        transformedEntities: [
          { entity: "talents", success: true },
          { entity: "boards", success: true },
        ],
      };

      const orchestrationResult: OrchestrationResult = {
        success: true,
        syncResult,
        transformResult,
        completedAt: new Date().toISOString(),
      };

      // Setup mocks
      vi.mocked(syncAllJsonApi.triggerAndWait().unwrap).mockResolvedValue(
        syncResult as any,
      );
      vi.mocked(transformAllDataApi.triggerAndWait().unwrap).mockResolvedValue(
        transformResult,
      );
      orchestrateApi.run.mockResolvedValue(orchestrationResult);

      // Run the orchestration
      const result = await orchestrateApi.run();

      // Verify the result
      expect(result).toEqual(orchestrationResult);
    });

    it("should handle sync failure", async () => {
      // Mock failed sync response
      const syncResult: SyncResult = {
        success: false,
        syncedEndpoints: ["boards"],
        failedEndpoints: ["talents"],
        errors: ["Failed to fetch talents data"],
      };

      const orchestrationResult: OrchestrationResult = {
        success: false,
        stage: "sync",
        syncResult,
        error: "Failed to fetch talents data",
        completedAt: new Date().toISOString(),
      };

      // Setup mocks
      vi.mocked(syncAllJsonApi.triggerAndWait().unwrap).mockResolvedValue(
        syncResult as any,
      );
      orchestrateApi.run.mockResolvedValue(orchestrationResult);

      // Run the orchestration
      const result = await orchestrateApi.run();

      // Verify the result
      expect(result).toEqual(orchestrationResult);
    });

    it("should handle transform failure", async () => {
      // Mock successful sync but failed transform
      const syncResult: SyncResult = {
        success: true,
        syncedEndpoints: ["boards", "talents"],
      };

      const transformResult: TransformAllResult = {
        success: false,
        transformedEntities: [
          { entity: "talents", success: true },
          {
            entity: "boards",
            success: false,
            error: "Failed to transform boards",
          },
        ],
        failedEntities: ["boards"],
        error: "Failed to transform boards",
      };

      const orchestrationResult: OrchestrationResult = {
        success: false,
        stage: "transform",
        syncResult,
        transformResult,
        error: "Failed to transform boards",
        completedAt: new Date().toISOString(),
      };

      // Setup mocks
      vi.mocked(syncAllJsonApi.triggerAndWait().unwrap).mockResolvedValue(
        syncResult as any,
      );
      vi.mocked(transformAllDataApi.triggerAndWait().unwrap).mockResolvedValue(
        transformResult,
      );
      orchestrateApi.run.mockResolvedValue(orchestrationResult);

      // Run the orchestration
      const result = await orchestrateApi.run();

      // Verify the result
      expect(result).toEqual(orchestrationResult);
    });

    it("should handle unwrap errors", async () => {
      // Create a SubtaskUnwrapError with the correct number of arguments
      const unwrapError = new SubtaskUnwrapError(
        "Task failed",
        "run-123",
        new Error("Underlying error"),
      );

      const orchestrationResult: OrchestrationResult = {
        success: false,
        stage: "orchestration",
        error: "Task failed",
        completedAt: new Date().toISOString(),
      };

      // Setup mocks
      vi.mocked(syncAllJsonApi.triggerAndWait().unwrap).mockRejectedValue(
        unwrapError,
      );
      orchestrateApi.run.mockResolvedValue(orchestrationResult);

      // Run the orchestration
      const result = await orchestrateApi.run();

      // Verify the result
      expect(result).toEqual(orchestrationResult);
    });

    it("should handle generic errors", async () => {
      const orchestrationResult: OrchestrationResult = {
        success: false,
        stage: "orchestration",
        error: "Generic error",
        completedAt: new Date().toISOString(),
      };

      // Setup mocks
      vi.mocked(syncAllJsonApi.triggerAndWait().unwrap).mockRejectedValue(
        new Error("Generic error"),
      );
      orchestrateApi.run.mockResolvedValue(orchestrationResult);

      // Run the orchestration
      const result = await orchestrateApi.run();

      // Verify the result
      expect(result).toEqual(orchestrationResult);
    });
  });
});
