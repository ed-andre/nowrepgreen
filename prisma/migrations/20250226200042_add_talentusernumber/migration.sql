/*
  Warnings:

  - Added the required column `talentUserNumber` to the `Talents_current` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentUserNumber` to the `Talents_v1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `talentUserNumber` to the `Talents_v2` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Talents_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "talentUserNumber" INTEGER NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentType" TEXT NOT NULL
);
INSERT INTO "new_Talents_current" ("bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns", "talentType") SELECT "bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns", "talentType" FROM "Talents_current";
DROP TABLE "Talents_current";
ALTER TABLE "new_Talents_current" RENAME TO "Talents_current";
CREATE UNIQUE INDEX "Talents_current_talentUserNumber_key" ON "Talents_current"("talentUserNumber");
CREATE TABLE "new_Talents_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "talentUserNumber" INTEGER NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentType" TEXT NOT NULL
);
INSERT INTO "new_Talents_v1" ("bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns", "talentType") SELECT "bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns", "talentType" FROM "Talents_v1";
DROP TABLE "Talents_v1";
ALTER TABLE "new_Talents_v1" RENAME TO "Talents_v1";
CREATE UNIQUE INDEX "Talents_v1_talentUserNumber_key" ON "Talents_v1"("talentUserNumber");
CREATE INDEX "Talents_v1_firstName_lastName_idx" ON "Talents_v1"("firstName", "lastName");
CREATE INDEX "Talents_v1_talentType_idx" ON "Talents_v1"("talentType");
CREATE TABLE "new_Talents_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "talentUserNumber" INTEGER NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentType" TEXT NOT NULL
);
INSERT INTO "new_Talents_v2" ("bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns", "talentType") SELECT "bio", "firstName", "gender", "id", "lastName", "profileImage", "pronouns", "talentType" FROM "Talents_v2";
DROP TABLE "Talents_v2";
ALTER TABLE "new_Talents_v2" RENAME TO "Talents_v2";
CREATE UNIQUE INDEX "Talents_v2_talentUserNumber_key" ON "Talents_v2"("talentUserNumber");
CREATE INDEX "Talents_v2_firstName_lastName_idx" ON "Talents_v2"("firstName", "lastName");
CREATE INDEX "Talents_v2_talentType_idx" ON "Talents_v2"("talentType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
