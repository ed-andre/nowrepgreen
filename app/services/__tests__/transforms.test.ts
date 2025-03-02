import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import {
  transformBoards,
  transformTalents,
  transformBoardsTalents,
} from "~/services/transforms.server";

// Mock the Prisma client
vi.mock("~/db.server", () => {
  const mockPrisma = {
    $transaction: vi.fn((callback) => callback(mockPrisma)),
    $executeRaw: vi.fn(),
    $executeRawUnsafe: vi.fn(),
    $queryRaw: vi.fn(),
    boardsJson: {
      findFirst: vi.fn(),
    },
    talentsJson: {
      findFirst: vi.fn(),
    },
    boardsTalentsJson: {
      findFirst: vi.fn(),
    },
    syncMetadata: {
      findFirst: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  };
  return { prisma: mockPrisma };
});

// Import the mocked prisma client
import { prisma } from "~/db.server";

describe("Transform Functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("transformBoards", () => {
    it("should transform boards data successfully", async () => {
      // Mock the data
      const mockBoardsData = {
        data: [
          {
            id: "board1",
            title: "Test Board",
            description: "Test Description",
            coverImage: "https://example.com/image.jpg",
          },
        ],
      };

      // Mock the Prisma responses
      vi.mocked(prisma.boardsJson.findFirst).mockResolvedValue({
        id: "1",
        createdAt: new Date(),
        data: mockBoardsData,
      } as any);

      vi.mocked(prisma.syncMetadata.findFirst).mockResolvedValue({
        id: "1",
        entityName: "boards",
        activeVersion: 1,
        backupVersion: 0,
      } as any);

      // Call the function
      const result = await transformBoards();

      // Verify the result
      expect(result.success).toBe(true);
      expect(result.entity).toBe("boards");
      expect(result.version).toBe(2);

      // Verify that the transaction was called
      expect(prisma.$transaction).toHaveBeenCalled();

      // Verify that the metadata was updated
      expect(prisma.syncMetadata.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          activeVersion: 2,
          backupVersion: 1,
        },
      });

      // Verify that the table was cleared
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        "DELETE FROM boards_v2",
      );

      // Verify that the view was created
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'DROP VIEW IF EXISTS "boards_current"',
      );
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'CREATE VIEW "boards_current" AS SELECT * FROM "boards_v2"',
      );
    });

    it("should handle missing JSON data", async () => {
      // Mock the Prisma response for no data
      vi.mocked(prisma.boardsJson.findFirst).mockResolvedValue(null);

      // Call the function
      const result = await transformBoards();

      // Verify the result
      expect(result.success).toBe(false);
      expect(result.error).toBe("No JSON data found for boards");

      // Verify that the transaction was not called
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("should handle invalid data structure", async () => {
      // Mock the Prisma response with invalid data
      vi.mocked(prisma.boardsJson.findFirst).mockResolvedValue({
        id: "1",
        createdAt: new Date(),
        data: { notAnArray: "invalid" },
      } as any);

      vi.mocked(prisma.syncMetadata.findFirst).mockResolvedValue({
        id: "1",
        entityName: "boards",
        activeVersion: 1,
        backupVersion: 0,
      } as any);

      // Mock transaction to throw an error
      vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
        return await callback(prisma);
      });

      // Call the function
      const result = await transformBoards();

      // Verify the result
      expect(result.success).toBe(false);
      expect(result.error).toContain("Invalid boards data structure");
    });
  });

  describe("transformTalents", () => {
    it("should transform talents data successfully", async () => {
      // Mock the data
      const mockTalentsData = {
        data: [
          {
            id: "talent1",
            firstName: "John",
            lastName: "Doe",
            talentUserNumber: 12345,
            bio: "Test bio",
            profileImage: "https://example.com/profile.jpg",
            gender: "Male",
            pronouns: "he/him",
            talentType: {
              id: "type1",
              name: "model",
            },
          },
        ],
      };

      // Mock the Prisma responses
      vi.mocked(prisma.talentsJson.findFirst).mockResolvedValue({
        id: "1",
        createdAt: new Date(),
        data: mockTalentsData,
      } as any);

      vi.mocked(prisma.syncMetadata.findFirst).mockResolvedValue({
        id: "1",
        entityName: "talents",
        activeVersion: 1,
        backupVersion: 0,
      } as any);

      // Call the function
      const result = await transformTalents();

      // Verify the result
      expect(result.success).toBe(true);
      expect(result.entity).toBe("talents");
      expect(result.version).toBe(2);

      // Verify that the transaction was called
      expect(prisma.$transaction).toHaveBeenCalled();

      // Verify that the metadata was updated
      expect(prisma.syncMetadata.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          activeVersion: 2,
          backupVersion: 1,
        },
      });

      // Verify that the table was cleared
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'DELETE FROM "talents_v2"',
      );

      // Verify that the view was created
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'DROP VIEW IF EXISTS "talents_current"',
      );
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'CREATE VIEW "talents_current" AS SELECT * FROM "talents_v2"',
      );
    });
  });

  describe("transformBoardsTalents", () => {
    it("should transform boardsTalents data successfully", async () => {
      // Mock the data
      const mockBoardsTalentsData = {
        boardsTalents: [
          {
            boardId: "board1",
            talents: [{ id: "talent1" }, { id: "talent2" }],
          },
        ],
      };

      // Mock the Prisma responses
      vi.mocked(prisma.boardsTalentsJson.findFirst).mockResolvedValue({
        id: "1",
        createdAt: new Date(),
        data: mockBoardsTalentsData,
      } as any);

      vi.mocked(prisma.syncMetadata.findFirst).mockResolvedValue({
        id: "1",
        entityName: "boardstalents",
        activeVersion: 1,
        backupVersion: 0,
      } as any);

      // Call the function
      const result = await transformBoardsTalents();

      // Verify the result
      expect(result.success).toBe(true);
      expect(result.entity).toBe("boardstalents");
      expect(result.version).toBe(2);

      // Verify that the transaction was called
      expect(prisma.$transaction).toHaveBeenCalled();

      // Verify that the metadata was updated
      expect(prisma.syncMetadata.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          activeVersion: 2,
          backupVersion: 1,
        },
      });

      // Verify that the table was cleared
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        "DELETE FROM boardstalents_v2",
      );

      // Verify that the view was created
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'DROP VIEW IF EXISTS "boardstalents_current"',
      );
      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        'CREATE VIEW "boardstalents_current" AS SELECT * FROM "boardstalents_v2"',
      );
    });

    it("should handle different data structures for boardsTalents", async () => {
      // Test with data as an array directly
      const mockBoardsTalentsArray = [
        {
          boardId: "board1",
          talents: [{ id: "talent1" }],
        },
      ];

      // Mock the Prisma responses
      vi.mocked(prisma.boardsTalentsJson.findFirst).mockResolvedValue({
        id: "1",
        createdAt: new Date(),
        data: mockBoardsTalentsArray,
      } as any);

      vi.mocked(prisma.syncMetadata.findFirst).mockResolvedValue({
        id: "1",
        entityName: "boardstalents",
        activeVersion: 1,
        backupVersion: 0,
      } as any);

      // Call the function
      const result = await transformBoardsTalents();

      // Verify the result
      expect(result.success).toBe(true);
      expect(result.entity).toBe("boardstalents");
    });
  });
});
