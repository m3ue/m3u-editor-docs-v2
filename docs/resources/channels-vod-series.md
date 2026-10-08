---
sidebar_position: 1
description: Organize what a playlist imports - enable groups, rename and renumber channels, add failovers, merge groups, and manage movies and series.
tags:
  - Getting Started
  - Playlists
  - Channels
title: Channels, VOD, and Series
---

# Channels, VOD, and Series

Once a playlist has synced, its content is split into three areas in the sidebar:

| Area | Holds | Organized by |
|---|---|---|
| **Live Channels** | Live TV channels | **Groups** |
| **VOD Channels** | Movies | **Groups**, plus TMDB **Dynamic Groups** |
| **Series** | TV series, with their seasons and episodes | **Categories**, plus TMDB **Dynamic Groups** |

Each list shows every playlist's content together. Use the **Playlist** filter to work on one.

Your changes are kept separately from what the provider sends, so syncing never undoes them. A renamed channel keeps its new name, and clearing the field brings back the provider's.

## Choose what's included

Only **enabled** items appear in your outputs, and new imports start disabled unless you've changed that in the playlist's [Auto-Enable Settings](playlists#processing).

The quickest way to build a lineup is by group. In **Live Channels → Groups**:

- **Enable group channels** or **Disable group channels** switches a whole group on or off.
- **Auto Enable New Channels** on a group enables channels the provider adds to it later.

VOD groups and series categories work the same way.

:::tip The Easy Editor
**Playlist → Easy Editor** puts it all on one screen: pick a playlist, switch between **Live** and **VOD**, and the groups are listed on the left with the selected group's channels on the right. Enable, edit, and sort both, and drag channels onto another group to move them.
:::

## Edit a channel

Open a channel to change it. Leave a field empty to keep the provider's value.

| Field | Use it to |
|---|---|
| **Title**, **Name** | Rename the channel. The title is what players show. |
| **Channel No.** | Set the channel number. |
| **Group** | Move it to another group. |
| **Logo Override** | Use a different logo. Upload logos under **Tools → Assets**. |
| **URL Override** | Play a different stream URL. |
| **EPG Channel** | Choose its guide data by hand. See [EPGs](epg-setup#map-guide-data-to-channels). |
| **Time Shift**, **EPG Shift** | Shift the stream (for catch-up providers) or the guide by a number of hours. |
| **Failover Channels** | Other channels to try, in order, when this one fails. Failover needs the [proxy](/docs/proxy/failover). |

The **Play** button on each row opens the in-app player, which is handy for checking a stream before your players see it.

To add a stream your provider doesn't have, choose **Create Custom Channel** on a Custom Playlist's **Channels** tab, or create one in **Live Channels → Channels** and assign it to a playlist.

## Change many at once

Select rows, then open **Bulk channel actions** (or **Bulk VOD actions**, **Bulk series actions**). The actions are grouped by what they change:

| Section | Includes |
|---|---|
| **Playlist & Groups** | **Add to Custom Playlist**, **Move to Group**, **Renumber Channels** |
| **Logo** | Choose channel or EPG logos, set a logo override, refresh cached logos |
| **EPG** | **Map EPG to selected**, **Undo EPG Map**, turn EPG mapping on or off, set an [AED profile](/docs/advanced/advanced-epg-dummies), **Set Timeshift**, **Set EPG shift** |
| **Find & Replace** | Rename with plain text or regex, and **Undo Find & Replace** |
| **Streaming** | **Set Stream Profile** for transcoding, turn merging on or off, **Add as failover** |
| **Probing** | Turn [stream probing](/docs/advanced/stream-probing) on or off, or **Probe Streams** now |
| **Enable / Disable** | **Enable selected**, **Disable selected** |

To make the same change after every sync, set it up in the playlist instead: **Find & Replace Rules**, **Auto Enable/Disable Rules**, and **Sort Alpha Configs** under its [Processing tab](playlists#processing).

## Groups and categories

Groups can be sorted (**Sort Alpha**), renumbered (**Renumber This Group**), given a transcoding profile (**Set Stream Profile**), or given an [AED profile](/docs/advanced/advanced-epg-dummies) for placeholder guide data.

A **merged group** combines several groups into one, for example three regional sports groups into "Sports". The channels stay in their own groups in M3U Editor, but players see them under the merged name. Choose **New Merged Group** on the Groups list, then **Manage Groups** on its row to pick the groups it combines. Series categories work the same way with **New Merged Category**. A merged group can only combine groups from one playlist.

## Movies and series

Movies and series need a little more setup than live channels, because their details (plot, cast, posters, and episode lists) are fetched separately.

| Action | What it does |
|---|---|
| **Fetch Provider Metadata** | Gets details and, for series, the episode list from your provider. Xtream players fetch these on demand when someone opens a series, but `.strm` files and series in the M3U output need them fetched first. |
| **Fetch TMDB Metadata** | Looks up TMDB IDs, ratings, and artwork. Needed for [media server sources](playlists#media-server-sources), [Dynamic Groups](/docs/integrations/tmdb_integration#dynamic-groups), and caching. See [TMDB Integration](/docs/integrations/tmdb_integration). |
| **Sync .strm files** | Writes [`.strm` files](/docs/advanced/strm-files) so a media server can add them to its library. |
| **Cache Now** | Downloads the file so it plays from your server. See [Cached Content](/docs/advanced/cached-content). |

Both fetches only include **enabled** items. To run them after every sync, turn on **Fetch metadata** under the playlist's **VOD Processing** and **Series Processing**.

Movies and series reach players through the Xtream API. To include them in the M3U file too, turn on **Include VOD in M3U output** and **Include series in M3U output** in the same sections.
