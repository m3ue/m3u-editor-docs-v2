---
sidebar_position: 4
description: Complete Settings page reference for M3U Editor
tags:
  - Settings
  - Configuration
  - Admin
title: Settings Reference
---

# Settings Reference

Complete guide to all settings available in the M3U Editor Settings page (admin-only).

**Access**: Sidebar → **Settings** (⚙️ icon)

---

## 🎨 Appearance Tab

### Layout & Display Options

#### Navigation Position
- **Options**: Left / Top
- **Default**: Left
- **Description**: Position of the main navigation sidebar

#### Show Breadcrumbs
- **Type**: Toggle
- **Default**: Enabled
- **Description**: Show breadcrumb navigation under page titles

#### Output WAN Address in Menu
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Display server's public IP address in the menu (useful for remote access)

#### Max Width of Page Content
- **Options**: Medium / Large / XL / 2XL / Full
- **Default**: XL
- **Description**: Maximum content width for better readability on large screens

---

## 🔄 Proxy Tab

### M3U Proxy Settings

#### URL Resolution

**Resolve Proxy Public URL Dynamically**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Automatically detect and use the correct public URL at request time
- **Use When**: Behind reverse proxy or dynamic DNS

#### Failover Resolver

**Enable Failover Resolver**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Use external service to validate failover URLs before switching

**Failover Resolver URL**
- **Type**: URL input
- **Example**: `http://your-resolver-service/check`
- **Description**: Endpoint that checks if stream URL is valid before failover

### Stream Limit Settings

**Stop Oldest Stream When Limit Reached**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: When playlist reaches connection limit, automatically stop oldest stream to allow new connection
- **Warning**: May cause issues with multiple clients - newest request always wins

### In-App Player Transcoding

**Default Live Transcoding Profile**
- **Type**: Select (Stream Profiles)
- **Description**: Profile used for Live channels in built-in player
- **Leave Empty**: To disable transcoding (direct stream)

**Default VOD/Series Transcoding Profile**
- **Type**: Select (Stream Profiles)
- **Description**: Profile used for VOD and Series in built-in player
- **Leave Empty**: To disable transcoding

**Manage Profiles**: Link to Stream Profiles page

---

## 🔗 Integrations Tab

### MediaFlow Proxy

**Proxy URL**
- **Format**: `socks5://user:pass@host:port` or `http://user:pass@host:port`
- **Description**: External proxy for routing traffic

**Proxy Port (Alternative)**
- **Type**: Number
- **Description**: Alternative if not specified in URL (rarely used)

**Proxy Password (Alternative)**
- **Type**: Password
- **Description**: Alternative if not specified in URL (rarely used)

**Use Playlist User Agent**
- **Type**: Toggle
- **Description**: Use playlist-specific user agent for MediaFlow requests

**User Agent**
- **Type**: Text input
- **Description**: Custom user agent when not using playlist's

### TMDB Integration

**TMDB API Key**
- **Type**: Password (revealable)
- **Get Key**: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **Description**: v3 API key for The Movie Database

**Auto-lookup on Import**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Automatically fetch TMDB metadata during VOD/Series import
- **Warning**: May slow down large imports

**Rate Limit**
- **Type**: Number (1-50)
- **Default**: 40
- **Description**: Max TMDB API requests per second

---

## 📺 Streams Tab

### Series .strm File Settings

**Enable .strm File Generation**
- **Type**: Toggle
- **Description**: Create .strm files for Series integration with media servers

**Series Sync Location**
- **Type**: Path
- **Example**: `/media/Series`
- **Must**: Be an absolute local path
- **Description**: Where to create Series .strm files

**Path Structure**
- **Options**: Category / Series / Season (multiple)
- **Description**: Folder hierarchy for organizing files
- **Example**: `Category → Series → Season`

**Filename Metadata**
- **Options**: 
  - Year: Append `(2024)` to filename
  - TMDB ID: Append `[tmdb-12345]` or `{tmdb-12345}`
  - Resolution: Append `1080p` to filename
- **Description**: Additional metadata in filename for media server scanning

