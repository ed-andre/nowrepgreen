-- CreateTable
CREATE TABLE "TalentsMeasurementsJson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TalentsSocialsJson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Boards_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "Boards_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "Boards_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "TalentTypes_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TalentTypes_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TalentTypes_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BoardsTalents_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "talentId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BoardsTalents_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "talentId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BoardsTalents_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "talentId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Talents_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentTypeId" TEXT NOT NULL,
    "measurements" JSONB,
    "socials" JSONB
);

-- CreateTable
CREATE TABLE "Talents_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentTypeId" TEXT NOT NULL,
    "measurements" JSONB,
    "socials" JSONB
);

-- CreateTable
CREATE TABLE "Talents_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "gender" TEXT,
    "pronouns" TEXT,
    "talentTypeId" TEXT NOT NULL,
    "measurements" JSONB,
    "socials" JSONB
);

-- CreateTable
CREATE TABLE "PortfolioCategories_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "PortfolioCategories_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "PortfolioCategories_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT
);

-- CreateTable
CREATE TABLE "Portfolios_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "Portfolios_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "Portfolios_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "talentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "coverImage" TEXT
);

-- CreateTable
CREATE TABLE "BoardsPortfolios_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BoardsPortfolios_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BoardsPortfolios_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MediaTags_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MediaTags_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MediaTags_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioMedia_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioMedia_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioMedia_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolioId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "MediaTags_Junction_v1" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MediaTags_Junction_v2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MediaTags_Junction_current" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mediaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "TalentsMeasurementsJson_createdAt_idx" ON "TalentsMeasurementsJson"("createdAt");

-- CreateIndex
CREATE INDEX "TalentsSocialsJson_createdAt_idx" ON "TalentsSocialsJson"("createdAt");

-- CreateIndex
CREATE INDEX "Boards_v1_title_idx" ON "Boards_v1"("title");

-- CreateIndex
CREATE INDEX "Boards_v2_title_idx" ON "Boards_v2"("title");

-- CreateIndex
CREATE INDEX "TalentTypes_v1_name_idx" ON "TalentTypes_v1"("name");

-- CreateIndex
CREATE INDEX "TalentTypes_v2_name_idx" ON "TalentTypes_v2"("name");

-- CreateIndex
CREATE INDEX "BoardsTalents_v1_talentId_idx" ON "BoardsTalents_v1"("talentId");

-- CreateIndex
CREATE INDEX "BoardsTalents_v1_boardId_idx" ON "BoardsTalents_v1"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardsTalents_v1_boardId_talentId_key" ON "BoardsTalents_v1"("boardId", "talentId");

-- CreateIndex
CREATE INDEX "BoardsTalents_v2_talentId_idx" ON "BoardsTalents_v2"("talentId");

-- CreateIndex
CREATE INDEX "BoardsTalents_v2_boardId_idx" ON "BoardsTalents_v2"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardsTalents_v2_boardId_talentId_key" ON "BoardsTalents_v2"("boardId", "talentId");

-- CreateIndex
CREATE INDEX "Talents_v1_firstName_lastName_idx" ON "Talents_v1"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "Talents_v1_talentTypeId_idx" ON "Talents_v1"("talentTypeId");

-- CreateIndex
CREATE INDEX "Talents_v2_firstName_lastName_idx" ON "Talents_v2"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "Talents_v2_talentTypeId_idx" ON "Talents_v2"("talentTypeId");

-- CreateIndex
CREATE INDEX "PortfolioCategories_v1_name_idx" ON "PortfolioCategories_v1"("name");

-- CreateIndex
CREATE INDEX "PortfolioCategories_v2_name_idx" ON "PortfolioCategories_v2"("name");

-- CreateIndex
CREATE INDEX "Portfolios_v1_talentId_idx" ON "Portfolios_v1"("talentId");

-- CreateIndex
CREATE INDEX "Portfolios_v1_categoryId_idx" ON "Portfolios_v1"("categoryId");

-- CreateIndex
CREATE INDEX "Portfolios_v1_title_idx" ON "Portfolios_v1"("title");

-- CreateIndex
CREATE INDEX "Portfolios_v2_talentId_idx" ON "Portfolios_v2"("talentId");

