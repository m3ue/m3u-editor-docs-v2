---
sidebar_position: 6
description: Link duplicate channels and series across your playlists as failovers of each other, automatically after each sync or on demand.
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

Edit the playlist, open **Processing → Auto-Merge Processing**, and under **What to merge** turn on each type you want merged:

| Toggle | What it merges |
|---|---|
| **Live channels** | Live channels with the same stream ID. |
| **VOD channels** | Movies, matched by the **VOD Merge key** under **VOD matching**: **Stream ID** (the default) or **TMDB ID**, which merges the same movie across providers even when their IDs differ. |
| **Series** | Series and their episodes ([below](#series)). |

Each toggle works on its own.

**Merge sources** decides where duplicates come from, for every type:

| Setting | What it does |
|---|---|
| **Preferred Playlist** | Masters come from this playlist when it has the channel, movie, or series. Leave empty to prefer this playlist. |
| **Additional Failover Playlists** | Other playlists to take failovers from, in order. Leave empty to merge only duplicates within this playlist. |

**Live and VOD merge behavior** decides how channels and movies merge:

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

## Series

Turn on **Series** under **What to merge**. Series use the same **Merge sources** as channels. The Live and VOD behavior options don't apply to series.

Series are matched first, then their episodes:

- **Series** match by TMDB ID, or by TVDB ID when there's no TMDB ID. A series without either never matches. TMDB auto-lookup only covers enabled series by default, so for a backup playlist whose series are disabled, set **Auto-lookup scope** to **All new** or **Both** in the [TMDB settings](/docs/integrations/tmdb_integration), or run **Fetch TMDB Metadata** on it. You can also [link series by hand](#link-series-by-hand).
- **Episodes** of a matched series pair up by their own TMDB ID when both have one, which handles providers that number episodes differently. Otherwise they pair up by season and episode number. Episodes whose number appears twice in a series are skipped, so the wrong episode never plays.

Each sync links newly added episodes, so failover keeps up with ongoing shows.

A playlist can be the master in its own merge and a failover in another playlist's merge at the same time. For example, a stable provider can keep its own series enabled while a less reliable playlist uses it as a backup.

A series used only as a failover doesn't need to be enabled. Its episodes are still fetched during the backup playlist's sync, as long as **Fetch metadata** is on under **Processing → Series Processing** for that playlist.

Episodes added since the last merge are linked the first time they're played through the proxy. If a backup series has no episodes yet, playing an episode queues a fetch for it, so the next attempt can fail over.

### Link series by hand

To link series that don't share an ID, or to change the order, edit the series and open **Failover Series**. Add the same series from other playlists in the order to try them. Their episodes are linked as soon as you save, and removing a series removes its episode links. Turn on the **Failovers** column on the Series list to see which series have failovers.

Each merge (**Merge Series** or after a sync) resets the links between series it matches by ID, including their order. Links you add between series with different IDs are kept.

## Merge on demand

To merge without waiting for a sync, use **Merge Same ID** from the **Actions** menu on **Live Channels → Channels** or **VOD Channels → Channels**, or on a single group. It has the same options. **Unmerge Same ID** removes the links again.

For series, use **Merge Series** on the Series list. It matches series and episodes the same way as [above](#series). **Unmerge Series** removes the links.

The API can start a merge too: `POST /playlist/{uuid}/merge-channels`, with a token from **Tools → API Tokens**.

## Troubleshooting

| Problem | What to check |
|---|---|
| Nothing merges | The duplicates have the same stream ID. If they don't, use name fallback or regex patterns. |
| The wrong channel is the master | Set a **Preferred Playlist**, or adjust **Advanced Priority Scoring**. |
| Changes don't apply to channels merged before | Turn on **Force complete re-merge** for one sync, or run **Merge Same ID** with it on. |
| The provider started blocking you | Turn off **Prioritize by resolution**, which opens every stream. |
| A series doesn't merge | Both copies need the same TMDB or TVDB ID. Disabled series only get IDs when **Auto-lookup scope** includes new items, or after **Fetch TMDB Metadata**. Or link them by hand under **Failover Series**. |
| A backup series has no episodes to fail over to | Turn on **Fetch metadata** under **Series Processing** for the backup playlist, and let it sync once. |
