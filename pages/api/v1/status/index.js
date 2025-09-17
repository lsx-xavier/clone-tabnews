import database from 'infra/database.js';

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const getServerVersion = await database.query('SHOW server_version;');
  const serverVersion = getServerVersion.rows[0].server_version;

  const getPgSettings = await database.query('SHOW max_connections;');
  const maxConnections = getPgSettings.rows[0].max_connections;

  const dataBaseName = process.env.POSTGRES_DB;

  const getOpenedConnections = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [dataBaseName],
  });
  const openedConnections = getOpenedConnections.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: serverVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      },
    },
  });
}

export default status;