-- CreateIndex
CREATE INDEX "Portfolios_v2_categoryId_idx" ON "Portfolios_v2"("categoryId");

-- CreateIndex
CREATE INDEX "Portfolios_v2_title_idx" ON "Portfolios_v2"("title");

-- CreateIndex
CREATE INDEX "BoardsPortfolios_v1_portfolioId_idx" ON "BoardsPortfolios_v1"("portfolioId");

-- CreateIndex
CREATE INDEX "BoardsPortfolios_v1_boardId_idx" ON "BoardsPortfolios_v1"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardsPortfolios_v1_boardId_portfolioId_key" ON "BoardsPortfolios_v1"("boardId", "portfolioId");

-- CreateIndex
CREATE INDEX "BoardsPortfolios_v2_portfolioId_idx" ON "BoardsPortfolios_v2"("portfolioId");

-- CreateIndex
CREATE INDEX "BoardsPortfolios_v2_boardId_idx" ON "BoardsPortfolios_v2"("boardId");

-- CreateIndex
CREATE UNIQUE INDEX "BoardsPortfolios_v2_boardId_portfolioId_key" ON "BoardsPortfolios_v2"("boardId", "portfolioId");

-- CreateIndex
CREATE INDEX "MediaTags_v1_name_idx" ON "MediaTags_v1"("name");

-- CreateIndex
CREATE INDEX "MediaTags_v1_slug_idx" ON "MediaTags_v1"("slug");

-- CreateIndex
CREATE INDEX "MediaTags_v2_name_idx" ON "MediaTags_v2"("name");

-- CreateIndex
CREATE INDEX "MediaTags_v2_slug_idx" ON "MediaTags_v2"("slug");

-- CreateIndex
CREATE INDEX "PortfolioMedia_v1_portfolioId_idx" ON "PortfolioMedia_v1"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioMedia_v1_type_idx" ON "PortfolioMedia_v1"("type");

-- CreateIndex
CREATE INDEX "PortfolioMedia_v1_order_idx" ON "PortfolioMedia_v1"("order");

-- CreateIndex
CREATE INDEX "PortfolioMedia_v2_portfolioId_idx" ON "PortfolioMedia_v2"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioMedia_v2_type_idx" ON "PortfolioMedia_v2"("type");

-- CreateIndex
CREATE INDEX "PortfolioMedia_v2_order_idx" ON "PortfolioMedia_v2"("order");

-- CreateIndex
CREATE INDEX "MediaTags_Junction_v1_tagId_idx" ON "MediaTags_Junction_v1"("tagId");

-- CreateIndex
CREATE INDEX "MediaTags_Junction_v1_mediaId_idx" ON "MediaTags_Junction_v1"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaTags_Junction_v1_mediaId_tagId_key" ON "MediaTags_Junction_v1"("mediaId", "tagId");

-- CreateIndex
CREATE INDEX "MediaTags_Junction_v2_tagId_idx" ON "MediaTags_Junction_v2"("tagId");

-- CreateIndex
CREATE INDEX "MediaTags_Junction_v2_mediaId_idx" ON "MediaTags_Junction_v2"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaTags_Junction_v2_mediaId_tagId_key" ON "MediaTags_Junction_v2"("mediaId", "tagId");

-- CreateIndex
CREATE INDEX "BoardsJson_createdAt_idx" ON "BoardsJson"("createdAt");

-- CreateIndex
CREATE INDEX "BoardsPortfoliosJson_createdAt_idx" ON "BoardsPortfoliosJson"("createdAt");

-- CreateIndex
CREATE INDEX "BoardsTalentsJson_createdAt_idx" ON "BoardsTalentsJson"("createdAt");

-- CreateIndex
CREATE INDEX "PortfoliosMediaJson_createdAt_idx" ON "PortfoliosMediaJson"("createdAt");

-- CreateIndex
CREATE INDEX "SyncMetadata_entityName_idx" ON "SyncMetadata"("entityName");

-- CreateIndex
CREATE INDEX "TalentsJson_createdAt_idx" ON "TalentsJson"("createdAt");

-- CreateIndex
CREATE INDEX "TalentsPortfoliosJson_createdAt_idx" ON "TalentsPortfoliosJson"("createdAt");
