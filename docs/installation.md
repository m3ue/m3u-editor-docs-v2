---
sidebar_position: 2
description: Get started with M3U Editor - Installation and quick setup guide
tags:
  - Getting Started
  - Installation
  - Docker
title: Compose Examples
---

# Docker Compose Installation

Get M3U Editor up and running in minutes with Docker!

## Prerequisites

Before you begin, ensure you have:

- [Docker](https://www.docker.com/) installed on your system
- Xtream codes API login info **or** M3U URLs/files containing an M3U playlist of video streams
- (Optional) EPG URLs/files containing valid XMLTV data

## Quick Start Options

M3U Editor offers several deployment options to fit your needs:

### ⭐ Recommended: Modular Deployment

**File**: `docker-compose.proxy.yml`

This setup runs separate containers for **m3u-editor**, **m3u-proxy** (external proxy required for hardware acceleration), and **Redis** — perfect for production use with granular control.

```bash
# Download the configuration
curl -O https://raw.githubusercontent.com/sparkison/m3u-editor/main/docker-compose.proxy.yml

# Start the services
docker-compose -f docker-compose.proxy.yml up -d
```

**What you get**:
- M3U Editor (main application)
- M3U Proxy (streaming with hardware acceleration support)
- Redis (stream pooling and caching)
- PostgreSQL (embedded in m3u-editor)

:::tip
PostgreSQL and NGINX can be easily added as separate containers if needed!
:::

### Simple: All-in-One Deployment

**File**: `docker-compose.aio.yml`

Everything runs in a single container for quick setup and testing.

```bash
# Download the configuration
curl -O https://raw.githubusercontent.com/sparkison/m3u-editor/main/docker-compose.aio.yml

# Start the service
docker-compose -f docker-compose.aio.yml up -d
```

:::warning
Hardware acceleration is **not supported** in the all-in-one setup.
:::

### Advanced: Modular with VPN

**File**: `docker-compose.proxy-vpn.yml`

Modular deployment with Gluetun VPN integration.

```bash
# Download the configuration
curl -O https://raw.githubusercontent.com/sparkison/m3u-editor/main/docker-compose.proxy-vpn.yml

# Configure your VPN settings in the file
# Then start the services
docker-compose -f docker-compose.proxy-vpn.yml up -d
```

## After Installation

Once your containers are running:

1. Open your browser and navigate to `http://localhost:36400` (or your configured port)
2. Complete the initial setup wizard
3. Add your first playlist
4. Start organizing your streams!

## Next Steps

- [Configuration Guide](/docs/getting-started/configuration) - Configure M3U Editor for your needs
- [Adding Playlists](/docs/getting-started/adding-playlists) - Import your first M3U playlist
- [EPG Setup](/docs/getting-started/epg-setup) - Add Electronic Program Guide data

## Need Help?

- 📖 Check our [FAQ](/docs/help/faq)
- 💬 Join our [Discord](https://discord.gg/rS3abJ5dz7)
- 🐛 [Report an issue](https://github.com/sparkison/m3u-editor/issues/new?template=bug_report.md)
