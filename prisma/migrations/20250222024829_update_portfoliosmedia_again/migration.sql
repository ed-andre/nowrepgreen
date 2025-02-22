/*
  Warnings:

  - Added the required column `mediaId` to the `PortfoliosMedia_current` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `PortfoliosMedia_v1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `PortfoliosMedia_v2` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortfoliosMedia_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "caption" TEXT
);
INSERT INTO "new_PortfoliosMedia_current" ("caption", "coverImage", "filename", "height", "id", "order", "portfolioId", "size", "type", "url", "width") SELECT "caption", "coverImage", "filename", "height", "id", "order", "portfolioId", "size", "type", "url", "width" FROM "PortfoliosMedia_current";
DROP TABLE "PortfoliosMedia_current";
ALTER TABLE "new_PortfoliosMedia_current" RENAME TO "PortfoliosMedia_current";
CREATE TABLE "new_PortfoliosMedia_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "caption" TEXT
);
INSERT INTO "new_PortfoliosMedia_v1" ("caption", "coverImage", "filename", "height", "id", "order", "portfolioId", "size", "type", "url", "width") SELECT "caption", "coverImage", "filename", "height", "id", "order", "portfolioId", "size", "type", "url", "width" FROM "PortfoliosMedia_v1";
DROP TABLE "PortfoliosMedia_v1";
ALTER TABLE "new_PortfoliosMedia_v1" RENAME TO "PortfoliosMedia_v1";
CREATE INDEX "PortfoliosMedia_v1_portfolioId_idx" ON "PortfoliosMedia_v1"("portfolioId");
CREATE INDEX "PortfoliosMedia_v1_type_idx" ON "PortfoliosMedia_v1"("type");
CREATE INDEX "PortfoliosMedia_v1_order_idx" ON "PortfoliosMedia_v1"("order");
CREATE INDEX "PortfoliosMedia_v1_mediaId_idx" ON "PortfoliosMedia_v1"("mediaId");
CREATE TABLE "new_PortfoliosMedia_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "caption" TEXT
);
INSERT INTO "new_PortfoliosMedia_v2" ("caption", "coverImage", "filename", "height", "id", "order", "portfolioId", "size", "type", "url", "width") SELECT "caption", "coverImage", "filename", "height", "id", "order", "portfolioId", "size", "type", "url", "width" FROM "PortfoliosMedia_v2";
DROP TABLE "PortfoliosMedia_v2";
ALTER TABLE "new_PortfoliosMedia_v2" RENAME TO "PortfoliosMedia_v2";
CREATE INDEX "PortfoliosMedia_v2_portfolioId_idx" ON "PortfoliosMedia_v2"("portfolioId");
CREATE INDEX "PortfoliosMedia_v2_type_idx" ON "PortfoliosMedia_v2"("type");
CREATE INDEX "PortfoliosMedia_v2_order_idx" ON "PortfoliosMedia_v2"("order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
