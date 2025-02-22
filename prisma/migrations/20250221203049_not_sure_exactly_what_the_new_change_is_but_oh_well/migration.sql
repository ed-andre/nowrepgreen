/*
  Warnings:

  - You are about to drop the `PortfolioCategories_current` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioCategories_v1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortfolioCategories_v2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TalentTypes_current` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TalentTypes_v1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TalentTypes_v2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `categoryId` on the `Portfolios_current` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Portfolios_v1` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Portfolios_v2` table. All the data in the column will be lost.
  - You are about to drop the column `measurements` on the `Talents_current` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `Talents_current` table. All the data in the column will be lost.
  - You are about to drop the column `talentTypeId` on the `Talents_current` table. All the data in the column will be lost.
  - You are about to drop the column `measurements` on the `Talents_v1` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `Talents_v1` table. All the data in the column will be lost.
  - You are about to drop the column `talentTypeId` on the `Talents_v1` table. All the data in the column will be lost.
  - You are about to drop the column `measurements` on the `Talents_v2` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `Talents_v2` table. All the data in the column will be lost.
  - You are about to drop the column `talentTypeId` on the `Talents_v2` table. All the data in the column will be lost.
  - Added the required column `talentType` to the `Talents_current` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentType` to the `Talents_v1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentType` to the `Talents_v2` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PortfolioCategories_v1_name_idx";

-- DropIndex
DROP INDEX "PortfolioCategories_v2_name_idx";

-- DropIndex
DROP INDEX "TalentTypes_v1_name_idx";

-- DropIndex
DROP INDEX "TalentTypes_v2_name_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioCategories_current";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioCategories_v1";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PortfolioCategories_v2";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TalentTypes_current";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TalentTypes_v1";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TalentTypes_v2";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "TalentsMeasurements_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "heightCm" REAL,
    "weightKg" REAL,
    "bustCm" REAL,
    "waistCm" REAL,
    "hipsCm" REAL,
    "shoeSizeEu" REAL,
    "heightFtIn" TEXT,
    "weightLbs" REAL,
    "bustIn" REAL,
    "waistIn" REAL,
    "hipsIn" REAL,
    "shoeSizeUs" REAL,
    "eyeColor" TEXT,
    "hairColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TalentsMeasurements_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "heightCm" REAL,
    "weightKg" REAL,
    "bustCm" REAL,
    "waistCm" REAL,
    "hipsCm" REAL,
    "shoeSizeEu" REAL,
    "heightFtIn" TEXT,
    "weightLbs" REAL,
    "bustIn" REAL,
    "waistIn" REAL,
    "hipsIn" REAL,
    "shoeSizeUs" REAL,
    "eyeColor" TEXT,
    "hairColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TalentsMeasurements_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "heightCm" REAL,
    "weightKg" REAL,
    "bustCm" REAL,
    "waistCm" REAL,
    "hipsCm" REAL,
    "shoeSizeEu" REAL,
    "heightFtIn" TEXT,
    "weightLbs" REAL,
    "bustIn" REAL,
    "waistIn" REAL,
    "hipsIn" REAL,
    "shoeSizeUs" REAL,
    "eyeColor" TEXT,
    "hairColor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TalentsSocials_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TalentsSocials_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TalentsSocials_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Portfolios_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "coverImage" TEXT
);
INSERT INTO "new_Portfolios_current" ("coverImage", "description", "id", "isDefault", "talentId", "title") SELECT "coverImage", "description", "id", "isDefault", "talentId", "title" FROM "Portfolios_current";
DROP TABLE "Portfolios_current";
ALTER TABLE "new_Portfolios_current" RENAME TO "Portfolios_current";
CREATE TABLE "new_Portfolios_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "coverImage" TEXT
);
INSERT INTO "new_Portfolios_v1" ("coverImage", "description", "id", "isDefault", "talentId", "title") SELECT "coverImage", "description", "id", "isDefault", "talentId", "title" FROM "Portfolios_v1";
DROP TABLE "Portfolios_v1";
ALTER TABLE "new_Portfolios_v1" RENAME TO "Portfolios_v1";
CREATE INDEX "Portfolios_v1_talentId_idx" ON "Portfolios_v1"("talentId");
CREATE INDEX "Portfolios_v1_category_idx" ON "Portfolios_v1"("category");
CREATE INDEX "Portfolios_v1_title_idx" ON "Portfolios_v1"("title");
CREATE TABLE "new_Portfolios_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "coverImage" TEXT
);
INSERT INTO "new_Portfolios_v2" ("coverImage", "description", "id", "isDefault", "talentId", "title") SELECT "coverImage", "description", "id", "isDefault", "talentId", "title" FROM "Portfolios_v2";
DROP TABLE "Portfolios_v2";
ALTER TABLE "new_Portfolios_v2" RENAME TO "Portfolios_v2";
CREATE INDEX "Portfolios_v2_talentId_idx" ON "Portfolios_v2"("talentId");
CREATE INDEX "Portfolios_v2_category_idx" ON "Portfolios_v2"("category");
CREATE INDEX "Portfolios_v2_title_idx" ON "Portfolios_v2"("title");
CREATE TABLE "new_Talents_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentType" TEXT NOT NULL
);
INSERT INTO "new_Talents_current" ("bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns") SELECT "bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns" FROM "Talents_current";
DROP TABLE "Talents_current";
ALTER TABLE "new_Talents_current" RENAME TO "Talents_current";
CREATE TABLE "new_Talents_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentType" TEXT NOT NULL
);
INSERT INTO "new_Talents_v1" ("bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns") SELECT "bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns" FROM "Talents_v1";
DROP TABLE "Talents_v1";
ALTER TABLE "new_Talents_v1" RENAME TO "Talents_v1";
CREATE INDEX "Talents_v1_firstName_lastName_idx" ON "Talents_v1"("firstName", "lastName");
CREATE INDEX "Talents_v1_talentType_idx" ON "Talents_v1"("talentType");
CREATE TABLE "new_Talents_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentType" TEXT NOT NULL
);
INSERT INTO "new_Talents_v2" ("bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns") SELECT "bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns" FROM "Talents_v2";
DROP TABLE "Talents_v2";
ALTER TABLE "new_Talents_v2" RENAME TO "Talents_v2";
CREATE INDEX "Talents_v2_firstName_lastName_idx" ON "Talents_v2"("firstName", "lastName");
CREATE INDEX "Talents_v2_talentType_idx" ON "Talents_v2"("talentType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TalentsMeasurements_v1_talentId_key" ON "TalentsMeasurements_v1"("talentId");

-- CreateIndex
CREATE INDEX "TalentsMeasurements_v1_talentId_idx" ON "TalentsMeasurements_v1"("talentId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentsMeasurements_v2_talentId_key" ON "TalentsMeasurements_v2"("talentId");

-- CreateIndex
CREATE INDEX "TalentsMeasurements_v2_talentId_idx" ON "TalentsMeasurements_v2"("talentId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentsMeasurements_current_talentId_key" ON "TalentsMeasurements_current"("talentId");

-- CreateIndex
CREATE INDEX "TalentsSocials_v1_talentId_idx" ON "TalentsSocials_v1"("talentId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentsSocials_v1_talentId_platform_key" ON "TalentsSocials_v1"("talentId", "platform");

-- CreateIndex
CREATE INDEX "TalentsSocials_v2_talentId_idx" ON "TalentsSocials_v2"("talentId");

-- CreateIndex
CREATE UNIQUE INDEX "TalentsSocials_v2_talentId_platform_key" ON "TalentsSocials_v2"("talentId", "platform");
