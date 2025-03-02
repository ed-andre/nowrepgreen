import { prisma } from "~/db.server";

/**
 * API endpoint to handle empty data scenarios by creating empty tables
 * and updating views to point to these empty tables
 */
export async function action({ request }: { request: Request }) {
  // Verify authorization
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const expectedToken = process.env.SYNC_SECRET_KEY ;

  if (token !== expectedToken) {
    return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
  }

  // Define entities in the order they should be processed
  const entities = [
    "talents",
    "talentsmeasurements",
    "talentsportfolios",
    "boards",
    "boardstalents",
    "boardsportfolios",
    "portfoliosmedia",
    "mediatags",
    "mediatags_junction",
    "talentssocials",
  ];

  const processedEntities: string[] = [];

  try {
    for (const entity of entities) {
      console.log(`Processing empty data for entity: ${entity}`);

      // Get the next version for this entity
      const current = await prisma.syncMetadata.findFirst({
        where: { entityName: entity },
        orderBy: { id: "desc" },
      });

      // Determine which version will be the next active one
      const newVersion = current?.activeVersion === 1 ? 2 : 1;

      console.log(`Entity ${entity}: Current active version: ${current?.activeVersion}, New version will be: ${newVersion}`);

      await prisma.$transaction(async (tx) => {
        // Truncate the table that will become the active version
        const targetTable = `${entity}_v${newVersion}`;
        await tx.$executeRawUnsafe(`DELETE FROM "${targetTable}"`);

        // Update the metadata to point to the new empty version
        if (current) {
          await tx.syncMetadata.update({
            where: { id: current.id },
            data: {
              activeVersion: newVersion,
              backupVersion: current.activeVersion,
            },
          });
        } else {
          await tx.syncMetadata.create({
            data: {
              entityName: entity,
              activeVersion: newVersion,
              backupVersion: 0,
            },
          });
        }

        // Update the view to point to the new empty version
        try {
          await tx.$executeRawUnsafe(`DROP VIEW IF EXISTS "${entity}_current"`);
        } catch (error) {
          // If it fails because it's a table, try to drop table
          await tx.$executeRawUnsafe(`DROP TABLE IF EXISTS "${entity}_current"`);
        }

        await tx.$executeRawUnsafe(
          `CREATE VIEW "${entity}_current" AS SELECT * FROM "${entity}_v${newVersion}"`
        );
      });

      processedEntities.push(entity);
      console.log(`Successfully processed empty data for ${entity}`);
    }

    return Response.json({
      success: true,
      message: "Successfully created empty tables and updated views for all entities",
      entities: processedEntities,
    });
  } catch (error) {
    console.error("Error handling empty data scenario:", error);
    return Response.json({
      success: false,
      message: `Error handling empty data: ${error instanceof Error ? error.message : String(error)}`,
      entities: processedEntities,
    }, { status: 500 });
  }
}