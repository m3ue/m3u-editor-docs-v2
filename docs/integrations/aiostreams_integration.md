---
sidebar_position: 11
description: Browse and play on-demand movies and series from Real-Debrid, TorBox, and other debrid services through AIOStreams.
title: AIOStreams
tags:
  - Integrations
  - AIOStreams
  - Debrid
---

# AIOStreams

[AIOStreams](https://github.com/viren070/aiostreams) is a self-hosted Stremio add-on that finds streams for movies and series on debrid services like Real-Debrid, TorBox, and AllDebrid. Connect it to M3U Editor and its catalogs (Popular, Trending, Netflix, and whatever else you've set up) can be browsed and played in [M3U TV](/docs/m3u-tv/overview) and the [guest portal](/docs/resources/playlist-auth#guest-portal).

Unlike a media server, nothing is imported up front. Catalogs are browsed on demand, and a stream is found when someone presses play. Titles you want to keep can be added to your library, so they play in any player.

## Connect it

You need a running AIOStreams instance and its **manifest URL**: the full address ending in `/manifest.json`, shown on the AIOStreams dashboard. It has your login built in, so treat it like a password.

1. Go to **Integrations → Media Servers**, choose **Add Media Server**, and set **Server Type** to **AIOStreams**.
2. Paste the **Manifest URL**, and choose **Test Connection & Fetch Catalogs**.
3. Under **Available Catalogs**, keep **Enable All Catalogs** on to expose every catalog, now and in the future, or turn it off and pick them.
4. Save.

**Enrich metadata with TMDB** (on by default) adds full cast lists, title logos, and season details from [TMDB](tmdb_integration), so detail pages match the rest of your library. The **Schedule** tab sets how often the manifest is checked for new catalogs; **Sync Now** checks it straight away.

## Give people access

AIOStreams is reached through a playlist:

1. In the playlist's **AIOStreams** tab, choose the **AIOStreams Integration** to expose.
2. For people with a [Playlist Auth](/docs/resources/playlist-auth), also turn on **AIOStreams Access** on their login.

In M3U TV, they get an **AIOStreams** section with the catalogs, search, detail pages, a stream picker to choose quality and source, and Continue Watching.

To browse as an admin, choose **Browse Catalog** on the integration.

## Add titles to your library

From a movie or series page in **Browse Catalog**, **Add to Library** (or **Add Series to Library**) saves it to the integration's own playlist. It then appears with your other movies and series, in every player, not just M3U TV.

In the background, M3U Editor finds streams for it and keeps the best few as a failover chain (3 by default, set by **Max Failover Candidates** in **Settings → Integrations → AIOStreams**). If one stops working, playback moves to the next.

<details>
<summary>Resolution statuses, rescans, and unaired episodes</summary>

Added movies and episodes show an **AIO Resolution Status** on the integration's AIOStreams tables:

| Status | Means |
|---|---|
| `pending` | Just added; streams haven't been looked up yet. |
| `partial` | Playable, with fewer failover streams than the target. |
| `resolved` | Playable, with a full failover chain. |
| `failed` | No streams were found. |
| `scheduled` | An episode that hasn't aired yet. It's added disabled, and enabled once it airs and a stream is found. |

An hourly sweep retries `failed` items and due `scheduled` episodes. It never re-checks `partial` or `resolved` items, since some debrid services ban accounts that keep re-checking working links. To check those again, use **Rescan** on one item or a selection. Rescanning a series checks every aired episode.

You get one summary notification each time streams are looked up, for example "8 episodes fetched, 4 resolved, 2 failed".

Added titles manage their own failover, so stream probing, merging, and failover channels are always off for them.

</details>

## Troubleshooting

| Problem | What to check |
|---|---|
| No catalogs are found | The manifest URL ends in `/manifest.json` and loads in a browser. If you added catalogs in AIOStreams recently, check they were saved there. |
| A catalog browses but finds no streams | M3U Editor only asks this one AIOStreams instance for streams. Make sure it's set up to find streams for that catalog's content, not just list it. |
| Streams don't load | Your debrid account is active, and AIOStreams itself returns streams for the title. |
| An added title is stuck on `failed` or `pending` | Use **Rescan**, or wait for the hourly sweep. |
