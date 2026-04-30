const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createServer } = require('../src/server');

function get(path, port) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path, method: 'GET' },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

test('GET /health returns 200 and metadata', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const response = await get('/health', port);
    assert.equal(response.statusCode, 200);

    const body = JSON.parse(response.body);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'fra-atlas-backend');
    assert.ok(body.timestamp);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});

test('unknown route returns 404', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));

  try {
    const { port } = server.address();
    const response = await get('/missing', port);
    assert.equal(response.statusCode, 404);

    const body = JSON.parse(response.body);
    assert.equal(body.error, 'Not Found');
    assert.equal(body.path, '/missing');
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});
