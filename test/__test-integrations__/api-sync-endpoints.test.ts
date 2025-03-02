import { describe, it, expect, beforeAll, vi } from "vitest";
import { createId } from "@paralleldrive/cuid2";

// Mock data for testing
const mockBoardsData = {
  data: [
    {
      id: "board1",
      title: "Test Board",
      description: "Test Description",
    },
  ],
};

const mockTalentsData = {
  data: [
    {
      id: "talent1",
      firstName: "John",
      lastName: "Doe",
      talentType: {
        id: "type1",
        name: "model",
      },
    },
  ],
};

describe("Sync API Endpoints Integration Tests", () => {
  // Verify environment variables before running tests
  beforeAll(() => {
    if (!process.env.TARGET_API_URL) {
      console.warn(
        "TARGET_API_URL environment variable is not set, using default",
      );
      process.env.TARGET_API_URL = "http://localhost:5173";
    }

    if (!process.env.SYNC_SECRET_KEY) {
      console.warn(
        "SYNC_SECRET_KEY environment variable is not set, using default",
      );
      process.env.SYNC_SECRET_KEY = "test_secret_key";
    }
  });

  describe("Store JSON API", () => {
    it("should store JSON data and return success", async () => {
      const modelName = "BoardsJson";
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
          body: JSON.stringify({
            modelName,
            data: mockBoardsData,
            keepCount: 3,
          }),
        },
      );

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("record");
      expect(result.record).toHaveProperty("id");
      expect(result.record).toHaveProperty("createdAt");
      expect(result).toHaveProperty("keepCount", 3);
    });

    it("should reject requests with invalid model name", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
          body: JSON.stringify({
            modelName: "InvalidModel",
            data: mockBoardsData,
          }),
        },
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);

      const result = await response.json();
      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Invalid model name");
    });

    it("should reject requests with missing authorization", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            modelName: "BoardsJson",
            data: mockBoardsData,
          }),
        },
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it("should reject GET requests", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
        },
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(405);
    });
  });

  describe("Transform API", () => {
    it("should transform talents data and return success", async () => {
      // First store some test data
      await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
          body: JSON.stringify({
            modelName: "TalentsJson",
            data: mockTalentsData,
          }),
        },
      );

      // Then call the transform endpoint
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/transform/talents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
        },
      );

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result).toHaveProperty("success", true);
      expect(result).toHaveProperty("entity", "talents");
    });

    it("should reject requests for invalid entities", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/transform/invalid-entity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
        },
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);

      const result = await response.json();
      expect(result).toHaveProperty("success", false);
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Invalid entity name");
    });

    it("should reject requests with missing authorization", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/transform/talents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it("should reject GET requests", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/transform/talents`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
        },
      );

      expect(response.ok).toBe(false);
      expect(response.status).toBe(405);
    });
  });

  describe("Orchestration API", () => {
    it("should have a working orchestration endpoint", async () => {
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/orchestrate-sync-api`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
        },
      );

      expect(response.status).toBe(200);

      const result = await response.json();
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("taskId");
    });

    it("should handle non-existent task IDs in the task status endpoint", async () => {
      // Create a fake task ID
      const taskId = createId();

      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/task-status/${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
        },
      );

      // The endpoint returns 500 for non-existent task IDs
      expect(response.status).toBe(500);

      // Verify the response contains an error message
      const result = await response.json();
      expect(result).toHaveProperty("error");
    });
  });
});
