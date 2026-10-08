---
sidebar_position: 0
description: Add your first M3U playlist to M3U Editor
tags:
  - Getting Started
  - Playlists
title: Playlists
---

# Playlists

Learn how to import and manage M3U playlists in M3U Editor.

## Supported Formats

M3U Editor supports multiple playlist sources:

- **M3U/M3U8 Files** - Standard M3U playlist files
- **M3U+ Format** - Extended M3U with additional metadata
- **Xtream Codes API** - Direct integration with Xtream providers
- **URLs** - Remote M3U playlists

## Adding Your First Playlist

### Via Xtream Codes API

1. Navigate to **Playlists** in the sidebar
2. Click **Add Playlist**
3. Select **Xtream Codes API**
4. Enter your credentials:
   - **Server URL**: Your provider's server URL
   - **Username**: Your Xtream username
   - **Password**: Your Xtream password
5. Click **Save & Sync**

### Via M3U URL

1. Navigate to **Playlists** in the sidebar
2. Click **Add Playlist**
3. Select **M3U URL**
4. Enter the playlist URL
5. (Optional) Configure authentication if required
6. Click **Save & Sync**

### Via File Upload

1. Navigate to **Playlists** in the sidebar
2. Click **Add Playlist**
3. Select **Upload File**
4. Choose your M3U file
5. Click **Save & Sync**

## Testing the Provider Connection

After entering your Xtream API credentials, you can verify they are valid before saving:

1. Fill in the **Server URL**, **Username**, and **Password** fields
2. Click the signal icon (📶) — **Test connection** — next to the URL field
3. A notification shows the result: connection status, active/max streams, and account expiry (when returned by the provider)

## Playlist Settings

After adding a playlist, you can configure various settings:

### General Settings

- **Playlist Name** - Custom name for easy identification
- **Auto Sync** - Automatically sync on schedule
- **Sync Interval** - How often to sync (hours)

### Channel Options

- **Import Active Channels Only** - Skip inactive channels
- **Auto-categorize** - Automatically organize by groups
- **Custom Prefix** - Add prefix to channel numbers

### Advanced Options

- **Auto-merge Channels** - Automatically merge duplicate channels
- **Deactivate Failovers** - Disable failover channels after merge
- **Prioritize by Resolution** - Use highest resolution as master

:::warning Resolution Checking
Enabling "Prioritize by Resolution" requires analyzing each stream, which can cause rate limiting with some IPTV providers. Use with caution.
:::

### Media Server Sources

*(v0.13.2+)* If the same movies and episodes also exist in one of your [media server integrations](../integrations/overview.md) (Emby, Jellyfin, Plex, or Local Media), the playlist can play those files instead of the provider's streams. Turn on **Prefer media server sources** under **Processing → Media Server Sources**.

- Items are matched by TMDB, TVDB, or IMDB ID, so the playlist needs TMDB IDs. Enable TMDB lookup or a metadata fetch on the playlist first (see [TMDB Integration](../integrations/tmdb_integration.md)).
- Matching runs when you turn the option on, after each playlist sync, and after each media server sync.
- When [caching](../advanced/cached-content.md) is enabled, the **Cached** column in the VOD and Episodes tables shows a server icon for matched items ("Available on your media server").
- Clients keep the same URLs. If the media server copy can't be reached, playback falls back to the provider stream.
- This option is not shown on playlists that are themselves created by a media server integration.

