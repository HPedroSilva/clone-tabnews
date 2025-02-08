import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import migrator from "models/migrator.js";

const route = createRouter();

route.get(getHandler).post(postHandler);

export default route.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }

  return response.status(200).json(migratedMigrations);
}
