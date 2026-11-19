// Starts the website's own MySQL server (port 3307) for local development.
// Its data lives in %LOCALAPPDATA%\HydraulicProgram\mysql-data, separate from any other MySQL.
// The first time, it creates that folder; the root password is then set as in DATABASE_URL.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const bin = process.env.MYSQL_BIN ?? 'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin';
const dataDir = process.env.MYSQL_DATA_DIR ?? path.join(process.env.LOCALAPPDATA ?? '.', 'HydraulicProgram', 'mysql-data');
const mysqld = path.join(bin, 'mysqld.exe');

if (!fs.existsSync(mysqld)) {
  console.error(`mysqld not found at ${mysqld}. Set MYSQL_BIN to your MySQL "bin" folder.`);
  process.exit(1);
}
if (!fs.existsSync(dataDir)) {
  console.log(`Creating a new database folder at ${dataDir} ...`);
  fs.mkdirSync(path.dirname(dataDir), { recursive: true });
  const init = spawnSync(mysqld, ['--no-defaults', '--initialize-insecure', `--datadir=${dataDir}`, '--console'], { stdio: 'inherit' });
  if (init.status !== 0) process.exit(init.status ?? 1);
  console.log('Created. The root user has no password yet: set it to the one in DATABASE_URL.');
}

console.log(`Starting MySQL on 127.0.0.1:3307 (data: ${dataDir}). Press Ctrl+C to stop.`);
const server = spawn(mysqld, ['--no-defaults', `--datadir=${dataDir}`, '--port=3307', '--bind-address=127.0.0.1', '--mysqlx=OFF', '--console'], { stdio: 'inherit' });
server.on('exit', (code) => process.exit(code ?? 0));
