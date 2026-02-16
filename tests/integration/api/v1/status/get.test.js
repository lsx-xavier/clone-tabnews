import orchestrator from '../orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe('GET to /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const response = await fetch('http://localhost:3000/api/v1/status');
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.update_at).toBeDefined();

      const parsedUpdateAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toBe(parsedUpdateAt);

      const databaseInfos = responseBody.dependencies.database;
      expect(databaseInfos.version).toBe('16.0');

      expect(databaseInfos.max_connections).toBe(100);

      expect(databaseInfos.opened_connections).toBe(1);
    });
  });
});
