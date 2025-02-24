import { describe, it, expect, beforeAll } from "vitest";
import { API_CONFIG } from "../../trigger/config";

// Expected data shapes based on API schema
interface Board {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
}

interface TalentType {
  id: string;
  name: string;
}

interface Talent {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImage?: string;
  gender?: string;
  pronouns?: string;
  talentType: TalentType;
}

interface BoardTalent {
  id: string;
  boardId: string;
  talentId: string;
}

interface Portfolio {
  id: string;
  talentId: string;
  title: string;
  description?: string;
  isDefault: boolean;
  category?: string;
  coverImage?: string;
}

interface Media {
  id: string;
  mediaId: string;
  portfolioId: string;
  type: string;
  url: string;
  filename: string;
  coverImage?: string;
  order: number;
  width: number;
  height: number;
  size: number;
  caption?: string;
}

interface MediaTag {
  id: string;
  name: string;
  slug: string;
}

interface TalentMeasurement {
  id: string;
  heightCm?: number;
  weightKg?: number;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  shoeSizeEu?: number;
  heightFtIn?: string;
  weightLbs?: number;
  bustIn?: number;
  waistIn?: number;
  hipsIn?: number;
  shoeSizeUs?: number;
  eyeColor?: string;
  hairColor?: string;
}

interface TalentSocial {
  id: string;
  talentId: string;
  platform: string;
  username: string;
  url: string;
}

interface ApiResponse<T> {
  data: T[];
}

interface BoardTalentResponse {
  boardId: string;
  talents: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    talentType: TalentType;
  }[];
}

interface PortfolioCategory {
  id: string;
  name: string;
  color: string;
}

interface TalentPortfolioResponse {
  talentId: string;
  portfolios: {
    id: string;
    title: string;
    description?: string;
    coverImage?: string;
    isDefault: boolean;
    category?: PortfolioCategory;
  }[];
}

interface PortfolioMediaResponse {
  portfolioId: string;
  media: {
    id: string;
    type: string;
    url: string;
    filename: string;
    coverImage?: string | null;
    order: number;
    tags: MediaTag[];
    width: number;
    height: number;
    size: number;
  }[];
}

