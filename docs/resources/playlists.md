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

## API: Update Playlist Source URL

You can update a playlist's source URL and credentials programmatically without going through the UI. This is useful for automated credential rotation or provider migrations.

```http
PATCH /api/playlist/{uuid}
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
This endpoint requires `auth:sanctum` authentication. Generate an API token under your account settings.
:::

## Output URL Options

### Use Provider URLs Directly in M3U

When enabled, the M3U output for this playlist will contain raw upstream provider URLs instead of the editor's proxied/Xtream-formatted URLs. This bypasses the proxy layer entirely for clients consuming this playlist.

**Use case**: Clients that connect directly to the provider, or when you want to exclude a playlist from proxy routing.

### Disable Xtream-Formatted URLs in M3U

By default, all stream URLs use Xtream API format for stream analysis and limit checking. Enabling this option outputs standard M3U URLs instead — useful for clients that don't support Xtream Codes URL patterns.

This setting is also available on [Custom Playlists](custom-playlist.md) and [Merged Playlists](merged-playlist.md).

## Next Steps

- [EPG Setup](/docs/resources/epg-setup) - Add program guide data
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel deduplication
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
