---
sidebar_position: 6
description: Link duplicate channels across your playlists as failovers of each other, automatically after each sync or on demand.
tags:
  - Advanced
  - Channels
  - Auto-Merge
title: Auto-Merge Channels
---

# Auto-Merge Channels

Many providers list the same channel more than once, and if you have two providers, they share most channels. Merging links duplicates together: one becomes the **master** that players see, and the others become its [failovers](/docs/proxy/failover), tried in order when the master stops working.

Channels are matched by their stream ID: the ID the provider gives each channel, which you can override with a channel's **ID** field. The same channel from different playlists merges when they share an ID. Channels without an ID can be matched by name instead ([below](#channels-without-an-id)).

Failover needs the [proxy](/docs/proxy/overview), so merging is most useful on proxied playlists.

## Merge after every sync

Edit the playlist, open **Processing → Auto-Merge Processing**, and turn on **Enable auto-merge after sync**.

**Merge source configuration** decides where duplicates come from:

| Setting | What it does |
|---|---|
| **Preferred Playlist** | Masters come from this playlist when it has the channel. Leave empty to merge only within this playlist. |
| **Additional Failover Playlists** | Other playlists to take failovers from, in order. |

**Merge behavior** decides how:

| Setting | What it does |
|---|---|
| **Merge only new channels** | Only merge channels added by this sync. Turn off to re-check every channel each time. |
| **Deactivate failover channels** | Disable the channels that become failovers, so players only see one copy of each channel. They still work as failovers. |
| **Prefer catch-up as primary** | Pick a channel with catch-up as the master when there is one. |
| **Exclude disabled groups from master selection** | Channels in disabled groups can only be failovers. |
| **Scrubber-aware master selection** | Don't pick channels a [Channel Scrubber](channel-scrubbers) found dead as masters. |
| **Prioritize by resolution** | Pick the highest resolution as the master. This opens every stream to check it, which can get you rate limited or blocked by providers. |
| **Force complete re-merge** | Rebuild every failover link from scratch, including ones already set up. |
| **Regex merge patterns** | Group channels whose names match the same pattern, for channels named differently across providers. |
| **VOD Merge key** | Match movies by **Stream ID** (the default) or by **TMDB ID**, which merges the same movie across providers even when their IDs differ. |

To keep a channel out of merges, select it and use **Disable Merge** from the bulk actions, or turn off **Can merge** when editing it.

## Channels without an ID

**Fallback matching for channels without IDs** matches channels that have no usable stream ID by their name. Turn on **Enable name or alias fallback**, and pick a **Fallback match mode**:

- **Exact normalized name only:** names that match once tidied up (case, spacing, punctuation).
- **Alias rules only:** names you've listed as the same channel in **Fallback alias groups**. For example, a group labelled "BBC One" with the aliases `BBC One`, `BBC 1`, and `BBC1`.
- **Normalized name and alias rules:** both.

Quality labels like HD, FHD, and 4K are kept when names are tidied, so SD and HD versions of a channel aren't merged by accident.

## Choosing the master

**Advanced Priority Scoring** decides which duplicate becomes the master, and the order of the failovers:

| Setting | What it does |
|---|---|
| **Preferred Codec** | Prefer HEVC (smaller) or H.264 (plays on more devices). Needs [probed](stream-probing) streams. |
| **Priority Keywords** | Prefer channels with these words in their names, like `RAW` or `LOCAL`. |
| **Group Priority Weights** | Prefer channels from certain groups, weighted from 1 to 1000. |
| **Priority Order** | The order these factors are applied in: playlist priority, group priority, catch-up support, resolution, codec, and keyword match. |

## Merge on demand

To merge without waiting for a sync, use **Merge Same ID** from the **Actions** menu on **Live Channels → Channels** or **VOD Channels → Channels**, or on a single group. It has the same options. **Unmerge Same ID** removes the links again.

For series, **Merge Episodes** on the Series list links the same episode across playlists, by TMDB ID or by season and episode number.

The API can start a merge too: `POST /playlist/{uuid}/merge-channels`, with a token from **Tools → API Tokens**.

## Troubleshooting

| Problem | What to check |
|---|---|
| Nothing merges | The duplicates have the same stream ID. If they don't, use name fallback or regex patterns. |
| The wrong channel is the master | Set a **Preferred Playlist**, or adjust **Advanced Priority Scoring**. |
| Changes don't apply to channels merged before | Turn on **Force complete re-merge** for one sync, or run **Merge Same ID** with it on. |
| The provider started blocking you | Turn off **Prioritize by resolution**, which opens every stream. |
