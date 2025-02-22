import { PrismaClient } from "@prisma/client";
import { task } from "@trigger.dev/sdk/v3";

import { API_CONFIG } from "./config";

const prisma = new PrismaClient();

interface EndpointConfig {
  name: string;
  endpoint: string;
  model: any;
}

const ENDPOINTS: EndpointConfig[] = [
  {
    name: "boards",
    endpoint: API_CONFIG.endpoints.boards,
    model: prisma.boardsJson,
  },
  {
    name: "boardsTalents",
    endpoint: API_CONFIG.endpoints.boardsTalents,
    model: prisma.boardsTalentsJson,
  },
  {
    name: "boardsPortfolios",
    endpoint: API_CONFIG.endpoints.boardsPortfolios,
    model: prisma.boardsPortfoliosJson,
  },
  {
    name: "portfoliosMedia",
    endpoint: API_CONFIG.endpoints.portfoliosMedia,
    model: prisma.portfoliosMediaJson,
  },
  {
    name: "talents",
    endpoint: API_CONFIG.endpoints.talents,
    model: prisma.talentsJson,
  },
  {
    name: "talentsPortfolios",
    endpoint: API_CONFIG.endpoints.talentsPortfolios,
    model: prisma.talentsPortfoliosJson,
  },
  {
    name: "talentsMeasurements",
    endpoint: API_CONFIG.endpoints.talentsMeasurements,
    model: prisma.talentsMeasurementsJson,
  },
  {
    name: "talentsSocials",
    endpoint: API_CONFIG.endpoints.talentsSocials,
    model: prisma.talentsSocialsJson,
  },
  {
    name: "mediaTags",
    endpoint: API_CONFIG.endpoints.mediaTags,
    model: prisma.mediaTagsJson,
  },
];

async function cleanOldRecords(model: any) {
  const records = await model.findMany({
    orderBy: { createdAt: "desc" },
    skip: 3,
  });

  if (records.length > 0) {
    await model.deleteMany({
      where: {
        id: {
          in: records.map((r: any) => r.id),
        },
      },
    });
  }
}

async function fetchAndStoreData(config: EndpointConfig) {
  try {
    const response = await fetch(API_CONFIG.getFullUrl(config.endpoint));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    await config.model.create({
      data: {
        data: data.data,
      },
    });
    await cleanOldRecords(config.model);

    return {
      name: config.name,
      success: true,
    };
  } catch (error) {
    return {
      name: config.name,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const syncAllJson = task({
  id: "sync-all-json",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
  },
  run: async () => {
    const results = await Promise.all(ENDPOINTS.map(fetchAndStoreData));

    const failures = results.filter((result) => !result.success);
    if (failures.length > 0) {
      throw new Error(
        `Failed to sync: ${failures
          .map((f) => `${f.name} (${f.error})`)
          .join(", ")}`,
      );
    }

    return {
      success: true,
      syncedEndpoints: results.map((r) => r.name),
    };
  },
});
