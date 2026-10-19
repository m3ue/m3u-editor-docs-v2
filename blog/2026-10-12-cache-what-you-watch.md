---
slug: m3u-editor-0-13-cache-what-you-watch
title: "M3U Editor 0.13: cache what you watch"
description: The 0.13 series downloads movies and episodes for local playback, caches TMDB Dynamic Groups automatically, routes downloads through Radarr and Sonarr, prefers your media server's copies, and adds new default login modes.
authors: [sparkison]
tags: [release, editor]
image: /img/blog/v0-13-series-detail.jpg
---

Provider streams are convenient until they aren't: a busy evening, a slow server, or a title that buffers every few minutes. The 0.13 series, from late September to mid-October, gives M3U Editor a way around that. It can keep its own copies of the movies and episodes you care about, and play those instead.

<!-- truncate -->

## Cached Downloads

Turn on **Settings → Cache**, and every movie and episode gets a **Cache Now** action (series get **Cache all episodes**). M3U Editor downloads the file in the background, and from then on playback uses the local copy. Players don't need a new URL, and if the copy is ever missing, playback falls back to the provider as before.

A **Cached** column shows where each item will play from, and the **Cached Downloads** page lists everything with its progress, size, and any errors, with totals for storage used and what's in progress. Retention is up to you: delete a file once its title leaves the playlist, or keep everything until you remove it. See [Cached Content](/docs/advanced/cached-content).

## Dynamic Groups that cache themselves

*(0.13.2)* A TMDB Dynamic Group like **Trending Movies** can now cache its members automatically: the top 20 by default, refreshed daily, and cleaned up a set number of days after a title drops off the list. Series cache only their latest season. **Keep** holds on to anything you want to stay. See [Dynamic Group Caching](/docs/advanced/cached-content#dynamic-group-caching).

## Through Radarr and Sonarr

*(0.13.2)* If you run Radarr or Sonarr, caching can send new titles to them instead of downloading from the provider. They fetch the title into your media server library, the way they normally would, and playback then uses the media server's copy. *(0.13.3)* If the arr can't deliver within 24 hours, the title is downloaded from the provider after all. See [Caching Through Radarr or Sonarr](/docs/advanced/cached-content#caching-through-radarr-or-sonarr).

## Prefer your media server

*(0.13.2)* Many people already have some of their provider's movies and episodes on Plex, Emby, Jellyfin, or disk. With **Prefer media server sources** on, a playlist plays your copy instead of the provider's stream, matched by TMDB, TVDB, or IMDB ID. Players keep the same URLs, and the provider stays as the fallback. See [Media server sources](/docs/resources/playlists#media-server-sources).

![A series page with its TMDB, TVDB, and IMDB IDs, which media server matching relies on](/img/blog/v0-13-series-detail.jpg)

## Default logins your way

*(0.13.3)* Every playlist has a built-in owner login, which used the playlist's unique ID as its password. **Default login** can now keep that, switch to a **Custom Password** you choose, or be **Disabled** so only Playlist Auths work. That last one is the easy way to hand out logins without ever sharing your own. See [Default login](/docs/resources/playlist-auth#default-login).

## Also in 0.13

- **Image size profiles** (0.13.1): logos, posters, and backdrops are served at sizes that suit where they're shown, so players download much less.
- **Sort by channel number** (0.13.1) for the playlist output, instead of by group.
- **Bouquets** in alias group ordering, a tabbed alias editor, and auto-include patterns for new groups (0.13.2 and 0.13.3).
- **Failed probes are recorded** and retried later, and series can be probed by sample (0.13.2).
- **Multiple Schedules Direct lineups** on one EPG (0.13.0).
- **The DVR in the API** (0.13.0), and **tool approvals** for the AI Copilot (0.13.1).
- **Over-the-air sub-channels** like `5.1` (0.13.4).
- **Watch progress by hand** (0.13.4): add or edit a viewer's progress, for something they watched elsewhere. See [Continue Watching](/docs/m3u-tv/continue-watching#add-or-edit-progress-by-hand).
- **Guide artwork**: programme posters and backdrops are kept apart, and exact duplicate programmes are removed (0.13.4).

Caching runs on its own background workers, so a big download never holds up a playlist sync. Mount a volume for the cache folder before you start; the Cache settings page shows the path.
