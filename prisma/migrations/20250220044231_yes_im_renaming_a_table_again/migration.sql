/*
  Warnings:

  - You are about to drop the `PortfolioMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioMedia";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PortfoliosMedia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
