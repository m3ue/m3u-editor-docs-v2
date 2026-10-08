---
sidebar_position: 1
description: What runs in each shipped Docker Compose setup, what to change, and the commands for running M3U Editor day to day.
tags:
  - Deployment
  - Docker
  - Docker Compose
title: Docker Compose Setups
---

# Docker Compose Setups

This page goes one level deeper than [Compose Examples](/docs/installation): what runs in each shipped compose file, the parts you might change, and the commands for running it day to day. If you haven't picked a setup yet, start there.

## Everyday commands

Run these from the folder that holds your `docker-compose.yml`:

| To | Run |
|---|---|
| Start, or apply changes to the compose file or `.env` | `docker compose up -d` |
| Update to the newest images | `docker compose pull` then `docker compose up -d` |
| Check that every container is `healthy` | `docker compose ps` |
| Follow the editor's logs | `docker compose logs -f m3u-editor` |
| Restart everything | `docker compose restart` |
| Stop and remove the containers (your data is kept) | `docker compose down` |

Your data lives in volumes, so recreating or updating the containers never touches it. [Keeping your data](/docs/installation#keeping-your-data) lists what each volume holds.

## Modular

`docker-compose.proxy.yml`, the recommended setup.

| Container | Runs | Reachable from |
|---|---|---|
| `m3u-editor` | The web app, playlist outputs, and an embedded PostgreSQL database | Port `36400` on your server |
| `m3u-proxy` | [M3U Proxy](/docs/proxy/overview), which streams to your players | The Docker network only |
| `m3u-redis` | Redis, shared by the editor and proxy | The Docker network only |

Players never connect to the proxy directly. Stream URLs point at the editor (`http://your-server:36400/m3u-proxy/...`), and the editor's web server passes them on. See [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration) for how the two connect.

Redis runs as a cache only: nothing is written to disk, and it's capped at 256 MB. The proxy uses Redis database `6` so it doesn't collide with the editor.

Optional parts of the file are already there, commented out:

- **Hardware acceleration:** uncomment `devices: - /dev/dri:/dev/dri` under `m3u-proxy`. See [Hardware Acceleration](/docs/proxy/hardware-acceleration), including NVIDIA.
- **Resource limits:** uncomment a `deploy.resources` block to cap a container's CPU and memory.
- **Database access from the host:** uncomment the PostgreSQL port under `m3u-editor` to reach the database with your own tools.

## All-in-one

`docker-compose.aio.yml` runs everything in the one `m3u-editor` container: the web app, PostgreSQL, Redis, and an embedded proxy. Only port `36400` is published.

It's the quickest way to try M3U Editor, with two trade-offs:

- Hardware acceleration isn't supported.
- The editor and proxy are updated and restarted together.

You can move to the modular setup later without losing anything. See [Move to a separate proxy container](/docs/deployment/m3u-proxy-integration#move-to-a-separate-proxy-container).

## Modular + VPN

`docker-compose.proxy-vpn.yml` is the modular setup plus [Gluetun](https://github.com/qdm12/gluetun). The editor, proxy, and Redis all join Gluetun's network, so everything they fetch (playlists, guide data, and streams) goes out through your VPN. Port `36400` is published on the `gluetun` container instead of the editor.

Set your VPN details in `.env`. The file is set up for WireGuard:

```bash
VPN_SERVICE_PROVIDER=mullvad
WIREGUARD_PRIVATE_KEY=your-private-key
```

Other Gluetun options, such as `WIREGUARD_ADDRESSES` and `SERVER_COUNTRIES`, are listed commented out under the `gluetun` service. Uncomment the ones your provider needs. For OpenVPN or provider-specific settings, see the [Gluetun wiki](https://github.com/qdm12/gluetun-wiki).

:::tip Reaching services on your network
Gluetun blocks traffic to your local network by default. If M3U Editor needs to reach something on your LAN, like a Plex, Emby, or Jellyfin server, uncomment `FIREWALL_OUTBOUND_SUBNETS` and set it to your LAN's range, for example `192.168.1.0/24`.
:::

<details>
<summary>Media server movies and episodes won't play, but syncing works</summary>

If your media server runs on the same machine as the VPN containers, requests from M3U Editor reach it through Docker's internal bridge rather than your LAN. The media server then sees a Docker address (like `172.19.0.2`) and may treat the stream as remote. Library sync, artwork, and live TV still work, but movies and episodes fail or stall.

Plex is the most common case: it applies its remote bandwidth limit, and its log shows `Bandwidth exceeded` followed by `Cannot make a decision`.

To fix it, add the Docker subnet to the media server's list of local networks:

- **Plex:** **Settings → Network → LAN Networks**, for example `172.19.0.0/16`
- **Emby or Jellyfin:** the local network addresses setting under **Networking**

Find the subnet with `docker network inspect <network-name>` on the host.

</details>

## Fully external

`docker-compose.external-all.yml` (Nginx) and `docker-compose.external-all-caddy.yml` (Caddy) run every service in its own container: PostgreSQL, Redis, the proxy, the editor (PHP only), and a web server in front.

Each needs its web server config file next to the compose file:

```bash
# Nginx
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.external-all.yml
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/nginx.conf

# Caddy
curl -o docker-compose.yml https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.external-all-caddy.yml
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/Caddyfile
```

In `.env`, set `APP_URL`, `APP_PORT`, `M3U_PROXY_TOKEN`, `PG_PASSWORD`, and `REDIS_PASSWORD`. Set `APP_PORT` even if you keep the default: the web server publishes `36400` when it's unset, but the editor builds its links with `8080`.

The bundled config files route `/m3u-proxy/` to the proxy and websockets to the editor, the same as the editor's own web server does. To add HTTPS to them, see [The bundled Nginx and Caddy](/docs/deployment/caddy-vs-nginx#the-bundled-nginx-and-caddy).

## Ports

Only the editor's port is published to your network. Everything else is reached over the Docker network.

| Service | Default port | Set with |
|---|---|---|
| M3U Editor | `36400` | `APP_PORT` |
| Xtream API only (optional) | `36401` | `XTREAM_PORT`, with `XTREAM_ONLY_ENABLED=true` |
| M3U Proxy | `38085` | `M3U_PROXY_PORT` |
| PostgreSQL | `5432` | `PG_PORT` |
| Redis (embedded) | `36790` | `REDIS_SERVER_PORT` |

The optional Xtream-only port serves just the Xtream API, so you can expose it to the internet without exposing the rest of the app. Add it to the editor's `ports:` list to publish it. See [Editor Configuration](/docs/configuration#application).
