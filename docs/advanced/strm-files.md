---
sidebar_position: 3
description: Complete guide to .strm file generation for media server integration
tags:
  - Series
  - VOD
  - Integration
  - Plex
  - Jellyfin
  - Emby
title: .strm Files Guide
---

# .strm Files for Media Server Integration

Learn how to use M3U Editor's .strm file generation to integrate your IPTV content with Plex, Jellyfin, Emby, and other media servers.


## 🎯 What are .strm Files?

**.strm files** are simple text files containing a stream URL. Media servers like Plex, Jellyfin, and Emby can read these files and play the streams as if they were local media files.

**Example .strm file content**:
```
http://your-ip:36400/stream/episode/12345
```

### Benefits

✅ **Organize IPTV content** like local media  
✅ **Use media server features** (watched status, collections, etc.)  
✅ **Better metadata** via TMDB integration  
✅ **Automatic library updates** when content changes  
✅ **Compatible** with existing media server workflows  



## 🚀 Quick Start

### 1. Enable .strm File Generation

**For Series**:
1. Go to **Settings** → **Sync Options**
2. Enable **"Enable .strm file generation"** under "Series stream file settings"
3. Set **Series Sync Location**: `/path/to/your/Series`
4. Configure path structure and metadata options
5. Click **Save Settings**

**For VOD**:
1. Same location, but under "VOD stream file settings"
2. Set **VOD Sync Location**: `/path/to/your/Movies`

### 2. Configure a Series/VOD

1. Go to your Series or VOD channel
2. Click **Edit**
3. Enable the series/VOD
4. Click **Sync .strm Files** (if available)

### 3. Add to Media Server

1. In Plex/Jellyfin/Emby, add new library
2. Point to your sync location (`/path/to/your/Series`)
3. Set library type (TV Shows or Movies)
4. Scan library



## ⚙️ Configuration Options

### Path Structure

Control how folders are organized:

#### For Series

**Category Folder**
- Example: `/Series/Sports/`
- Groups by category/genre

**Series Folder**
- Example: `/Series/Sports/NBA Games/`
- Individual folder per series

**Season Folder**
- Example: `/Series/Sports/NBA Games/Season 01/`
- Separate folder per season

**Common Patterns**:
```
Series only:
/Series/NBA Games/episode.strm

Series + Season:
/Series/NBA Games/Season 01/S01E01.strm

Category + Series + Season:
/Series/Sports/NBA Games/Season 01/S01E01.strm
```

#### For VOD

**Category Folder**
- Example: `/Movies/Action/`
- Groups by category/genre

**Title Folder**
- Example: `/Movies/Action/Movie Title/`
- Individual folder per movie

**Common Patterns**:
```
No folders:
/Movies/Movie Title (2024).strm

Category only:
/Movies/Action/Movie Title (2024).strm

Category + Title:
/Movies/Action/Movie Title/Movie Title (2024).strm
```



## 📝 Filename Metadata

Customize what appears in the filename for better media server recognition:

### Year
- **Format**: `Title (2024)`
- **Source**: Release date from provider or TMDB
- **Recommended**: ✅ Yes - helps media server matching

### TMDB ID
- **Format**: `Title [tmdb-12345]` or `Title {tmdb-12345}`
- **Source**: TMDB integration (must be configured)
- **Recommended**: ✅ Yes - ensures correct metadata matching

### Resolution (Series only)
- **Format**: `S01E01 - 1080p`
- **Source**: Detected from stream
- **Recommended**: ⚠️ Optional - not all streams have resolution info

### Examples

**Series with Year + TMDB ID**:
```
/Series/NBA Games/Season 01/S01E01 - Game 1 (2024) [tmdb-123456].strm
```

**VOD with Year + TMDB ID (curly brackets)**:
```
/Movies/Action/The Matrix (1999) {tmdb-603}.strm
```



## 🔧 Advanced Settings

### TMDB ID Format

**Square Brackets** (Default)
- Format: `[tmdb-12345]`
- Better for Plex

**Curly Brackets**
- Format: `{tmdb-12345}`
- Better for Jellyfin

### Replace Character

Replace special characters in filenames with:
- **Space** (default)
- **Underscore** `_`
- **Dash** `-`
- **Nothing** (remove)

### Name Filtering

Remove unwanted text from folder/file names:

**Examples**:
- `DE • ` - Remove "DE • " prefix
- `EN |` - Remove "EN |" prefix  
- `[4K]` - Remove "[4K]" tag
- `★` - Remove star emoji

**Use Case**: Cleaning up provider-added prefixes/suffixes



## 🎬 Media Server Setup

### Plex Configuration

#### Add Library

1. **Settings** → **Libraries** → **Add Library**
2. Select library type:
   - **TV Shows** for Series
   - **Movies** for VOD
3. **Add folders**: Point to your sync location
4. **Advanced** → **Scanner**: 
   - Use **Plex Series Scanner** for TV
   - Use **Plex Movie Scanner** for Movies
