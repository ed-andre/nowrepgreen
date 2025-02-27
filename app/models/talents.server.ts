import type { BoardsTalents_current, Talents_current } from "@prisma/client";

import { prisma } from "../db.server";

export async function getTalentsByBoardId(boardId: string) {
  const boardTalents = await prisma.boardsTalents_current.findMany({
    where: { boardId },
    select: {
      talentId: true,
    },
  });

  const talentIds = boardTalents.map(
    (bt: Pick<BoardsTalents_current, "talentId">) => bt.talentId,
  );

  const talents = await prisma.talents_current.findMany({
    where: {
      id: {
        in: talentIds,
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

  // Get measurements for each talent
  const talentsWithMeasurements = await Promise.all(
    talents.map(async (talent) => {
      const measurements = await prisma.talentsMeasurements_current.findUnique({
        where: { talentId: talent.id },
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

      return {
        ...talent,
        measurements,
      };
    }),
  );

  return talentsWithMeasurements;
}

export async function getTalentWithDetails(talentId: string) {
  const talent = await prisma.talents_current.findUnique({
    where: { id: talentId },
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

  const measurements = await prisma.talentsMeasurements_current.findUnique({
    where: { talentId },
  });

  const portfolios = await prisma.talentsPortfolios_current.findMany({
    where: { talentId },
    orderBy: {
      isDefault: "desc", // Default portfolios first
    },
  });

  // Fetch social media accounts
  const socials = await prisma.talentsSocials_current.findMany({
    where: { talentId },
  });

  return {
    ...talent,
    measurements,
    portfolios,
    socials,
  };
}

/**
 * Retrieves all talents with their basic information and measurements
 * Used for the talent directory page
 */
export async function getAllTalents() {
  const talents = await prisma.talents_current.findMany({
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

  // Get measurements for each talent
  const talentsWithMeasurements = await Promise.all(
    talents.map(async (talent) => {
      const measurements = await prisma.talentsMeasurements_current.findUnique({
        where: { talentId: talent.id },
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

      return {
        ...talent,
        measurements,
      };
    }),
  );

  return talentsWithMeasurements;
}

/**
 * Retrieves all talents grouped by board
 * Used for the redesigned talent directory page
 */
export async function getTalentsByBoard() {
  // Get all boards
  const boards = await prisma.boards_current.findMany({
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

  // For each board, get all associated talents
  const boardsWithTalents = await Promise.all(
    boards.map(async (board) => {
      const talents = await getTalentsByBoardId(board.id);

      // Create a slug for the board
      const boardSlug = board.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      return {
        ...board,
        slug: boardSlug,
        talents,
      };
    }),
  );

  // Filter out boards with no talents
  return boardsWithTalents.filter((board) => board.talents.length > 0);
}
