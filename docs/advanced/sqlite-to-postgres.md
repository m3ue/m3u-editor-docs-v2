---
sidebar_position: 15
description: Move an existing install from SQLite to PostgreSQL, keeping all your playlists, channels, EPGs, users, and settings.
tags:
  - Advanced
  - PostgreSQL
  - Migration
  - Database
title: SQLite to PostgreSQL
---

import { Steps, Step } from '@site/src/components/Steps';

# SQLite to PostgreSQL

M3U Editor uses SQLite unless told otherwise, which suits small setups. PostgreSQL handles large playlists and many users better, and the shipped compose files use it. If you started on SQLite, you can move everything over: playlists, channels, EPGs, users, and settings.

:::warning Back up first
The migration is fairly new. It makes its own backup of your SQLite database, but take a [backup](admin-tools#backups) as well, and keep a copy of your `./data` folder.
:::

<Steps>
<Step title="Add the PostgreSQL settings and the migration switch">

Add these to the `m3u-editor` service's `environment:`. This uses the embedded PostgreSQL; for your own server, set `ENABLE_POSTGRES=false` and point the `DB_*` values at it.

```yaml
- SQLITE_MIGRATE=true

- ENABLE_POSTGRES=true
- PG_DATABASE=m3ue
- PG_USER=m3ue
- PG_PASSWORD=your-secure-password

- DB_CONNECTION=pgsql
- DB_HOST=localhost
- DB_PORT=5432
- DB_DATABASE=m3ue
- DB_USERNAME=m3ue
- DB_PASSWORD=your-secure-password
```

For the embedded PostgreSQL, also add a volume for its data: `pgdata:/var/lib/postgresql/data`.

</Step>
<Step title="Recreate the container">

```bash
docker compose up -d
docker compose logs -f m3u-editor
```

The log shows the migration as it runs, table by table, ending with how many rows it imported.

</Step>
<Step title="Check your data">

Sign in and check your playlists, channels, EPGs, and users are there. The full log is saved to `./data/logs/sqlite_migration.log`.

You can leave `SQLITE_MIGRATE=true` set: once the migration succeeds, it writes `./data/database/sqlite_migrated.flag` and never runs again.

</Step>
</Steps>

The migration runs only when `SQLITE_MIGRATE=true`, `DB_CONNECTION=pgsql`, and `./data/database/database.sqlite` exists and isn't empty. Your SQLite database is copied to `./data/database/backups/` first. To go back, copy it to `./data/database/database.sqlite` and set `DB_CONNECTION=sqlite` again.

## Troubleshooting

| Problem | What to do |
|---|---|
| The migration didn't run | Check the three conditions above. If `sqlite_migrated.flag` exists, it already ran. |
| It stopped partway | The flag isn't written until it succeeds, so it runs again on the next start. To run it by hand: `docker exec -it m3u-editor bash /var/www/html/docker/8.4/migrate-sqlite-to-postgres.sh`, then `docker exec -it m3u-editor php artisan migrate --force`. |
| A playlist shows a spinner that never stops | A sync was interrupted. Clear it with `docker exec -it m3u-editor php artisan app:reset-sync-process`. |

:::danger Running it again
Deleting `sqlite_migrated.flag` makes the migration run again on the next start. It **deletes everything in PostgreSQL** and imports from SQLite, so anything changed since the first migration is lost.
:::
