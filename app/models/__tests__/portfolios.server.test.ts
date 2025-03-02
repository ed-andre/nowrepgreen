import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getTalentPortfolios,
  getPortfolioMedia,
  getUniqueMediaByTalent,
} from "../portfolios.server";
import { prisma } from "../../db.server";

// Mock the prisma client
vi.mock("../../db.server", () => ({
  prisma: {
    talentsPortfolios_current: {
      findMany: vi.fn(),
    },
    portfoliosMedia_current: {
      findMany: vi.fn(),
    },
  },
}));

describe("portfolios.server", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getTalentPortfolios", () => {
    const mockPortfolios = [
      {
        id: "1",
        title: "Portfolio 1",
        description: "Description 1",
        isDefault: true,
        category: "Category 1",
        coverImage: "image1.jpg",
        talentId: "talent1",
      },
      {
        id: "2",
        title: "Portfolio 2",
        description: "Description 2",
        isDefault: false,
        category: "Category 2",
        coverImage: "image2.jpg",
        talentId: "talent1",
      },
    ];

    it("should return all portfolios for a talent", async () => {
      vi.mocked(prisma.talentsPortfolios_current.findMany).mockResolvedValue(
        mockPortfolios,
      );

      const result = await getTalentPortfolios("talent1");

      expect(prisma.talentsPortfolios_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1" },
        select: {
          id: true,
          title: true,
          description: true,
          isDefault: true,
          category: true,
          coverImage: true,
        },
      });
      expect(result).toEqual(mockPortfolios);
    });

    it("should return only default portfolios when onlyDefault is true", async () => {
      vi.mocked(prisma.talentsPortfolios_current.findMany).mockResolvedValue([
        mockPortfolios[0],
      ]);

      const result = await getTalentPortfolios("talent1", {
        onlyDefault: true,
      });

      expect(prisma.talentsPortfolios_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1", isDefault: true },
        select: {
          id: true,
          title: true,
          description: true,
          isDefault: true,
          category: true,
          coverImage: true,
        },
      });
      expect(result).toEqual([mockPortfolios[0]]);
    });

    it("should return only non-default portfolios when onlyNonDefault is true", async () => {
      vi.mocked(prisma.talentsPortfolios_current.findMany).mockResolvedValue([
        mockPortfolios[1],
      ]);

      const result = await getTalentPortfolios("talent1", {
        onlyNonDefault: true,
      });

      expect(prisma.talentsPortfolios_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1", isDefault: false },
        select: {
          id: true,
          title: true,
          description: true,
          isDefault: true,
          category: true,
          coverImage: true,
        },
      });
      expect(result).toEqual([mockPortfolios[1]]);
    });

    it("should exclude default portfolios when includeDefault is false", async () => {
      vi.mocked(prisma.talentsPortfolios_current.findMany).mockResolvedValue([
        mockPortfolios[1],
      ]);

      const result = await getTalentPortfolios("talent1", {
        includeDefault: false,
      });

      expect(prisma.talentsPortfolios_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1", isDefault: false },
        select: {
          id: true,
          title: true,
          description: true,
          isDefault: true,
          category: true,
          coverImage: true,
        },
      });
      expect(result).toEqual([mockPortfolios[1]]);
    });

    it("should handle errors and rethrow them", async () => {
      const error = new Error("Database error");
      vi.mocked(prisma.talentsPortfolios_current.findMany).mockRejectedValue(
        error,
      );

      await expect(getTalentPortfolios("talent1")).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getPortfolioMedia", () => {
    it("should return all media for a portfolio", async () => {
      const mockMedia = [
        {
          id: "1",
          mediaId: "media1",
          type: "image",
          url: "url1",
          filename: "file1.jpg",
          coverImage: "true",
          order: 1,
          width: 100,
          height: 100,
          size: 1000,
          caption: "Caption 1",
          portfolioId: "portfolio1",
        },
        {
          id: "2",
          mediaId: "media2",
          type: "video",
          url: "url2",
          filename: "file2.mp4",
          coverImage: "false",
          order: 2,
          width: 200,
          height: 200,
          size: 2000,
          caption: "Caption 2",
          portfolioId: "portfolio1",
        },
      ];

      vi.mocked(prisma.portfoliosMedia_current.findMany).mockResolvedValue(
        mockMedia,
      );

      const result = await getPortfolioMedia("portfolio1");

      expect(prisma.portfoliosMedia_current.findMany).toHaveBeenCalledWith({
        where: { portfolioId: "portfolio1" },
        select: {
          id: true,
          mediaId: true,
          type: true,
          url: true,
          filename: true,
          coverImage: true,
          order: true,
          width: true,
          height: true,
          size: true,
          caption: true,
        },
      });
      expect(result).toEqual(mockMedia);
    });
  });

  describe("getUniqueMediaByTalent", () => {
    it("should return all unique media for a talent's portfolios", async () => {
      const mockPortfolios = [
        {
          id: "portfolio1",
          talentId: "talent1",
          title: "Portfolio 1",
          description: null,
          coverImage: null,
          isDefault: true,
          category: null,
        },
        {
          id: "portfolio2",
          talentId: "talent1",
          title: "Portfolio 2",
          description: null,
          coverImage: null,
          isDefault: false,
          category: null,
        },
      ];

      const mockMedia = [
        {
          id: "1",
          mediaId: "media1",
          type: "image",
          url: "url1",
          filename: "file1.jpg",
          coverImage: "true",
          order: 1,
          width: 100,
          height: 100,
          size: 1000,
          caption: "Caption 1",
          portfolioId: "portfolio1",
        },
        {
          id: "2",
          mediaId: "media2",
          type: "video",
          url: "url2",
          filename: "file2.mp4",
          coverImage: "false",
          order: 2,
          width: 200,
          height: 200,
          size: 2000,
          caption: "Caption 2",
          portfolioId: "portfolio2",
        },
      ];

      vi.mocked(prisma.talentsPortfolios_current.findMany).mockResolvedValue(
        mockPortfolios,
      );
      vi.mocked(prisma.portfoliosMedia_current.findMany).mockResolvedValue(
        mockMedia,
      );

      const result = await getUniqueMediaByTalent("talent1");

      expect(prisma.talentsPortfolios_current.findMany).toHaveBeenCalledWith({
        where: { talentId: "talent1" },
        select: { id: true },
      });
      expect(prisma.portfoliosMedia_current.findMany).toHaveBeenCalledWith({
        where: {
          portfolioId: {
            in: ["portfolio1", "portfolio2"],
          },
        },
        select: {
          id: true,
          mediaId: true,
          type: true,
          url: true,
          filename: true,
          coverImage: true,
          order: true,
          width: true,
          height: true,
          size: true,
          caption: true,
        },
        orderBy: {
          order: "asc",
        },
      });
      expect(result).toEqual(mockMedia);
    });
  });
});
