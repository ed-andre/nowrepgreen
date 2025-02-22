/*
  Warnings:

  - You are about to drop the `Portfolios_current` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Portfolios_current";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TalentsPortfolios_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "coverImage" TEXT
);
