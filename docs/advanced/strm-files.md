---
sidebar_position: 11
description: Write .strm files for your movies and series, so Plex, Jellyfin, and Emby can add your provider's VOD to their libraries.
tags:
  - Series
  - VOD
  - Plex
  - Jellyfin
  - Emby
title: .strm Files
---

import { Steps, Step } from '@site/src/components/Steps';

# .strm Files

A `.strm` file is a small text file holding a stream's address. Media servers like Plex, Jellyfin, and Emby treat a folder of them like a folder of video files: they scan them into a library, fetch artwork, and track what you've watched. M3U Editor can write one for every movie and episode in your playlists, organized and named the way media servers expect.

## Set it up

<Steps>
<Step title="Give M3U Editor a folder to write to">

Mount a folder that both M3U Editor and your media server can see. In the `m3u-editor` service:

```yaml
volumes:
  - /mnt/media/iptv:/media/iptv
```

Mount the same host folder into your media server's container too.

</Step>
<Step title="Create a stream file setting">

Go to **Playlist → Stream File Settings** and choose **New stream file setting**. Pick the **Type** (**Series** or **VOD**), and set the **Sync Location** to a folder inside the mount, like `/media/iptv/Movies`. Create one for each type you want. The options are [below](#settings).

</Step>
<Step title="Choose where it applies">

Set it as the default in **Settings → Sync Options** (**Default Series Stream File Setting** and **Default VOD Stream File Setting**). You can also pick a different setting for a series category, a VOD group, or a single series or movie. The most specific one wins.

</Step>
<Step title="Write the files">

Files are only written for **enabled** items. For series, episodes come from **Fetch Provider Metadata**, so turn on **Fetch metadata** too. Then either:

- turn on **Sync stream files** under the playlist's **VOD Processing** and **Series Processing**, to write files after every sync, or
- select items and use **Sync VOD .strm files** or **Sync Series .strm files** from the bulk actions.

</Step>
<Step title="Add the folder to your media server">

Add the folder as a **Movies** or **TV Shows** library, depending on the type. Use the path as your media server sees it.

</Step>
</Steps>

## Settings

| Setting | What it does |
|---|---|
| **Enable .strm file generation** | Turn this setting's files on or off. |
| **URL Type** | **M3U Editor** (the default) puts M3U Editor's address in each file, so playback follows your proxy, failover, and caching settings. **Original Source URL** puts the provider's address in directly, skipping M3U Editor, but exposes it to anyone who can read the files. |
| **Path structure (folders)** | The folders to create: category, series, and season for series; group and title for movies. **Path Preview** shows the result. |
| **Title folder metadata**, **Filename metadata** | Add the year, TMDB ID, group, or category to folder and file names, which helps media servers match the right title. |
| **TMDB ID format**, **Apply TMDB ID to** | Write the ID as `[tmdb-123]` or `{tmdb-123}`, on episodes, the series folder, or both. |
| **Enable Trash Guide naming** | Add edition, quality, video, audio, and HDR details to file names, the way Sonarr and Radarr name files. Quality details need [probed](stream-probing) streams. |
| **Use Plex/Jellyfin/Emby multi-version markers** | Put every version of a movie (1080p, 4K, Director's Cut) in one folder, so the media server offers a version switch. |
| **Clean special characters**, **Replace with** | Replace characters media servers dislike. |
| **Enable name filtering**, **Patterns to remove** | Strip text like `EN - ` or `4K` from names. |
| **Generate NFO files** | Write `.nfo` files with plot, cast, ratings, and artwork, for Kodi, Jellyfin, and Plex. |
| **Refresh media server library after sync** | Ask a [media server integration](/docs/integrations/emby_integration_settings) to scan its library once files are written. |

The folder names `Movies`, `Series`, and `strm` used in some paths can be changed with the `XTREAM_MOVIE_FOLDER`, `XTREAM_SERIES_FOLDER`, and `XTREAM_STRM_FOLDER` [environment variables](environment-variables#storage).

To run something else when files are written, like a script, use a [post process](admin-tools#post-processing) on **VOD Stream Files Synced** or **Series Stream Files Synced**.

## Troubleshooting

| Problem | What to check |
|---|---|
| No files are written | The setting is enabled and assigned, the items are enabled, and the **Sync Location** is inside a mounted folder M3U Editor can write to. |
| Series have no episode files | **Fetch Provider Metadata** has run for them. |
| The media server shows no items | The library type matches (Movies or TV Shows), and the path is the one the media server sees. |
| Titles are matched wrong | Add the year and TMDB ID to names, and use [TMDB](/docs/integrations/tmdb_integration) metadata. |
| Playback stops working after a change | If you changed a playlist's [default login](/docs/resources/playlist-auth#default-login), files are rewritten on the next sync. |

Writing stream files needs the **Use Stream File Sync** permission, which admins have.
