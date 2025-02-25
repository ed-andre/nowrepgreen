import { prisma } from "../db.server";

export async function getBoards() {
  return prisma.boards_current.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
    },
  });
}

export async function getBoardById(id: string) {
  return prisma.boards_current.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
    },
  });
}
