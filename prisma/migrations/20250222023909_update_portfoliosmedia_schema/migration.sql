/*
  Warnings:

  - You are about to drop the `PortfolioMedia_current` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioMedia_v1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioMedia_v2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioMedia_current";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioMedia_v1";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioMedia_v2";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PortfoliosMedia_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
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

-- CreateTable
CREATE TABLE "PortfoliosMedia_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
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

-- CreateTable
CREATE TABLE "PortfoliosMedia_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
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

-- CreateIndex
CREATE INDEX "PortfoliosMedia_v1_portfolioId_idx" ON "PortfoliosMedia_v1"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfoliosMedia_v1_type_idx" ON "PortfoliosMedia_v1"("type");

-- CreateIndex
CREATE INDEX "PortfoliosMedia_v1_order_idx" ON "PortfoliosMedia_v1"("order");

-- CreateIndex
CREATE INDEX "PortfoliosMedia_v2_portfolioId_idx" ON "PortfoliosMedia_v2"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfoliosMedia_v2_type_idx" ON "PortfoliosMedia_v2"("type");

-- CreateIndex
CREATE INDEX "PortfoliosMedia_v2_order_idx" ON "PortfoliosMedia_v2"("order");
