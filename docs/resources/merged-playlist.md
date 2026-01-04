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

## Related Resources

- [Adding Playlists](playlists.md) - Setting up source playlists
- [Custom Playlist](custom-playlist.md) - Manual curation
- [Playlist Alias](playlist-alias.md) - Alternative configurations
- [Playlist Auth](playlist-auth.md) - Authentication
- [Auto-Merge Channels](../advanced/auto-merge-channels.md) - Advanced channel merging
