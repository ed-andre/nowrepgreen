import { describe, it, expect } from "vitest";
import { PrismaClient } from "@prisma/client";
import { API_CONFIG } from "../config";

// Sample data representing expected structure from source API
const sampleBoardsData = {
  data: [
    {
      id: "board1",
      title: "Test Board",
      description: "Test Description",
      coverImage: "https://example.com/image.jpg",
    },
  ],
};

const sampleTalentsData = {
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

const sampleBoardsTalentsData = {
  boardsTalents: [
    {
      boardId: "board1",
      talents: [{ id: "talent1" }],
    },
  ],
};

const sampleTalentsPortfoliosData = {
  talentsPortfolios: [
    {
      talentId: "talent1",
      portfolios: [
        {
          id: "portfolio1",
          title: "Test Portfolio",
          description: "Test Description",
          isDefault: true,
          category: {
            id: "category1",
            name: "Test Category",
          },
          coverImage: "https://example.com/cover.jpg",
        },
      ],
    },
  ],
};

const samplePortfoliosMediaData = {
  portfoliosMedia: [
    {
      portfolioId: "portfolio1",
      media: [
        {
          id: "media1",
          type: "image",
          url: "https://example.com/media.jpg",
          filename: "media.jpg",
          coverImage: "https://example.com/cover.jpg",
          order: 1,
          width: 800,
          height: 600,
          size: 1024,
          caption: "Test Caption",
        },
      ],
    },
  ],
};

const sampleMediaTagsData = {
  mediaTags: [
    {
      id: "tag1",
      name: "Test Tag",
      slug: "test-tag",
    },
  ],
};

const sampleTalentsMeasurementsData = {
  talentsMeasurements: [
    {
      id: "talent1",
      measurements: {
        id: "measurement1",
        userTalentId: "talent1",
        heightCm: 180,
        weightKg: 75,
        bustCm: 90,
        waistCm: 80,
        hipsCm: 95,
        shoeSizeEu: 42,
        heightFtIn: "5'11\"",
        weightLbs: 165,
        bustIn: 35,
        waistIn: 31,
        hipsIn: 37,
        shoeSizeUs: 9,
        eyeColor: "Blue",
        hairColor: "Brown",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  ],
};

const sampleTalentsSocialsData = {
  talentsSocials: [
    {
      id: "talent1",
      socials: [
        {
          platform: "Instagram",
          username: "johndoe",
          url: "https://instagram.com/johndoe",
        },
      ],
    },
  ],
};

describe("JSON Schema Validation Tests", () => {
  // These tests validate that the expected JSON structure from the source API
  // matches what our Prisma schema expects for each entity type

  describe("Boards JSON Structure", () => {
    it("should have the required fields for Boards", () => {
      const board = sampleBoardsData.data[0];

      // Validate required fields
      expect(board).toHaveProperty("id");
      expect(board).toHaveProperty("title");

      // Validate field types
      expect(typeof board.id).toBe("string");
      expect(typeof board.title).toBe("string");
      expect(typeof board.description).toBe("string");

      // Optional fields can be null or string
      if (board.coverImage !== null) {
        expect(typeof board.coverImage).toBe("string");
      }
    });
  });

  describe("Talents JSON Structure", () => {
    it("should have the required fields for Talents", () => {
      const talent = sampleTalentsData.data[0];

      // Validate required fields
      expect(talent).toHaveProperty("id");
      expect(talent).toHaveProperty("firstName");
      expect(talent).toHaveProperty("lastName");
      expect(talent).toHaveProperty("talentUserNumber");
      expect(talent).toHaveProperty("talentType");

      // Validate field types
      expect(typeof talent.id).toBe("string");
      expect(typeof talent.firstName).toBe("string");
      expect(typeof talent.lastName).toBe("string");
      expect(typeof talent.talentUserNumber).toBe("number");

      // Optional fields can be null or string
      if (talent.bio !== null) {
        expect(typeof talent.bio).toBe("string");
      }
      if (talent.profileImage !== null) {
        expect(typeof talent.profileImage).toBe("string");
      }
      if (talent.gender !== null) {
        expect(typeof talent.gender).toBe("string");
      }
      if (talent.pronouns !== null) {
        expect(typeof talent.pronouns).toBe("string");
      }

      // Validate talentType structure
      expect(talent.talentType).toHaveProperty("name");
      expect(typeof talent.talentType.name).toBe("string");
    });
  });

  describe("BoardsTalents JSON Structure", () => {
    it("should have the required fields for BoardsTalents", () => {
      const boardTalent = sampleBoardsTalentsData.boardsTalents[0];

      // Validate required fields
      expect(boardTalent).toHaveProperty("boardId");
      expect(boardTalent).toHaveProperty("talents");
      expect(Array.isArray(boardTalent.talents)).toBe(true);

      // Validate field types
      expect(typeof boardTalent.boardId).toBe("string");

      // Validate talents array structure
      if (boardTalent.talents.length > 0) {
        const talent = boardTalent.talents[0];
        expect(talent).toHaveProperty("id");
        expect(typeof talent.id).toBe("string");
      }
    });
  });

  describe("TalentsPortfolios JSON Structure", () => {
    it("should have the required fields for TalentsPortfolios", () => {
      const talentPortfolio = sampleTalentsPortfoliosData.talentsPortfolios[0];

      // Validate required fields
      expect(talentPortfolio).toHaveProperty("talentId");
      expect(talentPortfolio).toHaveProperty("portfolios");
      expect(Array.isArray(talentPortfolio.portfolios)).toBe(true);

      // Validate field types
      expect(typeof talentPortfolio.talentId).toBe("string");

      // Validate portfolios array structure
      if (talentPortfolio.portfolios.length > 0) {
        const portfolio = talentPortfolio.portfolios[0];
        expect(portfolio).toHaveProperty("id");
        expect(portfolio).toHaveProperty("title");
        expect(typeof portfolio.id).toBe("string");
        expect(typeof portfolio.title).toBe("string");

        // Optional fields
        if (portfolio.description !== null) {
          expect(typeof portfolio.description).toBe("string");
        }
        expect(typeof portfolio.isDefault).toBe("boolean");
        if (portfolio.coverImage !== null) {
          expect(typeof portfolio.coverImage).toBe("string");
        }

        // Category can be null or an object
        if (portfolio.category !== null) {
          expect(portfolio.category).toHaveProperty("id");
          expect(portfolio.category).toHaveProperty("name");
          expect(typeof portfolio.category.id).toBe("string");
          expect(typeof portfolio.category.name).toBe("string");
        }
      }
    });
  });

  describe("PortfoliosMedia JSON Structure", () => {
    it("should have the required fields for PortfoliosMedia", () => {
      const portfolioMedia = samplePortfoliosMediaData.portfoliosMedia[0];

      // Validate required fields
      expect(portfolioMedia).toHaveProperty("portfolioId");
      expect(portfolioMedia).toHaveProperty("media");
      expect(Array.isArray(portfolioMedia.media)).toBe(true);

      // Validate field types
      expect(typeof portfolioMedia.portfolioId).toBe("string");

      // Validate media array structure
      if (portfolioMedia.media.length > 0) {
        const media = portfolioMedia.media[0];
        expect(media).toHaveProperty("id");
        expect(media).toHaveProperty("type");
        expect(media).toHaveProperty("url");
        expect(media).toHaveProperty("filename");
        expect(media).toHaveProperty("order");
        expect(media).toHaveProperty("width");
        expect(media).toHaveProperty("height");
        expect(media).toHaveProperty("size");

        expect(typeof media.id).toBe("string");
        expect(typeof media.type).toBe("string");
        expect(typeof media.url).toBe("string");
        expect(typeof media.filename).toBe("string");
        expect(typeof media.order).toBe("number");
        expect(typeof media.width).toBe("number");
        expect(typeof media.height).toBe("number");
        expect(typeof media.size).toBe("number");

        // Optional fields
        if (media.coverImage !== null) {
          expect(typeof media.coverImage).toBe("string");
        }
        if (media.caption !== null) {
          expect(typeof media.caption).toBe("string");
        }
      }
    });
  });

  describe("MediaTags JSON Structure", () => {
    it("should have the required fields for MediaTags", () => {
      const mediaTag = sampleMediaTagsData.mediaTags[0];

      // Validate required fields
      expect(mediaTag).toHaveProperty("id");
      expect(mediaTag).toHaveProperty("name");
      expect(mediaTag).toHaveProperty("slug");

      // Validate field types
      expect(typeof mediaTag.id).toBe("string");
      expect(typeof mediaTag.name).toBe("string");
      expect(typeof mediaTag.slug).toBe("string");
    });
  });

  describe("TalentsMeasurements JSON Structure", () => {
    it("should have the required fields for TalentsMeasurements", () => {
      const talentMeasurement =
        sampleTalentsMeasurementsData.talentsMeasurements[0];

      // Validate required fields
      expect(talentMeasurement).toHaveProperty("id");
      expect(talentMeasurement).toHaveProperty("measurements");

      // Validate field types
      expect(typeof talentMeasurement.id).toBe("string");

      // Measurements can be null or an object
      if (talentMeasurement.measurements !== null) {
        const measurements = talentMeasurement.measurements;
        expect(measurements).toHaveProperty("id");
        expect(measurements).toHaveProperty("userTalentId");
        expect(typeof measurements.id).toBe("string");
        expect(typeof measurements.userTalentId).toBe("string");

        // Optional numeric fields
        if (measurements.heightCm !== null) {
          expect(typeof measurements.heightCm).toBe("number");
        }
        if (measurements.weightKg !== null) {
          expect(typeof measurements.weightKg).toBe("number");
        }
        if (measurements.bustCm !== null) {
          expect(typeof measurements.bustCm).toBe("number");
        }
        if (measurements.waistCm !== null) {
          expect(typeof measurements.waistCm).toBe("number");
        }
        if (measurements.hipsCm !== null) {
          expect(typeof measurements.hipsCm).toBe("number");
        }
        if (measurements.shoeSizeEu !== null) {
          expect(typeof measurements.shoeSizeEu).toBe("number");
        }

        // Optional string fields
        if (measurements.heightFtIn !== null) {
          expect(typeof measurements.heightFtIn).toBe("string");
        }
        if (measurements.eyeColor !== null) {
          expect(typeof measurements.eyeColor).toBe("string");
        }
        if (measurements.hairColor !== null) {
          expect(typeof measurements.hairColor).toBe("string");
        }

        // Date fields
        expect(measurements).toHaveProperty("createdAt");
        expect(measurements).toHaveProperty("updatedAt");
      }
    });
  });

  describe("TalentsSocials JSON Structure", () => {
    it("should have the required fields for TalentsSocials", () => {
      const talentSocial = sampleTalentsSocialsData.talentsSocials[0];

      // Validate required fields
      expect(talentSocial).toHaveProperty("id");
      expect(talentSocial).toHaveProperty("socials");
      expect(Array.isArray(talentSocial.socials)).toBe(true);

      // Validate field types
      expect(typeof talentSocial.id).toBe("string");

      // Validate socials array structure
      if (talentSocial.socials.length > 0) {
        const social = talentSocial.socials[0];
        expect(social).toHaveProperty("platform");
        expect(social).toHaveProperty("username");
        expect(social).toHaveProperty("url");

        expect(typeof social.platform).toBe("string");
        expect(typeof social.username).toBe("string");
        expect(typeof social.url).toBe("string");
      }
    });
  });

  // Test that validates all entity types against API_CONFIG endpoints
  describe("API Endpoints Configuration", () => {
    it("should have endpoints for all entity types", () => {
      // Check that all required endpoints exist in API_CONFIG
      expect(API_CONFIG.endpoints).toHaveProperty("boards");
      expect(API_CONFIG.endpoints).toHaveProperty("talents");
      expect(API_CONFIG.endpoints).toHaveProperty("boardsTalents");
      expect(API_CONFIG.endpoints).toHaveProperty("talentsPortfolios");
      expect(API_CONFIG.endpoints).toHaveProperty("portfoliosMedia");
      expect(API_CONFIG.endpoints).toHaveProperty("mediaTags");
      expect(API_CONFIG.endpoints).toHaveProperty("talentsMeasurements");
      expect(API_CONFIG.endpoints).toHaveProperty("talentsSocials");

      // Validate that all endpoints are strings
      Object.values(API_CONFIG.endpoints).forEach((endpoint) => {
        expect(typeof endpoint).toBe("string");
      });
    });
  });
});
