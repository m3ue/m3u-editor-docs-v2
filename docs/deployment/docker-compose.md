---
sidebar_position: 1
description: Docker Compose deployment options for M3U Editor
tags:
  - Deployment
  - Docker
  - Docker Compose
title: Docker Compose Deployments
---

# Docker Compose Deployments

M3U Editor offers multiple Docker Compose configurations to fit different use cases.

## Deployment Options Overview

| Use Case | File | Description |
|----------|------|-------------|
| **⭐⭐ Recommended** | `docker-compose.proxy.yml` | Modular setup with separate containers for m3u-editor, m3u-proxy, and Redis |
| **Simple** | `docker-compose.aio.yml` | All-in-one container for quick testing |
| **VPN** | `docker-compose.proxy-vpn.yml` | Modular deployment with Gluetun VPN |
| **Advanced** | `docker-compose.external-all.yml` | Fully modular with external Nginx |
| **Advanced** | `docker-compose.external-all-caddy.yml` | Fully modular with Caddy (auto HTTPS) |

## Modular Deployment (Recommended)

**File**: `docker-compose.proxy.yml`

This is the **recommended production setup** with separate containers for each service.

### Features

- ✅ Hardware acceleration support (via external m3u-proxy)
- ✅ Independent service scaling
- ✅ Redis-based stream pooling
- ✅ Easy to manage and troubleshoot

### Quick Start

```bash
# Download configuration
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml

# Generate secure tokens
echo "M3U_PROXY_TOKEN=$(openssl rand -hex 32)" >> .env
echo "PG_PASSWORD=$(openssl rand -base64 32)" >> .env
echo "APP_URL=http://localhost" >> .env

# Start services
docker-compose -f docker-compose.proxy.yml up -d
```

### Services Included

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| m3u-editor | m3u-editor | 36400 | Main application |
| m3u-proxy | m3u-proxy | 8085* | Streaming proxy |
| Redis | m3u-redis | 6379* | Caching and pooling |
| PostgreSQL | embedded | 5432* | Database |

*Internal ports only

### Management Commands

```bash
# View logs
docker-compose -f docker-compose.proxy.yml logs -f

# Restart services
docker-compose -f docker-compose.proxy.yml restart

# Stop services
docker-compose -f docker-compose.proxy.yml down

# Check status
docker-compose -f docker-compose.proxy.yml ps
```

## All-in-One Deployment

**File**: `docker-compose.aio.yml`

Simple single-container deployment for testing and development.

### Features

- ✅ Quick setup
- ✅ Minimal configuration
- ❌ No hardware acceleration support

### Quick Start

```bash
# Download configuration
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.aio.yml

# Start service
docker-compose -f docker-compose.aio.yml up -d
```

:::warning
This setup does **not** support hardware acceleration for transcoding.
:::

## VPN Deployment

**File**: `docker-compose.proxy-vpn.yml`

Route proxy traffic through a VPN using Gluetun.

### Features

- ✅ All modular deployment benefits
- ✅ VPN protection for streaming
- ✅ Support for multiple VPN providers

### Quick Start

```bash
# Download configuration
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy-vpn.yml

# Configure VPN settings in the file
# Edit the gluetun service section

# Start services
docker-compose -f docker-compose.proxy-vpn.yml up -d
```

### Supported VPN Providers

Gluetun supports many providers including:
- NordVPN
- ProtonVPN
- ExpressVPN
- Mullvad
- And many more...

See [Gluetun documentation](https://github.com/qdm12/gluetun) for configuration details.

### Troubleshooting: Media Server (Plex/Emby/Jellyfin) VOD playback fails, but sync works

If you're running a media server integration (Plex, Emby, or Jellyfin) on the **same host machine** as your VPN-routed M3U Editor container, you may see this pattern:

- Syncing the media server, and loading posters/backdrops, all work fine.
- Live channels play fine.
- VOD (movies/episodes) from that media server fail to play, hang, or error out - even though the connection test in M3U Editor succeeds.

This happens because the request from the Gluetun-networked container to your media server has to leave the container, hit your host's LAN IP, and loop back in to another service on the same host (a "hairpin" route through Docker's own bridge networking). Metadata and image requests are unaffected, but some media servers apply different network/bandwidth rules to the actual streaming endpoint based on what address the request appears to come from - and a hairpinned request often shows up as a Docker-internal bridge IP (e.g. `172.19.0.2`) rather than your real LAN IP.

