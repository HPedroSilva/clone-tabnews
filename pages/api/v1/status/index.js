import database from "infra/database";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const dbVersionResult = await database.query("show server_version;");
    const dbVersion = dbVersionResult.rows[0].server_version;

    const dbMaxConnectionsResult = await database.query("show max_connections");
    const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const dbConnectionsResult = await database.query({
      text: "select count(*)::int from pg_stat_activity where datname = $1;",
      values: [databaseName],
    });
    const dbConnections = dbConnectionsResult.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion,
          max_connections: parseInt(dbMaxConnections),
          opened_connections: dbConnections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({ cause: error });
    console.log("Erro dentro do catch do controller:");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
