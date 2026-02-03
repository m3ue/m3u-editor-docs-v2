---
sidebar_position: 4
description: Create pseudo-TV networks from integrated media server content
title: Media Networks Integration
hide_title: true
tags:
  - Integrations
  - Networks
  - Media Servers
  - Emby
  - Jellyfin
  - Plex
  - Broadcasting
---

# Media Networks Integration

:::info Experimental Feature
Available in the **experimental** branch (`sparkison/m3u-editor:experimental`).
Create pseudo-TV networks that broadcast content from your media server in a continuous loop.
:::

## Overview

Transform VOD content and Series into 24/7 live TV channels with automatic EPG generation and HLS streaming.

**Key Features:**
- Continuous broadcasting with loop support
- Automatic EPG generation
- HLS streaming for broad compatibility
- Mix movies and series episodes
- Optional transcoding support

## Prerequisites

- M3U Editor experimental branch
- Media server integration configured (Emby/Jellyfin/Plex)
- M3U Proxy enabled for streaming
- Media content synced into M3U Editor

**Recommended:** Redis, PostgreSQL, hardware acceleration, adequate storage

## Configuration

Add to your `.env` file:

```env
# Enable broadcasting
NETWORK_BROADCAST_ENABLED=true

# HLS storage
HLS_TEMP_DIR=/var/www/html/storage/app/hls-segments
HLS_GC_ENABLED=true
HLS_GC_INTERVAL=600          # Cleanup every 10 minutes
HLS_GC_AGE_THRESHOLD=7200    # Delete segments older than 2 hours
```

**Optional but recommended:**
```env
REDIS_ENABLED=true
ENABLE_POSTGRES=true
M3U_PROXY_ENABLED=false  # Use external proxy
```

### Performance: HLS Segments on RAM Disk

:::tip Better Performance
For optimal performance and reduced disk wear, store HLS segments in RAM using tmpfs. This provides faster I/O and eliminates disk writes for temporary segment files.
:::

For better performance and reduced disk wear, store HLS segments in RAM using tmpfs:

**Docker Compose:**
```yaml
services:
  m3u-editor:
    # ... other config ...
    volumes:
      - ./data:/var/www/config
      - pgdata:/var/lib/postgresql/data
      - type: tmpfs
        target: /var/www/html/storage/app/hls-segments
        tmpfs:
          size: 512M  # Adjust based on concurrent networks
```

**Benefits:**
- Faster read/write for HLS segments
- Reduced SSD/HDD wear
- Automatic cleanup on restart

**Considerations:**
- RAM usage increases (50-200MB per active network)
- Segments lost on container restart (regenerated automatically)
- Not suitable for systems with limited RAM

## Quick Setup

### 1. Sync Media Server
1. Navigate to **Integrations** → **Media Servers**
2. Add your media server if needed
3. Click **Sync Now**

### 2. Create Network
1. Go to **Networks** → **Create Network**
2. Set **Name**, **Channel Number**, and **Media Server**
3. Enable **Loop Content** and **Enabled**
4. Save

### 3. Add Content
1. Open the network
2. Click **Add Content**
3. Select series episodes or movies
4. Set **Sort Order** for playback sequence
5. Save

### 4. Generate Schedule
1. Click **Generate Schedule**
2. Review in **Programme Schedule** section
3. Enable **Auto-regenerate** to keep schedule updated

### 5. Start Broadcasting
1. Open **Broadcast Settings**
2. Enable **Broadcast Enabled**
3. Configure HLS and transcoding options (see below)
4. Click **Start Broadcast**

#### HLS Settings
- **Segment Duration**: Length of each HLS segment in seconds (default: 6)
  - Lower = less latency, more CPU usage
  - Higher = better buffering, less CPU usage
- **HLS List Size**: Number of segments to keep in playlist (default: 5)

#### Transcoding Settings
- **Transcode Mode**: Choose transcoding behavior
  - `copy`: No transcoding (fastest, least compatible) - direct stream
  - `h264`: Transcode to H.264 (best compatibility, recommended)
  - `hevc`: Transcode to H.265/HEVC (better compression, newer devices)
- **Video Bitrate**: Target video bitrate in kbps
  - Standard: 2500-3500 kbps
  - Low bandwidth: 1500 kbps
  - High quality: 6000+ kbps
- **Audio Bitrate**: Target audio bitrate in kbps (typically 96-192 kbps)

