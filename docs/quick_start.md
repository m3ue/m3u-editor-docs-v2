---
sidebar_position: 1
description: Get M3U Editor running with Docker in a few minutes, using the recommended editor, proxy, and Redis setup.
tags:
  - Getting Started
title: Quick Start
---

import { Steps, Step } from '@site/src/components/Steps';
import LinkCards from '@site/src/components/LinkCards';

# Quick Start

This gets M3U Editor running with the recommended setup: the editor, [M3U Proxy](/docs/proxy/overview) for streaming, and Redis, each in its own container. It takes a few minutes.

You need a machine with [Docker](https://docs.docker.com/get-docker/) and Docker Compose, and at least one source: an Xtream login, or an M3U URL or file. Guide data is optional.

## Install

<Steps>
<Step title="Get the compose file">

Make a folder for M3U Editor and download the recommended compose file into it:

```bash
mkdir m3u-editor && cd m3u-editor
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml
```

Want a different setup, like a single container, a VPN, or your own database? Build a file with the [Compose Wizard](/compose-wizard), or pick one from [Compose Examples](/docs/installation).

</Step>
<Step title="Set your secrets">

The compose file falls back to `changeme` for every password, so create a `.env` file next to it with your own:

```bash
cat > .env <<EOF
APP_URL=http://192.168.1.50
M3U_PROXY_TOKEN=$(openssl rand -hex 32)
PG_PASSWORD=$(openssl rand -hex 24)
REDIS_PASSWORD=$(openssl rand -hex 24)
EOF
```

Set `APP_URL` to the address you'll open the editor at, without the port: your server's LAN IP, or your domain if it sits behind a reverse proxy. See [Editor Configuration](/docs/configuration#application) for details.

</Step>
<Step title="Start it">

```bash
docker compose up -d
```

The first start takes a minute or two while the database is set up. `docker compose ps` shows the containers as `healthy` once they're ready, and `docker compose logs -f m3u-editor` shows what's happening.

</Step>
<Step title="Sign in">

Open `http://<your-server>:36400` and sign in with the username **admin** and password **admin**. You'll be asked to choose a new password straight away.

</Step>
<Step title="Add a playlist and connect a player">

Add your provider under **Playlists**, optionally attach guide data, then point your player at M3U Editor. The guides below walk through each part.

</Step>
</Steps>

## What's running

| Container | What it does | Reachable at |
|---|---|---|
| `m3u-editor` | The web app, API, and playlist outputs. Runs its own PostgreSQL database inside the container. | Port `36400` on your server |
| `m3u-proxy` | Streams channels to your players, shares provider connections, and transcodes. | Inside the Docker network only |
| `m3u-redis` | Stream pooling and caching for the proxy and the editor. | Inside the Docker network only |

Your data lives in four places. Keep them when you update, and back up the first two:

| Volume | Holds |
|---|---|
| `./data` | Configuration and logs |
| `pgdata` | The database |
| `./storage` | Logos and images you upload |
| `redis-data` | Redis data (safe to lose) |

## Updating

Pull the new images and recreate the containers. Your data volumes are kept.

```bash
docker compose pull
docker compose up -d
```

To follow the `dev` or `experimental` builds instead of stable releases, add `IMAGE_TAG=dev` (or `experimental`) to your `.env`. See [Image tags](/docs/installation#image-tags) for what each one means.

## Next steps

<LinkCards
  items={[
    { to: '/docs/resources/playlists', icon: 'playlist_play', title: 'Add a playlist', text: 'Import an Xtream login, M3U URL, or file, then organize its channels.' },
    { to: '/docs/resources/epg-setup', icon: 'tv_guide', title: 'Set up the guide', text: 'Attach XMLTV or Schedules Direct and map it to your channels.' },
    { to: '/docs/client_configuration', icon: 'devices', title: 'Connect your players', text: 'Set up TiviMate, Kodi, Plex, Emby, Jellyfin, M3U TV, and more.' },
    { to: '/docs/configuration', icon: 'tune', title: 'Editor configuration', text: 'The environment variables for URLs, database, Redis, and the proxy.' },
  ]}
/>
