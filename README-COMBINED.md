# CarbonSynq University Combined Backend

This package combines the two supplied backend archives into one delivery without mixing incompatible runtimes.

## Active university backend

Use `scale-api/` for the university sustainability demo/product backend. It contains the PostgreSQL university stack, Scope 1/2, university data collection, Excel/CSV normalization, multi-PDF invoice intake, OCR/review workflow, operations, and tests.

The root-level SQLite demo is also preserved because it was present in the supplied university package, but it is not the main scale backend.

## Preserved earlier backend

`legacy-carbonsynq-backend/` contains the complete contents of the supplied `carbonsync-backend-main (19).zip`. It is preserved as a separate source/reference backend so its routes, data files, report engine, Drizzle schema, Climatiq/provider experiments, scripts, and historical code are not lost or accidentally overlaid onto the newer university API.

Do not copy legacy files over `scale-api/` blindly: the two projects have different contracts and persistence models.

## Private configuration

No private `.env` file or credentials are added by this merge. Configure the active backend using the environment/setup documentation under `scale-api/` before startup.

## Source archives merged

- `carbonsync-backend-main (19).zip`: 286 files
- `demo-backend-main (2)(1).zip`: 356 files

The active university package is preserved byte-for-byte from the second archive, and the entire first archive is included under `legacy-carbonsynq-backend/`.
