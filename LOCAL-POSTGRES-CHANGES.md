# Local PostgreSQL conversion

Active demo configuration now uses Docker PostgreSQL only.

- Backend host port changed to 5000.
- Frontend localhost:3000 is allowed by default.
- `npm run setup` generates local PostgreSQL credentials and `.env`.
- Added `env:check`, `local:up`, `local:status`, `local:logs`, `local:provision`, `local:down`.
- Removed active Neon compose/template/helper/launcher files from this delivery.
- Migrations 001-006, university modules, Scope 1/2, Excel normalization, multi-PDF intake, OCR, review/approval, operations and background exports are retained.
