import { createId } from "@paralleldrive/cuid2";
import { Prisma } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

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

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    // Validate the request
    validateSecretKey(request);

    const { entity } = params;

    if (!entity) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing entity parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Import server-only modules inside the action function
    // This prevents them from being included in the client bundle
    const { prisma } = await import("~/db.server");

    // Import transform functions from a separate file to keep this file clean
    const {
      transformBoards,
      transformBoardsTalents,
      transformBoardsPortfolios,
      transformPortfoliosMedia,
      transformMediaTags,
      transformTalents,
      transformTalentsPortfolios,
      transformTalentsMeasurements,
      transformTalentsSocials,
    } = await import("~/services/transforms.server");

    // Map entity names to their transform functions
    const transformFunctions: Record<string, () => Promise<any>> = {
      talents: transformTalents,
      talentsmeasurements: transformTalentsMeasurements,
      talentsportfolios: transformTalentsPortfolios,
      boards: transformBoards,
      boardstalents: transformBoardsTalents,
      boardsportfolios: transformBoardsPortfolios,
      portfoliosmedia: transformPortfoliosMedia,
      mediatags: transformMediaTags,
      talentssocials: transformTalentsSocials,
    };

    // Check if the entity is valid
    if (!Object.keys(transformFunctions).includes(entity)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid entity name" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Call the appropriate transform function
    const transformFunction = transformFunctions[entity];
    const result = await transformFunction();

    return new Response(
      JSON.stringify({
        success: true,
        entity,
        ...result,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(`Error transforming entity:`, error);

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
