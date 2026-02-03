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
Media Networks integration is available in the **experimental** branch (`sparkison/m3u-editor:experimental`).
This feature allows you to create pseudo-TV networks that broadcast content from your media server in a continuous loop.
:::

## Overview

Media Networks enable you to create virtual TV channels that continuously broadcast content from your integrated media servers (Emby, Jellyfin, or Plex). This feature transforms your VOD content (Movies) and Series into live TV-like experiences with:

- **24/7 Continuous Broadcasting**: Content plays in a loop based on a generated schedule
- **EPG Support**: Automatically generated Electronic Program Guide for your networks
- **HLS Streaming**: Live HLS (HTTP Live Streaming) output for broad client compatibility
- **Flexible Content Selection**: Mix and match movies, series episodes, or any media from your server
- **Transcoding Support**: Optional transcoding with configurable bitrates and quality settings

## Prerequisites

Before setting up Media Networks, ensure you have:

### Required

- ✅ **M3U Editor installed** with experimental branch:
  ```bash
  docker pull sparkison/m3u-editor:experimental
  ```
- ✅ **Media Server Integration** configured (Emby, Jellyfin, or Plex)
  - See [Emby Integration](./emby_integration.md) or [Plex Integration](./plex_integration.md) for setup instructions
  - Media content must be synced into M3U Editor before creating networks
- ✅ **M3U Proxy enabled** for streaming support
  - External m3u-proxy container recommended for hardware acceleration
  - See [Docker Compose Deployments](../deployment/docker-compose.md) for setup

### Recommended

- ✅ **Redis** for improved performance (caching and session management)
- ✅ **PostgreSQL** database for better performance with large media libraries
- ✅ **Hardware acceleration** (via m3u-proxy) for efficient transcoding
- ✅ **Adequate storage** for HLS segments during broadcasting

## Environment Variables

### Required Configuration

Add the following to your `.env` file or Docker environment variables:

```env
# Enable network broadcasting feature
NETWORK_BROADCAST_ENABLED=true

# HLS storage configuration
HLS_TEMP_DIR=/var/www/html/storage/app/hls-segments
HLS_GC_ENABLED=true
HLS_GC_INTERVAL=600
HLS_GC_AGE_THRESHOLD=7200
```

### Configuration Details

#### NETWORK_BROADCAST_ENABLED
- **Default**: `false`
- **Description**: Master switch to enable network broadcasting feature
- **Options**: `true`, `false`
- **Important**: Must be set to `true` to use Media Networks
- **Note**: When enabled, networks with `broadcast_enabled=true` will stream live HLS content

#### HLS Storage Settings

The following settings control HLS (HTTP Live Streaming) segment storage and cleanup:

**HLS_TEMP_DIR**
- **Default**: `/var/www/html/storage/app/hls-segments`
- **Description**: Directory where HLS segments are written during broadcast
- **Important**: Ensure sufficient disk space for concurrent network streams
- **Note**: Each active network requires temporary storage for segments

**HLS_GC_ENABLED**
- **Default**: `true`
- **Description**: Enable automatic garbage collection for old HLS segments
- **Options**: `true`, `false`
- **Recommendation**: Keep enabled to prevent disk space issues

**HLS_GC_INTERVAL**
- **Default**: `600` (10 minutes)
- **Description**: How often garbage collection runs (in seconds)
- **Range**: Any positive integer
- **Note**: Shorter intervals use more CPU but keep disk usage lower

**HLS_GC_AGE_THRESHOLD**
- **Default**: `7200` (2 hours)
- **Description**: Delete HLS segments older than this value (in seconds)
- **Recommendation**: Adjust based on your needs; shorter = less disk usage, longer = better for seeking/pausing

### Optional Configuration

For optimal performance, consider these additional settings:

