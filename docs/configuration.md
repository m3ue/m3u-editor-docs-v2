---
sidebar_position: 3
description: The environment variables M3U Editor needs before it starts - its address, database, Redis, the proxy connection, and the web server.
tags:
  - Getting Started
  - Configuration
title: Editor Configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LinkCards from '@site/src/components/LinkCards';

# Editor Configuration

Most of M3U Editor is configured in the app, under **Settings**: syncing, the proxy's behavior, EPG, integrations, alerts, and more (see the [Settings Reference](/docs/advanced/settings-reference)).

A few things have to be known before the app starts, so they're set as environment variables, either in your compose file's `environment:` section or in the `.env` file next to it:

- **Application:** the address the editor is served on
- **Database:** which database the editor uses
- **Redis:** the Redis instance it connects to
- **M3U Proxy:** how it reaches the proxy
- **Web server:** the server in front of it

This page covers each of these. Every variable is listed in the [Environment Variables reference](/docs/advanced/environment-variables).

After changing any of them, run `docker compose up -d` to recreate the container with the new values.

## Application

| Variable | Default | What it does |
|---|---|---|
| `APP_URL` | `http://localhost` | The scheme and host clients use to reach the editor, **without the port**: your LAN IP (`http://192.168.1.50`) or your domain (`https://m3u.example.com`). It's used to build every playlist, guide, and stream URL. |
| `APP_PORT` | `36400` | The port the editor listens on. For an `http://` `APP_URL`, it's added to generated URLs. For `https://`, the editor assumes a reverse proxy on port 443 and leaves the port off. |
| `TZ` | `UTC` | The timezone the app runs in, used for sync schedules and every date and time it shows. **Application Timezone** in **Settings → General** overrides it. |
| `XTREAM_ONLY_ENABLED` | `false` | Also serve the Xtream API alone on a second port, `XTREAM_PORT` (default `36401`), for example to expose only that port to the internet. |

:::tip Links point at localhost?
If playlist or stream URLs in the app show `localhost`, `APP_URL` is still the default. Set it to the address your players use, then recreate the container.
:::

## Database

<Tabs groupId="database" queryString>
<TabItem value="sqlite" label="SQLite">

The default when nothing else is set. The database is a file in `/var/www/config`, so there's nothing to configure. It suits small setups; for large playlists or many users, use PostgreSQL. You can move an existing install over later with the [SQLite to PostgreSQL migration](/docs/advanced/sqlite-to-postgres).

</TabItem>
<TabItem value="embedded" label="Embedded PostgreSQL" default>

PostgreSQL running inside the editor container, which is what the shipped compose files use. Mount `/var/lib/postgresql/data` to a volume so the database survives updates.

```bash
ENABLE_POSTGRES=true
PG_DATABASE=m3ue
PG_USER=m3ue
PG_PASSWORD=your-secure-password

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=m3ue
DB_USERNAME=m3ue
DB_PASSWORD=your-secure-password
```

The `PG_*` values create the embedded database, and the `DB_*` values connect the app to it, so they should match.

</TabItem>
<TabItem value="external" label="Your own PostgreSQL">

Connect to a PostgreSQL server you already run. Create the database and user first.

```bash
ENABLE_POSTGRES=false

DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=m3ue
DB_USERNAME=m3ue
DB_PASSWORD=your-secure-password
```

</TabItem>
</Tabs>

## Redis

The editor uses Redis for its queues and cache, and the proxy uses it to share streams between viewers.

<Tabs groupId="redis" queryString>
<TabItem value="embedded" label="Embedded" default>

Redis runs inside the editor container, on port `36790`. This is the default, and what the all-in-one setup uses.

```bash
REDIS_ENABLED=true
REDIS_PASSWORD=your-secure-password   # optional
```

If `REDIS_PASSWORD` isn't set, the editor uses `M3U_PROXY_TOKEN` as the password, or generates one if that isn't set either.

</TabItem>
<TabItem value="container" label="Separate container">

