import { PrismaClient } from "@prisma/client";

// Initialize a dedicated Prisma client for the trigger system
const prisma = new PrismaClient({
  log: ["error", "warn"], // Configure logging specific to trigger system needs
});

export { prisma };