When this is on, [Cache Now and dynamic group caching](../advanced/cached-content.md#caching-through-radarr-or-sonarr) can also send titles to Radarr or Sonarr instead of downloading them from the provider.

## Easy Editor

**Playlist → Easy Editor** is a simpler, split-pane way to organize a playlist. Pick a playlist and switch between **Live** and **VOD**: groups are listed on the left and the selected group's channels on the right. You can edit, enable or disable, and sort groups and channels in one place, and drag channels onto another group to move them.

If you don't use every feature, you can also trim the sidebar down in **Settings → Navigation** (see the [Settings Reference](../advanced/settings-reference.md)).

## Sync Safeguards

### Zero-Out Sync Detection

If a sync would result in significantly fewer channels than the current count (or zero channels), M3U Editor warns you before proceeding. This protects against provider outages or bad responses that would otherwise wipe out your entire channel list.

When triggered, a confirmation dialog describes how many channels would be removed and asks whether to proceed or cancel the sync.

### Sync Invalidation

Sync invalidation cancels a sync that would remove too much content at once, which usually means the provider returned a partial or broken response. Turn it on in **Settings → Sync Options → Sync Invalidation & Retries** with **Enable sync invalidation**, then set the limits:

| Setting | Default | Cancels the sync when it would remove more than... |
|---|---|---|
| **Channel removal threshold** | `100` | this many channels |
| **Series removal threshold** | `100` | this many series |
| **Group/category removal threshold** | `50` | this many groups or categories |

The [`INVALIDATE_IMPORT`](../advanced/environment-variables.md#invalidate_import) environment variables still work. When set, they lock the matching fields on the settings page.

An invalidated sync is never retried early. It waits for the next scheduled sync. To be told when this happens, turn on **Notify on invalidated playlist syncs** in [Alerts](../advanced/alerts.md).

### Failed Sync Retries

*(v0.13.1+)* When a scheduled sync fails (for example, the provider timed out), the playlist can retry it on its own instead of waiting for the next scheduled run. In the playlist's **Scheduling** tab, with **Auto Sync** on:

- **Auto resync on failure**: on by default.
- **Max retry attempts**: how many retries to make before giving up until the next scheduled sync (default `3`, up to `10`).

Each retry waits for the **Failed sync retry cooldown** set in **Settings → Sync Options** (default 15 minutes, or [`FAILED_RETRY_COOLDOWN_MINUTES`](../advanced/environment-variables.md#failed_retry_cooldown_minutes)). The same cooldown applies to failed EPG syncs. Running **Sync Now** by hand resets the retry count.

### Sync Run History

M3U Editor tracks each sync run with a timestamp, status, and result summary. This history is available on the playlist detail page under the **Sync Runs** tab and is useful for diagnosing intermittent sync failures.

Each sync's log lists what was added and removed. *(v0.13.3+)* Logs also track added and removed **series**, and can be filtered by **Content Type** (Live, VOD, Series) and by change (added or removed channels, groups, or series).

## Managing Playlists

### Syncing Playlists

Keep your playlist up-to-date:

1. Navigate to your playlist
2. Click **Sync Now**
3. Monitor the progress in the notification area or on the [Jobs Monitor](../advanced/job-monitoring.md) page

### Editing Channels

After importing, you can edit individual channels:

1. Go to **Channels** for your playlist
2. Click on any channel to edit:
   - Channel name and number
   - Category/group
   - Logo URL
   - Enable/disable
   - Add failover streams

### Bulk Operations

Manage multiple channels at once:

1. Select channels using checkboxes
2. Choose a bulk action:
   - Change category
   - Enable/disable
   - Delete
   - Export
   - Assign stream profile
   - Bulk EPG shift (tvg-shift)

## Sorting VOD and Series

Besides the regular sort actions, VOD and series have date and rating sorts:

- **Sort by Date** (Series list header, category row and bulk actions, and the Edit Category page) has a **Sort By** option:
  - **Release Date** (default): by the series premiere date.
  - **Most Recent Activity**: by the most recently aired episode, so an older show with a new season this month sorts ahead of a newer show that ended months ago. Episodes dated in the future don't count, and series with no dates go to the bottom.
- **Sort Alpha Configs** on the playlist edit page runs sorts automatically after every sync. For the **VOD groups** and **Series categories** targets, **Sort By** can be **Release Date**, **Rating** (TMDB rating, highest first; unrated items always go to the bottom), or for series **Most Recent Activity**.

Rating and air-date data come from [TMDB enrichment](../integrations/tmdb_integration.md).

## Migrating to a New Provider

**Migrate Provider** (in the playlist's action menu) moves your channel setup from this playlist onto another playlist, for example when switching IPTV providers. It is a step-by-step flow you review before anything is changed:

1. **Configure**
   - **Replacement playlist**: the playlist whose channels should receive this lineup.
   - **Match passes (in order)**: how channels are matched. Options are unique shared TVG-ID / Stream ID, unique normalized channel name, and unique normalized channel title.
   - **Configuration to copy onto matched channels**: enabled state, group and order, sort order, channel number, TVG shift, name, title, and logo overrides, station ID, and more.
   - **Preserve EPG mappings** (on by default): re-point matched channels at the replacement provider's equivalent EPG channel where one exists, otherwise copy the existing mapping.
   - **Overwrite existing values**: keep this on for a lineup migration. When off, only empty fields on the replacement channels are filled.
   - **Disable channels that are not in this lineup**: turns off replacement channels with no match, for a strict curated lineup. Nothing is deleted.
   - **Update Custom Playlist membership**: points any Custom Playlist entries at the matched replacement channel.
2. **Preview**: review every match. You can change a match, include or exclude channels, and filter the list.
3. **Apply migration**: the migration runs in the background and you're notified when it's done.

## API: Update Playlist Source URL

You can update a playlist's source URL and credentials programmatically without going through the UI. This is useful for automated credential rotation or provider migrations.

```http
PATCH /playlist/{uuid}
Authorization: Bearer {api_token}
Content-Type: application/json
```

### M3U Playlist

```json
{
  "url": "https://new-provider.com/playlist.m3u8",
  "resync": true
}
```

### Xtream Playlist

```json
{
  "url": "https://new-provider.com:8080",
  "username": "new_username",
  "password": "new_password",
  "resync": true
}
```

Pass `resync: true` to immediately dispatch a sync job after updating. If omitted, the update is saved but no sync is triggered.

**Response**:
```json
{
  "success": true,
  "message": "Playlist updated successfully",
  "data": {
    "uuid": "abc-123-def",
    "name": "My Provider",
    "url": "https://new-provider.com:8080",
    "resync_dispatched": true
  }
}
```

:::note
This endpoint requires `auth:sanctum` authentication. Create a token under **Tools → Personal Access Tokens**. Use `GET /user/playlists` to look up playlist UUIDs. The full list of endpoints is in the in-app API docs (**Settings → API**).
:::

## Output URL Options

### Use Provider URLs Directly in M3U

When enabled, the M3U output for this playlist will contain raw upstream provider URLs instead of the editor's proxied/Xtream-formatted URLs. This bypasses the proxy layer entirely for clients consuming this playlist.

**Use case**: Clients that connect directly to the provider, or when you want to exclude a playlist from proxy routing.

### Disable Xtream-Formatted URLs in M3U

By default, all stream URLs use Xtream API format for stream analysis and limit checking. Enabling this option outputs standard M3U URLs instead — useful for clients that don't support Xtream Codes URL patterns.

This setting is also available on [Custom Playlists](custom-playlist.md) and [Merged Playlists](merged-playlist.md).

### Enabled Output Types

Each playlist can turn its outputs on or off individually under **Output → Playlist Output → Enabled output types**:

- **HDHR** (HDHomeRun emulation)
- **M3U**
- **Xtream API**
- **XMLTV (EPG)**

A disabled output returns an "Output disabled" error instead of content. All four are on by default. The same options exist on Custom Playlists, Merged Playlists, and Playlist Aliases.

### Sort by Channel Number

*(v0.13.1+)* By default, channels are output grouped by group, in your group order. Turn on **Sort by channel number** under **Output → Playlist Output** to output one flat list ordered by channel number instead. Channels without a number come last, in the standard group order. The same option exists on Custom Playlists and Merged Playlists.

### Cache

When [Cached Content Downloads](../advanced/cached-content.md) are enabled, the **Cache** section lets you share this playlist's cached files with your other playlists and override the retention mode.

## Next Steps

- [EPG Setup](/docs/resources/epg-setup) - Add program guide data
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel deduplication
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
