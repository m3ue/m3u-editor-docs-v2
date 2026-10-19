---
slug: m3u-editor-0-12-dvr-arrives
title: "M3U Editor 0.12: DVR arrives"
description: The 0.12 series adds a full DVR with series rules and commercial detection, Sonarr and Radarr requests, AIOStreams, device pairing, HDHomeRun tuners, Emby library publishing, and TMDB Dynamic Groups.
authors: [sparkison]
tags: [release, editor, tv]
---

The 0.12 series is the biggest in M3U Editor's history. Its first release on August 4 brought a built-in DVR, requests through Sonarr and Radarr, and AIOStreams, and the thirteen releases after it kept going until late September.

<!-- truncate -->

## Record live TV

The **DVR** records from your playlists' guide data. Record one airing, every episode of a show, or a fixed time slot on a channel:

- **Series rules** match a show by its title, skip episodes you already have, and keep only the last few if you want. *(0.12.57)* **Upcoming Airings** shows exactly what a rule will record before it does, and why it skips what it skips.
- **Commercial detection** with Comskip marks the ad breaks, and players like M3U TV skip them.
- **Metadata and NFO files** give recordings artwork and episode details, ready for Kodi, Jellyfin, and Plex.
- **Recordings play like any other movie or episode**, in your players and from the DVR pages, where you can also download them.
- Each user's recordings are their own, with a storage overview for admins.
- *(0.12.55)* **Transcode recordings** to H.264 while recording, and record from **HDHomeRun** over-the-air tuners.

See [DVR](/docs/integrations/dvr_integration).

## Request what's missing

Connect **Sonarr** and **Radarr**, and people can search for a movie or series and request it, from M3U Editor, the guest portal, or M3U TV. Requests are tracked through the download queue, and people are told when what they asked for is ready. See [Sonarr and Radarr](/docs/integrations/arrs_integration).

## AIOStreams

[AIOStreams](/docs/integrations/aiostreams_integration) is now a first-class source: browse its catalogs, add titles to your library, play them in any player, and keep watch progress like any other title.

## TMDB Dynamic Groups

**Dynamic Groups** (0.12.53) build groups from TMDB lists, like Trending, Popular, or Top Comedy, filled with the matching titles already in your library. They update themselves as the lists change. Series and movies can also be sorted into their TMDB genres, and items pick up clear logos, cast, and **actor filmography**. See [TMDB Integration](/docs/integrations/tmdb_integration#dynamic-groups).

## For M3U TV

- **Device pairing** (0.12.47): sign a TV in by entering a short code on your phone, instead of typing a password with the remote. See [Device Pairing](/docs/m3u-tv/device-pairing).
- New Xtream API endpoints for the DVR, requests, filmography, and Continue Watching's **Up next**.

## Publishing to Emby

**Emby library publishing** (0.12.48) works the other way around from the media server integrations: it publishes your M3U Editor movies and series, and later your Dynamic Groups, as real Emby libraries. See [Emby Library Publishing](/docs/integrations/emby_library_publishing).

## Also in 0.12

- **Migrate Provider** (0.12.55) moves your whole channel setup to a new provider's playlist, with a preview to check every match first. See [Playlists](/docs/resources/playlists#moving-to-a-new-provider).
- A **simplified editing layout** for playlists, and a **menu manager** to reorder or hide sidebar items.
- **Bouquets**: reusable sets of groups to assign to Playlist Aliases, and per-source group filters on aliases of Merged Playlists.
- **DASH** stream support, URL find and replace before channels are saved, channel number overrides, and turning off output types you don't use.

:::note Re-sync your media servers
0.12 signs every media server stream URL, to stop them being guessed. After updating, re-sync each media server integration, or wait for its next scheduled sync to do it for you.
:::
