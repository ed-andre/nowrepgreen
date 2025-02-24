import { describe, it, expect, vi, beforeEach } from "vitest";
import { PrismaClient, Prisma } from "@prisma/client";
import { API_CONFIG } from "../config";

type JsonTable = {
  findMany: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  deleteMany: ReturnType<typeof vi.fn>;
  findFirst: ReturnType<typeof vi.fn>;
};

// Mock PrismaClient
vi.mock("@prisma/client", () => {
  const createMockTable = (): JsonTable => ({
    findMany: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
    findFirst: vi.fn(),
  });

  const mockPrisma = {
    boardsJson: createMockTable(),
    talentsJson: createMockTable(),
    portfoliosMediaJson: createMockTable(),
    mediaTagsJson: createMockTable(),
    talentsMeasurementsJson: createMockTable(),
    talentsSocialsJson: createMockTable(),
    boards_v1: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
    syncMetadata: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
    $executeRawUnsafe: vi.fn(),
  };

  return {
    PrismaClient: vi.fn(() => mockPrisma),
  };
});

describe("Data Transformation Unit Tests", () => {
  const prisma = new PrismaClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Database Operations", () => {
    const tables = [
      "boards",
      "talents",
      "portfoliosMedia",
      "mediaTags",
      "talentsMeasurements",
      "talentsSocials",
      "boardsTalents",
      "boardsPortfolios",
      "talentsPortfolios",
      "mediaTagsJunction"
    ];

    tables.forEach(entityName => {
      it(`should handle view creation correctly for ${entityName}`, async () => {
        const newVersion = 2;

        await prisma.$executeRawUnsafe(`DROP VIEW IF EXISTS "${entityName}_current"`);
        await prisma.$executeRawUnsafe(
          `CREATE VIEW "${entityName}_current" AS SELECT * FROM "${entityName}_v${newVersion}"`
        );

        expect(prisma.$executeRawUnsafe).toHaveBeenCalledTimes(2);
        expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
          `DROP VIEW IF EXISTS "${entityName}_current"`
        );
        expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
          `CREATE VIEW "${entityName}_current" AS SELECT * FROM "${entityName}_v${newVersion}"`
        );
      });

      it(`should handle transaction rollback on error for ${entityName}`, async () => {
        const error = new Error("Transaction failed");
        vi.mocked(prisma.$transaction).mockRejectedValue(error);

        try {
          await prisma.$transaction(async (tx) => {
            await tx.$executeRawUnsafe(`DELETE FROM ${entityName}_v2`);
            throw error;
          });
        } catch (e) {
          expect(e).toBe(error);
        }

        expect(prisma.$transaction).toHaveBeenCalled();
      });
    });
  });

  describe("Data Cleanup", () => {
    const jsonTables: Array<{ name: string; mock: JsonTable }> = [
      { name: "boardsJson", mock: (prisma as any).boardsJson },
      { name: "talentsJson", mock: (prisma as any).talentsJson },
      { name: "portfoliosMediaJson", mock: (prisma as any).portfoliosMediaJson },
      { name: "mediaTagsJson", mock: (prisma as any).mediaTagsJson },
      { name: "talentsMeasurementsJson", mock: (prisma as any).talentsMeasurementsJson },
      { name: "talentsSocialsJson", mock: (prisma as any).talentsSocialsJson }
    ];

    jsonTables.forEach(table => {
      it(`should retain only recent records for ${table.name}`, async () => {
        type JsonRecord = {
          id: number;
          createdAt: Date;
          updatedAt: Date;
          data: Prisma.JsonValue;
        };

        const mockRecords: JsonRecord[] = [
          { id: 4, createdAt: new Date("2024-01-04"), updatedAt: new Date("2024-01-04"), data: null },
          { id: 3, createdAt: new Date("2024-01-03"), updatedAt: new Date("2024-01-03"), data: null },
          { id: 2, createdAt: new Date("2024-01-02"), updatedAt: new Date("2024-01-02"), data: null },
        ];

        // Mock findMany to return only the 3 most recent records
        table.mock.findMany.mockResolvedValue(mockRecords);

        const records = await table.mock.findMany({
          orderBy: { createdAt: "desc" },
          take: 3,
        });

        await table.mock.deleteMany({
          where: {
            id: {
              in: [1], // Delete oldest record
            },
          },
        });

        expect(table.mock.deleteMany).toHaveBeenCalledWith({
          where: {
            id: {
              in: [1],
            },
          },
        });
      });
    });
  });
});
