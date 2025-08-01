const { test } = require('tap');
const { build } = require('../src/server');

// Test data
const testPlayer = {
  name: 'Virat Kohli',
  team: 'RCB',
  country: 'India',
  runs: 6000,
  role: 'Batsman',
  salary: 150000000
};

let playerId;

test('IPL Players API Tests', async (t) => {
  const app = await build();

  t.test('Health Check', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });

    t.equal(response.statusCode, 200);
    t.same(JSON.parse(response.payload), { 
      status: 'OK', 
      timestamp: JSON.parse(response.payload).timestamp 
    });
  });

  t.test('Root Endpoint', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.message, 'IPL Players Management API');
    t.equal(payload.version, '1.0.0');
  });

  t.test('List Players - Empty', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/players'
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.page, 1);
    t.equal(payload.limit, 10);
    t.equal(payload.total, 0);
    t.same(payload.players, []);
  });

  t.test('Create Player', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/players',
      payload: testPlayer
    });

    t.equal(response.statusCode, 201);
    const payload = JSON.parse(response.payload);
    t.equal(payload.message, 'Player created successfully');
  });

  t.test('List Players - After Creation', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/players'
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.total, 1);
    t.equal(payload.players.length, 1);
    t.equal(payload.players[0].name, testPlayer.name);
    t.equal(payload.players[0].team, testPlayer.team);
    t.equal(payload.players[0].role, testPlayer.role);
    
    // Store player ID for later tests
    playerId = payload.players[0].id;
  });

  t.test('Get Player Description', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/players/${playerId}/description`
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.name, testPlayer.name);
    t.equal(payload.team, testPlayer.team);
    t.equal(payload.country, testPlayer.country);
    t.equal(payload.runs, testPlayer.runs);
    t.equal(payload.role, testPlayer.role);
    t.equal(payload.salary, testPlayer.salary);
  });

  t.test('Update Player', async (t) => {
    const updateData = {
      runs: 6500,
      salary: 160000000
    };

    const response = await app.inject({
      method: 'PATCH',
      url: `/api/players/${playerId}`,
      payload: updateData
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.message, 'Player updated successfully');
  });

  t.test('Verify Player Update', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/players/${playerId}/description`
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.runs, 6500);
    t.equal(payload.salary, 160000000);
  });

  t.test('Filter Players by Team', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/players?team=RCB'
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.total, 1);
    t.equal(payload.players[0].team, 'RCB');
  });

  t.test('Sort Players by Runs', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/players?sortBy=runs&sortOrder=desc'
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.total, 1);
    t.equal(payload.players[0].name, testPlayer.name);
  });

  t.test('Delete Player', async (t) => {
    const response = await app.inject({
      method: 'DELETE',
      url: `/api/players/${playerId}`
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.message, 'Player deleted successfully');
  });

  t.test('Verify Player Deletion', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/players'
    });

    t.equal(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    t.equal(payload.total, 0);
    t.same(payload.players, []);
  });

  t.test('Get Non-existent Player', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/players/non-existent-id/description'
    });

    t.equal(response.statusCode, 404);
  });

  await app.close();
}); 