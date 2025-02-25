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

  return prisma.talents_current.findMany({
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
  });
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
  });

  return {
    ...talent,
    measurements,
    portfolios,
  };
}
