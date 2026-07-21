---
sidebar_position: 3
description: Combine multiple playlists into a unified collection
tags:
  - Resources
  - Playlists
  - Advanced
title: Merged Playlists
---

# Merged Playlists

Merged Playlists automatically combine multiple source playlists into a single, unified playlist. This is ideal for aggregating content from multiple providers, creating comprehensive channel lineups, or maintaining automatic synchronization across sources.

## What is a Merged Playlist?

A Merged Playlist combines entire playlists automatically:
- All channels from multiple sources in one playlist
- Automatic deduplication of channels
- Priority-based source selection
- Automatic updates when source playlists sync
- Intelligent channel and series merging

Unlike custom playlists where you manually select content, merged playlists automatically include all content from the selected sources.

## Use Cases

### Multi-Provider Aggregation
Combine channels from multiple IPTV providers:
- Primary provider for most channels
- Secondary provider for backup/failover
- Specialty providers for niche content
- Free sources to supplement paid services

### Failover and Redundancy
Create reliable playlists with automatic failover:
- Multiple sources for the same channels
- Priority-based selection
- Automatic switching on stream failure
- Improved uptime and reliability

### Content Consolidation
Unify your content sources:
- One playlist for all your IPTV services
- Single EPG combining all sources
- Simplified client configuration
- Centralized management

### Testing and Comparison
Compare providers side-by-side:
- Test stream quality from different sources
- Compare EPG accuracy
- Evaluate reliability
- Make informed decisions about providers

## Creating a Merged Playlist

1. Navigate to **Merged Playlists** in the sidebar
2. Click **Create Merged Playlist**
3. Configure basic settings:
   - **Name**: Descriptive name
   - **Enabled**: Activate the playlist
4. Click **Save**
5. Add source playlists (next step)

## Adding Source Playlists

After creating the merged playlist:

1. Open your Merged Playlist
2. Go to the **Playlists** tab
3. Click **Add Playlists**
4. Select the playlists to merge
5. Configure priority for each source
6. Click **Save**

### Playlist Priority

Each source playlist in a merge can have a priority setting:
- Higher priority = preferred source for duplicates
- Used for automatic channel selection
- Configures failover order
- Default: 0

**Example**:
- Provider A (Premium): Priority 100
- Provider B (Backup): Priority 50
- Free Provider: Priority 10

## Merged EPG Detail View

The **Merged EPG** resource gives you a detailed view of how EPG data is being mapped across merged sources.

### Accessing the Detail View

1. Navigate to **Merged Playlists** → open a merged playlist
2. Go to the **EPG** tab
3. Click on any EPG entry to open the **detail slide-over**

The detail view shows:
- Matched EPG channel details (ID, name, logo)
- Source EPG provider
- Current programme (if live EPG data is available)
- Quality/mapping indicators
- Raw EPG metadata for debugging

This is useful for diagnosing missing or incorrect EPG data — you can see exactly which source the EPG entry came from and whether the channel ID matched correctly.

## Provider URL Output

By default, Merged Playlists use the editor's Xtream-formatted URLs in M3U output. You can change this per-playlist:

### Disable Xtream-Formatted URLs

Enable **Disable Xtream-formatted URLs** to output standard M3U URLs instead of Xtream API format. Useful for clients that don't support Xtream Codes URL patterns.

## DVR and Guest Requests

Merged Playlists are a first-class playlist type: they have their own **DVR** tab with the same recording rules, quotas, and settings as a standard playlist (see [DVR Integration](../integrations/dvr_integration.md)), and support guest content **Requests** the same way. This means you can schedule recordings or accept guest requests against the merged channel lineup directly, without needing DVR enabled on each individual source playlist.

## Related Resources

- [Adding Playlists](playlists.md) - Setting up source playlists
- [Custom Playlist](custom-playlist.md) - Manual curation
- [Playlist Alias](playlist-alias.md) - Alternative configurations
- [Playlist Auth](playlist-auth.md) - Authentication
- [Auto-Merge Channels](../advanced/auto-merge-channels.md) - Advanced channel merging
- [DVR Integration](../integrations/dvr_integration.md) - Scheduling recordings
