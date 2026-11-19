import { execSync } from 'node:child_process';
import { testDatabaseUrl } from './db-url.js';

/**
 * Creates the test database if needed and applies the migrations, once per run.
 * Uses the non-destructive `migrate deploy`; each test empties the tables itself
 * (see resetDb in helpers.ts), so runs still start from a clean state.
 */
export default function setup() {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl() },
    stdio: 'inherit',
  });
}
