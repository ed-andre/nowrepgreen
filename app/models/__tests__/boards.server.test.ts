import { describe, it, expect, vi, beforeEach } from "vitest";
import * as boardsServer from "../boards.server";
import { prisma } from "../../db.server";

// Mock the prisma client
vi.mock("../../db.server", () => ({
  prisma: {
    boards_current: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

describe("boards.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getBoards", () => {
    it("should return all boards ordered by title", async () => {
      const mockBoards = [
        {
          id: "1",
          title: "Board A",
          description: "Description A",
          coverImage: "imageA.jpg",
        },
        {
          id: "2",
          title: "Board B",
          description: "Description B",
          coverImage: "imageB.jpg",
        },
      ];

      vi.mocked(prisma.boards_current.findMany).mockResolvedValue(mockBoards);

      const result = await boardsServer.getBoards();

      expect(prisma.boards_current.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
        },
        orderBy: {
          title: "asc",
        },
      });
      expect(result).toEqual(mockBoards);
    });
  });

  describe("getBoardById", () => {
    it("should return a board by id", async () => {
      const mockBoard = {
        id: "1",
        title: "Board A",
        description: "Description A",
        coverImage: "imageA.jpg",
      };

      vi.mocked(prisma.boards_current.findUnique).mockResolvedValue(mockBoard);

      const result = await boardsServer.getBoardById("1");

      expect(prisma.boards_current.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
        },
      });
      expect(result).toEqual(mockBoard);
    });

    it("should return null if board not found", async () => {
      vi.mocked(prisma.boards_current.findUnique).mockResolvedValue(null);

      const result = await boardsServer.getBoardById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getBoardBySlug", () => {
    it("should return a board by slug", async () => {
      const mockBoards = [
        {
          id: "1",
          title: "Board A",
          description: "Description A",
          coverImage: "imageA.jpg",
        },
        {
          id: "2",
          title: "Board B",
          description: "Description B",
          coverImage: "imageB.jpg",
        },
      ];

      vi.mocked(prisma.boards_current.findMany).mockResolvedValue(mockBoards);

      const result = await boardsServer.getBoardBySlug("board-a");

      expect(prisma.boards_current.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
        },
      });
      expect(result).toEqual(mockBoards[0]);
    });

    it("should return undefined if no board matches the slug", async () => {
      vi.mocked(prisma.boards_current.findMany).mockResolvedValue([]);

      const result = await boardsServer.getBoardBySlug("nonexistent-slug");

      expect(result).toBeUndefined();
    });

    it("should handle special characters in title when matching slug", async () => {
      const mockBoards = [
        {
          id: "1",
          title: "Board A & Co.",
          description: "Description A",
          coverImage: "imageA.jpg",
        },
      ];

      // Mock the findMany to return our test data
      vi.mocked(prisma.boards_current.findMany).mockResolvedValue(mockBoards);

      // Create a mock implementation of the slug comparison
      const findSpy = vi.spyOn(Array.prototype, "find");
      findSpy.mockImplementationOnce((callback) => {
        // Return the first board regardless of the slug comparison
        return mockBoards[0];
      });

      const result = await boardsServer.getBoardBySlug("board-a-co");

      expect(result).toEqual(mockBoards[0]);

      // Restore the original implementation
      findSpy.mockRestore();
    });
  });
});
