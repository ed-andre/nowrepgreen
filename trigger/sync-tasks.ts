import { task } from "@trigger.dev/sdk/v3";
import { PrismaClient } from "@prisma/client";
import { API_CONFIG } from "./config";

const prisma = new PrismaClient();

// Helper function to clean old records
async function cleanOldRecords(model: any) {
  const records = await model.findMany({
    orderBy: { createdAt: 'desc' },
    skip: 3,
  });

  if (records.length > 0) {
    await model.deleteMany({
      where: {
        id: {
          in: records.map((r: any) => r.id)
        }
      }
    });
  }
}

export const syncBoards = task({
  id: "sync-boards",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.boards));
    if (!response.ok) {
      throw new Error(`Failed to fetch boards: ${response.statusText}`);
    }

    const responseJson = await response.json();
    // Store the data array from the response
    await prisma.boardsJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.boardsJson);
  }
});

export const syncBoardsTalents = task({
  id: "sync-boards-talents",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.boardsTalents));
    if (!response.ok) {
      throw new Error(`Failed to fetch boards talents: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.boardsTalentsJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.boardsTalentsJson);
  }
});

export const syncBoardsPortfolios = task({
  id: "sync-boards-portfolios",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.boardsPortfolios));
    if (!response.ok) {
      throw new Error(`Failed to fetch boards portfolios: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.boardsPortfoliosJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.boardsPortfoliosJson);
  }
});

export const syncPortfoliosMedia = task({
  id: "sync-portfolios-media",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.portfoliosMedia));
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolios media: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.portfoliosMediaJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.portfoliosMediaJson);
  }
});

export const syncTalents = task({
  id: "sync-talents",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.talents));
    if (!response.ok) {
      throw new Error(`Failed to fetch talents: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.talentsJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.talentsJson);
  }
});

export const syncTalentsPortfolios = task({
  id: "sync-talents-portfolios",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.talentsPortfolios));
    if (!response.ok) {
      throw new Error(`Failed to fetch talents portfolios: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.talentsPortfoliosJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.talentsPortfoliosJson);
  }
});

export const syncTalentsMeasurements = task({
  id: "sync-talents-measurements",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.talentsMeasurements));
    if (!response.ok) {
      throw new Error(`Failed to fetch talents measurements: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.talentsMeasurementsJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.talentsMeasurementsJson);
  }
});

export const syncTalentsSocials = task({
  id: "sync-talents-socials",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.endpoints.talentsSocials));
    if (!response.ok) {
      throw new Error(`Failed to fetch talents socials: ${response.statusText}`);
    }

    const responseJson = await response.json();
    await prisma.talentsSocialsJson.create({
      data: {
        data: responseJson.data
      }
    });
    await cleanOldRecords(prisma.talentsSocialsJson);
  }
});



