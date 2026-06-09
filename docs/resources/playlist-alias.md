---
sidebar_position: 5
description: Understanding and using Playlist Aliases in M3U Editor
tags:
  - Resources
  - Playlists
  - Advanced
title: Playlist Alias
---

# Playlist Alias

Playlist Aliases allow you to create alternate versions of existing playlists with different settings, authentication, or proxy configurations. This is useful when you need to serve the same playlist content to different clients with varying requirements.

## What is a Playlist Alias?

A Playlist Alias is a reference to an existing playlist that allows you to:
- Apply different stream profiles for transcoding
- Use separate authentication credentials
- Configure custom proxy settings
- Set different priorities for channel selection
- Apply custom headers
- Enable/disable specific features per alias

Think of it as a "view" of your original playlist with customized settings.

## Use Cases

### Multiple Client Configurations
Serve the same playlist to different IPTV clients with optimized settings for each:
- High-quality streams for local network clients
- Transcoded streams for remote/mobile clients
- Different authentication per device

### Testing and Development
Create test aliases without affecting production playlists:
- Test new stream profiles
- Experiment with proxy configurations
- Validate channel priorities

### Multi-User Environments
Provide the same content with user-specific access:
- Individual authentication per user
- Custom stream quality per subscription tier
- Separate tracking and analytics

## Creating a Playlist Alias

1. Navigate to **Playlists** in the sidebar
2. Find the playlist you want to alias
3. Click the actions menu (three dots)
4. Select **Create Alias**
5. Configure alias settings:
   - **Name**: Descriptive name for this alias
   - **Enabled**: Toggle to activate/deactivate
   - **Priority**: Channel selection priority (higher = preferred)

## Duplicating a Playlist Alias

To quickly create a copy of an existing alias with all its settings intact:

1. Find the alias in the **Playlist Aliases** list
2. Click the actions menu (three dots)
3. Select **Duplicate**

The duplicate is created immediately with all settings copied over. Credentials (username/password) are not duplicated — you will need to set new ones to avoid conflicts.

## Filter Aliases by Category

When you have many aliases, use the **Filter by Category** option to narrow the list:

1. Open the Playlist Aliases list
2. Use the **Category** filter in the table header
3. The list updates to show only aliases matching the selected category

## Testing the Provider Connection

Before assigning an alias to clients, verify the upstream provider credentials are working:

1. Open the alias edit form
2. Fill in the **Xtream API URL**, **Username**, and **Password**
3. Click the signal icon (📶) next to the URL field — **Test connection**
4. A notification shows the connection result, including active connections and expiry information (if the provider returns them)

This is useful after rotating credentials or when diagnosing stream failures.

## Custom Live Group Sort Order

Each alias can have its own channel group sort order independent of the source playlist. This is useful for serving clients that expect a specific channel lineup order.

1. Open the alias edit form
2. Go to the **Group Sort** tab (or section)
3. Drag groups into your preferred order
4. Save

The custom sort applies only to live channel groups for this alias. VOD and series group ordering follows the source playlist.

## Alias Fallback Merge (Name-Based Channel Matching)

When channels from the source playlist do not have a usable stream ID, the auto-merge step normally cannot link them to failover sources. **Alias fallback merge** extends matching to channel names as a last resort.

### Enabling Fallback Matching

In the playlist's **Auto-Merge** settings (not on the alias itself):

1. Open the source **Playlist** → **Edit**
2. Go to the **Merging** tab and enable **Auto-merge channels**
3. Enable **Enable name or alias fallback**
4. Choose a **Fallback match mode**:

| Mode | Behaviour |
|---|---|
| **Exact normalized name only** | Merges channels whose normalized names are identical |
| **Alias rules only** | Merges channels based on explicit alias groups you define |
| **Normalized name and alias rules** | Both methods are attempted |

:::caution Quality label preservation
Quality labels (HD, FHD, UHD, 4K) are intentionally preserved during name normalization. This prevents SD and HD variants of the same channel from being incorrectly merged together.
:::

### Fallback Alias Groups

When using **alias rules**, define named groups of channel name variants that should be treated as the same channel:

1. Click **Add alias group**
2. Enter a **Group label** (internal reference, e.g. `"BBC One variants"`)
3. Add the channel name **Aliases** (e.g. `BBC One`, `BBC 1`, `BBC1`, `BBC One HD`)
4. Add more groups as needed

Duplicate aliases across groups are ignored to avoid unintended channel bridging.

## Related Resources

- [Adding Playlists](playlists.md) - How to add source playlists
- [Playlist Auth](playlist-auth.md) - Authentication configuration
- [Custom Playlist](custom-playlist.md) - Creating custom playlists
- [Merged Playlist](merged-playlist.md) - Merging multiple playlists
