/*
  Warnings:

  - Added the required column `talentId` to the `BoardsPortfolios_current` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId` to the `BoardsPortfolios_v1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentId` to the `BoardsPortfolios_v2` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BoardsPortfolios_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "talentId" TEXT NOT NULL
);
INSERT INTO "new_BoardsPortfolios_current" ("boardId", "id", "portfolioId") SELECT "boardId", "id", "portfolioId" FROM "BoardsPortfolios_current";
DROP TABLE "BoardsPortfolios_current";
ALTER TABLE "new_BoardsPortfolios_current" RENAME TO "BoardsPortfolios_current";
CREATE TABLE "new_BoardsPortfolios_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "talentId" TEXT NOT NULL
);
INSERT INTO "new_BoardsPortfolios_v1" ("boardId", "id", "portfolioId") SELECT "boardId", "id", "portfolioId" FROM "BoardsPortfolios_v1";
DROP TABLE "BoardsPortfolios_v1";
ALTER TABLE "new_BoardsPortfolios_v1" RENAME TO "BoardsPortfolios_v1";
CREATE INDEX "BoardsPortfolios_v1_portfolioId_idx" ON "BoardsPortfolios_v1"("portfolioId");
CREATE INDEX "BoardsPortfolios_v1_boardId_idx" ON "BoardsPortfolios_v1"("boardId");
CREATE INDEX "BoardsPortfolios_v1_talentId_idx" ON "BoardsPortfolios_v1"("talentId");
CREATE UNIQUE INDEX "BoardsPortfolios_v1_boardId_portfolioId_key" ON "BoardsPortfolios_v1"("boardId", "portfolioId");
CREATE TABLE "new_BoardsPortfolios_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "talentId" TEXT NOT NULL
);
INSERT INTO "new_BoardsPortfolios_v2" ("boardId", "id", "portfolioId") SELECT "boardId", "id", "portfolioId" FROM "BoardsPortfolios_v2";
DROP TABLE "BoardsPortfolios_v2";
ALTER TABLE "new_BoardsPortfolios_v2" RENAME TO "BoardsPortfolios_v2";
CREATE INDEX "BoardsPortfolios_v2_portfolioId_idx" ON "BoardsPortfolios_v2"("portfolioId");
CREATE INDEX "BoardsPortfolios_v2_boardId_idx" ON "BoardsPortfolios_v2"("boardId");
CREATE INDEX "BoardsPortfolios_v2_talentId_idx" ON "BoardsPortfolios_v2"("talentId");
CREATE UNIQUE INDEX "BoardsPortfolios_v2_boardId_portfolioId_key" ON "BoardsPortfolios_v2"("boardId", "portfolioId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
