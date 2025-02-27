import { prisma } from "../db.server";

export async function getBoards() {
  return prisma.boards_current.findMany({
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

export async function getBoardBySlug(slug: string) {
  // Convert slug to a case-insensitive regex pattern
  // This will match board titles that would convert to this slug
  const boards = await prisma.boards_current.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      coverImage: true,
    },
  });

  // Find the board whose title, when converted to a slug, matches the requested slug
  return boards.find((board) => {
    const boardSlug = board.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return boardSlug === slug;
  });
}
