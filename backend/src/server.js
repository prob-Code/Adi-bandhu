const http = require('http');

const DEFAULT_PORT = 4000;

function requestHandler(req, res) {
  if (req.url === '/health' && req.method === 'GET') {
    const body = JSON.stringify({
      status: 'ok',
      service: 'fra-atlas-backend',
      timestamp: new Date().toISOString(),
    });

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
    return;
  }

  const body = JSON.stringify({
    error: 'Not Found',
    path: req.url,
  });

  res.writeHead(404, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function createServer() {
  return http.createServer(requestHandler);
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
};
