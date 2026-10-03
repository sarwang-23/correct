# CarbonSynq University Demo — Local PostgreSQL (No Neon)

This package uses a **new local PostgreSQL database in Docker**. The active demo path does not require or contact Neon.

## Fastest Windows setup

1. Install Node.js 24 (or Node.js 22.16+) and Docker Desktop.
2. Start Docker Desktop and keep it running.
3. Double-click `START-LOCAL-DEMO.cmd`.
4. After services are healthy, open:
   - `http://localhost:5000/university`
   - `http://localhost:5000/university/imports`
   - `http://localhost:5000/operations`
5. For the first/new university only, open a terminal in `scale-api` and run:
   `npm.cmd run local:provision`
   Save the printed tenant/admin/reviewer credentials privately.

## What gets created

- PostgreSQL 17 database: `carbonsynq`
- Host database address: `127.0.0.1:5433`
- Database roles: `cs_owner`, `cs_api`, `cs_worker`
- API host address: `http://localhost:5000`
- Frontend origin allowed: `http://localhost:3000`
- Local private object storage and ClamAV scanner
- Background worker and local English OCR support

`npm run setup` creates `scale-api/.env` with random **local-only** secrets. Do not commit that file.

If another local stack already uses ports 5000, 9000, 9001 or 3310, set
`API_HOST_PORT`, `OBJECT_STORE_HOST_PORT`, `OBJECT_STORE_CONSOLE_HOST_PORT`
and `SCANNER_HOST_PORT` in `scale-api/.env`. Set `PUBLIC_BASE_URL` and the
matching `ALLOWED_ORIGINS` entry to the selected API port. The local checker
accepts only a `localhost` API URL matching `API_HOST_PORT`.

## CLI commands

```powershell
cd scale-api
npm.cmd run setup
npm.cmd run env:check
npm.cmd run local:up
npm.cmd run local:status
npm.cmd run local:provision   # NEW tenant only
npm.cmd run local:logs
npm.cmd run local:down
```

`local:down` keeps database/storage volumes. Do **not** use `docker compose down -v` unless you intentionally want to destroy local demo data.

## Frontend

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend on `http://localhost:3000`.

## Database inspection

```powershell
docker compose exec database psql -U cs_owner -d carbonsynq
```

Inside psql:

```sql
\dt cs.*
```

## Important

- The old Neon-specific active launcher/profile has been removed from this package to avoid accidental remote DB use.
- Historical documentation can mention older deliveries; use this file for the current local demo setup.
- Provisioning creates a new tenant each time; do not rerun it for password recovery.
