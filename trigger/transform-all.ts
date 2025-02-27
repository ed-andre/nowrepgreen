import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import { task } from "@trigger.dev/sdk/v3";

import { prisma } from "./db.server";

interface TransformResult {
  entity: string;
  success: boolean;
  error?: string;
  version?: number;
}

interface Board {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
}

interface BoardTalent {
  boardId: string;
  talents: Array<{
    id: string;
  }>;
}

interface BoardPortfolio {
  boardId: string;
  portfolios: Array<{
    id: string;
    talentId: string;
  }>;
}

interface PortfolioMedia {
  portfolioId: string;
  media: Array<{
    id: string;
    filename: string;
    type: string;
    url: string;
    width: number;
    height: number;
    size: number;
    caption: string | null;
    coverImage: string | null;
    order: number;
    tags: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }>;
}

interface MediaTag {
  id: string;
  name: string;
  slug: string;
}

interface MediaTagsResponse {
  data: Array<{
    id: string; // mediaId
    tags: MediaTag[];
  }>;
}

interface Talent {
  id: string;
  firstName: string;
  lastName: string;
  talentUserNumber: number;
  bio: string | null;
  profileImage: string | null;
  gender: string | null;
  pronouns: string | null;
  talentType: {
    id: string;
    name: string;
  };
}

interface TalentPortfolio {
  talentId: string;
  portfolios: Array<{
    id: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    isDefault: boolean;
    category: {
      id: string;
      name: string;
      color: string;
    } | null;
  }>;
}

