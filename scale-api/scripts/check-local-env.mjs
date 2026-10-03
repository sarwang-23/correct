import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve('.env');
if (!existsSync(path)) {
  console.error(JSON.stringify({ valid:false, error:'MISSING_ENV', message:'Run npm run setup first.' }));
  process.exit(1);
}
const env = {};
for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const i = line.indexOf('=');
  if (i < 1) continue;
  env[line.slice(0,i)] = line.slice(i+1);
}
const required = ['DB_OWNER_PASSWORD','DB_API_PASSWORD','DB_WORKER_PASSWORD','DATABASE_OWNER_URL','DATABASE_URL','WORKER_DATABASE_URL','S3_BUCKET','AWS_ACCESS_KEY_ID','AWS_SECRET_ACCESS_KEY','METRICS_TOKEN','REQUEST_HASH_SECRET','MAIL_ENCRYPTION_KEY'];
const missing = required.filter(k => !env[k] || /REPLACE|PLACEHOLDER/i.test(env[k]));
if (missing.length) {
  console.error(JSON.stringify({ valid:false, error:'MISSING_VALUES', missing }));
  process.exit(1);
}
for (const k of ['DATABASE_OWNER_URL','DATABASE_URL','WORKER_DATABASE_URL']) {
  let u;
  try { u = new URL(env[k]); } catch { console.error(JSON.stringify({ valid:false,error:'BAD_DATABASE_URL',key:k })); process.exit(1); }
  if (!['127.0.0.1','localhost'].includes(u.hostname) || Number(u.port || 5432) !== 5433 || u.pathname !== '/carbonsynq') {
    console.error(JSON.stringify({ valid:false,error:'NOT_LOCAL_POSTGRES',key:k,message:'This local demo profile must use localhost:5433/carbonsynq. Neon/remote database URLs are not allowed.' }));
    process.exit(1);
  }
}
if (env.DB_SSL !== 'false') {
  console.error(JSON.stringify({ valid:false,error:'LOCAL_DB_SSL',message:'Local Docker PostgreSQL profile requires DB_SSL=false.' }));
  process.exit(1);
}
const apiPort = Number(env.API_HOST_PORT || 5000);
const publicBaseUrl = `http://localhost:${apiPort}`;
if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535 || env.PUBLIC_BASE_URL !== publicBaseUrl) {
  console.error(JSON.stringify({ valid:false,error:'PUBLIC_BASE_URL',message:`Use ${publicBaseUrl} for the local demo.` }));
  process.exit(1);
}
const origins = (env.ALLOWED_ORIGINS || '').split(',').map(s=>s.trim());
for (const origin of ['http://localhost:3000',publicBaseUrl]) {
  if (!origins.includes(origin)) {
    console.error(JSON.stringify({ valid:false,error:'ALLOWED_ORIGINS',message:`Missing ${origin}` }));
    process.exit(1);
  }
}
console.log(JSON.stringify({ valid:true, profile:'local-postgres', database:'localhost:5433/carbonsynq', backend:publicBaseUrl, frontend:'http://localhost:3000', databaseContacted:false }, null, 2));
