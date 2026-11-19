import os from 'node:os';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { testDatabaseUrl } from './test/db-url.js';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    globalSetup: ['./test/global-setup.ts'],
    // Set before the app (and its Prisma client) is imported in each test file.
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: testDatabaseUrl(),
      UPLOAD_DIR: path.join(os.tmpdir(), 'hydraulic-test-uploads'),
      JWT_SECRET: process.env.JWT_SECRET ?? 'test-secret-only-used-in-tests',
    },
    // One shared database: run files one after another.
    fileParallelism: false,
    hookTimeout: 60_000,
    testTimeout: 20_000,
  },
});
