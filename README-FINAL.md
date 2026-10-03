# CarbonSynq University - FINAL Local PostgreSQL Backend

This is the single combined backend package for the university sustainability demo.

## Active application
Use `scale-api/` only. It uses local PostgreSQL through Docker Compose, not Neon.

Configured local endpoints:
- Frontend origin: http://localhost:3000
- Backend/API: http://localhost:5000
- PostgreSQL host: 127.0.0.1:5433
- Database: carbonsynq
- PostgreSQL schema: cs

## Included university features
- Manual activity data entry
- Scope 1 and Scope 2 accounting workflows
- University KPI/data collection
- Unstructured XLSX/CSV mapping, normalization and review
- Batch PDF invoice intake (5-6 invoices and more within configured bounds)
- Local English OCR for scanned invoices with human review
- Emission-factor governance and independent review
- Approval/calculation workflow
- Supplier/materiality/reduction/reporting modules retained
- Evidence/document permissions, notifications, reassignment and recovery workflows
- Background inventory export

## Database
Run migrations 001-006 automatically through Docker Compose. Do not use the legacy database as the active university database.

The folder `legacy-carbonsynq-backend/` is preserved only as source/reference from the older supplied backend. Do not copy its schema or runtime files over `scale-api/`.

## First run on Windows
1. Install/start Docker Desktop (Linux containers) and Node.js 22.16+ (Node 24 recommended).
2. Double-click `START-LOCAL-DEMO.cmd`, or from `scale-api/` run:

```powershell
npm.cmd run setup
npm.cmd run env:check
npm.cmd run local:up
npm.cmd run local:status
```

3. Create a fresh demo university once:

```powershell
npm.cmd run local:provision
```

4. Open:
- http://localhost:5000/university
- http://localhost:5000/university/imports
- http://localhost:5000/operations

## Important
- A private `.env` is intentionally not shipped. `npm run setup` creates local-only secrets.
- Do not run `docker compose down -v` unless you intentionally want to delete local database/evidence volumes.
- Keep all sample/demo emissions and factors clearly labelled as synthetic/illustrative.