5. **Advanced** → **Agent**:
   - Select **TheTVDB** or **TMDB** for TV
   - Select **The Movie Database** for Movies

#### Recommended Settings

- **✅** Enable "Update my library automatically"
- **✅** Enable "Scan my library periodically"
- **⚠️** Disable "Empty trash automatically" (until stable)

#### Troubleshooting

**Content not appearing?**
1. Force scan library
2. Check file permissions
3. Verify .strm file contents (should be URL)
4. Check Plex logs for errors

**Wrong metadata?**
1. Use TMDB IDs in filenames
2. Fix series/episode naming format
3. Manually match in Plex

### Jellyfin Configuration

#### Add Library

1. **Dashboard** → **Libraries** → **Add Library**
2. Select content type:
   - **Shows** for Series
   - **Movies** for VOD
3. **Add** folder: Your sync location
4. **Metadata downloaders**:
   - Enable **TheMovieDb**
   - Enable **TheTVDB** (for Series)
5. **Save**

#### Recommended Settings

- Metadata language: Your preference
- Country: Your country
- **✅** Save metadata into media folder
- **✅** Enable "Monitor library"

### Emby Configuration

#### Add Library

1. **Settings** → **Library** → **Add Library**
2. Select type: **TV Shows** or **Movies**
3. **Add** folder path
4. Configure metadata providers (TMDB, TheTVDB)
5. **Save**



## 📂 Sync Location Requirements

### Path Requirements

**Must be**:
- ✅ Absolute path (e.g., `/media/Series`)
- ✅ Writable by m3u-editor container
- ✅ Accessible by media server

**Should not be**:
- ❌ Relative path (e.g., `~/Series`)
- ❌ URL or remote path
- ❌ Temporary directory

### Docker Volume Mapping

Mount the sync location in both containers:

**docker-compose.yml**:
```yaml
services:
  m3u-editor:
    volumes:
      - ./data:/var/www/config
      - /path/to/media/Series:/media/Series  # <-- Add this
      - /path/to/media/Movies:/media/Movies  # <-- Add this
  
  jellyfin:  # or plex/emby
    volumes:
      - /path/to/media/Series:/media/Series  # <-- Same path
      - /path/to/media/Movies:/media/Movies  # <-- Same path
```

### Permissions

```bash
# Ensure m3u-editor can write
chown -R 1000:1000 /path/to/media/Series

# Or make world-writable (less secure)
chmod -R 777 /path/to/media/Series
```



## 🔄 Syncing Process

### Automatic Sync

**When enabled on Playlist**:
- Automatically creates/updates .strm files after playlist sync
- Removes .strm files for deleted episodes/VOD

**When enabled on Series/VOD**:
- Syncs on save
- Syncs when fetching metadata

### Manual Sync

**Per Series**:
1. Edit Series
2. Click **Sync .strm Files** button
3. Wait for completion notification

**Per Playlist**:
1. Edit Playlist
2. Enable "Auto sync .strm files" in VOD/Series settings
3. Click **Sync Now**

### Bulk Sync

```bash
# Sync all Series
docker exec -it m3u-editor php artisan app:sync-series-strm-files

# Sync all VOD
docker exec -it m3u-editor php artisan app:sync-vod-strm-files
```



## 🎨 Filename Examples

### Series Examples

**Minimal** (Series name only):
```
/Series/NBA 2024/S01E01 - Lakers vs Celtics.strm
```

**With Year**:
```
/Series/NBA 2024/S01E01 - Lakers vs Celtics (2024).strm
```

**With TMDB ID**:
```
/Series/NBA 2024/S01E01 - Lakers vs Celtics [tmdb-123456].strm
```

**Full Metadata**:
```
/Series/Sports/NBA 2024/Season 01/S01E01 - Lakers vs Celtics (2024) [tmdb-123456].strm
```

### VOD Examples

**Minimal**:
```
/Movies/The Matrix.strm
```

**With Year**:
```
/Movies/The Matrix (1999).strm
```

**With TMDB ID**:
```
/Movies/The Matrix (1999) [tmdb-603].strm
```

**In Folders**:
```
/Movies/Sci-Fi/The Matrix/The Matrix (1999) [tmdb-603].strm
```



## 🔍 Troubleshooting

### Files Not Created

**Check**:
1. **.strm generation enabled** in Settings?
2. **Sync location exists** and is writable?
3. **Volume mounted** in docker-compose?
4. Check logs: `/var/www/config/logs/laravel.log`

```bash
# Test write permission
docker exec -it m3u-editor touch /media/Series/test.txt
docker exec -it m3u-editor rm /media/Series/test.txt
```

### Files Created but Empty

**Verify**:
```bash
# Check file contents
cat /path/to/media/Series/Show/S01E01.strm
# Should contain: http://your-ip:36400/stream/episode/12345
```

### Media Server Not Detecting

