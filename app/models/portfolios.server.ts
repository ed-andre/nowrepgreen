import type { TalentsPortfolios_current } from "@prisma/client";

import { prisma } from "../db.server";

export async function getTalentPortfolios(
  talentId: string,
  options?: {
    includeDefault?: boolean;
    onlyDefault?: boolean;
    onlyNonDefault?: boolean;
  },
) {
  try {
    const whereClause = {
      talentId,
      ...(options?.onlyDefault ? { isDefault: true } : {}),
      ...(options?.includeDefault === false ? { isDefault: false } : {}),
      ...(options?.onlyNonDefault ? { isDefault: false } : {}),
    };

    const portfolios = await prisma.talentsPortfolios_current.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        isDefault: true,
        category: true,
        coverImage: true,
      },
    });

    return portfolios;
  } catch (error: unknown) {
    console.error(
      `❌ Error in getTalentPortfolios for talent ${talentId}:`,
      error,
    );
    throw error;
  }
}

export async function getPortfolioMedia(portfolioId: string) {
  return prisma.portfoliosMedia_current.findMany({
    where: { portfolioId },
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
}

export async function getUniqueMediaByTalent(talentId: string) {
  const portfolios = await prisma.talentsPortfolios_current.findMany({
    where: { talentId },
    select: { id: true },
  });

  const portfolioIds = portfolios.map(
    (p: Pick<TalentsPortfolios_current, "id">) => p.id,
  );

  return prisma.portfoliosMedia_current.findMany({
    where: {
      portfolioId: {
        in: portfolioIds,
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
}
