import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path';

import database from 'infra/database';

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
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
      const pendingMigrations = await migrationRunner(defaultMigartionsOptions);

      await dbClient.end();

      response.status(200).json(pendingMigrations);
    }
    case 'POST': {
      const migratedMigrations = await migrationRunner({
        ...defaultMigartionsOptions,
        dryRun: false,
      });

      await dbClient.end();

      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
      }

      response.status(200).json(migratedMigrations);
    }

    default: {
      response.status(405).end();
    }
  }
}
