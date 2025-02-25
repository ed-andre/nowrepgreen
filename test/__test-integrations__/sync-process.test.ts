import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "../../app/db.server";

// Mock data representing expected API responses
const mockBoardsData = {
  data: [
    {
      id: "board1",
      title: "Test Board 1",
      description: "Test Description 1",
      coverImage: "https://example.com/image1.jpg",
    },
    {
      id: "board2",
      title: "Test Board 2",
      description: "Test Description 2",
      coverImage: "https://example.com/image2.jpg",
    },
  ],
};

const mockTalentsData = {
  data: [
    {
      id: "talent1",
      firstName: "John",
      lastName: "Doe",
      bio: "Test Bio 1",
      profileImage: "https://example.com/profile1.jpg",
      gender: "male",
      pronouns: "he/him",
      talentType: "model",
    },
    {
      id: "talent2",
      firstName: "Jane",
      lastName: "Smith",
      bio: "Test Bio 2",
      profileImage: "https://example.com/profile2.jpg",
      gender: "female",
      pronouns: "she/her",
      talentType: "actor",
    },
  ],
};

describe("Data Sync Integration Tests", () => {
  beforeEach(async () => {
    // Clear all tables before each test
    await prisma.boardsJson.deleteMany();
    await prisma.talentsJson.deleteMany();
    await prisma.boards_v1.deleteMany();
    await prisma.boards_v2.deleteMany();
    await prisma.boards_current.deleteMany();
    await prisma.talents_v1.deleteMany();
    await prisma.talents_v2.deleteMany();
    await prisma.talents_current.deleteMany();

    // Reset all mocks
    vi.resetAllMocks();
  });

  describe("Source API Response Format", () => {
    beforeEach(() => {
      // Mock fetch globally
      global.fetch = vi.fn();
    });

    it("should handle boards API response format", async () => {
      // Mock successful boards API response
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockBoardsData),
      });

      const response = await fetch(`${process.env.SOURCE_API_URL}/api/boards`);
      const data = await response.json();

      // Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.SOURCE_API_URL}/api/boards`,
      );

      // Verify response format
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      // Check schema of first board
      const firstBoard = data.data[0];
      expect(firstBoard).toHaveProperty("id");
      expect(firstBoard).toHaveProperty("title");
      expect(firstBoard).toHaveProperty("description");
      expect(firstBoard).toHaveProperty("coverImage");
    });

    it("should handle talents API response format", async () => {
      // Mock successful talents API response
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTalentsData),
      });

      const response = await fetch(`${process.env.SOURCE_API_URL}/api/talents`);
      const data = await response.json();

      // Verify API was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.SOURCE_API_URL}/api/talents`,
      );

      // Verify response format
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      // Check schema of first talent
      const firstTalent = data.data[0];
      expect(firstTalent).toHaveProperty("id");
      expect(firstTalent).toHaveProperty("firstName");
      expect(firstTalent).toHaveProperty("lastName");
      expect(firstTalent).toHaveProperty("talentType");
    });

    it("should handle API errors gracefully", async () => {
      // Mock API error response
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const response = await fetch(`${process.env.SOURCE_API_URL}/api/boards`);
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe("JSON to Database Schema Mapping", () => {
    it("should correctly store and retrieve boards JSON data", async () => {
      // Store JSON data
      const stored = await prisma.boardsJson.create({
        data: { data: mockBoardsData },
      });

      // Retrieve and verify
      const retrieved = await prisma.boardsJson.findFirst({
        where: { id: stored.id },
      });

      expect(retrieved).toBeTruthy();
      expect(retrieved!.data).toEqual(mockBoardsData);
    });

    it("should correctly store and retrieve talents JSON data", async () => {
      // Store JSON data
      const stored = await prisma.talentsJson.create({
        data: { data: mockTalentsData },
      });

      // Retrieve and verify
      const retrieved = await prisma.talentsJson.findFirst({
        where: { id: stored.id },
      });

      expect(retrieved).toBeTruthy();
      expect(retrieved!.data).toEqual(mockTalentsData);
    });
  });

  describe("Data Transformation", () => {
    it("should correctly transform boards JSON to versioned tables", async () => {
      // Store JSON data first
      await prisma.boardsJson.create({
        data: { data: mockBoardsData },
      });

      // Transform data to versioned table
      const boardsToInsert = mockBoardsData.data.map((board) => ({
        id: board.id,
        title: board.title,
        description: board.description,
        coverImage: board.coverImage,
      }));

      await prisma.boards_v2.createMany({
        data: boardsToInsert,
      });

      // Verify transformation
      const transformedBoards = await prisma.boards_v2.findMany({
        orderBy: { id: "asc" },
      });

      expect(transformedBoards).toHaveLength(mockBoardsData.data.length);
      expect(transformedBoards[0]).toMatchObject({
        id: mockBoardsData.data[0].id,
        title: mockBoardsData.data[0].title,
        description: mockBoardsData.data[0].description,
        coverImage: mockBoardsData.data[0].coverImage,
      });
    });

    it("should correctly transform talents JSON to versioned tables", async () => {
      // Store JSON data first
      await prisma.talentsJson.create({
        data: { data: mockTalentsData },
      });

      // Transform data to versioned table
      const talentsToInsert = mockTalentsData.data.map((talent) => ({
        id: talent.id,
        firstName: talent.firstName,
        lastName: talent.lastName,
        bio: talent.bio,
        profileImage: talent.profileImage,
        gender: talent.gender,
        pronouns: talent.pronouns,
        talentType: talent.talentType,
      }));

      await prisma.talents_v2.createMany({
        data: talentsToInsert,
      });

      // Verify transformation
      const transformedTalents = await prisma.talents_v2.findMany({
        orderBy: { id: "asc" },
      });

      expect(transformedTalents).toHaveLength(mockTalentsData.data.length);
      expect(transformedTalents[0]).toMatchObject({
        id: mockTalentsData.data[0].id,
        firstName: mockTalentsData.data[0].firstName,
        lastName: mockTalentsData.data[0].lastName,
        bio: mockTalentsData.data[0].bio,
        profileImage: mockTalentsData.data[0].profileImage,
        gender: mockTalentsData.data[0].gender,
        pronouns: mockTalentsData.data[0].pronouns,
        talentType: mockTalentsData.data[0].talentType,
      });
    });
  });

  describe("Database Operations", () => {
    it("should maintain data integrity between versions", async () => {
      // Insert into v1
      await prisma.boards_v1.create({
        data: {
          id: "test-board",
          title: "Test Board",
          description: "V1 Description",
          coverImage: "image.jpg",
        },
      });

      // Insert into v2 with updated data
      await prisma.boards_v2.create({
        data: {
          id: "test-board",
          title: "Test Board Updated",
          description: "V2 Description",
          coverImage: "new-image.jpg",
        },
      });

      // Insert into current with final data
      await prisma.boards_current.create({
        data: {
          id: "test-board",
          title: "Test Board Final",
          description: "Current Description",
          coverImage: "final-image.jpg",
        },
      });

      // Verify all versions exist
      const v1Board = await prisma.boards_v1.findUnique({
        where: { id: "test-board" },
      });
      const v2Board = await prisma.boards_v2.findUnique({
        where: { id: "test-board" },
      });
      const currentBoard = await prisma.boards_current.findUnique({
        where: { id: "test-board" },
      });

      expect(v1Board).toBeTruthy();
      expect(v2Board).toBeTruthy();
      expect(currentBoard).toBeTruthy();
      expect(v1Board!.title).toBe("Test Board");
      expect(v2Board!.title).toBe("Test Board Updated");
      expect(currentBoard!.title).toBe("Test Board Final");
    });

    it("should handle relationships correctly", async () => {
      // Create a board and talent with unique IDs
      const boardId = `test-board-${Date.now()}`;
      const talentId = `test-talent-${Date.now()}`;
      const relationId = `test-relation-${Date.now()}`;

      await prisma.boards_current.create({
        data: {
          id: boardId,
          title: "Test Board",
          description: "Test Description",
          coverImage: "image.jpg",
        },
      });

      await prisma.talents_current.create({
        data: {
          id: talentId,
          firstName: "John",
          lastName: "Doe",
          talentType: "model",
        },
      });

      // Create relationship
      await prisma.boardsTalents_current.create({
        data: {
          id: relationId,
          boardId: boardId,
          talentId: talentId,
        },
      });

      // Verify relationship
      const relation = await prisma.boardsTalents_current.findFirst({
        where: {
          boardId: boardId,
          talentId: talentId,
        },
      });

      expect(relation).toBeTruthy();
      expect(relation!.boardId).toBe(boardId);
      expect(relation!.talentId).toBe(talentId);
    });
  });
});
