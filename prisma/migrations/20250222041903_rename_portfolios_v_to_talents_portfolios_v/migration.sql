/*
  Warnings:

  - You are about to drop the `Portfolios_v1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Portfolios_v2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Portfolios_v1";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Portfolios_v2";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TalentsPortfolios_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "TalentsPortfolios_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "coverImage" TEXT
);

-- CreateIndex
CREATE INDEX "TalentsPortfolios_v1_talentId_idx" ON "TalentsPortfolios_v1"("talentId");

-- CreateIndex
CREATE INDEX "TalentsPortfolios_v1_category_idx" ON "TalentsPortfolios_v1"("category");

-- CreateIndex
CREATE INDEX "TalentsPortfolios_v1_title_idx" ON "TalentsPortfolios_v1"("title");

-- CreateIndex
CREATE INDEX "TalentsPortfolios_v2_talentId_idx" ON "TalentsPortfolios_v2"("talentId");

-- CreateIndex
CREATE INDEX "TalentsPortfolios_v2_category_idx" ON "TalentsPortfolios_v2"("category");

-- CreateIndex
CREATE INDEX "TalentsPortfolios_v2_title_idx" ON "TalentsPortfolios_v2"("title");