```env
# Redis configuration (for caching and pooling)
REDIS_ENABLED=true
REDIS_HOST=redis
REDIS_SERVER_PORT=6379
REDIS_PASSWORD=changeme

# PostgreSQL (recommended for large libraries)
ENABLE_POSTGRES=true
DB_CONNECTION=pgsql
PG_DATABASE=m3ue
PG_USER=m3ue
PG_PASSWORD=changeme

# Proxy configuration (required for streaming)
M3U_PROXY_ENABLED=false  # Use external proxy
M3U_PROXY_HOST=m3u-proxy
M3U_PROXY_PORT=38085
M3U_PROXY_TOKEN=changeme
```

## Setting Up Media Networks

### Step 1: Configure Media Server Integration

First, ensure your media server is integrated and content has been synced:

1. Navigate to **Integrations** → **Media Servers** in the M3U Editor interface
2. If not already done, add your media server (Emby, Jellyfin, or Plex)
3. Click **Sync Now** to import your media library
4. Wait for the sync to complete (large libraries may take several minutes)

:::tip
Verify your content is imported by checking the VOD (Groups) and Series (Categories) sections in your playlists.
:::

### Step 2: Create a Network

1. Navigate to the **Networks** section in M3U Editor
2. Click **Create Network**
3. Configure the network settings:

   **Basic Settings:**
   - **Name**: Friendly name for your network (e.g., "Comedy Central", "Movie Marathon")
   - **Channel Number**: Virtual channel number for EPG and playlist
   - **Media Server**: Select the media server integration to pull content from
   - **Loop Content**: Enable to continuously loop through content
   - **Enabled**: Toggle to activate/deactivate the network

   **Schedule Settings:**
   - **Schedule Window (Days)**: How many days ahead to generate the EPG schedule
   - **Auto-regenerate Schedule**: Automatically rebuild schedule when it runs low

4. Click **Save** to create the network

### Step 3: Add Content to Network

After creating the network, add content that will play on it:

1. Open the network you created
2. Navigate to the **Content** section
3. Click **Add Content**
4. Select content from your media server:
   - **Series Episodes**: Individual episodes or entire seasons
   - **Movies**: VOD content from your media server
   - **Mixed Content**: Combine different types for variety
5. Set the **Sort Order** to control playback sequence
6. Optionally set **Weight** for random scheduling (higher weight = plays more often)
7. Click **Save**

:::tip Content Selection
You can mix different content types (movies, series episodes) within the same network to create a varied programming schedule.
:::

### Step 4: Generate Schedule

Once content is added, generate the programming schedule:

1. In the network settings, click **Generate Schedule**
2. The system will:
   - Calculate total content duration
   - Create a timetable based on your schedule window
   - Generate EPG data for the network
   - Assign start/end times for each content item
3. Review the generated schedule in the **Programme Schedule** section

:::note
If **Auto-regenerate Schedule** is enabled, the system will automatically extend the schedule when it approaches the end of the window (within 24 hours).
:::

### Step 5: Enable Broadcasting

To start live streaming your network:

1. Open the network settings
2. Navigate to the **Broadcast Settings** section
3. Enable **Broadcast Enabled**
4. Configure broadcast options:

   **HLS Settings:**
   - **Segment Duration**: Length of each HLS segment in seconds (default: 6)
     - Lower = less latency, more CPU usage
     - Higher = better buffering, less CPU usage
   - **HLS List Size**: Number of segments to keep in playlist (default: 5)

   **Transcoding Settings:**
   - **Transcode Mode**: Choose transcoding behavior
     - `copy`: No transcoding (fastest, least compatible)
     - `h264`: Transcode to H.264 (best compatibility)
     - `hevc`: Transcode to H.265/HEVC (better compression)
   - **Video Bitrate**: Target video bitrate in kbps (e.g., 2500 for 2.5 Mbps)
   - **Audio Bitrate**: Target audio bitrate in kbps (e.g., 128)

   **Optional: Scheduled Broadcasting**
   - **Enable Broadcast Schedule**: Start broadcast at a specific time
   - **Scheduled Start Time**: When to begin broadcasting

