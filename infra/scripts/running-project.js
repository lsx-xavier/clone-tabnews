const { execSync } = require('node:child_process');

const mode = process.argv[2];
let exitCode = 0;
let cleaning = false;

function run(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit' });
    return 0;
  } catch (e) {
    return e.status ?? (e.signal ? 143 : 1) ?? 1;
  }
}

function cleanup() {
  if (cleaning) return;
  cleaning = true;
  console.log('🔴 Cleaning up...');
  try {
    execSync('pnpm run services:stop', { stdio: 'inherit' });
  } catch (e) {
    console.error('🔴 Error cleaning up:', e);
  }
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(130); // 128 + SIGINT(2)
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(143); // 128 + SIGTERM(15)
});

try {
  run('pnpm run services:up');

  if (mode === 'dev') {
    run('pnpm run services:wait:database');
    run('pnpm run migrations:up');
    exitCode = run('next dev');
  } else if (mode === 'test') {
    exitCode = run(
      'concurrently -n next,jest --hide next -k -s command-jest "next dev" "jest --runInBand --verbose"',
    );
  } else {
    console.error(`Uso: node infra/scripts/running-project.js [${mode}]`);
    process.exit(1);
  }
} finally {
  cleanup();
}

process.exit(exitCode);