:::warning Resource Usage
Transcoding is CPU-intensive. Use hardware acceleration with external m3u-proxy container and GPU passthrough (`/dev/dri:/dev/dri`) for optimal performance.
:::

## Access Your Network

**HLS Stream:**
```
http://your-server:36400/network/{network-uuid}/hls/playlist.m3u8
```

**EPG:**
```
http://your-server:36400/network/{network-uuid}/epg
```

Add to media clients using the playlist M3U URL and EPG URL.

## Troubleshooting

### Network Not Broadcasting
- Verify `NETWORK_BROADCAST_ENABLED=true` in `.env`
- Ensure content added and schedule generated
- Check M3U Proxy is running: `docker ps | grep m3u-proxy`
- Review logs: `docker logs m3u-editor`

### Stream Not Playing
- Verify broadcast is running
- Check HLS directory exists and is writable
- Verify disk space: `df -h`
- Check proxy logs: `docker logs m3u-proxy`

### EPG Not Showing
- Click **Generate Schedule**
- Refresh client's EPG data
- Verify EPG URL in client

### High CPU Usage
- Enable hardware acceleration with m3u-proxy
- Reduce bitrate or use `copy` mode
- Limit concurrent broadcasts

### Disk Space Issues
- Verify `HLS_GC_ENABLED=true`
- Lower `HLS_GC_AGE_THRESHOLD` value
- Increase cleanup frequency with `HLS_GC_INTERVAL`

## Transcoding Profiles

**Low Bandwidth:**
```
Mode: h264 | Video: 1500 kbps | Audio: 96 kbps | Segment: 4s
```

**Standard Quality:**
```
Mode: h264 | Video: 3500 kbps | Audio: 128 kbps | Segment: 6s
```

**High Quality:**
```
Mode: hevc | Video: 6000 kbps | Audio: 192 kbps | Segment: 10s
```

**Direct Streaming:**
```
Mode: copy | Segment: 6s (best performance, limited compatibility)
```

## Docker Compose Example

**With tmpfs (RAM disk) for HLS segments:**
```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:experimental
    container_name: m3u-editor
    environment:
      - TZ=America/New_York
      - APP_URL=http://localhost
      - APP_PORT=36400
      - NETWORK_BROADCAST_ENABLED=true
      - HLS_TEMP_DIR=/var/www/html/storage/app/hls-segments
      - HLS_GC_ENABLED=true
      - M3U_PROXY_ENABLED=false
      - M3U_PROXY_HOST=m3u-proxy
      - M3U_PROXY_TOKEN=${M3U_PROXY_TOKEN}
      - REDIS_ENABLED=false
      - REDIS_HOST=redis
      - ENABLE_POSTGRES=true
    volumes:
      - ./data:/var/www/config
      - pgdata:/var/lib/postgresql/data
      - type: tmpfs
        target: /var/www/html/storage/app/hls-segments
        tmpfs:
          size: 512M
    ports:
      - "36400:36400"
    networks:
      - m3u-network
    depends_on:
      - m3u-proxy
      - redis

  m3u-proxy:
    image: sparkison/m3u-proxy:experimental
    container_name: m3u-proxy
    environment:
      - API_TOKEN=${M3U_PROXY_TOKEN}
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
    devices:
      - /dev/dri:/dev/dri  # Hardware acceleration
    networks:
      - m3u-network

  redis:
    image: redis:alpine3.22
    container_name: m3u-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    networks:
      - m3u-network

networks:
  m3u-network:

volumes:
  pgdata:
  redis-data:
```

## FAQ

**Q: Can I use multiple media servers in one network?**
A: No, each network uses one media server. Create multiple networks for different servers.

**Q: How much disk space needed?**
A: 50-200 MB per network for HLS segments. Varies by bitrate and duration.

**Q: Can viewers seek/rewind?**
A: Limited seeking within buffered segments. For full control, use VOD/series directly.

**Q: Can I schedule specific content at specific times?**
A: Not currently. Schedule is auto-generated based on content duration and order.

**Q: Multiple networks simultaneously?**
A: Yes, but monitor system resources (CPU, disk, bandwidth).

## Related Documentation

- [Emby Integration](./emby_integration.md)
- [Plex Integration](./plex_integration.md)
- [Docker Compose Deployments](../deployment/docker-compose.md)
- [Environment Variables](../advanced/environment-variables.md)

## Support

- [GitHub Issues](https://github.com/sparkison/m3u-editor/issues)
- [Discord Community](https://discord.gg/rS3abJ5dz7)