Redis in its own container, as in the modular setup. Turn the embedded one off and point the editor at it. The proxy connects to the same Redis, so give it the same host and password.

```bash
REDIS_ENABLED=false
REDIS_HOST=redis
REDIS_SERVER_PORT=6379
REDIS_PASSWORD=your-secure-password   # must match the Redis --requirepass
```

</TabItem>
</Tabs>

<details>
<summary>Troubleshooting Redis connections</summary>

| Error | Cause | Fix |
|---|---|---|
| `NOAUTH Authentication required` | Redis has a password but the editor wasn't given one | Set `REDIS_PASSWORD` to the Redis password |
| `ERR invalid password` | The passwords don't match | Use the same value for `REDIS_PASSWORD` and the Redis `--requirepass` |

To test the connection to a Redis container, run `docker exec -it m3u-redis redis-cli -a your-password ping`. It should answer `PONG`.

</details>

## M3U Proxy

[M3U Proxy](/docs/proxy/overview) streams channels to your players, shares provider connections, and transcodes. The editor and proxy authenticate each other with a shared token, so generate one with `openssl rand -hex 32`.

<Tabs groupId="proxy" queryString>
<TabItem value="container" label="Separate container" default>

The recommended setup, and the only one that supports hardware acceleration. Turn off the embedded proxy and point the editor at the proxy container.

```bash
M3U_PROXY_ENABLED=false
M3U_PROXY_HOST=m3u-proxy
M3U_PROXY_PORT=38085
M3U_PROXY_TOKEN=your-secure-token   # must match API_TOKEN on the proxy
```

</TabItem>
<TabItem value="embedded" label="Embedded">

The proxy runs inside the editor container. This is the default when `M3U_PROXY_ENABLED` isn't set. If `M3U_PROXY_TOKEN` is empty, a random one is generated at startup.

```bash
M3U_PROXY_ENABLED=true
```

</TabItem>
</Tabs>

See [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration) for how the two connect and how to check it's working.

## Web server

<Tabs groupId="webserver" queryString>
<TabItem value="embedded" label="Embedded Nginx" default>

The container serves the app with its own Nginx. Nothing to set. Put a reverse proxy such as Caddy, Nginx Proxy Manager, or Traefik in front of it if you want HTTPS.

</TabItem>
<TabItem value="own" label="Your own web server">

Turn off the embedded Nginx and serve the app's PHP-FPM from your own Nginx or Caddy container, as in the fully external compose files.

```bash
NGINX_ENABLED=false
FPMPORT=9000
```

</TabItem>
</Tabs>

[Reverse Proxy and HTTPS](/docs/deployment/caddy-vs-nginx) covers both, including how to serve the app at your own domain.

## Storage paths

Where the editor writes large files can be changed too, which is useful for putting them on a separate disk:

- HLS segments for live streaming: [`HLS_TEMP_DIR`](/docs/advanced/environment-variables#m3u-proxy). Mounting the host's `/dev/shm` keeps them in memory.
- [DVR](/docs/integrations/dvr_integration) recordings: [`DVR_STORAGE_PATH`](/docs/advanced/environment-variables#storage)
- [Cached content downloads](/docs/advanced/cached-content): [`CACHE_STORAGE_PATH`](/docs/advanced/environment-variables#storage)

## Next steps

<LinkCards
  items={[
    { to: '/docs/advanced/environment-variables', icon: 'terminal', title: 'Environment variables', text: 'Every variable the editor reads, with defaults.' },
    { to: '/docs/advanced/settings-reference', icon: 'tune', title: 'Settings reference', text: 'Everything you can configure in the app, page by page.' },
    { to: '/docs/installation', icon: 'folder_zip', title: 'Compose examples', text: 'The shipped compose files, image tags, and data volumes.' },
    { to: '/docs/client_configuration', icon: 'devices', title: 'Connect your players', text: 'Point TiviMate, Kodi, Plex, Emby, and others at the editor.' },
  ]}
/>
