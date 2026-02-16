import { runner } from 'node-pg-migrate';
import { join } from 'node:path';

import database from 'infra/database';

const METHODS_ALLOWED = ['GET', 'POST'];
export default async function migrations(request, response) {
  if (!METHODS_ALLOWED.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigartionsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    };

    switch (request.method) {
      case 'GET': {
        const pendingMigrations = await runner(
          defaultMigartionsOptions,
        );

        return response.status(200).json(pendingMigrations);
      }
      case 'POST': {
        const migratedMigrations = await runner({
          ...defaultMigartionsOptions,
          dryRun: false,
        });

        if (migratedMigrations.length > 0) {
          return response.status(201).json(migratedMigrations);
        }

        return response.status(200).json(migratedMigrations);
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
