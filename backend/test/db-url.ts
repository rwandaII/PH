import 'dotenv/config';

/**
 * The tests use their own database: TEST_DATABASE_URL if set, otherwise DATABASE_URL
 * with "_test" added to the database name. It is wiped on every run, so refuse
 * anything whose name does not end in "_test".
 */
export function testDatabaseUrl(): string {
  const explicit = process.env.TEST_DATABASE_URL;
  const base = explicit ?? process.env.DATABASE_URL;
  if (!base) throw new Error('Set DATABASE_URL (or TEST_DATABASE_URL) in backend/.env to run the tests');
  const url = new URL(base);
  if (!explicit) url.pathname = `${url.pathname.replace(/\/$/, '')}_test`;
  if (!/_test$/.test(url.pathname)) {
    throw new Error(`Refusing to run tests against "${url.pathname.slice(1)}": the test database name must end in _test`);
  }
  return url.toString();
}
