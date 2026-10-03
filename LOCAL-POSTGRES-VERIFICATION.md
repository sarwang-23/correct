# Local PostgreSQL conversion verification

This delivery converts the active demo setup from the Neon-specific profile to a local Docker PostgreSQL profile.

## Checked locally

- `npm run setup` created a fresh `.env` containing local-only PostgreSQL URLs on `127.0.0.1:5433/carbonsynq`.
- `npm run env:check` returned `valid: true`, backend `http://localhost:5000`, frontend `http://localhost:3000`, and `databaseContacted: false`.
- `compose.yaml` parsed successfully and exposes the API as `127.0.0.1:5000:8080`.
- Local Compose retains PostgreSQL 17, private object storage, ClamAV, migration service, worker and API.
- SQL migrations `001` through `006` are retained.
- Neon-specific active compose/template/helper/launcher filenames were removed from this delivery.
- No generated `.env` or private credential was packaged.

## Not executed in this environment

A dependency install attempt timed out because registry/network access was unavailable. Docker/PostgreSQL/ClamAV were therefore not started here, and live migrations were not executed. Core application code is inherited from the supplied backend; this change focuses on local database/startup configuration.

Before the CEO demo, run `START-LOCAL-DEMO.cmd`, provision one fresh demo university, then rehearse manual entry, Excel normalization and multi-invoice review/calculation end to end.
