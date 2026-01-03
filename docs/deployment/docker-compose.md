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
| **⭐ Recommended** | `docker-compose.proxy.yml` | Modular setup with separate containers for m3u-editor, m3u-proxy, and Redis |
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
curl -O https://raw.githubusercontent.com/sparkison/m3u-editor/main/docker-compose.proxy.yml

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
curl -O https://raw.githubusercontent.com/sparkison/m3u-editor/main/docker-compose.aio.yml

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
curl -O https://raw.githubusercontent.com/sparkison/m3u-editor/main/docker-compose.proxy-vpn.yml

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

- [M3U Proxy Integration](/docs/Deployment/m3u-proxy-integration) - Detailed proxy setup
- [Caddy vs Nginx](/docs/Deployment/caddy-vs-nginx) - Choose your reverse proxy
- [Configuration Guide](/docs/configuration) - Configure environment variables
