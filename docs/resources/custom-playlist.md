---
sidebar_position: 1
description: Create custom playlists with hand-picked channels and content
tags:
  - Resources
  - Playlists
  - Customization
title: Custom Playlists
---

# Custom Playlists

Custom Playlists allow you to create curated collections of channels, series, and VOD content hand-picked from your existing playlists. This is perfect for creating themed playlists, family-friendly collections, or personalized channel lineups.

## What is a Custom Playlist?

A Custom Playlist is a manually curated collection where you select exactly which content to include:
- Choose specific live TV channels
- Select individual series
- Pick VOD movies and shows
- Organize content your way

Unlike merged playlists that combine entire playlists, custom playlists give you granular control over every item.

## Use Cases

### Curated Collections
- **Kids Playlist**: Family-friendly channels and content only
- **Sports Package**: All sports channels from multiple sources
- **Premium Movies**: Hand-picked VOD content
- **News & Documentary**: Curated news and educational content

### Client-Specific Playlists
- Different playlists for different rooms/devices
- Subscription tier-based content access
- Language-specific collections
- Regional content groupings

### Testing and Organization
- Test channels before adding to main playlist
- Organize channels by category or preference
- Create backup playlists with alternative sources

## Creating a Custom Playlist

1. Navigate to **Custom Playlists** in the sidebar
2. Click **Create Custom Playlist**
3. Configure basic settings:
   - **Name**: Descriptive name for the playlist
   - **Enabled**: Activate the playlist
4. Click **Save**

## Duplicating a Custom Playlist

To quickly create a copy of an existing custom playlist with all its settings:

1. Find the playlist in the **Custom Playlists** list
2. Click the actions menu (three dots)
3. Select **Duplicate**

The duplicate is created with all settings and channel selections copied over. It is independent of the original — changes to one do not affect the other.

## Adding Content

After creating a custom playlist, add content from your existing playlists:

### Adding Channels

1. Open your Custom Playlist
2. Go to the **Channels** tab
3. Click **Add Channels**
4. Select channels from your existing playlists
5. Click **Add Selected**

You can add:
- Live TV channels
- VOD channels (movies)
- Both enabled and disabled channels

### Adding Series

1. Open your Custom Playlist
2. Go to the **Series** tab
3. Click **Add Series**
4. Select series from your existing playlists
5. Click **Add Selected**

### Channel Filtering

Use the search and filter options to find specific content:
- Search by channel name
- Filter by category/group
- Filter by source playlist
- Show only enabled channels

## VOD and Series Output

Custom Playlists can include VOD and series content in their M3U and Xtream API output, not just live channels. Enable this under the playlist's **Output** settings to allow clients to browse and play VOD/series content from the custom playlist.

## Auto-Sync Source Groups

When the source playlist syncs new channels, those channels can be automatically added to your custom playlists that include channels from the same source. Enable **Auto-sync source groups** in the playlist's sync settings to have new channels from tracked groups added automatically after each sync.

## Custom Sort

Control the order channels appear within your custom playlist independently of the source playlist.

### Sort Options

- **Custom sort column**: Manually drag channels into your preferred order
- **Sort alphabetically**: Automatically sort all channels A→Z by name

To reorder manually:
1. Open the **Channels** tab
2. Use the drag handle on each row to reorder
3. Save

To sort alphabetically:
1. Click the **Sort Alpha** action in the table actions menu
2. The channels are reordered immediately

## Post-Processing

Post-processing actions run automatically after each sync that adds or updates channels in the custom playlist. This keeps the playlist tidy without manual intervention.

### Configuring Post-Processing

1. Open the Custom Playlist → **Edit**
2. Go to the **Processing** tab
3. Click **Add processing action**
4. Configure each action:

| Field | Description |
|---|---|
| **Enabled** | Toggle the action on or off without removing it |
| **Action** | What to do: `Sort Alpha` or `Recount Channels` |
| **Target** | Which channels to apply to: `All`, `Live`, or `VOD` |
| **Groups** | Limit to specific groups, or `All groups` |

5. Drag actions to set their execution order — actions run top to bottom
6. Save

### Available Actions

| Action | Description |
|---|---|
| **Sort Alpha** | Sorts channels alphabetically within the target group/type |
| **Recount Channels** | Reassigns sequential channel numbers starting from 1 |

### Example: Sort live channels after every sync

| Setting | Value |
|---|---|
| Action | Sort Alpha |
| Target | Live Channels |
| Groups | All groups |

This ensures live channels are always in alphabetical order after a sync adds new entries.

## Provider URL Output

By default, Custom Playlists use the editor's Xtream-formatted URLs in M3U output. Two options let you change this behaviour:

### Use Provider URLs Directly

Enable **Use provider URLs directly** to include the raw upstream provider URLs in the M3U output instead of proxied/editor URLs. This bypasses the proxy layer entirely for this playlist.

**Use case**: Clients that need direct provider access for better performance, or when proxy is not needed for certain users.

### Disable Xtream-Formatted URLs

Enable **Disable Xtream-formatted URLs** to output standard M3U URLs instead of Xtream API format. This is useful for clients that don't support Xtream Codes URL patterns.

## Related Resources

- [Adding Playlists](playlists.md) - Source playlist setup
- [Merged Playlist](merged-playlist.md) - Combining entire playlists
- [Playlist Alias](playlist-alias.md) - Alternative configurations
- [Playlist Auth](playlist-auth.md) - Authentication setup
- [Auto-Merge Channels](../advanced/auto-merge-channels.md) - Automatic channel merging
