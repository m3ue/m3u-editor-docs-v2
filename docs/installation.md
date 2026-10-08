---
sidebar_position: 2
description: Every Docker Compose setup M3U Editor ships, side by side, plus image tags, data volumes, and health checks.
tags:
  - Getting Started
  - Installation
  - Docker
title: Compose Examples
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LinkCards from '@site/src/components/LinkCards';

# Compose Examples

M3U Editor ships a Docker Compose file for each common setup. Start with the recommended **Modular** setup unless you have a reason not to; the [Quick Start](/docs/quick_start) walks through it step by step.

:::tip Build your own
The [Compose Wizard](/compose-wizard) walks through your database, proxy, Redis, VPN, web server, and storage choices, and generates a compose file and `.env` for your setup.
:::

## Choose a setup

| Setup | Containers | Hardware acceleration | Best for |
|---|---|:-:|---|
| **Modular** (recommended) | Editor, proxy, Redis | Yes | Most installs |
| **All-in-one** | One container | No | Trying it out, or light use |
| **Modular + VPN** | Editor, proxy, Redis, Gluetun | Yes | Sending provider traffic through a VPN |
| **Fully external** | Editor, proxy, Redis, PostgreSQL, Nginx or Caddy | Yes | Running every service in its own container |

Every file reads its secrets from a `.env` file next to it and falls back to `changeme`, so always set your own. Generate tokens and passwords with `openssl rand -hex 32`.

<Tabs groupId="compose-setup" queryString>
<TabItem value="modular" label="Modular" default>

Separate containers for the editor, [M3U Proxy](/docs/proxy/overview), and Redis. PostgreSQL runs inside the editor container. The proxy runs in its own container, which is what makes [hardware acceleration](/docs/proxy/hardware-acceleration) possible.

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml
```

Set in `.env`: `APP_URL`, `M3U_PROXY_TOKEN`, `PG_PASSWORD`, `REDIS_PASSWORD`. [More about this setup](/docs/deployment/docker-compose#modular)

</TabItem>
<TabItem value="aio" label="All-in-one">

Everything in a single container: the editor, an embedded proxy, PostgreSQL, and Redis. The simplest to run, but hardware acceleration isn't supported.

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.aio.yml
```

Set in `.env`: `APP_URL`, `M3U_PROXY_TOKEN`, `PG_PASSWORD`. [More about this setup](/docs/deployment/docker-compose#all-in-one)

</TabItem>
<TabItem value="vpn" label="Modular + VPN">

The modular setup plus a [Gluetun](https://github.com/qdm12/gluetun) container, so traffic to your provider goes out through your VPN.

```bash
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy-vpn.yml
```

Set in `.env`: the modular variables, plus `VPN_SERVICE_PROVIDER` and `WIREGUARD_PRIVATE_KEY`. Other Gluetun options, like `SERVER_COUNTRIES`, are commented out in the file. [More about this setup](/docs/deployment/docker-compose#modular--vpn)

</TabItem>
<TabItem value="external" label="Fully external">

Every service in its own container, with the editor's embedded services turned off: PostgreSQL, Redis, the proxy, and a reverse proxy in front. Choose Nginx or Caddy as the web server.

```bash
# Nginx
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.external-all.yml
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/nginx.conf

# Caddy
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.external-all-caddy.yml
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/Caddyfile
```

Set in `.env`: `APP_URL`, `APP_PORT`, `M3U_PROXY_TOKEN`, `PG_PASSWORD`, `REDIS_PASSWORD`. [More about this setup](/docs/deployment/docker-compose#fully-external)

</TabItem>
</Tabs>

Then start it with `docker compose up -d`. To use your own PostgreSQL or Redis instead of the bundled ones, see [Editor Configuration](/docs/configuration#database).

## Image tags

M3U Editor and M3U Proxy are published to Docker Hub as `sparkison/m3u-editor` and `sparkison/m3u-proxy`. The compose files use the `IMAGE_TAG` variable (default `latest`) for both, so you can switch channels from `.env`.

| Tag | What you get |
|---|---|
| `latest` | Stable releases. Recommended. |
| `dev` | The development branch: fixes land here first and are usually stable. |
| `experimental` | Features still being built. Expect rough edges. |

Each editor release is also tagged with its version (for example `sparkison/m3u-editor:0.13.3`, and `dev-` or `experimental-` versions for the other channels). To pin a version, set it on the `image:` line rather than through `IMAGE_TAG`, since the editor and proxy are versioned separately.

## Keeping your data

Map these container paths to volumes so nothing is lost when a container is recreated or updated:

| Container path | Holds | In the shipped files |
|---|---|---|
| `/var/www/config` | Configuration, logs, and the SQLite database if you use one | `./data` |
| `/var/lib/postgresql/data` | The embedded PostgreSQL database | `pgdata` |
| `/var/www/html/storage/app/public` | Logos and images you upload | `./storage` |

If you use the [DVR](/docs/integrations/dvr_integration#set-it-up) or [Cached Content Downloads](/docs/advanced/cached-content#enabling-the-cache), mount a volume for those files too. Their locations are set by [`DVR_STORAGE_PATH`](/docs/advanced/environment-variables#storage) and [`CACHE_STORAGE_PATH`](/docs/advanced/environment-variables#storage).

## Health checks

The editor reports its health at `/up`. The shipped files already use it, so other services can wait for the editor to be ready:

```yaml
services:
  m3u-editor:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:${APP_PORT:-36400}/up"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  my-service:
    depends_on:
      m3u-editor:
        condition: service_healthy
```

## Next steps

<LinkCards
  items={[
    { to: '/docs/configuration', icon: 'tune', title: 'Editor configuration', text: 'The environment variables for URLs, database, Redis, and the proxy.' },
    { to: '/docs/deployment/m3u-proxy-integration', icon: 'router', title: 'M3U Proxy setup', text: 'How the editor and proxy talk to each other, and how to tune it.' },
    { to: '/docs/deployment/caddy-vs-nginx', icon: 'dns', title: 'Reverse proxy and HTTPS', text: 'Serve M3U Editor at your own domain, with HTTPS.' },
    { to: '/docs/resources/playlists', icon: 'playlist_play', title: 'Add a playlist', text: 'Import your first source once the editor is running.' },
  ]}
/>
