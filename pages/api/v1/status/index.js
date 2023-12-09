import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await database.query("show server_version;");
  const dbMaxConnectionsResult = await database.query("show max_connections");
  const dbConnectionsResult = await database.query(
    "select sum(numbackends) from pg_stat_database;",
  );

  const dbVersion = dbVersionResult.rows[0].server_version;
  const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;
  const dbConnections = dbConnectionsResult.rows[0].sum;

  response.status(200).json({
    updated_at: updatedAt,
    db_version: dbVersion,
    db_max_connections: dbMaxConnections,
    db_connections: dbConnections,
  });
}

export default status;
