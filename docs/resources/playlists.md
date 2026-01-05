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

## Managing Playlists

### Syncing Playlists

Keep your playlist up-to-date:

1. Navigate to your playlist
2. Click **Sync Now**
3. Monitor the progress in the notification area

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

## Next Steps

- [EPG Setup](/docs/resources/epg-setup) - Add program guide data
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel deduplication
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
