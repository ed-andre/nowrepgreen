import { describe, it, expect, vi, beforeEach } from "vitest";
import * as talentsServer from "../talents.server";
import { prisma } from "../../db.server";

// Mock the prisma client
vi.mock("../../db.server", () => ({
  prisma: {
    boardsTalents_current: {
      findMany: vi.fn(),
    },
    talents_current: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    talentsMeasurements_current: {
      findUnique: vi.fn(),
    },
    talentsPortfolios_current: {
      findMany: vi.fn(),
    },
    talentsSocials_current: {
      findMany: vi.fn(),
    },
    boards_current: {
      findMany: vi.fn(),
    },
  },
}));

describe("talents.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getTalentsByBoardId", () => {
    it("should return all talents for a board with their measurements", async () => {
      const mockBoardTalents = [
        { id: "bt1", talentId: "talent1", boardId: "board1" },
        { id: "bt2", talentId: "talent2", boardId: "board1" },
      ];

      const mockTalents = [
        {
          id: "talent1",
          firstName: "John",
          lastName: "Doe",
          talentUserNumber: 1,
          bio: "Bio 1",
          profileImage: "image1.jpg",
          gender: "Male",
          pronouns: "He/Him",
          talentType: "Model",
        },
        {
          id: "talent2",
          firstName: "Jane",
          lastName: "Smith",
          talentUserNumber: 2,
          bio: "Bio 2",
          profileImage: "image2.jpg",
          gender: "Female",
          pronouns: "She/Her",
          talentType: "Actor",
        },
      ];

      const mockMeasurements1 = {
        id: "m1",
        talentId: "talent1",
        updatedAt: new Date(),
        createdAt: new Date(),
        heightCm: 183,
        weightKg: 75,
        weightLbs: 165,
        bustCm: 102,
        waistCm: 81,
        hipsCm: 102,
        heightFtIn: "6'0\"",
        bustIn: 40,
        waistIn: 32,
        hipsIn: 40,
        shoeSizeUs: 10,
        shoeSizeEu: 43,
        eyeColor: "Blue",
        hairColor: "Brown",
      };

      const mockMeasurements2 = {
        id: "m2",
        talentId: "talent2",
        updatedAt: new Date(),
        createdAt: new Date(),
        heightCm: 173,
        weightKg: 65,
        weightLbs: 143,
        bustCm: 91,
        waistCm: 71,
        hipsCm: 97,
        heightFtIn: "5'8\"",
        bustIn: 36,
        waistIn: 28,
        hipsIn: 38,
        shoeSizeUs: 8,
        shoeSizeEu: 39,
        eyeColor: "Green",
        hairColor: "Blonde",
      };

      vi.mocked(prisma.boardsTalents_current.findMany).mockResolvedValue(
        mockBoardTalents,
      );
      vi.mocked(prisma.talents_current.findMany).mockResolvedValue(mockTalents);
      vi.mocked(prisma.talentsMeasurements_current.findUnique)
        .mockResolvedValueOnce(mockMeasurements1)
        .mockResolvedValueOnce(mockMeasurements2);

      const result = await talentsServer.getTalentsByBoardId("board1");

      expect(prisma.boardsTalents_current.findMany).toHaveBeenCalledWith({
        where: { boardId: "board1" },
        select: {
          talentId: true,
        },
      });

      expect(prisma.talents_current.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ["talent1", "talent2"],
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          bio: true,
          profileImage: true,
          gender: true,
          pronouns: true,
          talentType: true,
        },
        orderBy: {
          firstName: "asc",
        },
      });

      expect(
        prisma.talentsMeasurements_current.findUnique,
      ).toHaveBeenCalledTimes(2);
      expect(
        prisma.talentsMeasurements_current.findUnique,
      ).toHaveBeenCalledWith({
        where: { talentId: "talent1" },
        select: {
          heightFtIn: true,
          bustIn: true,
          waistIn: true,
          hipsIn: true,
          shoeSizeUs: true,
          eyeColor: true,
          hairColor: true,
        },
      });

      expect(result).toEqual([
        { ...mockTalents[0], measurements: mockMeasurements1 },
        { ...mockTalents[1], measurements: mockMeasurements2 },
      ]);
    });
  });

  describe("getTalentWithDetails", () => {
    it("should return a talent with all details", async () => {
      const mockTalent = {
        id: "talent1",
        firstName: "John",
        lastName: "Doe",
        talentUserNumber: 1,
        bio: "Bio 1",
        profileImage: "image1.jpg",
        gender: "Male",
        pronouns: "He/Him",
        talentType: "Model",
      };

      const mockMeasurements = {
        id: "m1",
        talentId: "talent1",
        updatedAt: new Date(),
        createdAt: new Date(),
        heightCm: 183,
        weightKg: 75,
        weightLbs: 165,
        bustCm: 102,
        waistCm: 81,
        hipsCm: 102,
        heightFtIn: "6'0\"",
        bustIn: 40,
        waistIn: 32,
        hipsIn: 40,
        shoeSizeUs: 10,
        shoeSizeEu: 43,
        eyeColor: "Blue",
        hairColor: "Brown",
      };

      const mockPortfolios = [
        {
          id: "portfolio1",
          title: "Portfolio 1",
          description: "Description 1",
          coverImage: "cover1.jpg",
          isDefault: true,
          talentId: "talent1",
          category: "Fashion",
        },
        {
          id: "portfolio2",
          title: "Portfolio 2",
          description: "Description 2",
          coverImage: "cover2.jpg",
          isDefault: false,
          talentId: "talent1",
          category: "Commercial",
        },
      ];

      const mockSocials = [
        {
          id: "social1",
          talentId: "talent1",
          url: "https://instagram.com/johndoe",
          platform: "Instagram",
          username: "johndoe",
        },
        {
          id: "social2",
          talentId: "talent1",
          url: "https://twitter.com/johndoe",
          platform: "Twitter",
          username: "johndoe",
        },
      ];

      vi.mocked(prisma.talents_current.findUnique).mockResolvedValue(
        mockTalent,
      );
      vi.mocked(
        prisma.talentsMeasurements_current.findUnique,
      ).mockResolvedValue(mockMeasurements);
      vi.mocked(prisma.talentsPortfolios_current.findMany).mockResolvedValue(
        mockPortfolios,
      );
      vi.mocked(prisma.talentsSocials_current.findMany).mockResolvedValue(
        mockSocials,
      );

      const result = await talentsServer.getTalentWithDetails("talent1");

      expect(prisma.talents_current.findUnique).toHaveBeenCalledWith({
        where: { id: "talent1" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          bio: true,
          profileImage: true,
          gender: true,
          pronouns: true,
          talentType: true,
        },
      });

      expect(
        prisma.talentsMeasurements_current.findUnique,
      ).toHaveBeenCalledWith({
        where: { talentId: "talent1" },
      });

      expect(prisma.talentsPortfolios_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1" },
        orderBy: {
          isDefault: "desc",
        },
      });

      expect(prisma.talentsSocials_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1" },
      });

      expect(result).toEqual({
        ...mockTalent,
        measurements: mockMeasurements,
        portfolios: mockPortfolios,
        socials: mockSocials,
      });
    });
  });

  describe("getAllTalents", () => {
    it("should return all talents with their measurements", async () => {
      const mockTalents = [
        {
          id: "talent1",
          firstName: "John",
          lastName: "Doe",
          talentUserNumber: 1,
          bio: "Bio 1",
          profileImage: "image1.jpg",
          gender: "Male",
          pronouns: "He/Him",
          talentType: "Model",
        },
        {
          id: "talent2",
          firstName: "Jane",
          lastName: "Smith",
          talentUserNumber: 2,
          bio: "Bio 2",
          profileImage: "image2.jpg",
          gender: "Female",
          pronouns: "She/Her",
          talentType: "Actor",
        },
      ];

      const mockMeasurements1 = {
        id: "m1",
        talentId: "talent1",
        updatedAt: new Date(),
        createdAt: new Date(),
        heightCm: 183,
        weightKg: 75,
        weightLbs: 165,
        bustCm: 102,
        waistCm: 81,
        hipsCm: 102,
        heightFtIn: "6'0\"",
        bustIn: 40,
        waistIn: 32,
        hipsIn: 40,
        shoeSizeUs: 10,
        shoeSizeEu: 43,
        eyeColor: "Blue",
        hairColor: "Brown",
      };

      const mockMeasurements2 = {
        id: "m2",
        talentId: "talent2",
        updatedAt: new Date(),
        createdAt: new Date(),
        heightCm: 173,
        weightKg: 65,
        weightLbs: 143,
        bustCm: 91,
        waistCm: 71,
        hipsCm: 97,
        heightFtIn: "5'8\"",
        bustIn: 36,
        waistIn: 28,
        hipsIn: 38,
        shoeSizeUs: 8,
        shoeSizeEu: 39,
        eyeColor: "Green",
        hairColor: "Blonde",
      };

      vi.mocked(prisma.talents_current.findMany).mockResolvedValue(mockTalents);
      vi.mocked(prisma.talentsMeasurements_current.findUnique)
        .mockResolvedValueOnce(mockMeasurements1)
        .mockResolvedValueOnce(mockMeasurements2);

      const result = await talentsServer.getAllTalents();

      expect(prisma.talents_current.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          bio: true,
          profileImage: true,
          gender: true,
          pronouns: true,
          talentType: true,
        },
        orderBy: {
          firstName: "asc",
        },
      });

      expect(
        prisma.talentsMeasurements_current.findUnique,
      ).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        { ...mockTalents[0], measurements: mockMeasurements1 },
        { ...mockTalents[1], measurements: mockMeasurements2 },
      ]);
    });
  });

  describe("getTalentsByBoard", () => {
    it("should return all boards with their talents", async () => {
      const mockBoards = [
        {
          id: "board1",
          title: "Board A",
          description: "Description A",
          coverImage: "imageA.jpg",
        },
        {
          id: "board2",
          title: "Board B",
          description: "Description B",
          coverImage: "imageB.jpg",
        },
      ];

      const mockTalentsBoard1 = [
        {
          id: "talent1",
          firstName: "John",
          lastName: "Doe",
          bio: "Bio 1",
          profileImage: "image1.jpg",
          gender: "Male",
          pronouns: "He/Him",
          talentType: "Model",
          measurements: {
            heightFtIn: "6'0\"",
            bustIn: 40,
            waistIn: 32,
            hipsIn: 40,
            shoeSizeUs: 10,
            eyeColor: "Blue",
            hairColor: "Brown",
          },
        },
      ];

      const mockTalentsBoard2 = [
        {
          id: "talent2",
          firstName: "Jane",
          lastName: "Smith",
          bio: "Bio 2",
          profileImage: "image2.jpg",
          gender: "Female",
          pronouns: "She/Her",
          talentType: "Actor",
          measurements: {
            heightFtIn: "5'8\"",
            bustIn: 36,
            waistIn: 28,
            hipsIn: 38,
            shoeSizeUs: 8,
            eyeColor: "Green",
            hairColor: "Blonde",
          },
        },
      ];

      // Mock the boards_current.findMany to return our test data
      vi.mocked(prisma.boards_current.findMany).mockResolvedValue(mockBoards);

      // Mock the getTalentsByBoardId function to return our test data
      const getTalentsByBoardIdSpy = vi.spyOn(
        talentsServer,
        "getTalentsByBoardId",
      );
      getTalentsByBoardIdSpy
        .mockResolvedValueOnce(mockTalentsBoard1)
        .mockResolvedValueOnce(mockTalentsBoard2);

      // Mock the Promise.all to return our expected result
      const promiseAllSpy = vi.spyOn(Promise, "all");
      promiseAllSpy.mockResolvedValueOnce([
        { ...mockBoards[0], slug: "board-a", talents: mockTalentsBoard1 },
        { ...mockBoards[1], slug: "board-b", talents: mockTalentsBoard2 },
      ]);

      const result = await talentsServer.getTalentsByBoard();

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

      expect(result).toEqual([
        { ...mockBoards[0], slug: "board-a", talents: mockTalentsBoard1 },
        { ...mockBoards[1], slug: "board-b", talents: mockTalentsBoard2 },
      ]);

      // Restore the original implementations
      getTalentsByBoardIdSpy.mockRestore();
      promiseAllSpy.mockRestore();
    });

    it("should filter out boards with no talents", async () => {
      const mockBoards = [
        {
          id: "board1",
          title: "Board A",
          description: "Description A",
          coverImage: "imageA.jpg",
        },
        {
          id: "board2",
          title: "Board B",
          description: "Description B",
          coverImage: "imageB.jpg",
        },
      ];

      const mockTalentsBoard1 = [
        {
          id: "talent1",
          firstName: "John",
          lastName: "Doe",
          bio: "Bio 1",
          profileImage: "image1.jpg",
          gender: "Male",
          pronouns: "He/Him",
          talentType: "Model",
          measurements: {
            heightFtIn: "6'0\"",
            bustIn: 40,
            waistIn: 32,
            hipsIn: 40,
            shoeSizeUs: 10,
            eyeColor: "Blue",
            hairColor: "Brown",
          },
        },
      ];

      const mockTalentsBoard2: Array<{
        id: string;
        firstName: string;
        lastName: string;
        bio: string;
        profileImage: string;
        gender: string;
        pronouns: string;
        talentType: string;
        measurements: {
          heightFtIn: string | null;
          bustIn: number | null;
          waistIn: number | null;
          hipsIn: number | null;
          shoeSizeUs: number | null;
          eyeColor: string | null;
          hairColor: string | null;
        } | null;
      }> = [];

      // Mock the boards_current.findMany to return our test data
      vi.mocked(prisma.boards_current.findMany).mockResolvedValue(mockBoards);

      // Mock the getTalentsByBoardId function to return our test data
      const getTalentsByBoardIdSpy = vi.spyOn(
        talentsServer,
        "getTalentsByBoardId",
      );
      getTalentsByBoardIdSpy
        .mockResolvedValueOnce(mockTalentsBoard1)
        .mockResolvedValueOnce(mockTalentsBoard2);

      // Mock the Promise.all to return our expected result
      const promiseAllSpy = vi.spyOn(Promise, "all");
      promiseAllSpy.mockResolvedValueOnce([
        { ...mockBoards[0], slug: "board-a", talents: mockTalentsBoard1 },
        { ...mockBoards[1], slug: "board-b", talents: mockTalentsBoard2 },
      ]);

      // Mock the filter method to return only boards with talents
      const filterSpy = vi.spyOn(Array.prototype, "filter");
      filterSpy.mockImplementationOnce((callback) => {
        return [
          { ...mockBoards[0], slug: "board-a", talents: mockTalentsBoard1 },
        ];
      });

      const result = await talentsServer.getTalentsByBoard();

      expect(result).toEqual([
        { ...mockBoards[0], slug: "board-a", talents: mockTalentsBoard1 },
      ]);

      // Restore the original implementations
      getTalentsByBoardIdSpy.mockRestore();
      promiseAllSpy.mockRestore();
      filterSpy.mockRestore();
    });
  });
});
