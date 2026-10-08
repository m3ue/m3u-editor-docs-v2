---
sidebar_position: 4
description: Serve several playlists as one, choosing whether each source adds its live channels, movies, series, or all three.
tags:
  - Resources
  - Playlists
title: Merged Playlists
---

# Merged Playlists

A Merged Playlist serves several playlists as one. Your players get a single login and URL with everything from the sources you pick, for example your main provider plus a movies-only provider.

It always reflects its sources: whatever is enabled in a source playlist appears in the Merged Playlist, and updates as the source syncs. To hand-pick content instead, use a [Custom Playlist](custom-playlist).

:::note Duplicates aren't combined
A channel that two sources both carry appears twice. To link duplicates as failovers of each other, use [Auto-Merge Channels](/docs/advanced/auto-merge-channels) on the source playlists.
:::

## Create one

1. Go to **Playlist → Merged Playlists** and choose **New merged playlist**. Give it a name and save.
2. Open it and, on the **Playlists** tab, attach the source playlists.

## Choose what each source adds

Each source has its own **Include Live Channels**, **Include VOD**, and **Include Series** switches. All three are on by default. Set them when you attach a playlist, or later with the **Content Types** action on its row.

For example, attach a movies-only provider with only **Include VOD** on, while your main provider keeps all three.

The **Playlists** tab counts what each source contributes. A content type you've turned off shows `0` and "Excluded from merge".

## Settings

| Tab | What's in it |
|---|---|
| **General** | Name, user agent, short URLs, and the unique identifier used in its URLs |
| **Auth** | [Playlist Auths](playlist-auth) and the [default login](playlist-auth#default-login) |
| **Output** | Output types, numbering, placeholder guides, the proxy, connection limits, and transcoding. See [Playlists](playlists#output). |
| **DVR**, **Requests**, **AIOStreams** | The [DVR](/docs/integrations/dvr_integration), [content requests](/docs/integrations/arrs_integration), and [AIOStreams](/docs/integrations/aiostreams_integration), for the merged lineup as a whole |

For guide data, map an EPG to each source playlist as usual. The Merged Playlist's guide includes them all.

To limit what a Merged Playlist exposes to someone, create an [Alias](playlist-alias) of it. Its channel filter tracks groups per source, so one provider's "Sports" group doesn't bring in another's.