5. Click **Start Broadcast** or **Save** (if scheduled)

:::warning Resource Usage
Broadcasting with transcoding is CPU-intensive. Use hardware acceleration via the external m3u-proxy container for optimal performance.
:::

## Using Your Network

### Accessing the Stream

Once broadcasting is enabled, access your network through:

**HLS Stream URL:**
```
http://your-m3u-editor-url/network/{network-uuid}/hls/playlist.m3u8
```

**EPG URL:**
```
http://your-m3u-editor-url/network/{network-uuid}/epg
```

### Adding to Media Clients

#### Plex/Jellyfin/Emby (as Live TV)
1. In M3U Editor, add the network to a playlist
2. Use the playlist's M3U URL in your media server's Live TV configuration
3. Use the EPG URL for program guide data

#### Direct Playback (VLC, MPV, etc.)
1. Copy the HLS stream URL
2. Open in your media player: `File → Open Network Stream`
3. Paste the URL and play

#### IPTV Apps (TiviMate, etc.)
1. Create a new playlist in your IPTV app
2. Use the M3U URL from the playlist containing your networks
3. Add the EPG URL for program guide
4. Refresh the playlist

## Managing Networks

### Monitoring Broadcast Status

View the current status of your networks:

- **Broadcasting**: Network is actively streaming
- **Scheduled**: Waiting for scheduled start time
- **Stopped**: Broadcast is not running
- **Waiting**: Network is enabled but not yet started

### Updating Content

To modify network content while broadcasting:

1. The network continues to broadcast using the current schedule
2. Add or remove content items as needed
3. Click **Regenerate Schedule** to update the programming
4. The broadcast will automatically transition to the new schedule at the next programme boundary

:::tip
Changes to content or schedule take effect at the next programme transition, ensuring smooth playback without interruption.
:::

### Stopping a Broadcast

To stop a network broadcast:

1. Open the network settings
2. Navigate to **Broadcast Settings**
3. Click **Stop Broadcast**
4. Optionally disable **Broadcast Enabled** to prevent auto-restart

## Troubleshooting

### Network Not Broadcasting

**Symptoms**: Broadcast won't start or immediately stops

**Possible Causes:**
- `NETWORK_BROADCAST_ENABLED` is not set to `true`
- No content added to the network
- Schedule not generated
- M3U Proxy not running or not configured

**How to Fix:**
1. Verify `NETWORK_BROADCAST_ENABLED=true` in your `.env` file
2. Ensure content is added and schedule is generated
3. Check M3U Proxy is running: `docker ps | grep m3u-proxy`
4. Review logs for errors: `docker logs m3u-editor`
5. Restart the container: `docker-compose restart`

---

### Stream Not Playing

**Symptoms**: HLS URL returns error or won't play in client

**Possible Causes:**
- Broadcast not started
- Network is disabled
- HLS segments not being generated
- Insufficient disk space for segments

**How to Fix:**
1. Verify broadcast is running (check network status)
2. Ensure network is enabled
3. Check HLS storage directory exists and is writable:
   ```bash
   docker exec m3u-editor ls -la /var/www/html/storage/app/hls-segments
   ```
4. Verify disk space: `df -h`
5. Check m3u-proxy logs: `docker logs m3u-proxy`

---

### EPG Not Showing Programs

**Symptoms**: Program guide is empty or outdated

**Possible Causes:**
- Schedule not generated
- EPG not regenerated after content changes
- Network not synced with media server

**How to Fix:**
1. Click **Generate Schedule** in network settings
2. Wait for EPG generation to complete
3. Refresh your client's EPG data
4. If using external IPTV app, update the EPG URL

---

### High CPU Usage During Broadcast

**Symptoms**: System performance degrades when broadcasting

