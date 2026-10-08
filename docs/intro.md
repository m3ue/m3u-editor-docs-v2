---
sidebar_position: 0
description: Documentation home for m3u-editor
tags:
  - Getting Started
title: Welcome
---

<div style={{ textAlign: 'center', padding: '0 0 2rem 0' }}>
  <img src="/img/logo.png" alt="M3U Editor logo" style={{ width: '220px', maxWidth: '10%' }} />
</div>

<div style={{ textAlign: 'center', padding: '1rem 0' }}>
  <img src="https://img.shields.io/docker/pulls/sparkison/m3u-editor?style=for-the-badge&logo=docker&label=Docker%20Downloads" alt="Docker Downloads" />
  {' '}
  <img src="https://img.shields.io/github/stars/m3ue/m3u-editor?style=for-the-badge&logo=github" alt="GitHub Stars" />
  {' '}
  <a href="https://discord.gg/rS3abJ5dz7" target="_blank" rel="noopener noreferrer">
    <img src="https://dcbadge.limes.pink/api/server/rS3abJ5dz7" alt="Discord" />
  </a>
</div>

# Welcome to M3U Editor

**M3U Editor** is a full-featured, open-source IPTV playlist manager with advanced features similar to **xteve** or **threadfin**.

This documentation provides comprehensive guides, examples, and reference material to help you get the most out of M3U Editor.

## What is M3U Editor?

M3U Editor is a self-hosted web application for managing M3U playlists and IPTV streams. Created by **[sparkison](https://github.com/sparkison)**, it offers a modern, responsive interface for importing, editing, and serving your media streams.

**Key capabilities:**
- Full M3U/M3U8/M3U+ and Xtream Codes API support
- Complete EPG (Electronic Program Guide) management
- Xtream API output for client compatibility
- Series management with .strm file support
- Post-processing with webhooks and custom scripts
- Built-in stream player with EPG integration

## 🎯 Key Features

### Stream Management
- **Multiple Import Methods** — M3U files, URLs, and Xtream Codes API
- **Channel Organization** — Categorize, number, and customize channels
- **Auto-Merge Channels** — Automatically deduplicate and create failovers
- **Failover Streams** — Automatic failover for reliability
- **Bulk Operations** — Manage hundreds of channels efficiently

### EPG Integration
- **XMLTV Support** — Local files and remote URLs
- **Schedules Direct** — Full SD integration
- **EPG Caching** — Optimized performance for large EPG files
- **Smart Mapping** — Automatic and manual EPG channel mapping
- **EPG Preview** — Built-in TV guide with playback

### Streaming & Output
- **M3U Proxy** — Restream with hardware acceleration
- **Xtream API** — Full Xtream-compatible API output
- **HDHR Support** — Connect with Plex, Emby, Jellyfin
- **HLS Support** — HTTP Live Streaming output
- **Custom Outputs** — Multiple playlist configurations

### Advanced Features
- **Series Management** — VOD organization with .strm files
- **Post Processing** — Webhooks, scripts, and email notifications
- **Redis Caching** — Stream pooling and performance
- **Queue System** — Background job processing
- **API Access** — RESTful API for automation

For what changed in each version, see the [release notes on GitHub](https://github.com/m3ue/m3u-editor/releases).

## 📋 Prerequisites

To run M3U Editor, you need:

- **Docker** installed on your system
- **M3U sources**: Xtream credentials or M3U URLs/files
- **(Optional)** EPG data: XMLTV URLs/files or Schedules Direct account

## 🚀 Quick Start

Get up and running in minutes:

```bash
# Download recommended configuration
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml

# Start services
docker-compose -f docker-compose.proxy.yml up -d

# Access at http://localhost:36400
```

See [Installation](/docs/installation) for detailed setup instructions.

## 📖 Documentation Sections

### 🎓 Getting Started
New to M3U Editor? Start here:
- [Installation](/docs/installation)
- [Configuration](/docs/configuration)
- [Adding Playlists](/docs/resources/playlists)
- [EPG Setup](/docs/resources/epg-setup)

### 🚀 Deployment
Production deployment guides:
- [Docker Compose](/docs/deployment/docker-compose)
- [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration)
- [Caddy vs Nginx](/docs/deployment/caddy-vs-nginx)

### 🔌 Integrations
Connect M3U Editor to your media ecosystem:
- [Emby Integration](/docs/integrations/emby_integration)
- [Plex Integration](/docs/integrations/plex_integration)
- [WebDAV / TorBox](/docs/integrations/webdav_integration)
- [DVR (v0.12.45+)](/docs/integrations/dvr_integration)
- [Sonarr & Radarr (v0.12.45+)](/docs/integrations/arrs_integration)
- [AIOStreams (v0.12.45+)](/docs/integrations/aiostreams_integration)
- [TMDB Integration](/docs/integrations/tmdb_integration)

### ⚡ Advanced Topics
Deep dives into advanced features:
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels)
- [EPG Cache Overview](/docs/advanced/epg-optimization)

### 💬 Community & Support
Get help and contribute:
- [Discord Server](https://discord.gg/rS3abJ5dz7)
- [Report Issues](https://github.com/m3ue/m3u-editor/issues)
- [GitHub Repository](https://github.com/m3ue/m3u-editor)

## 📸 Screenshots

![Dashboard](/img/screenshots/01_dashboard.png)
*Dashboard with sync activity, EPG coverage, and library stats*

![Series detail](/img/screenshots/02_series-detail.png)
*Rich metadata display with TMDB artwork, cast, and seasons*

![Series editor](/img/screenshots/03_series-editor.png)
*Series and episode editing*

![Playlist output options](/img/screenshots/04_playlist-output-options.png)
*Per-playlist output types (HDHR, M3U, Xtream API, XMLTV) and streaming options*

![Proxy monitoring](/img/screenshots/08_proxy-monitor.png)
*Real-time proxy statistics and monitoring*

## ⚖️ License

M3U Editor is licensed under **CC BY-NC-SA 4.0**:

- **BY** (Attribution): Credit the original author
- **NC** (Non-Commercial): No commercial use
- **SA** (Share Alike): Derivatives must use same license

For full details, see [Creative Commons License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

---

:::danger Disclaimer
M3U Editor is an independent, open-source playlist manager — **not an IPTV provider**. We don't host channels or partner with streaming services. Please only use content you're authorized to access.
:::
