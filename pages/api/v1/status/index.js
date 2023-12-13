import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersionResult = await database.query("show server_version;");
  const dbVersion = dbVersionResult.rows[0].server_version;
  
  const dbMaxConnectionsResult = await database.query("show max_connections");
  const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

  const dbConnectionsResult = await database.query(
    "select count(*)::int from pg_stat_activity where datname = 'local_db';",
  );
  const dbConnections = dbConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersion,
        max_connections: parseInt(dbMaxConnections),
        opened_connections: dbConnections,
      }
    },
  });
}

export default status;