**Possible Causes:**
- Transcoding without hardware acceleration
- Too many concurrent broadcasts
- Inefficient transcode settings

**How to Fix:**
1. Use external m3u-proxy container with GPU passthrough:
   ```yaml
   m3u-proxy:
     devices:
       - /dev/dri:/dev/dri  # Intel QuickSync/VAAPI
   ```
2. Reduce video bitrate or use `copy` mode (no transcoding)
3. Limit number of concurrent broadcasts
4. Increase `HLS_GC_INTERVAL` to reduce cleanup overhead

---

### Disk Space Filling Up

**Symptoms**: Storage running out of space

**Possible Causes:**
- HLS garbage collection disabled
- GC threshold too high
- Multiple long-running broadcasts

**How to Fix:**
1. Verify `HLS_GC_ENABLED=true`
2. Lower `HLS_GC_AGE_THRESHOLD` (e.g., 3600 for 1 hour)
3. Decrease `HLS_GC_INTERVAL` for more frequent cleanup
4. Manually clean HLS directory:
   ```bash
   docker exec m3u-editor find /var/www/html/storage/app/hls-segments -type f -mmin +120 -delete
   ```

---

### Schedule Not Auto-Regenerating

**Symptoms**: Program guide stops updating after initial generation

**Possible Causes:**
- Auto-regenerate disabled
- Schedule window too large
- System cron/scheduler not running

**How to Fix:**
1. Enable **Auto-regenerate Schedule** in network settings
2. Set reasonable schedule window (7-14 days recommended)
3. Verify Laravel scheduler is running:
   ```bash
   docker exec m3u-editor php artisan schedule:list
   ```
4. Manually trigger regeneration as needed

## Advanced Configuration

### Transcoding Profiles

For optimal quality and performance, configure transcoding based on your use case:

**Low Bandwidth / Mobile**
```
Transcode Mode: h264
Video Bitrate: 1500 kbps
Audio Bitrate: 96 kbps
Segment Duration: 4
```

**Standard Quality / Home Network**
```
Transcode Mode: h264
Video Bitrate: 3500 kbps
Audio Bitrate: 128 kbps
Segment Duration: 6
```

**High Quality / Fast Network**
```
Transcode Mode: hevc
Video Bitrate: 6000 kbps
Audio Bitrate: 192 kbps
Segment Duration: 10
```

**Direct Streaming (No Transcoding)**
```
Transcode Mode: copy
Segment Duration: 6
Note: Best performance but limited compatibility
```

### Docker Compose Example

Complete docker-compose setup with network broadcasting:

```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:experimental
    container_name: m3u-editor
    environment:
      - TZ=America/New_York
      - APP_URL=http://localhost
      - APP_PORT=36400
      
      # Network Broadcasting
      - NETWORK_BROADCAST_ENABLED=true
      
      # HLS Configuration
      - HLS_TEMP_DIR=/var/www/html/storage/app/hls-segments
      - HLS_GC_ENABLED=true
      - HLS_GC_INTERVAL=600
      - HLS_GC_AGE_THRESHOLD=7200
      
      # Proxy Configuration
      - M3U_PROXY_ENABLED=false  # Disable embedded proxy, using external
      - M3U_PROXY_HOST=m3u-proxy
      - M3U_PROXY_PORT=38085
      - M3U_PROXY_TOKEN=${M3U_PROXY_TOKEN}
      
      # Redis Configuration
      - REDIS_ENABLED=false  # Disable embedded Redis, using external
      - REDIS_HOST=redis
      - REDIS_SERVER_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      
      # Database
      - ENABLE_POSTGRES=true
      - DB_CONNECTION=pgsql
      - PG_DATABASE=m3ue
      - PG_USER=m3ue
      - PG_PASSWORD=${PG_PASSWORD}
    volumes:
      - ./data:/var/www/config
      - pgdata:/var/lib/postgresql/data
    ports:
      - "36400:36400"
    restart: unless-stopped
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
      - PORT=38085
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - ENABLE_REDIS_POOLING=true
    devices:
      - /dev/dri:/dev/dri  # Hardware acceleration
    restart: unless-stopped
    networks:
      - m3u-network

  redis:
    image: redis:alpine3.22
    container_name: m3u-redis
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - m3u-network

networks:
  m3u-network:
    driver: bridge

volumes:
  pgdata:
  redis-data:
```

