import { spawn } from 'node:child_process';

const BACKEND_PORT = process.env.BACKEND_PORT || '4000';
const FRONTEND_PORT = process.env.FRONTEND_PORT || '4173';
const BASE_FRONTEND = `http://127.0.0.1:${FRONTEND_PORT}`;
const BASE_BACKEND = `http://127.0.0.1:${BACKEND_PORT}`;

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: false, ...opts });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} failed with ${code}`))));
  });
}

async function waitFor(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function verifyRoutes(base, routes) {
  for (const route of routes) {
    const res = await fetch(`${base}${route}`);
    if (!res.ok) throw new Error(`Route check failed: ${route} (${res.status})`);
    console.log(`✔ ${route} -> ${res.status}`);
  }
}

async function main() {
  console.log('1) Running backend tests...');
  await run('npm', ['run', 'backend:test']);

  console.log('2) Building frontend...');
  await run('npm', ['run', 'build']);

  console.log('3) Starting backend + preview...');
  const backend = spawn('node', ['backend/src/server.js'], {
    env: { ...process.env, BACKEND_PORT },
    stdio: 'inherit',
  });
  const frontend = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', FRONTEND_PORT], {
    env: process.env,
    stdio: 'inherit',
  });

  const shutdown = () => {
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  try {
    await waitFor(`${BASE_BACKEND}/health`);
    await waitFor(`${BASE_FRONTEND}/`);

    console.log('4) Verifying critical routes...');
    await verifyRoutes(BASE_FRONTEND, ['/', '/public-map-viewer', '/auth/login', '/auth/signup']);

    const healthRes = await fetch(`${BASE_BACKEND}/automation/status`);
    const health = await healthRes.json();
    console.log('Backend automation status:', health);

    console.log('\n✅ Launch automation checks passed. Website is ready to launch.');
  } finally {
    shutdown();
  }
}

main().catch((err) => {
  console.error('❌ Launch automation failed:', err.message);
  process.exit(1);
});
