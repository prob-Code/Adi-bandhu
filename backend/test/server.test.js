const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createServer } = require('../src/server');

function request(path, port, method = 'GET', payload) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path, method, headers: payload ? { 'Content-Type': 'application/json' } : {} },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      }
    );
    req.on('error', reject);
    if (payload) req.write(JSON.stringify(payload));
    req.end();
  });
}

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  try {
    const { port } = server.address();
    await fn(port);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
}

test('GET /health returns 200 and metadata', async () => {
  await withServer(async (port) => {
    const response = await request('/health', port);
    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.status, 'ok');
  });
});

test('POST /api/pattas/verify returns verification decision', async () => {
  await withServer(async (port) => {
    const response = await request('/api/pattas/verify', port, 'POST', {
      claimId: 'CLAIM-100',
      lat: 23.4,
      lng: 87.3,
      parcelOverlapScore: 0.9,
      documentTextConfidence: 0.8,
      imageChangeScore: 0.1,
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.ok, true);
    assert.equal(body.claimId, 'CLAIM-100');
    assert.equal(body.verification.decision, 'approve');
  });
});

test('POST /api/pattas/verify validates required fields', async () => {
  await withServer(async (port) => {
    const response = await request('/api/pattas/verify', port, 'POST', { claimId: 'X' });
    assert.equal(response.statusCode, 400);
    const body = JSON.parse(response.body);
    assert.equal(body.ok, false);
  });
});