**Required .env file:**
```env
M3U_PROXY_TOKEN=<generate with: openssl rand -hex 32>
REDIS_PASSWORD=<generate with: openssl rand -base64 32>
PG_PASSWORD=<generate with: openssl rand -base64 32>
```

## Best Practices

1. **Start Small**: Create one or two networks initially to understand resource requirements
2. **Use External Proxy**: For hardware acceleration and better performance
3. **Monitor Resources**: Keep an eye on CPU, memory, and disk usage
4. **Regular Syncs**: Keep media server content up-to-date with periodic syncs
5. **Schedule Windows**: Use 7-14 day windows for balance between convenience and regeneration overhead
6. **Content Variety**: Mix different content types to create engaging programming
7. **Test Streams**: Verify playback in multiple clients before deploying widely
8. **Backup Configuration**: Regularly backup your M3U Editor data directory
9. **Update Regularly**: Keep experimental branch updated for latest features and fixes
10. **Use Redis**: Enable Redis for better performance with multiple networks

## Frequently Asked Questions

### Q: Can I use content from multiple media servers in one network?

**A:** No, each network is tied to a single media server integration. However, you can create multiple networks, each pulling from different media servers, and combine them in a playlist.

### Q: How much disk space do I need for broadcasting?

**A:** It varies by configuration. As a rough estimate:
- **Per Network**: 50-200 MB for HLS segments (depends on bitrate and segment duration)
- **Multiple Networks**: Multiply accordingly
- **With Garbage Collection**: Disk usage remains relatively stable

### Q: Can viewers seek/rewind while watching?

**A:** HLS supports limited seeking within the buffered segments (controlled by `HLS_LIST_SIZE`). For full seeking, viewers should use the VOD/series content directly, not the network broadcast.

### Q: Does broadcasting affect my media server?

**A:** Yes, M3U Editor streams content from your media server, which counts as active playback sessions. Ensure your media server can handle the additional load.

### Q: Can I schedule specific content to play at certain times?

**A:** Currently, the schedule is generated automatically based on content duration and sort order. Manual scheduling of specific time slots is not yet supported but planned for future releases.

### Q: What happens if content is removed from my media server?

**A:** On the next sync, M3U Editor will update its database. If that content was part of a network, the schedule will need to be regenerated. Active broadcasts may stop if the currently playing content is no longer available.

### Q: Can I have multiple networks broadcasting simultaneously?

**A:** Yes, but each broadcast consumes resources (CPU, disk, bandwidth). Monitor system performance and scale hardware as needed.

### Q: Is there a limit to how much content I can add to a network?

**A:** No hard limit, but very large networks (hundreds of items) may take longer to generate schedules and use more database resources. Consider splitting into multiple themed networks for better manageability.

## Related Documentation

- [Emby Integration](./emby_integration.md) - Setting up Emby media server
- [Media Server Integration Settings](./emby_integration_settings.md) - Sync and configuration options
- [Plex Integration](./plex_integration.md) - Setting up Plex media server (experimental)
- [Environment Variables](../advanced/environment-variables.md) - Complete environment variable reference
- [Docker Compose Deployments](../deployment/docker-compose.md) - Docker setup and configuration

## Support

For issues, questions, or suggestions:
- [Open an issue](https://github.com/sparkison/m3u-editor/issues) on GitHub
- Join the [Discord community](https://discord.gg/rS3abJ5dz7)
- Check existing documentation for troubleshooting tips