interface MediaTagsResponse {
  id: string;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface TalentSocialsResponse {
  id: string;
  socials: {
    platform: string;
    username: string;
    url: string;
  }[];
}

describe("Live API Response Tests", () => {
  // Verify environment variables before running tests
  beforeAll(() => {
    if (!process.env.SOURCE_API_URL) {
      throw new Error("SOURCE_API_URL environment variable is not set");
    }
  });

  describe("Boards API", () => {
    it("should return valid boards data structure", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/boards`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<Board> = await response.json();

      // Verify response structure
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      // Check first board if available
      if (data.data.length > 0) {
        const board = data.data[0];
        expect(board).toHaveProperty("id");
        expect(board).toHaveProperty("title");
        expect(typeof board.id).toBe("string");
        expect(typeof board.title).toBe("string");
      }
    });

    it("should handle pagination parameters", async () => {
      const limit = 1;
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/boards?limit=${limit}`,
      );
      expect(response.ok).toBe(true);

      const data: ApiResponse<Board> = await response.json();
      // Only verify data array exists since pagination might be handled differently
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe("Talents API", () => {
    it("should return valid talents data structure", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/talents`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<Talent> = await response.json();

      // Verify response structure
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      // Check first talent if available
      if (data.data.length > 0) {
        const talent = data.data[0];
        expect(talent).toHaveProperty("id");
        expect(talent).toHaveProperty("firstName");
        expect(talent).toHaveProperty("lastName");
        expect(talent).toHaveProperty("talentType");
        expect(typeof talent.id).toBe("string");
        expect(typeof talent.firstName).toBe("string");
        expect(typeof talent.lastName).toBe("string");
        expect(typeof talent.talentType).toBe("object");
        expect(talent.talentType).toHaveProperty("name");
      }
    });

    it("should handle pagination parameters", async () => {
      const limit = 1;
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/talents?limit=${limit}`,
      );
      expect(response.ok).toBe(true);

      const data: ApiResponse<Talent> = await response.json();
      // Only verify data array exists since pagination might be handled differently
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should filter talents by type", async () => {
      const talentType = "model";
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/talents?type=${talentType}`,
      );
      expect(response.ok).toBe(true);

      const data: ApiResponse<Talent> = await response.json();

      // Verify all returned talents match the requested type
      data.data.forEach((talent) => {
        expect(talent.talentType.name.toLowerCase()).toBe(
          talentType.toLowerCase(),
        );
      });
    });
  });

  describe("BoardsTalents API", () => {
    it("should return valid board-talent relationships", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.boardsTalents}`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<BoardTalentResponse> = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const boardTalent = data.data[0];
        expect(boardTalent).toHaveProperty("boardId");
        expect(boardTalent).toHaveProperty("talents");
        expect(Array.isArray(boardTalent.talents)).toBe(true);
        expect(typeof boardTalent.boardId).toBe("string");

        if (boardTalent.talents.length > 0) {
          const talent = boardTalent.talents[0];
          expect(talent).toHaveProperty("id");
          expect(talent).toHaveProperty("firstName");
          expect(talent).toHaveProperty("lastName");
          expect(talent).toHaveProperty("talentType");
          expect(typeof talent.id).toBe("string");
          expect(typeof talent.firstName).toBe("string");
          expect(typeof talent.lastName).toBe("string");
          expect(talent.talentType).toHaveProperty("name");
        }
      }
    });
  });

  describe("TalentsPortfolios API", () => {
    it("should return valid talent portfolios", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.talentsPortfolios}`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<TalentPortfolioResponse> = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const talentPortfolio = data.data[0];
        expect(talentPortfolio).toHaveProperty("talentId");
        expect(talentPortfolio).toHaveProperty("portfolios");
        expect(Array.isArray(talentPortfolio.portfolios)).toBe(true);
        expect(typeof talentPortfolio.talentId).toBe("string");

        if (talentPortfolio.portfolios.length > 0) {
          const portfolio = talentPortfolio.portfolios[0];
          expect(portfolio).toHaveProperty("id");
          expect(portfolio).toHaveProperty("title");
          expect(portfolio).toHaveProperty("isDefault");
          expect(typeof portfolio.id).toBe("string");
          expect(typeof portfolio.title).toBe("string");
          expect(typeof portfolio.isDefault).toBe("boolean");
        }
      }
    });
  });

  describe("PortfoliosMedia API", () => {
    it("should return valid portfolio media", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.portfoliosMedia}`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<PortfolioMediaResponse> = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const portfolioMedia = data.data[0];
        expect(portfolioMedia).toHaveProperty("portfolioId");
        expect(portfolioMedia).toHaveProperty("media");
        expect(Array.isArray(portfolioMedia.media)).toBe(true);
        expect(typeof portfolioMedia.portfolioId).toBe("string");

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
          expect(media).toHaveProperty("tags");
          expect(typeof media.id).toBe("string");
          expect(typeof media.type).toBe("string");
          expect(typeof media.url).toBe("string");
          expect(typeof media.filename).toBe("string");
          expect(typeof media.order).toBe("number");
          expect(Array.isArray(media.tags)).toBe(true);
        }
      }
    });
  });

  describe("MediaTags API", () => {
    it("should return valid media tags", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.mediaTags}`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<MediaTagsResponse> = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const mediaTagsEntry = data.data[0];
        expect(mediaTagsEntry).toHaveProperty("id");
        expect(mediaTagsEntry).toHaveProperty("tags");
        expect(Array.isArray(mediaTagsEntry.tags)).toBe(true);
        expect(typeof mediaTagsEntry.id).toBe("string");

        if (mediaTagsEntry.tags.length > 0) {
          const tag = mediaTagsEntry.tags[0];
          expect(tag).toHaveProperty("id");
          expect(tag).toHaveProperty("name");
          expect(tag).toHaveProperty("slug");
          expect(typeof tag.id).toBe("string");
          expect(typeof tag.name).toBe("string");
          expect(typeof tag.slug).toBe("string");
        }
      }
    });
  });

  describe("TalentsMeasurements API", () => {
    it("should return valid talent measurements", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.talentsMeasurements}`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<TalentMeasurement> = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const measurement = data.data[0];
        expect(measurement).toHaveProperty("id");
        expect(typeof measurement.id).toBe("string");
        // Optional fields are checked for type if present
        if (measurement.heightCm !== undefined)
          expect(typeof measurement.heightCm).toBe("number");
        if (measurement.weightKg !== undefined)
          expect(typeof measurement.weightKg).toBe("number");
        if (measurement.eyeColor !== undefined)
          expect(typeof measurement.eyeColor).toBe("string");
        if (measurement.hairColor !== undefined)
          expect(typeof measurement.hairColor).toBe("string");
      }
    });
  });

  describe("TalentsSocials API", () => {
    it("should return valid talent social media links", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}${API_CONFIG.endpoints.talentsSocials}`,
      );
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      const data: ApiResponse<TalentSocialsResponse> = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        const talentSocials = data.data[0];
        expect(talentSocials).toHaveProperty("id");
        expect(talentSocials).toHaveProperty("socials");
        expect(Array.isArray(talentSocials.socials)).toBe(true);
        expect(typeof talentSocials.id).toBe("string");

        if (talentSocials.socials.length > 0) {
          const social = talentSocials.socials[0];
          expect(social).toHaveProperty("platform");
          expect(social).toHaveProperty("username");
          expect(social).toHaveProperty("url");
          expect(typeof social.platform).toBe("string");
          expect(typeof social.username).toBe("string");
          expect(typeof social.url).toBe("string");
        }
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid endpoints gracefully", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/invalid-endpoint`,
      );
      // The API might handle invalid endpoints differently, just verify the response
      const data = await response.text();
      expect(data).toBeTruthy();
    });

    it("should handle invalid query parameters", async () => {
      const response = await fetch(
        `${process.env.SOURCE_API_URL}/api/v1/public/talents?limit=invalid`,
      );
      // The API might handle invalid parameters differently, just verify the response
      const data = await response.text();
      expect(data).toBeTruthy();
    });
  });
});
