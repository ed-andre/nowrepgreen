import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import { prisma } from "~/db.server";

// Validate the secret key from the request
function validateSecretKey(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    throw new Response("Missing Authorization header", { status: 401 });
  }

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || token !== process.env.SYNC_SECRET_KEY) {
    throw new Response("Invalid authorization", { status: 403 });
  }
}

// Clean up old records, keeping only the most recent ones
async function cleanupOldRecords(modelName: string, keepCount: number) {
  // Validate model name
  const validModels = [
    "BoardsJson",
    "BoardsTalentsJson",
    "BoardsPortfoliosJson",
    "PortfoliosMediaJson",
    "TalentsJson",
    "TalentsPortfoliosJson",
    "TalentsMeasurementsJson",
    "TalentsSocialsJson",
    "MediaTagsJson",
  ];

  if (!validModels.includes(modelName)) {
    throw new Error(`Invalid model name: ${modelName}`);
  }

  console.log(
    `Cleaning up old records for ${modelName}, keeping ${keepCount} most recent`,
  );

  // Get all records sorted by createdAt in descending order
  // Using dynamic property access with type assertion
  const records = await (prisma as any)[modelName].findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true },
  });

  console.log(`Found ${records.length} total records for ${modelName}`);

  // If we have more records than we want to keep, delete the oldest ones
  if (records.length > keepCount) {
    const recordsToKeep = records.slice(0, keepCount);
    const recordsToDelete = records.slice(keepCount);
    const idsToDelete = recordsToDelete.map(
      (record: { id: string | number }) => record.id,
    );

    console.log(`Deleting ${idsToDelete.length} old records from ${modelName}`);
    console.log(
      `Keeping records created at: ${recordsToKeep.map((r: any) => r.createdAt).join(", ")}`,
    );
    console.log(`Deleting records with IDs: ${idsToDelete.join(", ")}`);

    await (prisma as any)[modelName].deleteMany({
      where: {
        id: { in: idsToDelete },
      },
    });

    return idsToDelete.length;
  } else {
    console.log(
      `No cleanup needed for ${modelName}, only have ${records.length} records (keeping ${keepCount})`,
    );
    return 0;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Validate the request
    validateSecretKey(request);

    // Parse the request body
    const body = await request.json();
    const { modelName, data, keepCount = 3 } = body;

    console.log(
      `Received request to store data in ${modelName} with keepCount=${keepCount}`,
    );

    if (!modelName || !data) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate model name
    const validModels = [
      "BoardsJson",
      "BoardsTalentsJson",
      "BoardsPortfoliosJson",
      "PortfoliosMediaJson",
      "TalentsJson",
      "TalentsPortfoliosJson",
      "TalentsMeasurementsJson",
      "TalentsSocialsJson",
      "MediaTagsJson",
    ];

    if (!validModels.includes(modelName)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid model name: ${modelName}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Create a new record with the data
    const record = await (prisma as any)[modelName].create({
      data: {
        data: data as Prisma.JsonObject,
        createdAt: new Date(),
      },
    });

    console.log(`Created new record in ${modelName} with ID ${record.id}`);

    // Clean up old records
    const deletedCount = await cleanupOldRecords(modelName, keepCount);

    return new Response(
      JSON.stringify({
        success: true,
        record: {
          id: record.id,
          createdAt: record.createdAt,
        },
        deletedCount,
        keepCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error storing JSON data:", error);

    if (error instanceof Response) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Disallow GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
