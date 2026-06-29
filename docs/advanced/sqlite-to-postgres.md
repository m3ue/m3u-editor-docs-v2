---
sidebar_position: 10
description: Migrate your existing SQLite data to Postgres
tags:
  - Advanced
  - PostgreSQL
  - Migration
  - Database
title: SQLite to Postgres Migration
---

# SQLite to PostgreSQL Migration

M3U Editor ships with SQLite as the default database, which works well for most users. If you want the performance and concurrency benefits of PostgreSQL, you can migrate your existing data without losing any playlists, channels, EPGs, users, or settings.

:::warning Experimental Feature
This migration feature is available on all branches but is **still new and has limited real-world testing**. While it has been validated on several setups, edge cases may exist depending on how long you've been running SQLite and which features you've used.

**We strongly recommend creating a backup before migrating.** The migration script does this automatically, but an additional manual backup is never a bad idea.

If you run into issues, please report them on [Discord](https://discord.gg/rS3abJ5dz7) or [GitHub](https://github.com/sparkison/m3u-editor/issues) so we can improve the process.
:::

## How It Works

The migration is triggered by a single environment variable (`SQLITE_MIGRATE=true`) and runs automatically on the next container start. It is **safe to leave enabled** — a flag file is written after a successful migration so the process never runs twice.

The migration flow:

1. Checks for the flag file — skips entirely if already migrated
2. Pre-migrates the SQLite database to ensure all schema changes are recorded
3. Creates a timestamped backup of `database.sqlite`
4. Drops all existing PostgreSQL tables (preserving extensions like `pg_trgm`)
5. Recreates tables from SQLite's own schema (bare columns, no constraints)
6. Imports all data including the `migrations` table
7. Creates unique indexes from the SQLite schema
8. Resets all sequences so auto-increment IDs work correctly
9. Runs `php artisan migrate` to apply PostgreSQL-specific changes (e.g. `jsonb` column types)

## Prerequisites

- A running PostgreSQL instance accessible to your container (if using external instance)
- Your existing `database.sqlite` file (typically at `./data/database/database.sqlite`)
- PostgreSQL connection details (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)

## Setup

### 1. Update your `.docker-composer.yml` / Docker env file

Add the following alongside your existing PostgreSQL connection settings:

```yaml
environment:
  # Trigger the one-time SQLite migration
  - SQLITE_MIGRATE=true # <---- This will trigger the migration

  # Postgres Configuration
  - ENABLE_POSTGRES=true # Use embedded Postgres, disable to use your own Postgres service
  - PG_DATABASE=${PG_DATABASE:-m3ue}
  - PG_USER=${PG_USER:-m3ue}
  - PG_PASSWORD=${PG_PASSWORD:-changeme}
  - PG_PORT=${PG_PORT:-5432}

  # Database Connection (m3u-editor)
  - DB_CONNECTION=pgsql
  - DB_HOST=localhost
  - DB_PORT=${PG_PORT:-5432}
  - DB_DATABASE=${PG_DATABASE:-m3ue}
  - DB_USERNAME=${PG_USER:-m3ue}
  - DB_PASSWORD=${PG_PASSWORD:-changeme}
```

### 2. Restart your container

```bash
docker compose down && docker compose up -d
```

Watch the startup logs for migration output:

```bash
docker compose logs -f m3u-editor
```

You should see output like:

```
[db-init] SQLITE_MIGRATE=true — importing SQLite data into PostgreSQL...
[sqlite-migrate] Starting SQLite → PostgreSQL migration...
[sqlite-migrate] Pre-migrating SQLite database to record all pending migrations...
[sqlite-migrate] Building Postgres schema from SQLite PRAGMA...
[sqlite-migrate] Created 74 tables.
[sqlite-migrate] Importing table data...
[sqlite-migrate]   Imported channels: 12483 rows
...
[sqlite-migrate] Created 42 unique index(es) from SQLite schema.
[sqlite-migrate] Done. 66162 rows imported across 74 tables.
[db-init] Running post-import migrations...
[db-init] Post-import migrations complete.
```

### 3. Verify

Log in and confirm your playlists, channels, EPGs, and users are all present. The migration log is also written to `./data/logs/sqlite_migration.log` for review.

Once verified, you can remove `SQLITE_MIGRATE=true` from your env file (or leave it — it will not re-run).

## Backup Location

Before migrating, the script copies your SQLite database to:

```
./data/database/backups/database.sqlite.<timestamp>.bak
```

To restore from backup, copy the file back to `./data/database/database.sqlite` and switch `DB_CONNECTION` back to `sqlite`.

## Troubleshooting

### Migration did not run

Check that all three conditions are met:

- `SQLITE_MIGRATE=true`
- `DB_CONNECTION=pgsql`
- `./data/database/database.sqlite` exists and is not empty

Also check for the flag file at `./data/database/sqlite_migrated.flag`. If it exists, the migration was already completed. Delete it to force a re-run.

```bash
rm ./data/database/sqlite_migrated.flag
```

:::danger
Deleting the flag file and re-running will **drop all PostgreSQL tables** and re-import from SQLite. Any data written to PostgreSQL after the original migration will be lost.
:::

### Spinner stuck on Playlist screen after migration

A playlist sync may have been in progress or failed during migration, leaving a processing flag set. Run the following to clear it:

```bash
docker exec -it m3u-editor php artisan app:reset-sync-process
```

### Checking the migration log

The full migration log (per-table row counts, any warnings) is available at:

```bash
cat ./data/logs/sqlite_migration.log
```

Or inside the container:

```bash
docker exec -it m3u-editor cat /var/www/config/logs/sqlite_migration.log
```

### Re-running after a failure

If the migration failed partway through (e.g. the container restarted), the flag file will not have been written, so the next container start will re-run automatically. You can also trigger it manually:

```bash
docker exec -it m3u-editor bash /var/www/html/docker/8.4/migrate-sqlite-to-postgres.sh
```

Then run pending migrations:

```bash
docker exec -it m3u-editor php artisan migrate --force
```

### Checking PostgreSQL table counts after migration

To verify data was imported correctly, connect to your PostgreSQL instance and run:

```sql
SELECT schemaname, tablename, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

This shows live row counts per table. Compare against your SQLite data if needed:

```bash
docker exec -it m3u-editor sqlite3 /var/www/config/database/database.sqlite \
  "SELECT name FROM sqlite_master WHERE type='table';" | \
  xargs -I{} sh -c 'echo -n "{}: "; sqlite3 /var/www/config/database/database.sqlite "SELECT COUNT(*) FROM \"{}\";"'
```
