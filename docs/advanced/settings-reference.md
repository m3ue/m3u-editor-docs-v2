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


## 🌐 General Tab

### Layout & Display Options

#### Show Breadcrumbs
- **Type**: Toggle
- **Default**: Enabled
- **Description**: Show breadcrumb navigation under page titles

#### Show Queue Indicator
- **Type**: Toggle
- **Description**: Show the live queue status indicator in the top navigation bar

#### Output WAN Address in Menu
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Display server's public IP address in the menu (useful for remote access)

#### Suppress Success Notifications
- **Type**: Toggle
- **Default**: Disabled
- **Description**: When enabled, hides success toast notifications from background tasks (e.g. sync completed, probe finished). Error and warning notifications are always shown regardless.

#### Navigation Position
- **Options**: Left / Top
- **Default**: Left
- **Description**: Position of the main navigation sidebar

#### Max Width of Page Content
- **Options**: Medium / Large / XL / 2XL / Full
- **Default**: XL
- **Description**: Maximum content width for better readability on large screens

#### Application Timezone
- **Type**: Text input
- **Placeholder**: `UTC`
- **Description**: Override the application timezone. Leave empty to use the server default (UTC). Takes effect for all date/time output throughout the app. See [PHP timezone list](https://www.php.net/manual/en/timezones.php) for accepted values.
- **Note**: Can be locked by the `APP_TIMEZONE` environment variable

#### Date Format
- **Type**: Select (presets) + optional custom string
- **Default**: `Y-m-d H:i:s`
- **Options**: Default, Short, Long, Human Readable, 12-Hour AM/PM, Custom…
- **Description**: Format applied to dates throughout the application (e.g. next sync, last synced). Choose "Custom…" to enter any [PHP date format string](https://www.php.net/manual/en/datetime.format.php).

### Allowed Playlist Domains

**Allowed Domains**
- **Type**: Tag input
- **Placeholder**: `*.example.com*`
- **Description**: Restrict playlist URLs to specific domains. Supports wildcards (e.g. `*.example.com*`). Leave empty to allow all domains. Press `[tab]` or `[return]` to add each entry.
- **Note**: Can be locked by the `ALLOWED_PLAYLIST_DOMAINS` environment variable

### Xtream API Panel Settings

**HTTP Port**
- **Type**: Number
- **Description**: Returned as `server_info.http_port` in `player_api.php` responses. Leave empty to use `APP_PORT` (default).

**HTTPS Port**
- **Type**: Number
- **Placeholder**: `443`
- **Description**: Returned as `server_info.https_port` in `player_api.php` responses. Leave empty to use 443 (default).

**Xtream API Panel Message**
- **Type**: Textarea
- **Description**: Returned as `user_info.message` in `player_api.php` responses.



## 🔄 Proxy Tab

### URL & Connection

**Override URL**
- **Type**: URL input
- **Placeholder**: `http://192.168.0.123:36400`
- **Description**: Override the base URL used for proxied stream links. Useful for local network access or when you want LAN addresses for streaming but use a domain for the frontend. Leave empty to use the configured app URL.
- **Note**: Can be locked by the `PROXY_URL_OVERRIDE` environment variable

**Resolve Proxy Public URL Dynamically**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Automatically resolve the public-facing proxy URL using the incoming request host/scheme instead of `APP_URL` or the Override URL. Useful for multi-host access (VPN, Tailscale, etc.)

**Stop Oldest Stream When Limit Reached**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: When a playlist reaches its connection limit, automatically stop the oldest active stream to make room for the new request. Useful for single-connection providers where instant channel switching is desired.
- **Warning**: May cause issues with multiple clients — the newest request always wins

**Include Logos in Proxy URL Override**
- **Type**: Toggle
- **Description**: When using a URL override, also apply it to logo/image URLs. Useful when Plex requires HTTPS for logos but your stream override points to a local HTTP address.
- **Visibility**: Only shown when an Override URL is configured
- **Note**: Can be locked by the `PROXY_URL_OVERRIDE_INCLUDE_LOGOS` environment variable

### Failover & Recovery

**Resolver URL**
- **Type**: URL input
- **Description**: The LAN address of the editor that the proxy can reach. Used for advanced failover logic, webhook registration for pooled providers, and Network Broadcasting features.
- **Note**: Can be locked by the `M3U_RESOLVER_URL` environment variable

**Enable Advanced Failover Logic**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: When enabled, the proxy calls the editor to determine which failover URL to use based on available capacity. When disabled, the proxy loops through failover URLs without capacity checks.
- **Requires**: Resolver URL

#### Playlist Fail Conditions
*(visible when advanced failover is enabled)*

**Enable Playlist Fail Conditions**
- **Type**: Toggle
- **Description**: When playlists return specific HTTP status codes, temporarily mark them as invalid during failover resolution. This enables account-level failover by skipping all channels from a failing playlist/account.

**HTTP Status Codes**
- **Type**: Tag input
- **Placeholder**: `403, 404, 502, 503`
- **Description**: HTTP response codes that should mark a playlist as temporarily unavailable.

**Invalid Timeout (minutes)**
- **Type**: Number
- **Default**: 5
- **Description**: How long (in minutes) a playlist remains marked as invalid before being retried.

**Clear Failed Playlists**
- **Action Button**: Clears all playlists currently marked as invalid so they are immediately eligible for failover again.
- **Confirmation**: Required

### Silence Detection

**Enable Silence Detection**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Automatically trigger failover when a live stream's audio goes silent. Requires advanced failover to be set up. See [Silence Detection docs](https://m3ue.sparkison.dev/docs/proxy/silence-detection).

#### Silence Detection Settings
*(visible when silence detection is enabled)*

**Silence Threshold (dB)**
- **Default**: `-50 dB`
- **Description**: Audio level below which audio is considered silent. Raise to `-40 dB` for stricter detection.

**Silence Duration (seconds)**
- **Default**: `3`
- **Description**: Minimum continuous silence within a check window to count as a silent check.

**Check Interval (seconds)**
- **Default**: `10`
- **Description**: How often to run silence analysis. Each window buffers stream data and analyses it with FFmpeg.

**Consecutive Silent Checks Before Failover**
- **Default**: `3`
- **Description**: Number of consecutive silent checks required before triggering failover. Prevents failover on brief silent moments.

**Monitoring Grace Period (seconds)**
- **Default**: `15`
- **Description**: Delay after stream start before silence monitoring begins. Allows for initial buffering and audio decoder startup.

### In-App Player Transcoding

**Default Live Transcoding Profile**
- **Type**: Select (Stream Profiles)
- **Description**: Profile used for Live channels in the built-in player. A per-channel stream profile (if set) takes priority. Leave empty to disable transcoding.
- **Manage Profiles**: Link to Stream Profiles page

**VOD and Series Transcoding Profile**
- **Type**: Select (Stream Profiles)
- **Description**: Profile used for VOD and Series in the built-in player. A per-channel stream profile (if set) takes priority. Leave empty to disable transcoding.

**Max Concurrent Players**
- **Type**: Number
- **Default**: Unlimited (0 or empty)
- **Description**: Maximum number of in-app players that can be open simultaneously. Set to 0 or leave empty for unlimited.



## 📺 TV App Tab

### TV Notification Tester

Use the **Send Notification** action to dispatch a test TV notification to any playlist target and verify the TV app notification system is connected.

**Send Notification** modal fields:
- **Playlist type**: Playlist / Custom Playlist / Merged Playlist / Alias
- **Target**: Select the specific playlist to notify
- **Level**: Info / Success / Warning / Danger
- **Title**: Notification title
- **Message**: Optional body text
- **Channel**: Notification channel (category tag)
- **Admin only**: When enabled, only admin-scope TV sessions receive the notification

### Notification Channels

**Default Notification Channels**
- **Type**: Repeater
- **Description**: Define the notification channels available in the TV app. Users can subscribe to specific channels so they only receive relevant notifications. Channels not listed here are still usable — they appear automatically once a notification arrives on that channel.

Each channel entry:
- **Channel slug**: Lowercase letters, numbers, and underscores only (e.g. `dvr_recording_completed`)
- **Display label**: Optional — shown in the TV app instead of the raw slug



## 🔁 Sync Options Tab

### Provider Rate Limiting & Concurrency

**Enable Request Delay**
- **Type**: Toggle
- **Description**: When enabled, adds a delay between requests to the provider during playlist and EPG syncs and other stream processing tasks.

**Max Concurrent Requests**
- **Type**: Number
- **Default**: `2`
- **Description**: Maximum number of simultaneous requests allowed. Also controls parallelism for batch operations such as stream probing and channel scrubbing. Lower values (1–2) are safer but slower.

**Request Delay**
- **Type**: Number (ms)
- **Default**: `500 ms`
- **Range**: 100–10,000 ms
- **Description**: Minimum delay between provider requests, in milliseconds. Recommended: 500–2,000 ms.
- **Visibility**: Only shown when request delay is enabled

### Sync Invalidation

**Enable Sync Invalidation**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Prevent a sync from proceeding if it would remove more entries than the configured thresholds. Useful for protecting against provider outages or temporary data issues.

**Channel Removal Threshold**
- **Type**: Number
- **Placeholder**: `100`
- **Description**: Cancel the sync if it would remove more than this many channels.

**Series Removal Threshold**
- **Type**: Number
- **Placeholder**: `100`
- **Description**: Cancel the sync if it would remove more than this many series.

**Group/Category Removal Threshold**
- **Type**: Number
- **Placeholder**: `50`
- **Description**: Cancel the sync if it would remove more than this many groups or categories.

### Default Stream File Settings

**Default Series Stream File Setting**
- **Type**: Select
- **Description**: The global default Stream File Setting used for series `.strm` file generation. Settings can be overridden at the Category level or per-Series. Leave empty to disable `.strm` generation for series. Priority: Series > Category > Global.
- **Manage**: Link to Stream File Settings page

**Default VOD Stream File Setting**
- **Type**: Select
- **Description**: The global default Stream File Setting used for VOD `.strm` file generation. Settings can be overridden at the Group level or per-VOD channel. Leave empty to disable `.strm` generation for VOD. Priority: VOD > Group > Global.
- **Manage**: Link to Stream File Settings page



## 🖼️ Assets Tab

### Logo Cache

**Keep Cache Permanently (disable expiry cleanup)**
- **Type**: Toggle
- **Description**: When enabled, the scheduled expired-cache cleanup skips deletion. You can still refresh or clear the cache manually via the Actions menu.

**Enable Logo Repository Endpoint**
- **Type**: Toggle
- **Description**: When enabled, `/logo-repository` endpoints are publicly accessible for apps like UHF.

### Placeholder Images

Override app-wide placeholder images. Clearing any field reverts to the built-in default.

**Logo Placeholder**
- **Recommended size**: 300×300 px
- **Description**: Shown when a channel logo is missing.

**Episode Preview Placeholder**
- **Recommended size**: 600×400 px
- **Description**: Shown when an episode preview image is missing.

**VOD/Series Poster Placeholder**
- **Recommended size**: 600×900 px
- **Description**: Shown when a VOD or Series poster/cover image is missing.



## 💾 Backups Tab

### Automated Backups

**Enable Automatic Database Backups**
- **Type**: Toggle
- **Description**: Schedule automatic database backups

**Backup Schedule**
- **Type**: CRON expression
- **Examples**:
  - `0 3 * * *` — Daily at 3 AM
  - `0 */6 * * *` — Every 6 hours
  - `0 0 * * 0` — Weekly on Sunday
- **Helper**: Shows next scheduled run time

**Max Backups**
- **Type**: Number
- **Default**: Unlimited (0)
- **Description**: Automatically delete old backups when limit exceeded. Enter 0 for no limit.



## ✉️ SMTP Tab

### SMTP Settings

Configure SMTP to send emails from the application.

**SMTP Host**
- **Type**: Text
- **Description**: SMTP server address. Required to send emails.

**SMTP Port**
- **Type**: Number
- **Common values**: 587 (TLS), 465 (SSL)
- **Description**: Required to send emails.

**SMTP Username**
- **Type**: Text
- **Description**: Required if your provider requires authentication.

**SMTP Password**
- **Type**: Password (revealable)
- **Description**: Required if your provider requires authentication.

**SMTP Encryption**
- **Options**: TLS / SSL / None

**SMTP From Address**
- **Type**: Email
- **Description**: The "From" email address for outgoing emails. Defaults to `no-reply@m3u-editor.dev`.

**Send Test Email**
- **Action Button**: Enter a recipient address to send a test email using the current form settings.



## 🔑 API Tab

### API Settings

**Allow Access to API Docs**
- **Type**: Toggle
- **Description**: When enabled, the interactive API documentation is accessible at `/docs/api`. When disabled, the endpoint returns 403. The API itself responds regardless of this setting — you do not need to enable docs to use the API.

**Manage API Tokens**
- **Action Button**: Opens `/personal-access-tokens` to create and manage Sanctum API tokens.

**API Docs**
- **Action Button**: Opens `/docs/api` in a new tab (requires the toggle above to be enabled).



## 🔗 Integrations Tab

### TMDB Integration

**TMDB API Key**
- **Type**: Password (revealable)
- **Get Key**: [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
- **Description**: v3 API key for The Movie Database

**Search Language**
- **Type**: Select
- **Default**: English (US)
- **Description**: Preferred language for TMDB search results.

**Auto-lookup on Metadata Fetch**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: Automatically lookup TMDB IDs when fetching metadata for VOD and Series. May slow down imports for large playlists.

**Auto-create Groups/Categories from TMDB Genres**
- **Type**: Toggle
- **Default**: Disabled
- **Description**: When enabled, TMDB metadata fetching will automatically create new groups (VOD) and categories (Series) based on TMDB genres. When disabled, only existing groups/categories are used.

**Auto-lookup Scope**
*(visible when auto-lookup is enabled)*
- **Type**: Toggle buttons — Only Enabled / All New / Both
- **Default**: Only Enabled
- **Description**: Controls which entries are automatically looked up after each sync. "Only enabled" respects per-channel TMDB lookup settings. "All new" fetches TMDB data for every newly imported entry. "Both" does both.

**Rate Limit (requests/second)**
- **Type**: Number (1–50)
- **Default**: 40
- **Description**: Max TMDB API requests per second. TMDB allows ~40 req/s for free accounts.

**Match Confidence Threshold (%)**
- **Type**: Number (50–100)
- **Default**: 80
- **Description**: Minimum title similarity percentage required to accept a TMDB match. Higher values = stricter matching.

#### Title Cleaning for TMDB Lookup

Strip provider prefixes from titles before matching with TMDB to improve accuracy (e.g. removing `EN - `, `4K-EN - `, `NF - `).

**Strip Provider Prefixes from VOD Titles**
- **Type**: Toggle
- **Description**: Remove prefix patterns from VOD titles before searching TMDB.

**VOD Title Prefix Patterns**
- **Type**: Tag input
- **Placeholder**: `EN - `
- **Description**: Strings to strip from VOD titles before TMDB lookup.

**Strip Provider Prefixes from Series Titles**
- **Type**: Toggle
- **Description**: Remove prefix patterns from Series titles before searching TMDB.

**Series Title Prefix Patterns**
- **Type**: Tag input
- **Placeholder**: `EN - `
- **Description**: Strings to strip from Series titles before TMDB lookup.

### MediaFlow Proxy

Connect MediaFlow Proxy to route playlists, EPG, and Xtream API through it. Once configured, proxied URLs are auto-generated on each playlist's detail page.

**Proxy URL**
- **Type**: URL input
- **Placeholder**: `http://your-mediaflow-host:8888`
- **Description**: Base URL of your MediaFlow Proxy instance.

**Proxy Port (Alternative)**
- **Type**: Number
- **Description**: Alternative port if not specified in the URL (rarely used).

**API Password**
- **Type**: Password (revealable)
- **Description**: The `API_PASSWORD` configured on your MediaFlow Proxy instance.

**Use Proxy User Agent for Playlists (M3U8/MPD)**
- **Type**: Toggle
- **Description**: When enabled, the configured user agent is also used when fetching playlist files. Otherwise the default user agent is used for playlists.

**Proxy User Agent for Media Streams**
- **Type**: Text input
- **Placeholder**: `VLC/3.0.21 LibVLC/3.0.21`
- **Description**: Custom user agent sent with media stream requests through MediaFlow Proxy.

**Automatically Rewrite Stream URLs**
- **Type**: Toggle
- **Description**: When enabled, individual stream URLs in generated playlists and Xtream API responses are rewritten to route through MediaFlow Proxy. Applies only when m3u-proxy is not already in use for a given playlist or stream.



## ✨ AI Copilot Tab

### AI Copilot

**Enable AI Copilot**
- **Type**: Toggle
- **Description**: When enabled and configured, the AI Copilot assistant (✨) appears in the top navigation bar. Save and refresh the page after changing this setting for it to take effect.

**Enable AI Copilot Management**
- **Type**: Toggle
- **Description**: Enables audit log, custom rate limits, conversation history, and other management features.
- **Visibility**: Only shown when AI Copilot is enabled

### AI Provider

**Provider**
- **Type**: Select
- **Description**: The AI provider to use (e.g. Anthropic, OpenAI, Ollama).

**Model**
- **Type**: Text input
- **Description**: The model to use. Leave blank to use the provider default.

**API Key**
- **Type**: Password (revealable)
- **Description**: Your API key for the selected provider.
- **Visibility**: Hidden when using Ollama

**Base URL**
- **Type**: URL input
- **Description**: Override the default API base URL. Useful for self-hosted models or proxy endpoints. Leave blank to use the provider default.
- **Visibility**: Only shown for providers that support a custom URL

### System Prompt

**System Prompt**
- **Type**: Textarea
- **Description**: The system prompt sent to the AI on every conversation to configure its behaviour. Leave empty to use the built-in default.

### Global Tools

**Enabled Tools**
- **Type**: Checkbox list
- **Description**: Select which additional tools the AI assistant can use across all pages. Core tools (navigation, memory) are always available. Available tools include:
  - Search Documentation
  - EPG Mapper: Mapping State / Channel Matcher / Apply Mappings
  - Database: Get Schema / Execute Query
  - DVR: Overview / Schedule

### Quick Actions

**Quick Actions**
- **Type**: Repeater
- **Description**: Pre-defined prompts displayed as buttons in the Copilot chat window. Each entry has a **Label** (button text) and a **Prompt** (pre-filled message sent to the AI).



## 🔔 Alerts Tab

### Discord

**Enable Discord Alerts**
- **Type**: Toggle
- **Description**: When enabled, error-level log entries are forwarded to your Discord channel.

**Discord Webhook URL**
- **Type**: URL input
- **Placeholder**: `https://discord.com/api/webhooks/...`
- **Description**: Create an Incoming Webhook in your Discord server settings and paste the URL here.
- **Test**: Use the **Send test alert** header action to verify the connection.

### Slack

**Enable Slack Alerts**
- **Type**: Toggle
- **Description**: When enabled, error-level log entries are forwarded to your Slack channel.

**Slack Webhook URL**
- **Type**: URL input
- **Placeholder**: `https://hooks.slack.com/services/...`
- **Description**: Create a Slack App with an Incoming Webhook and paste the URL here. A setup guide (including a copy-paste app manifest) is shown in the Settings page when Slack alerts are enabled.
- **Test**: Use the **Send test alert** header action to verify the connection.

### Additional Notifications
*(visible when Discord or Slack alerts are enabled)*

**Notify on Queued Job Failures**
- **Type**: Toggle
- **Description**: Sends an alert whenever a queued job (import, sync, probe, etc.) fails permanently after all retry attempts.

**Notify on Playlist Import Failures**
- **Type**: Toggle
- **Description**: Sends an alert when a playlist sync fails entirely, e.g. all provider URLs were unreachable.



## 🔧 Actions Menu

The **Actions** dropdown (top right of the Settings page) provides the following utility operations:

### Test WebSocket
- **Function**: Send a test notification via WebSocket to verify real-time notifications are working
- **Expected**: A pop-up notification appears shortly after sending

### Clear Expired Logo Cache
- **Function**: Remove logo cache entries older than 30 days
- **Confirmation**: Required
- **Note**: If permanent cache is enabled, nothing will be removed

### Clear All Logo Cache
- **Function**: Remove all cached logo images regardless of age
- **Confirmation**: Required
- **Note**: Logos will be fetched again on the next request wherever logo proxy is enabled. If permanent cache is enabled, this still clears the cache.

### Reset Queue
- **Function**: Restart Horizon and flush all pending jobs
- **Confirmation**: Required
- **Warning**: Stops all active syncs and removes pending jobs

**When to use Reset Queue**:
- Queue appears stuck
- Jobs not processing
- After troubleshooting queue issues



## 💡 Tips & Best Practices

### TMDB Integration
- Get a free API key at [themoviedb.org](https://www.themoviedb.org/settings/api)
- Disable auto-lookup for large playlists (>1,000 items) to avoid slow imports
- Use Title Cleaning patterns to strip provider prefixes (e.g. `EN - `, `4K-`) before matching

### Stream File Settings (.strm)
- Stream File Settings are managed in **Playlists → Stream File Settings**
- Set a global default here in Sync Options; override at the Category/Group or per-channel level
- Use absolute paths in your Stream File Settings (e.g. `/media/Series`, not `~/Series`)
- Ensure paths are accessible by your media server (Plex/Jellyfin/Emby)

### Backup Schedule
- Daily backups: `0 3 * * *`
- Keep 7 backups for one week of history (`Max Backups = 7`)
- Run the backup CRON during off-peak hours

### SMTP / Email
- Use app-specific passwords for Gmail
- Test your configuration with the **Send Test Email** button before relying on it
- Port 587 with TLS is the most common modern configuration

### AI Copilot
- Save settings and refresh the page after enabling/disabling the Copilot
- Enable only the tools you actually need to keep the assistant focused
- Use Quick Actions for your most common queries
