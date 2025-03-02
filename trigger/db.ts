import { PrismaClient } from "@prisma/client";

// Initialize a dedicated Prisma client for the trigger system
// This is NOT a server-only module to allow it to be imported by trigger files
const prismaForTrigger = new PrismaClient({
  log: ["error", "warn"], // Configure logging specific to trigger system needs
});

export { prismaForTrigger };