**Plex/Jellyfin/Emby**:
1. Verify library path matches sync location exactly
2. Force library scan
3. Check file permissions (readable by media server)
4. Ensure .strm extension is recognized

### Wrong Metadata

**Solutions**:
1. Enable TMDB integration in Settings → Integrations
2. Include TMDB ID in filename
3. Use correct naming format for media server
4. Manually fix match in media server

### Files Not Updating

**When content changes**:
1. Re-sync the playlist
2. Or manually sync Series/VOD
3. Trigger media server library scan

### Slow Startup or Seeking in Emby (IPv6 / DNS)

**Symptoms**:
- `.strm` VOD items take ~25 seconds to start playing in Emby (likely also applies to Jellyfin)
- Seeking/scrubbing is slow, restarts playback, or fails entirely
- Emby logs show errors like `Network is unreachable (m3u.example.com:443)` and `TranscodeReasons=DirectPlayError`
- Playback falls back to HLS remux/transcode, which restarts ffmpeg on every seek

**Cause**:

The Emby container resolves your M3U Editor public hostname (e.g. `m3u.example.com`) through public DNS. Depending on your DNS setup (for example, a hostname proxied through Cloudflare), it can receive IPv6 (`AAAA`) records. If the Docker host or LAN has no IPv6 route, Emby's direct-play request fails, and Emby falls back to remuxing/transcoding the stream.

**Fix**: make the Emby container reach M3U Editor over your LAN (e.g. via your reverse proxy's LAN IP). Use one of these options:

1. **Docker Compose `extra_hosts`** (recommended):
   ```yaml
   services:
     emby:
       # ...
       extra_hosts:
         - "m3u.example.com:192.168.1.10"
   ```
2. **`docker run --add-host`**:
   ```bash
   docker run ... --add-host m3u.example.com:192.168.1.10 ...
   ```
3. **LAN DNS resolver**: point the Emby container at a local DNS server that resolves `m3u.example.com` to its LAN IP (e.g. `dns:` in Docker Compose or `--dns` in `docker run`)
4. **LAN base URL**: generate the `.strm` files with a LAN URL (e.g. `http://192.168.1.10:36400`) instead of the public hostname, then re-sync

Restart the Emby container after applying the change.

**Verify**:
1. Start a `.strm` item and open the Emby dashboard: playback should show **Direct Play**
2. Seek forward and back. Seeks should be near-instant

```bash
# Confirm the hosts entry was added inside the container (extra_hosts / --add-host)
docker exec -it emby cat /etc/hosts
# Should include: 192.168.1.10  m3u.example.com
```

In one test setup, this cut startup time from ~25s to ~3.5s, with seeks taking ~0.7s.

:::note
M3U Editor's proxy supports HTTP `Range` requests, so seeking works once Emby can direct play. Note that 4K HEVC content played in the Emby **web browser** client will still be transcoded because of browser codec limits. Use the native Emby apps (TV, mobile, desktop) for direct play of 4K HEVC.
:::



## 💡 Best Practices

### For Best Results

✅ **Use TMDB Integration**
- Get free API key
- Enable TMDB ID in filenames
- Ensures perfect metadata matching

✅ **Include Year in Filename**
- Helps distinguish remakes/reboots
- Improves media server matching

✅ **Use Consistent Path Structure**
- Decide on folder structure early
- Stick with it across all content

✅ **Test with One Series First**
- Verify paths work
- Check media server detection
- Then enable for all content

### Recommended Settings

**For Plex**:
- Path: Category → Series → Season
- Filename: Year + TMDB ID (square brackets)
- Format: `Show Name (2024) [tmdb-12345]`

**For Jellyfin**:
- Path: Series → Season
- Filename: Year + TMDB ID (curly brackets)
- Format: `Show Name (2024) {tmdb-12345}`

**For Emby**:
- Similar to Plex settings
- Square brackets work well



## 🔗 Stream URLs

### URL Format

**.strm files contain**:
```
http://your-ip:36400/stream/episode/12345
```

### URL Features

- **Authentication**: Uses playlist credentials
- **Failover**: Automatic failover support
- **Proxy**: Goes through m3u-proxy if enabled
- **Transcoding**: Uses profile if configured on playlist

### Direct URLs vs Proxied

**Direct** (no proxy):
```
http://your-ip:36400/stream/episode/12345?proxy=false
```

**Proxied** (default when proxy enabled):
```
http://your-ip:36400/stream/episode/12345?proxy=true
```



## 📊 Monitoring

### Check Sync Status

1. View notifications for sync results
2. Check series/VOD edit page for last sync time
3. Review logs for errors

### Verify File Count

```bash
# Count .strm files
find /path/to/media/Series -name "*.strm" | wc -l

# List recent files
find /path/to/media/Series -name "*.strm" -mtime -1
```



## 🆘 Getting Help

- 💬 [Discord](https://discord.gg/rS3abJ5dz7)
- 🐛 [GitHub Issues](https://github.com/m3ue/m3u-editor/issues)