interface TalentMeasurement {
  id: string;
  measurements: {
    id: string;
    userTalentId: string;
    heightCm: number | null;
    weightKg: number | null;
    bustCm: number | null;
    waistCm: number | null;
    hipsCm: number | null;
    shoeSizeEu: number | null;
    heightFtIn: string | null;
    weightLbs: number | null;
    bustIn: number | null;
    waistIn: number | null;
    hipsIn: number | null;
    shoeSizeUs: number | null;
    eyeColor: string | null;
    hairColor: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface TalentSocial {
  id: string;
  socials: Array<{
    platform: string;
    username: string;
    url: string;
  }>;
}

async function getNextVersion(entity: string) {
  const current = await prisma.syncMetadata.findFirst({
    where: { entityName: entity },
    orderBy: { id: "desc" }, // Get the latest record
  });

  // If no current version, start with 1
  if (!current?.activeVersion) {
    return {
      newVersion: 1,
      oldVersion: undefined,
    };
  }

  // Log current state for debugging
  console.log("Current version state:", {
    currentActive: current.activeVersion,
    currentBackup: current.backupVersion,
    willSwitchTo: current.activeVersion === 1 ? 2 : 1,
  });

  // Alternate between 1 and 2
  return {
    newVersion: current.activeVersion === 1 ? 2 : 1,
    oldVersion: current.activeVersion,
  };
}

async function updateVersionAndViews(
  tx: Prisma.TransactionClient,
  entity: string,
  versions: { newVersion: number; oldVersion?: number },
) {
  // Get current metadata to ensure proper version tracking
  const current = await tx.syncMetadata.findFirst({
    where: { entityName: entity },
    orderBy: { id: "desc" },
  });

  if (current) {
    // Update existing record
    await tx.syncMetadata.update({
      where: { id: current.id },
      data: {
        activeVersion: versions.newVersion,
        backupVersion: current.activeVersion,
      },
    });
  } else {
    // Create first record
    await tx.syncMetadata.create({
      data: {
        entityName: entity,
        activeVersion: versions.newVersion,
        backupVersion: 0,
      },
    });
  }

  // Handle view update with proper case and error handling
  try {
    await tx.$executeRawUnsafe(`DROP VIEW IF EXISTS "${entity}_current"`);
  } catch (error) {
    // If it fails because it's a table, try to drop table
    await tx.$executeRawUnsafe(`DROP TABLE IF EXISTS "${entity}_current"`);
  }

  await tx.$executeRawUnsafe(
    `CREATE VIEW "${entity}_current" AS SELECT * FROM "${entity}_v${versions.newVersion}"`,
  );
}

async function transformBoards(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.boardsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for boards");
    }

    const { newVersion, oldVersion } = await getNextVersion("boards");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `boards_v${newVersion}`,
      previousVersion: oldVersion ? `boards_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `boards_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM ${targetTable}`);

      const jsonData =
        typeof latestJson.data === "string"
          ? JSON.parse(latestJson.data)
          : latestJson.data;

      const boards = Array.isArray(jsonData) ? jsonData : jsonData.data;

      if (!Array.isArray(boards)) {
        throw new Error(
          `Invalid boards data structure: ${JSON.stringify(jsonData)}`,
        );
      }

      console.log("Data operation:", {
        action: "Inserting records",
        targetTable,
        recordCount: boards.length,
      });

      // Insert records one by one
      for (const board of boards) {
        await tx.$executeRaw`
          INSERT INTO ${Prisma.raw(targetTable)}
          (id, title, description, coverImage)
          VALUES (${board.id}, ${board.title}, ${board.description}, ${board.coverImage})
        `;
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `boards_v${newVersion}`,
        newBackupVersion: `boards_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "boards", { newVersion, oldVersion });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `boards_v${newVersion}`,
      viewUpdated: "boards_current",
    });

    return {
      entity: "boards",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "boards",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformBoardsTalents(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.boardsTalentsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for boardstalents");
    }

    const { newVersion, oldVersion } = await getNextVersion("boardstalents");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `boardstalents_v${newVersion}`,
      previousVersion: oldVersion ? `boardstalents_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `boardstalents_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM ${targetTable}`);

      // Data is already in the correct format
      const boardTalents = latestJson.data as any[];

      console.log("Data operation:", {
        action: "Inserting relationships",
        targetTable,
        boardCount: boardTalents.length,
        totalRelationships: boardTalents.reduce(
          (sum, board) => sum + board.talents.length,
          0,
        ),
      });

      // Insert relationships
      for (const board of boardTalents) {
        for (const talent of board.talents) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, boardId, talentId)
            VALUES (${createId()}, ${board.boardId}, ${talent.id})
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `boardstalents_v${newVersion}`,
        newBackupVersion: `boardstalents_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "boardstalents", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `boardstalents_v${newVersion}`,
      viewUpdated: "boardstalents_current",
    });

    return {
      entity: "boardstalents",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "boardstalents",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformBoardsPortfolios(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.boardsPortfoliosJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for boardsportfolios");
    }

    const { newVersion, oldVersion } = await getNextVersion("boardsportfolios");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `boardsportfolios_v${newVersion}`,
      previousVersion: oldVersion ? `boardsportfolios_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `boardsportfolios_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM ${targetTable}`);

      // Data is already in the correct format
      const boardPortfolios = latestJson.data as any[];

      console.log("Data operation:", {
        action: "Inserting relationships",
        targetTable,
        boardCount: boardPortfolios.length,
        totalRelationships: boardPortfolios.reduce(
          (sum, board) => sum + board.portfolios.length,
          0,
        ),
      });

      // Insert relationships
      for (const board of boardPortfolios) {
        for (const portfolio of board.portfolios) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, boardId, portfolioId, talentId)
            VALUES (${createId()}, ${board.boardId}, ${portfolio.id}, ${portfolio.talentId})
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `boardsportfolios_v${newVersion}`,
        newBackupVersion: `boardsportfolios_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "boardsportfolios", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `boardsportfolios_v${newVersion}`,
      viewUpdated: "boardsportfolios_current",
    });

    return {
      entity: "boardsportfolios",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "boardsportfolios",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformPortfoliosMedia(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.portfoliosMediaJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for portfoliosmedia");
    }

    const { newVersion, oldVersion } = await getNextVersion("portfoliosmedia");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `portfoliosmedia_v${newVersion}`,
      previousVersion: oldVersion ? `portfoliosmedia_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `portfoliosmedia_v${newVersion}`;

      // Clear the target table first - using DELETE FROM to ensure complete cleanup
      await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);

      // Double check the table is empty
      const count =
        await tx.$queryRaw`SELECT COUNT(*) as count FROM ${Prisma.raw(targetTable)}`;
      console.log("Table cleared, current count:", count);

      // Data is already in the correct format
      const portfoliosMedia = latestJson.data as any[];

      console.log("Data operation:", {
        action: "Inserting media",
        targetTable,
        portfolioCount: portfoliosMedia.length,
        totalMedia: portfoliosMedia.reduce((sum, p) => sum + p.media.length, 0),
      });

      // Insert media records
      for (const portfolio of portfoliosMedia) {
        for (const media of portfolio.media) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, mediaId, portfolioId, type, url, filename, coverImage, "order", width, height, size, caption)
            VALUES (
              ${createId()},
              ${media.id},
              ${portfolio.portfolioId},
              ${media.type},
              ${media.url},
              ${media.filename},
              ${media.coverImage},
              ${media.order},
              ${media.width},
              ${media.height},
              ${media.size},
              ${media.caption}
            )
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `portfoliosmedia_v${newVersion}`,
        newBackupVersion: `portfoliosmedia_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "portfoliosmedia", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `portfoliosmedia_v${newVersion}`,
      viewUpdated: "portfoliosmedia_current",
    });

    return {
      entity: "portfoliosmedia",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "portfoliosmedia",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformMediaTags(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.mediaTagsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for mediatags");
    }

    const { newVersion, oldVersion } = await getNextVersion("mediatags");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `mediatags_v${newVersion}`,
      previousVersion: oldVersion ? `mediatags_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `mediatags_v${newVersion}`;
      const junctionTable = `mediatags_junction_v${newVersion}`;

      // Clear both tables
      await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);
      await tx.$executeRawUnsafe(`DELETE FROM "${junctionTable}"`);

      const mediaTagsData = latestJson.data as any[];

      // Extract unique tags
      const uniqueTags = new Map<string, MediaTag>();
      mediaTagsData.forEach((item) => {
        item.tags.forEach((tag: MediaTag) => {
          uniqueTags.set(tag.id, tag);
        });
      });

      console.log("Data operation:", {
        action: "Inserting tags and relationships",
        targetTable,
        uniqueTagCount: uniqueTags.size,
        totalRelationships: mediaTagsData.reduce(
          (sum, item) => sum + item.tags.length,
          0,
        ),
      });

      // Insert unique tags
      for (const tag of uniqueTags.values()) {
        await tx.$executeRaw`
          INSERT INTO ${Prisma.raw(targetTable)}
          (id, name, slug)
          VALUES (${tag.id}, ${tag.name}, ${tag.slug})
        `;
      }

      // Insert junction records
      for (const item of mediaTagsData) {
        for (const tag of item.tags) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(junctionTable)}
            (id, mediaId, tagId)
            VALUES (${createId()}, ${item.id}, ${tag.id})
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating views and metadata",
        newActiveVersion: `mediatags_v${newVersion}`,
        newBackupVersion: `mediatags_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "mediatags", { newVersion, oldVersion });
      await updateVersionAndViews(tx, "mediatags_junction", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `mediatags_v${newVersion}`,
      viewUpdated: ["mediatags_current", "mediatags_junction_current"],
    });

    return {
      entity: "mediatags",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "mediatags",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformTalents(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talents");
    }

    const { newVersion, oldVersion } = await getNextVersion("talents");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `talents_v${newVersion}`,
      previousVersion: oldVersion ? `talents_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `talents_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);

      const talents = latestJson.data as unknown as Talent[];

      console.log("Data operation:", {
        action: "Inserting talents",
        targetTable,
        recordCount: talents.length,
      });

      // Insert talent records
      for (const talent of talents) {
        await tx.$executeRaw`
          INSERT INTO ${Prisma.raw(targetTable)}
          (id, firstName, lastName, talentUserNumber, bio, profileImage, gender, pronouns, talentType)
          VALUES (
            ${talent.id},
            ${talent.firstName},
            ${talent.lastName},
            ${talent.talentUserNumber},
            ${talent.bio},
            ${talent.profileImage},
            ${talent.gender},
            ${talent.pronouns},
            ${talent.talentType.name}
          )
        `;
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `talents_v${newVersion}`,
        newBackupVersion: `talents_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "talents", { newVersion, oldVersion });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `talents_v${newVersion}`,
      viewUpdated: "talents_current",
    });

    return {
      entity: "talents",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "talents",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformTalentsPortfolios(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsPortfoliosJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talentsportfolios");
    }

    const { newVersion, oldVersion } =
      await getNextVersion("talentsportfolios");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `talentsportfolios_v${newVersion}`,
      previousVersion: oldVersion ? `talentsportfolios_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `talentsportfolios_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);

      const talentsPortfolios = latestJson.data as unknown as TalentPortfolio[];

      console.log("Data operation:", {
        action: "Inserting portfolios",
        targetTable,
        talentCount: talentsPortfolios.length,
        totalPortfolios: talentsPortfolios.reduce(
          (sum, t) => sum + t.portfolios.length,
          0,
        ),
      });

      // Insert portfolio records
      for (const talent of talentsPortfolios) {
        for (const portfolio of talent.portfolios) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, talentId, title, description, isDefault, category, coverImage)
            VALUES (
              ${portfolio.id},
              ${talent.talentId},
              ${portfolio.title},
              ${portfolio.description},
              ${portfolio.isDefault},
              ${portfolio.category?.name ?? null},
              ${portfolio.coverImage}
            )
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `talentsportfolios_v${newVersion}`,
        newBackupVersion: `talentsportfolios_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "talentsportfolios", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `talentsportfolios_v${newVersion}`,
      viewUpdated: "talentsportfolios_current",
    });

    return {
      entity: "talentsportfolios",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "talentsportfolios",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformTalentsMeasurements(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsMeasurementsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talentsmeasurements");
    }

    const { newVersion, oldVersion } = await getNextVersion(
      "talentsmeasurements",
    );

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `talentsmeasurements_v${newVersion}`,
      previousVersion: oldVersion
        ? `talentsmeasurements_v${oldVersion}`
        : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `talentsmeasurements_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);

      const talentsMeasurements =
        latestJson.data as unknown as TalentMeasurement[];

      console.log("Data operation:", {
        action: "Inserting measurements",
        targetTable,
        talentCount: talentsMeasurements.length,
        measurementsCount: talentsMeasurements.filter(
          (t) => t.measurements !== null,
        ).length,
      });

      // Insert measurements records
      for (const talent of talentsMeasurements) {
        if (talent.measurements) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, talentId, heightCm, weightKg, bustCm, waistCm, hipsCm, shoeSizeEu,
             heightFtIn, weightLbs, bustIn, waistIn, hipsIn, shoeSizeUs, eyeColor, hairColor,
             createdAt, updatedAt)
            VALUES (
              ${talent.measurements.id},
              ${talent.id},
              ${talent.measurements.heightCm},
              ${talent.measurements.weightKg},
              ${talent.measurements.bustCm},
              ${talent.measurements.waistCm},
              ${talent.measurements.hipsCm},
              ${talent.measurements.shoeSizeEu},
              ${talent.measurements.heightFtIn},
              ${talent.measurements.weightLbs},
              ${talent.measurements.bustIn},
              ${talent.measurements.waistIn},
              ${talent.measurements.hipsIn},
              ${talent.measurements.shoeSizeUs},
              ${talent.measurements.eyeColor},
              ${talent.measurements.hairColor},
              ${new Date(talent.measurements.createdAt)},
              ${new Date(talent.measurements.updatedAt)}
            )
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `talentsmeasurements_v${newVersion}`,
        newBackupVersion: `talentsmeasurements_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "talentsmeasurements", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `talentsmeasurements_v${newVersion}`,
      viewUpdated: "talentsmeasurements_current",
    });

    return {
      entity: "talentsmeasurements",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "talentsmeasurements",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function transformTalentsSocials(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsSocialsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talentssocials");
    }

    const { newVersion, oldVersion } = await getNextVersion("talentssocials");

    console.log("Version transition:", {
      operation: "Starting transform",
      targetVersion: `talentssocials_v${newVersion}`,
      previousVersion: oldVersion ? `talentssocials_v${oldVersion}` : "none",
    });

    await prisma.$transaction(async (tx) => {
      const targetTable = `talentssocials_v${newVersion}`;

      // Clear the target table first
      await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);

      const talentsSocials = latestJson.data as unknown as TalentSocial[];

      console.log("Data operation:", {
        action: "Inserting socials",
        targetTable,
        talentCount: talentsSocials.length,
        totalSocials: talentsSocials.reduce(
          (sum, t) => sum + t.socials.length,
          0,
        ),
      });

      // Insert social records
      for (const talent of talentsSocials) {
        for (const social of talent.socials) {
          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, talentId, platform, username, url)
            VALUES (
              ${createId()},
              ${talent.id},
              ${social.platform},
              ${social.username},
              ${social.url}
            )
          `;
        }
      }

      console.log("Version update:", {
        action: "Updating view and metadata",
        newActiveVersion: `talentssocials_v${newVersion}`,
        newBackupVersion: `talentssocials_v${oldVersion ?? 0}`,
      });

      await updateVersionAndViews(tx, "talentssocials", {
        newVersion,
        oldVersion,
      });
    });

    console.log("Transform complete:", {
      status: "success",
      activeVersion: `talentssocials_v${newVersion}`,
      viewUpdated: "talentssocials_current",
    });

    return {
      entity: "talentssocials",
      success: true,
      version: newVersion,
    };
  } catch (error) {
    console.error("Transform error details:", error);
    return {
      entity: "talentssocials",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const transformAllData = task({
  id: "transform-all-data",
  run: async () => {
    const results = [];

    // Transform talents first since other tables depend on it
    const talentsResult = await transformTalents();
    results.push(talentsResult);

    if (!talentsResult.success) {
      throw new Error(
        `Transform failed for ${talentsResult.entity}: ${talentsResult.error}`,
      );
    }

    // Transform talents measurements
    const talentsMeasurementsResult = await transformTalentsMeasurements();
    results.push(talentsMeasurementsResult);

    if (!talentsMeasurementsResult.success) {
      throw new Error(
        `Transform failed for ${talentsMeasurementsResult.entity}: ${talentsMeasurementsResult.error}`,
      );
    }

    // Transform talents portfolios next since media depends on it
    const talentsPortfoliosResult = await transformTalentsPortfolios();
    results.push(talentsPortfoliosResult);

    if (!talentsPortfoliosResult.success) {
      throw new Error(
        `Transform failed for ${talentsPortfoliosResult.entity}: ${talentsPortfoliosResult.error}`,
      );
    }

    // Transform boards first
    const boardsResult = await transformBoards();
    results.push(boardsResult);

    if (!boardsResult.success) {
      throw new Error(
        `Transform failed for ${boardsResult.entity}: ${boardsResult.error}`,
      );
    }

    // Transform boardstalents next
    const boardsTalentsResult = await transformBoardsTalents();
    results.push(boardsTalentsResult);

    if (!boardsTalentsResult.success) {
      throw new Error(
        `Transform failed for ${boardsTalentsResult.entity}: ${boardsTalentsResult.error}`,
      );
    }

    // Transform boardsportfolios
    const boardsPortfoliosResult = await transformBoardsPortfolios();
    results.push(boardsPortfoliosResult);

    if (!boardsPortfoliosResult.success) {
      throw new Error(
        `Transform failed for ${boardsPortfoliosResult.entity}: ${boardsPortfoliosResult.error}`,
      );
    }

    // Transform portfolios media
    const portfoliosMediaResult = await transformPortfoliosMedia();
    results.push(portfoliosMediaResult);

    if (!portfoliosMediaResult.success) {
      throw new Error(
        `Transform failed for ${portfoliosMediaResult.entity}: ${portfoliosMediaResult.error}`,
      );
    }

    // Transform media tags
    const mediaTagsResult = await transformMediaTags();
    results.push(mediaTagsResult);

    if (!mediaTagsResult.success) {
      throw new Error(
        `Transform failed for ${mediaTagsResult.entity}: ${mediaTagsResult.error}`,
      );
    }

    // Transform talents socials
    const talentsSocialsResult = await transformTalentsSocials();
    results.push(talentsSocialsResult);

    if (!talentsSocialsResult.success) {
      throw new Error(
        `Transform failed for ${talentsSocialsResult.entity}: ${talentsSocialsResult.error}`,
      );
    }

    return {
      success: true,
      transformedEntities: results,
    };
  },
});
