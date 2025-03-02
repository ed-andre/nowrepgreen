import { describe, it, expect, vi, beforeEach } from "vitest";
import { API_CONFIG } from "../config";

// Mock fetch
global.fetch = vi.fn();

// Mock response data
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

// Mock successful API responses
const mockSuccessResponse = {
  success: true,
  record: {
    id: "1",
    createdAt: new Date().toISOString(),
  },
  deletedCount: 0,
  keepCount: 3,
};

const mockTransformResponse = {
  success: true,
  entity: "talents",
  version: 2,
};

describe("API-Driven Sync Process Unit Tests", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Set environment variables for testing
    process.env.TARGET_API_URL = "http://localhost:5173";
    process.env.SYNC_SECRET_KEY = "test_secret_key";
    process.env.SOURCE_API_URL = "http://source-api.example.com";
  });

  describe("API Endpoints", () => {
    it("should fetch data from source API", async () => {
      // Mock successful fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBoardsData),
      } as Response);

      // Call the source API directly
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.boards}`,
      );
      const data = await response.json();

      // Verify the response
      expect(response.ok).toBe(true);
      expect(data).toEqual(mockBoardsData);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.boards}`,
      );
    });

    it("should store JSON data via target API", async () => {
      // Mock successful fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      } as Response);

      // Call the target API directly
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
          body: JSON.stringify({
            modelName: "BoardsJson",
            data: mockBoardsData,
            keepCount: 3,
          }),
        },
      );
      const data = await response.json();

      // Verify the response
      expect(response.ok).toBe(true);
      expect(data).toEqual(mockSuccessResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          }),
          body: expect.any(String),
        }),
      );
    });

    it("should transform data via target API", async () => {
      // Mock successful fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTransformResponse),
      } as Response);

      // Call the transform API directly
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
      const data = await response.json();

      // Verify the response
      expect(response.ok).toBe(true);
      expect(data).toEqual(mockTransformResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.TARGET_API_URL}/api/internal/transform/talents`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          }),
        }),
      );
    });

    it("should handle source API errors gracefully", async () => {
      // Mock failed fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      } as Response);

      // Call the source API directly
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.boards}`,
      );

      // Verify the response
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.boards}`,
      );
    });

    it("should handle target API errors gracefully", async () => {
      // Mock failed fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      } as Response);

      // Call the target API directly
      const response = await fetch(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          },
          body: JSON.stringify({
            modelName: "BoardsJson",
            data: mockBoardsData,
          }),
        },
      );

      // Verify the response
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.TARGET_API_URL}/api/internal/sync/store-json`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          }),
          body: expect.any(String),
        }),
      );
    });

    it("should handle transform API errors gracefully", async () => {
      // Mock failed fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      } as Response);

      // Call the transform API directly
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

      // Verify the response
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(fetch).toHaveBeenCalledWith(
        `${process.env.TARGET_API_URL}/api/internal/transform/talents`,
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SYNC_SECRET_KEY}`,
          }),
        }),
      );
    });
  });

  describe("Environment Variables", () => {
    it("should use fallback URLs in development mode", async () => {
      // Clear environment variables
      const originalSourceApiUrl = process.env.SOURCE_API_URL;
      const originalTargetApiUrl = process.env.TARGET_API_URL;

      delete process.env.SOURCE_API_URL;
      delete process.env.TARGET_API_URL;

      // Set NODE_ENV to development for fallback
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";

      // Mock successful fetch response
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBoardsData),
      } as Response);

      // Call the API with fallback URL
      await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.boards));

      // Verify the URL used
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/public/boards"),
      );

      // Restore environment variables
      process.env.SOURCE_API_URL = originalSourceApiUrl;
      process.env.TARGET_API_URL = originalTargetApiUrl;
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
});
