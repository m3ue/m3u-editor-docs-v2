---
sidebar_position: 16
description: Opt an embedded PostgreSQL install into version 18, with an automatic rollback copy if anything goes wrong.
tags:
  - Advanced
  - PostgreSQL
  - Migration
  - Database
title: Upgrading Embedded PostgreSQL
---

# Upgrading Embedded PostgreSQL

*(v0.13.7+)* The embedded PostgreSQL defaults to version 17. Setting `POSTGRES_VERSION=18` and restarting upgrades your existing data in place - this never happens automatically.

:::info Only for the embedded database
This only applies when `ENABLE_POSTGRES=true`. An external PostgreSQL server is upgraded on its own schedule, independently of the editor; point `PG_CLIENT_VERSION` at its major if backup/restore needs a newer client. See [Environment Variables](environment-variables#database).
:::

## What happens

Add to the `m3u-editor` service's `environment:`:

```yaml
- POSTGRES_VERSION=18
```

Then `docker compose up -d` to restart. On the next boot:

1. The container checks there's enough free disk space - roughly the size of your current database, plus a buffer.
2. It upgrades the data directory to PostgreSQL 18 using `pg_upgrade`, which copies rather than moves the data.
3. The PostgreSQL 17 cluster this produces is **kept**, not deleted - it's still a complete, working copy of your database as it was right before the upgrade.
4. If anything fails along the way (not enough disk space, a crash, a power loss), the 17 cluster was never touched and the container starts on it normally, same as before you set `POSTGRES_VERSION` at all.

You can see the result - upgraded, or what went wrong - on **Tools → System Health**, under the Database section.

## Rolling back

Because the 17 cluster is kept, you can go back if you need to. Set:

```yaml
- POSTGRES_VERSION=17
- POSTGRES_ROLLBACK=true
```

and restart. `POSTGRES_ROLLBACK` is required on purpose: there is no reverse upgrade, so rolling back is a real downgrade. Anything written to the database after the 18 upgrade is **not** carried back - it only exists in the now-abandoned 18 cluster, which is itself kept (not deleted) alongside the restored 17 one.

Without `POSTGRES_ROLLBACK=true`, lowering `POSTGRES_VERSION` alone does nothing - the container keeps running on 18 and System Health shows a warning explaining why.

## Reclaiming disk space

Once you're confident on the new version, delete the retained copy from **Tools → System Health**: the Database section shows its size, and a **Delete PostgreSQL rollback copy** button removes it. This is the only step that isn't reversible - after it, rolling back is no longer possible.
