import { createApp } from './app.js';
import { config } from './config.js';
import { prisma } from './db.js';

const server = createApp().listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});

// Keep connections from the website open between requests (faster, fewer dropped connections),
// a little longer than the default of proxies in front of it.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
// Give a slow upload over weak wifi time to finish.
server.requestTimeout = 300_000;

// Stop cleanly (finish requests, close the database) when asked to.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(0), 10_000).unref();
  });
}
