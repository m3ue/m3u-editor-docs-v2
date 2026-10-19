---
slug: m3u-editor-0-8-m3u-proxy-moves-in
title: "M3U Editor 0.8: M3U Proxy moves in"
description: The 0.8 series embeds M3U Proxy, and adds transcoding profiles, Playlist Aliases, Auto-Merge, TMDB metadata, .strm and NFO files, Emby and Jellyfin, and failover across provider accounts.
authors: [sparkison]
tags: [release, editor, proxy]
---

The proxy I rebuilt for 0.7 worked, but it lived inside the web app, and streaming video from a PHP app has limits. So I pulled it out into its own project, [M3U Proxy](https://github.com/m3ue/m3u-proxy), a small Python service built only for streaming. The 0.8 series is where it moved back in, and where M3U Editor grew a lot of the features people now use every day.

<!-- truncate -->

## M3U Proxy, built in

From 0.8, M3U Proxy runs inside the M3U Editor container. There's nothing extra to install: turn on the proxy for a playlist and its streams go through M3U Proxy. If you'd rather run it separately, on another machine or with a GPU, you can do that too. See [M3U Proxy](/docs/proxy/overview).

With a real streaming service underneath, transcoding became practical:

- **Stream profiles** describe how to transcode a stream, with separate profiles for live TV and for movies and series. A quick action creates sensible defaults. See [Transcoding](/docs/proxy/transcoding).
- **Failover pooling** (0.8.30). If you have more than one account with a provider, M3U Editor pools them into one playlist: each new stream goes to an account with a free connection, so you can watch as many streams as all your accounts allow together. See [Provider Profiles](/docs/advanced/playlist-pooled_providers).

## New ways to share a playlist

- **Playlist Aliases** serve an existing playlist under a different login, or with a different provider address. See [Playlist Aliases](/docs/resources/playlist-alias).
- A **public playlist page**, where people with a login can browse and watch in a browser.
- **User management**, so several people can each have their own M3U Editor account.
- Logins can **expire** on a date and time you choose (0.8.28).

## Cleaner channel lists

**Auto-Merge Channels** finds the same channel offered more than once, for example in HD and FHD, or from two providers, and links the duplicates as failovers of one channel instead of listing them all. Later in the series it learned to prefer channels with catch-up, and to rank sources with weighted priorities. See [Auto-Merge Channels](/docs/advanced/auto-merge-channels).

## Movies and series, done properly

0.8.26 in January was mostly about VOD and series metadata:

- **TMDB and TVDB IDs**, looked up automatically or by hand with a search. See [TMDB Integration](/docs/integrations/tmdb_integration).
- **`.strm` files** for movies and series, so media servers can add your provider's library as if it were local, plus **NFO files** with their details. See [STRM Files](/docs/advanced/strm-files).

## Emby and Jellyfin

0.8.30 added the first **media server integration**: connect Emby or Jellyfin, and their movies and series become a playlist you can serve to your players like any other. It's the foundation the later Plex, Local Media, and WebDAV integrations were built on. See [Emby and Jellyfin](/docs/integrations/emby_integration).

## Also in 0.8

- A channel health check API, and API endpoints for active streams.
- Custom HTTP headers per playlist.
- Stop or remove a stream from the Stream Monitor, which now shows failover details.
- A delay between provider requests, for providers that block fast clients.
- The logs viewer is back in the admin area.
- A custom message for players that show the Xtream API panel message.

That's a lot for one series, and much of it came from requests in Discord and GitHub. Keep them coming.
