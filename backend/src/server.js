const http = require('http');
const { verifyPattas } = require('./pattasVerification');

const DEFAULT_PORT = 4000;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

async function requestHandler(req, res) {
  if (req.url === '/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'fra-atlas-backend',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.url === '/automation/status' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      automation: true,
      checks: ['backend-health', 'frontend-preview', 'critical-routes'],
      timestamp: new Date().toISOString(),
    });
  }

  if (req.url === '/api/pattas/verify' && req.method === 'POST') {
    try {
      const payload = await readJsonBody(req);
      const result = verifyPattas(payload);
      if (!result.ok) return sendJson(res, 400, result);
      return sendJson(res, 200, result);
    } catch (error) {
      return sendJson(res, 400, { ok: false, error: error.message });
    }
  }

  return sendJson(res, 404, {
    error: 'Not Found',
    path: req.url,
  });
}

function createServer() {
  return http.createServer((req, res) => {
    requestHandler(req, res).catch((error) => {
      sendJson(res, 500, { error: 'Internal Server Error', message: error.message });
    });
  });
}

function startServer(port = DEFAULT_PORT) {
  const server = createServer();
  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

if (require.main === module) {
  startServer(process.env.BACKEND_PORT || DEFAULT_PORT).then((server) => {
    const address = server.address();
    console.log(`Backend running on port ${address.port}`);
  });
}

module.exports = {
  createServer,
  startServer,
  requestHandler,
  readJsonBody,
};
