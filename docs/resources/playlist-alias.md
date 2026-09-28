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
- Swap provider credentials or send streams to a different provider URL
- Limit which groups and categories are exposed, directly or through reusable [Bouquets](#bouquets)
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

1. Navigate to **Playlist → Playlist Aliases** in the sidebar
2. Click **New Playlist Alias**
3. Choose the **Playlist type** and the source playlist
4. Configure alias settings:
   - **Name**: Descriptive name for this alias
   - **Enabled**: Toggle to activate/deactivate
   - **Priority**: Channel selection priority (higher = preferred)

Aliases live under **Playlist → Playlist Aliases**, which has two tabs: **Aliases** and **Bouquets**. An alias can point at a standard playlist, a [Custom Playlist](custom-playlist.md), or a [Merged Playlist](merged-playlist.md) (choose the **Playlist type** first).

## Provider Credentials and URL Replacement

The **Provider Credentials** section has one entry per provider URL used by the source playlist's streams. For each entry you can:

- **Swap credentials**: enter a different **Xtream API Username** and **Xtream API Password**, for example a second line from the same provider.
- **Replace the provider URL**: turn on **Replace provider URL** and enter a **Replacement URL**. Clients receive this URL instead of the provider URL; the rest of the stream URL is kept. This is useful for sending streams through a VPN-only address or a different provider host.
- **Both** at once.

When **Replace provider URL** is on, the credentials are optional. Leave them empty to keep the source playlist's credentials and only change the host.

:::note Proxy
When the stream proxy is enabled, the proxy fetches from the replacement URL, so it must be reachable from the proxy server.
:::

Turn on **Inherit DNS failover from source playlist** if the alias should follow the source playlist when it fails over to a backup URL, while keeping its own credentials. See [Xtream DNS Failover](xtream-dns-failover.md).

## Alias Credentials

Under **Auth (optional)** you can give the alias its own Xtream API username and password, and an optional expiration date and time. They must be unique across all aliases and [Playlist Auths](playlist-auth.md).

Usernames and passwords can't contain spaces, `/`, `\`, `?`, `#`, or `%`. Xtream clients put the credentials in every stream URL, so these characters would break playback.

## Channel Filter

The **Channel Filter (optional)** section limits which live groups, VOD groups, and series categories the alias exposes. Leave it empty to expose everything. The filter applies everywhere: M3U output, EPG, the Xtream API, and the guest panel.

For aliases of a **Merged Playlist**, selections are tracked per source playlist. Selecting "Sports" from one provider doesn't include another provider's "Sports" group. When more than one source is involved, the picker shows a **Source Playlist** column.

## Bouquets

Bouquets are named, reusable selections of a playlist's groups and categories that you can assign to many aliases, instead of picking the same groups on every alias.

### Creating a Bouquet

1. Go to **Playlist Aliases → Bouquets** and click **New**.
2. Give it a **Name** and choose the **Target Playlist** (a standard or custom playlist). The playlist can't be changed later.
3. Select the **Live channel groups**, **VOD groups**, and **Series categories** to include.
4. Optionally turn on **Automatically include new live groups** or **Automatically include new VOD groups** so new provider groups join the bouquet on each sync.

You can also add groups to a bouquet from the **Groups**, **VOD Groups**, and **Categories** pages with the **Add to Bouquet** row and bulk actions.

### Assigning Bouquets

In the alias's **Channel Filter** section, choose one or more **Assigned bouquets**. The alias then allows a channel if its group is in **any** assigned bouquet **or** in the manual selections. Assigning a bouquet never removes anything the manual pickers allow.

Bouquets are live: editing a bouquet updates every alias that uses it right away.

### Renames and Missing Groups

- When a provider renames a group, bouquet selections (and alias filters) are updated to the new name.
- If a group disappears from the provider, it stays in the bouquet and starts working again if the provider brings it back. The bouquet's edit page flags missing entries, and **Clean up missing** removes them.

:::note
Bouquets can't be assigned to Merged Playlist aliases yet. Use the per-source Channel Filter for those.
:::

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
- [Xtream DNS Failover](xtream-dns-failover.md) - Provider URL failover
- [Custom Playlist](custom-playlist.md) - Creating custom playlists
- [Merged Playlist](merged-playlist.md) - Merging multiple playlists
