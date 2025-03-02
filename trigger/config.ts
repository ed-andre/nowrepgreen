export const API_CONFIG = {
  baseUrl: process.env.SOURCE_API_URL ?? "",
  endpoints: {
    // Boards
    boards: "/api/v1/public/boards",
    // BoardsTalents
    boardsTalents: "/api/v1/public/boards/talents",
    // BoardsPortfolios
    boardsPortfolios: "/api/v1/public/boards/portfolios",
    // PortfoliosMedia
    portfoliosMedia: "/api/v1/public/portfolios/media",
    // MediaTags
    mediaTags: "/api/v1/public/portfolios/media/tags",
    // Talents
    talents: "/api/v1/public/talents",
    // TalentsPortfolios
    talentsPortfolios: "/api/v1/public/talents/portfolios",
    // TalentsMeasurements
    talentsMeasurements: "/api/v1/public/talents/measurements",
    // TalentsSocials
    talentsSocials: "/api/v1/public/talents/socials",
  },
  getFullUrl: (endpoint: string) => {
    const url = `${process.env.SOURCE_API_URL}${endpoint}`;
    console.log("Calling SOURCEAPI URL:", url);
    return url;
  },
};
