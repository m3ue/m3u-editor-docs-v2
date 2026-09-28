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

## Easy Editor

**Playlist → Easy Editor** is a simpler, split-pane way to organize a playlist. Pick a playlist and switch between **Live** and **VOD**: groups are listed on the left and the selected group's channels on the right. You can edit, enable or disable, and sort groups and channels in one place, and drag channels onto another group to move them.

If you don't use every feature, you can also trim the sidebar down in **Settings → Navigation** (see the [Settings Reference](../advanced/settings-reference.md)).

## Sync Safeguards

### Zero-Out Sync Detection

If a sync would result in significantly fewer channels than the current count (or zero channels), M3U Editor warns you before proceeding. This protects against provider outages or bad responses that would otherwise wipe out your entire channel list.

When triggered, a confirmation dialog describes how many channels would be removed and asks whether to proceed or cancel the sync.

### Sync Invalidation Threshold

The `INVALIDATE_IMPORT` environment variable enables an automatic cancel if the incoming sync result falls too far below the current channel count. See [Environment Variables](../advanced/environment-variables.md#invalidate_import) for configuration details.

The threshold now applies to **groups/categories** and **series** in addition to live channels — not just the channel count.

### Sync Run History

M3U Editor tracks each sync run with a timestamp, status, and result summary. This history is available on the playlist detail page under the **Sync Runs** tab and is useful for diagnosing intermittent sync failures.

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

### Cache

When [Cached Content Downloads](../advanced/cached-content.md) are enabled, the **Cache** section lets you share this playlist's cached files with your other playlists and override the retention mode.

## Next Steps

- [EPG Setup](/docs/resources/epg-setup) - Add program guide data
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel deduplication
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