**For Plex specifically**, this commonly surfaces as Plex applying its remote-stream bandwidth cap (default 8000 kbps) to a high-bitrate Direct Play file, since Plex doesn't recognize the Docker bridge address as part of your local network. Check Plex's own server log (**Settings → Troubleshooting → Logs**, or the `Plex Media Server.log` file) right after a failed playback attempt - a `Bandwidth exceeded` warning followed by `Cannot make a decision` confirms this.

**Fix**: add the Docker bridge subnet your VPN-routed container is using to your media server's local/trusted network list, so it stops treating that traffic as remote:

- **Plex**: Settings → Network → **LAN Networks**, add the bridge subnet (e.g. `172.19.0.0/16`). Find the exact subnet with `docker network inspect <network-name>` on the host.
- **Emby/Jellyfin**: check the equivalent "Local network addresses" / "Known proxies" setting under Networking settings.

## Fully External Deployment

**Files**: 
- `docker-compose.external-all.yml` (Nginx)
- `docker-compose.external-all-caddy.yml` (Caddy)

Maximum modularity with all services externalized.

### Features

- ✅ Complete service isolation
- ✅ Independent scaling
- ✅ External reverse proxy (Nginx or Caddy)
- ✅ Automatic HTTPS (Caddy only)

### Architecture

```
Nginx/Caddy (Reverse Proxy)
    ├── M3U Editor (PHP-FPM)
    ├── M3U Proxy (Streaming)
    ├── PostgreSQL (Database)
    └── Redis (Cache)
```

### When to Use

Choose fully external deployment when you need:
- Maximum control over each service
- Independent service updates
- Custom reverse proxy configuration
- Multi-instance deployment

See the deployment guides for detailed configuration options.

## Persisting User-Uploaded Assets

By default, all compose configurations mount `./data` for configuration persistence and a named volume for PostgreSQL. However, files uploaded through the **Assets** manager (logos, images, etc.) are stored in `storage/app/public` inside the container and are **not** covered by the `./data` mount.

Without a volume for this path, uploaded assets will be lost whenever the container is recreated (e.g., after a `docker-compose pull` and `up`).

All provided compose files already include this volume:

```yaml
volumes:
  - ./storage:/var/www/html/storage/app/public
```

This maps a local `./storage` directory next to your compose file to the container's public storage path. The directory will be created automatically by Docker on first run.

:::tip
If you are migrating an existing deployment, copy the contents of the container's `/var/www/html/storage/app/public` to your local `./storage` directory before adding the volume mount to avoid losing existing uploaded files.
:::

## Port Configuration

Default ports for each setup:

| Service | Default Port | Customizable |
|---------|-------------|--------------|
| M3U Editor | 36400 | ✅ `APP_PORT` |
| M3U Proxy | 38085 | ✅ `M3U_PROXY_PORT` |
| PostgreSQL | 5432 | ✅ `PG_PORT` |
| Redis | 6379 | ✅ `REDIS_PORT` |
| Nginx | 8080 | ✅ `NGINX_PORT` |
| Caddy | 8080 | ✅ `CADDY_PORT` |

Change ports by setting environment variables in your `.env` file.

## Next Steps

- [M3U Proxy Integration](/docs/deployment/m3u-proxy-integration) - Detailed proxy setup
- [Caddy vs Nginx](/docs/deployment/caddy-vs-nginx) - Choose your reverse proxy
- [Configuration Guide](/docs/configuration) - Configure environment variables