**TMDB ID Format**
- **Options**: Square `[tmdb-123]` / Curly `{tmdb-123}`
- **Description**: Bracket style for TMDB IDs

**Replace Character**
- **Default**: Space
- **Description**: Replace special characters in filenames

**File Name Format Preview**
- **Read-only**: Shows example of generated filename
- **Updates**: Dynamically as you change settings

### VOD .strm File Settings

Same options as Series, but for VOD channels:
- Enable .strm file generation
- Sync location
- Path structure
- Filename metadata
- TMDB ID format
- Name filtering patterns

**Name Filtering**
- **Type**: Tag input
- **Examples**: `"DE • "`, `"EN |"`, `"4K-"`
- **Description**: Remove specific patterns from folder/file names

---

## 💾 Backups Tab

### Automated Backups

**Enable Automatic Database Backups**
- **Type**: Toggle
- **Description**: Schedule automatic database backups

**Backup Schedule**
- **Type**: CRON expression
- **Examples**: 
  - `0 3 * * *` - Daily at 3 AM
  - `0 */6 * * *` - Every 6 hours
  - `0 0 * * 0` - Weekly on Sunday
- **Helper**: Shows next scheduled run time

**Max Backups to Keep**
- **Type**: Number
- **Default**: 7
- **Description**: Automatically delete old backups when limit exceeded

**Include Files in Backup**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Include EPG and Playlist files (increases backup size)

---

## 🔔 Notifications Tab

### Email Settings

**Mail Driver**
- **Options**: SMTP / Sendmail / Log
- **Description**: How to send emails

**SMTP Configuration**:
- **Host**: SMTP server address
- **Port**: Usually 587 (TLS) or 465 (SSL)
- **Username**: SMTP account username
- **Password**: SMTP account password
- **Encryption**: TLS / SSL / None
- **From Address**: Sender email
- **From Name**: Sender display name

**Test Email**
- **Action Button**: Send test notification
- **Recipient**: Your logged-in email

### Post-Processing Events

Configure email notifications for:
- Playlist sync completed
- EPG sync completed
- Backup created
- Errors and failures

---

## 🖥️ System Tab

### Application Features

**Show Breadcrumbs** (duplicate from Appearance)
- Shows breadcrumb navigation

**Allow Queue Manager Access**
- **Type**: Toggle
- **Description**: Enable access to Horizon queue manager at `/horizon`
- **Restriction**: Admin users only

### WebSocket

**Test WebSocket Connection**
- **Action**: Send test notification
- **Purpose**: Verify real-time notifications work
- **Expected**: Pop-up notification appears

### Links

**Queue Manager**
- **Button**: Opens `/horizon` in new tab
- **Requirement**: Must be enabled above

**API Docs**
- **Button**: Opens `/docs/api` in new tab
- **Access**: Admin only

---

## 🔧 Utility Buttons

### Reset Queue
- **Location**: Top right of Settings page
- **Function**: Restart Horizon and flush pending jobs
- **Confirmation**: Required
- **Warning**: Stops all active syncs!

**When to Use**:
- Queue appears stuck
- Jobs not processing
- After troubleshooting queue issues

### Clear Logo Cache
- **Location**: Top right of Settings page
- **Function**: Remove all cached channel logos
- **Confirmation**: Required

**When to Use**:
- Logos not updating
- Freeing disk space
- Testing logo changes

---

## 💡 Tips & Best Practices

### TMDB Integration
- Get free API key at [themoviedb.org](https://www.themoviedb.org/settings/api)
- Disable auto-lookup for large playlists (>1000 items)
- Use during off-peak hours for best results

### .strm File Sync
- Use absolute paths: `/media/Series` not `~/Series`
- Ensure path is accessible by media server (Plex/Jellyfin/Emby)
- Test with one series/VOD first
- Path structure: Series → Season is most common

### Backup Schedule
- Daily backups: `0 3 * * *`
- Keep 7 daily backups for one week of history
- Enable "Include Files" only if needed (increases size significantly)

### Email Notifications
- Use app-specific passwords for Gmail
- Test email configuration before relying on it
- Consider using log driver for testing
