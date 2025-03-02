import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

interface TransformResult {
  entity: string;
  success: boolean;
  error?: string;
  version?: number;
}

interface TalentPortfolio {
  talentId: string;
  portfolios: Array<{
    id: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    isDefault: boolean;
    category?: {
      id: string;
      name: string;
      color?: string;
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
    type: string;
    url: string;
    filename: string;
    coverImage: string | null;
    order: number;
    width: number;
    height: number;
    size: number;
    caption: string | null;
  }>;
}

interface MediaTag {
  id: string;
  name: string;
  slug: string;
}

interface MediaTagItem {
  id: string; // mediaId
  tags: MediaTag[];
}

// Get the next version for an entity (alternating between 1 and 2)
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

// Update version metadata and create/update views
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

// Transform functions for each entity
export async function transformBoards(): Promise<TransformResult> {
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

export async function transformBoardsTalents(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.boardsTalentsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for boardstalents");
    }

    // Log the data structure to help diagnose issues
    console.log("BoardsTalents data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let boardTalentsArray: BoardTalent[] = [];

      if (Array.isArray(latestJson.data)) {
        boardTalentsArray = latestJson.data as unknown as BoardTalent[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          boardTalentsArray = (latestJson.data as any).data as BoardTalent[];
        }
        // If it's an object with a boardsTalents property that's an array
        else if (Array.isArray((latestJson.data as any).boardsTalents)) {
          boardTalentsArray = (latestJson.data as any)
            .boardsTalents as BoardTalent[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            boardTalentsArray = values[0] as unknown as BoardTalent[];
          } else {
            // Try to convert object to array if it has numeric keys
            boardTalentsArray = Object.values(
              latestJson.data,
            ) as unknown as BoardTalent[];
          }
        }
      }

      if (!boardTalentsArray.length) {
        throw new Error("Could not extract boardsTalents array from data");
      }

      // Validate the structure before calculating totals
      const validBoardTalents = boardTalentsArray.filter(
        (board) =>
          board &&
          typeof board === "object" &&
          board.boardId &&
          Array.isArray(board.talents),
      );

      if (validBoardTalents.length === 0) {
        throw new Error("No valid boardsTalents records found in data");
      }

      console.log("Data operation:", {
        action: "Inserting relationships",
        targetTable,
        boardCount: validBoardTalents.length,
        totalRelationships: validBoardTalents.reduce(
          (sum, board) => sum + board.talents.length,
          0,
        ),
      });

      // Insert relationships
      for (const board of validBoardTalents) {
        // Validate board object has required fields
        if (!board.boardId || !Array.isArray(board.talents)) {
          console.warn("Skipping invalid board talent record:", board);
          continue;
        }

        for (const talent of board.talents) {
          // Validate talent object has required fields
          if (!talent.id) {
            console.warn("Skipping invalid talent record:", talent);
            continue;
          }

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

export async function transformBoardsPortfolios(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.boardsPortfoliosJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for boardsportfolios");
    }

    // Log the data structure to help diagnose issues
    console.log("BoardsPortfolios data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let boardPortfoliosArray: BoardPortfolio[] = [];

      if (Array.isArray(latestJson.data)) {
        boardPortfoliosArray = latestJson.data as unknown as BoardPortfolio[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          boardPortfoliosArray = (latestJson.data as any)
            .data as BoardPortfolio[];
        }
        // If it's an object with a boardsPortfolios property that's an array
        else if (Array.isArray((latestJson.data as any).boardsPortfolios)) {
          boardPortfoliosArray = (latestJson.data as any)
            .boardsPortfolios as BoardPortfolio[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            boardPortfoliosArray = values[0] as unknown as BoardPortfolio[];
          } else {
            // Try to convert object to array if it has numeric keys
            boardPortfoliosArray = Object.values(
              latestJson.data,
            ) as unknown as BoardPortfolio[];
          }
        }
      }

      if (!boardPortfoliosArray.length) {
        throw new Error("Could not extract boardsPortfolios array from data");
      }

      // Validate the structure before calculating totals
      const validBoardPortfolios = boardPortfoliosArray.filter(
        (board) =>
          board &&
          typeof board === "object" &&
          board.boardId &&
          Array.isArray(board.portfolios),
      );

      if (validBoardPortfolios.length === 0) {
        throw new Error("No valid boardsPortfolios records found in data");
      }

      console.log("Data operation:", {
        action: "Inserting relationships",
        targetTable,
        boardCount: validBoardPortfolios.length,
        totalRelationships: validBoardPortfolios.reduce(
          (sum, board) => sum + board.portfolios.length,
          0,
        ),
      });

      // Insert relationships
      for (const board of validBoardPortfolios) {
        // Validate board object has required fields
        if (!board.boardId || !Array.isArray(board.portfolios)) {
          console.warn("Skipping invalid board portfolio record:", board);
          continue;
        }

        for (const portfolio of board.portfolios) {
          // Validate portfolio object has required fields
          if (!portfolio.id || !portfolio.talentId) {
            console.warn("Skipping invalid portfolio record:", portfolio);
            continue;
          }

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

export async function transformPortfoliosMedia(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.portfoliosMediaJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for portfoliosmedia");
    }

    // Log the data structure to help diagnose issues
    console.log("PortfoliosMedia data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let portfoliosMediaArray: PortfolioMedia[] = [];

      if (Array.isArray(latestJson.data)) {
        portfoliosMediaArray = latestJson.data as unknown as PortfolioMedia[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          portfoliosMediaArray = (latestJson.data as any)
            .data as PortfolioMedia[];
        }
        // If it's an object with a portfoliosMedia property that's an array
        else if (Array.isArray((latestJson.data as any).portfoliosMedia)) {
          portfoliosMediaArray = (latestJson.data as any)
            .portfoliosMedia as PortfolioMedia[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            portfoliosMediaArray = values[0] as unknown as PortfolioMedia[];
          } else {
            // Try to convert object to array if it has numeric keys
            portfoliosMediaArray = Object.values(
              latestJson.data,
            ) as unknown as PortfolioMedia[];
          }
        }
      }

      if (!portfoliosMediaArray.length) {
        throw new Error("Could not extract portfoliosMedia array from data");
      }

      // Validate the structure before calculating totals
      const validPortfoliosMedia = portfoliosMediaArray.filter(
        (portfolio) =>
          portfolio &&
          typeof portfolio === "object" &&
          portfolio.portfolioId &&
          Array.isArray(portfolio.media),
      );

      if (validPortfoliosMedia.length === 0) {
        throw new Error("No valid portfoliosMedia records found in data");
      }

      console.log("Data operation:", {
        action: "Inserting media",
        targetTable,
        portfolioCount: validPortfoliosMedia.length,
        totalMedia: validPortfoliosMedia.reduce(
          (sum, p) => sum + p.media.length,
          0,
        ),
      });

      // Insert media records
      for (const portfolio of validPortfoliosMedia) {
        // Validate portfolio object has required fields
        if (!portfolio.portfolioId || !Array.isArray(portfolio.media)) {
          console.warn("Skipping invalid portfolio media record:", portfolio);
          continue;
        }

        for (const media of portfolio.media) {
          // Validate media object has required fields
          if (!media.id || !media.type || !media.url || !media.filename) {
            console.warn("Skipping invalid media record:", media);
            continue;
          }

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

export async function transformMediaTags(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.mediaTagsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for mediatags");
    }

    // Log the data structure to help diagnose issues
    console.log("MediaTags data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let mediaTagsArray: MediaTagItem[] = [];

      if (Array.isArray(latestJson.data)) {
        mediaTagsArray = latestJson.data as unknown as MediaTagItem[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          mediaTagsArray = (latestJson.data as any).data as MediaTagItem[];
        }
        // If it's an object with a mediaTags property that's an array
        else if (Array.isArray((latestJson.data as any).mediaTags)) {
          mediaTagsArray = (latestJson.data as any).mediaTags as MediaTagItem[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            mediaTagsArray = values[0] as unknown as MediaTagItem[];
          } else {
            // Try to convert object to array if it has numeric keys
            mediaTagsArray = Object.values(
              latestJson.data,
            ) as unknown as MediaTagItem[];
          }
        }
      }

      if (!mediaTagsArray.length) {
        throw new Error("Could not extract mediaTags array from data");
      }

      // Validate the structure before processing
      const validMediaTags = mediaTagsArray.filter(
        (item) =>
          item &&
          typeof item === "object" &&
          item.id &&
          Array.isArray(item.tags),
      );

      if (validMediaTags.length === 0) {
        throw new Error("No valid mediaTags records found in data");
      }

      // Extract unique tags
      const uniqueTags = new Map<string, MediaTag>();
      validMediaTags.forEach((item) => {
        if (Array.isArray(item.tags)) {
          item.tags.forEach((tag: MediaTag) => {
            if (tag && tag.id && tag.name) {
              uniqueTags.set(tag.id, tag);
            }
          });
        }
      });

      if (uniqueTags.size === 0) {
        throw new Error("No valid tags found in data");
      }

      console.log("Data operation:", {
        action: "Inserting tags and relationships",
        targetTable,
        uniqueTagCount: uniqueTags.size,
        totalRelationships: validMediaTags.reduce(
          (sum, item) =>
            sum + (Array.isArray(item.tags) ? item.tags.length : 0),
          0,
        ),
      });

      // Insert unique tags
      for (const tag of uniqueTags.values()) {
        if (!tag.id || !tag.name || !tag.slug) {
          console.warn("Skipping invalid tag:", tag);
          continue;
        }

        await tx.$executeRaw`
          INSERT INTO ${Prisma.raw(targetTable)}
          (id, name, slug)
          VALUES (${tag.id}, ${tag.name}, ${tag.slug})
        `;
      }

      // Insert junction records
      for (const item of validMediaTags) {
        if (!item.id || !Array.isArray(item.tags)) {
          console.warn("Skipping invalid media tag item:", item);
          continue;
        }

        for (const tag of item.tags) {
          if (!tag.id) {
            console.warn("Skipping invalid tag reference:", tag);
            continue;
          }

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

export async function transformTalents(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talents");
    }

    // Log the data structure to help diagnose issues
    console.log("Talents data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let talentsArray: any[] = [];

      if (Array.isArray(latestJson.data)) {
        talentsArray = latestJson.data;
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          talentsArray = (latestJson.data as any).data;
        }
        // If it's an object with a talents property that's an array
        else if (Array.isArray((latestJson.data as any).talents)) {
          talentsArray = (latestJson.data as any).talents;
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            talentsArray = values[0] as any[];
          } else {
            // Try to convert object to array if it has numeric keys
            talentsArray = Object.values(latestJson.data);
          }
        }
      }

      if (!talentsArray.length) {
        throw new Error("Could not extract talents array from data");
      }

      console.log("Data operation:", {
        action: "Inserting talents",
        targetTable,
        recordCount: talentsArray.length,
      });

      // Insert talent records
      for (const talent of talentsArray) {
        // Validate talent object has required fields
        if (
          !talent.id ||
          !talent.firstName ||
          !talent.lastName ||
          !talent.talentUserNumber
        ) {
          console.warn("Skipping invalid talent record:", talent);
          continue;
        }

        // Handle case where talentType might be an object or a string
        const talentType =
          typeof talent.talentType === "object" && talent.talentType !== null
            ? talent.talentType.name
            : talent.talentType || "Unknown";

        await tx.$executeRaw`
          INSERT INTO ${Prisma.raw(targetTable)}
          (id, firstName, lastName, talentUserNumber, bio, profileImage, gender, pronouns, talentType)
          VALUES (
            ${talent.id},
            ${talent.firstName},
            ${talent.lastName},
            ${talent.talentUserNumber},
            ${talent.bio || null},
            ${talent.profileImage || null},
            ${talent.gender || null},
            ${talent.pronouns || null},
            ${talentType}
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

export async function transformTalentsPortfolios(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsPortfoliosJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talentsportfolios");
    }

    // Log the data structure to help diagnose issues
    console.log("TalentsPortfolios data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let talentsPortfoliosArray: TalentPortfolio[] = [];

      if (Array.isArray(latestJson.data)) {
        talentsPortfoliosArray =
          latestJson.data as unknown as TalentPortfolio[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          talentsPortfoliosArray = (latestJson.data as any)
            .data as TalentPortfolio[];
        }
        // If it's an object with a talentsPortfolios property that's an array
        else if (Array.isArray((latestJson.data as any).talentsPortfolios)) {
          talentsPortfoliosArray = (latestJson.data as any)
            .talentsPortfolios as TalentPortfolio[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            talentsPortfoliosArray = values[0] as unknown as TalentPortfolio[];
          } else {
            // Try to convert object to array if it has numeric keys
            talentsPortfoliosArray = Object.values(
              latestJson.data,
            ) as unknown as TalentPortfolio[];
          }
        }
      }

      if (!talentsPortfoliosArray.length) {
        throw new Error("Could not extract talentsPortfolios array from data");
      }

      console.log("Data operation:", {
        action: "Inserting portfolios",
        targetTable,
        talentCount: talentsPortfoliosArray.length,
        totalPortfolios: talentsPortfoliosArray.reduce(
          (sum, t) =>
            sum + (Array.isArray(t.portfolios) ? t.portfolios.length : 0),
          0,
        ),
      });

      // Insert portfolio records
      for (const talent of talentsPortfoliosArray) {
        // Validate talent object has required fields
        if (!talent.talentId || !Array.isArray(talent.portfolios)) {
          console.warn("Skipping invalid talent portfolio record:", talent);
          continue;
        }

        for (const portfolio of talent.portfolios) {
          // Validate portfolio object has required fields
          if (!portfolio.id || !portfolio.title) {
            console.warn("Skipping invalid portfolio record:", portfolio);
            continue;
          }

          // Handle case where category might be an object or a string
          const category =
            typeof portfolio.category === "object" &&
            portfolio.category !== null
              ? portfolio.category.name
              : typeof portfolio.category === "string"
                ? portfolio.category
                : null;

          await tx.$executeRaw`
            INSERT INTO ${Prisma.raw(targetTable)}
            (id, talentId, title, description, isDefault, category, coverImage)
            VALUES (
              ${portfolio.id},
              ${talent.talentId},
              ${portfolio.title},
              ${portfolio.description || null},
              ${portfolio.isDefault || false},
              ${category},
              ${portfolio.coverImage || null}
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

export async function transformTalentsMeasurements(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsMeasurementsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talentsmeasurements");
    }

    // Log the data structure to help diagnose issues
    console.log("TalentsMeasurements data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let talentsMeasurementsArray: TalentMeasurement[] = [];

      if (Array.isArray(latestJson.data)) {
        talentsMeasurementsArray =
          latestJson.data as unknown as TalentMeasurement[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          talentsMeasurementsArray = (latestJson.data as any)
            .data as TalentMeasurement[];
        }
        // If it's an object with a talentsMeasurements property that's an array
        else if (Array.isArray((latestJson.data as any).talentsMeasurements)) {
          talentsMeasurementsArray = (latestJson.data as any)
            .talentsMeasurements as TalentMeasurement[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            talentsMeasurementsArray =
              values[0] as unknown as TalentMeasurement[];
          } else {
            // Try to convert object to array if it has numeric keys
            talentsMeasurementsArray = Object.values(
              latestJson.data,
            ) as unknown as TalentMeasurement[];
          }
        }
      }

      if (!talentsMeasurementsArray.length) {
        throw new Error(
          "Could not extract talentsMeasurements array from data",
        );
      }

      console.log("Data operation:", {
        action: "Inserting measurements",
        targetTable,
        talentCount: talentsMeasurementsArray.length,
        measurementsCount: talentsMeasurementsArray.filter(
          (t) => t.measurements !== null,
        ).length,
      });

      // Insert measurements records
      for (const talent of talentsMeasurementsArray) {
        // Validate talent object has required fields
        if (!talent.id) {
          console.warn("Skipping invalid talent measurement record:", talent);
          continue;
        }

        if (talent.measurements) {
          // Validate measurements object
          if (!talent.measurements.id) {
            console.warn(
              "Skipping invalid measurements record:",
              talent.measurements,
            );
            continue;
          }

          // Validate date strings
          let createdAt: Date;
          let updatedAt: Date;

          try {
            createdAt = new Date(talent.measurements.createdAt);
            updatedAt = new Date(talent.measurements.updatedAt);

            // Check if dates are valid
            if (isNaN(createdAt.getTime()) || isNaN(updatedAt.getTime())) {
              throw new Error("Invalid date");
            }
          } catch (error) {
            console.warn("Skipping record with invalid dates:", {
              id: talent.measurements.id,
              createdAt: talent.measurements.createdAt,
              updatedAt: talent.measurements.updatedAt,
              error,
            });
            continue;
          }

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
              ${createdAt},
              ${updatedAt}
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

export async function transformTalentsSocials(): Promise<TransformResult> {
  try {
    const latestJson = await prisma.talentsSocialsJson.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestJson) {
      throw new Error("No JSON data found for talentssocials");
    }

    // Log the data structure to help diagnose issues
    console.log("TalentsSocials data structure:", {
      type: typeof latestJson.data,
      isArray: Array.isArray(latestJson.data),
      keys:
        typeof latestJson.data === "object" && latestJson.data !== null
          ? Object.keys(latestJson.data as object)
          : "N/A",
    });

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

      // Handle different data structures
      let talentsSocialsArray: TalentSocial[] = [];

      if (Array.isArray(latestJson.data)) {
        talentsSocialsArray = latestJson.data as unknown as TalentSocial[];
      } else if (
        typeof latestJson.data === "object" &&
        latestJson.data !== null
      ) {
        // If it's an object with a data property that's an array
        if (Array.isArray((latestJson.data as any).data)) {
          talentsSocialsArray = (latestJson.data as any).data as TalentSocial[];
        }
        // If it's an object with a talentsSocials property that's an array
        else if (Array.isArray((latestJson.data as any).talentsSocials)) {
          talentsSocialsArray = (latestJson.data as any)
            .talentsSocials as TalentSocial[];
        }
        // If it's an object with numeric keys (like an object map of arrays)
        else if (typeof latestJson.data === "object") {
          const values = Object.values(latestJson.data);
          if (values.length > 0 && Array.isArray(values[0])) {
            talentsSocialsArray = values[0] as unknown as TalentSocial[];
          } else {
            // Try to convert object to array if it has numeric keys
            talentsSocialsArray = Object.values(
              latestJson.data,
            ) as unknown as TalentSocial[];
          }
        }
      }

      if (!talentsSocialsArray.length) {
        throw new Error("Could not extract talentsSocials array from data");
      }

      console.log("Data operation:", {
        action: "Inserting socials",
        targetTable,
        talentCount: talentsSocialsArray.length,
        totalSocials: talentsSocialsArray.reduce(
          (sum, t) => sum + (Array.isArray(t.socials) ? t.socials.length : 0),
          0,
        ),
      });

      // Insert social records
      for (const talent of talentsSocialsArray) {
        // Validate talent object has required fields
        if (!talent.id || !Array.isArray(talent.socials)) {
          console.warn("Skipping invalid talent social record:", talent);
          continue;
        }

        for (const social of talent.socials) {
          // Validate social object has required fields
          if (!social.platform || !social.username || !social.url) {
            console.warn("Skipping invalid social record:", social);
            continue;
          }

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
