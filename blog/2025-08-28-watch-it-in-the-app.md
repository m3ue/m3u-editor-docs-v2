---
slug: m3u-editor-0-7-watch-it-in-the-app
title: "M3U Editor 0.7: watch it in the app"
description: M3U Editor 0.7 adds an in-app EPG Viewer and Playlist Viewer, a rewritten player, EPG caching, and a rebuilt proxy with failover in the middle of a stream.
authors: [sparkison]
tags: [release, editor]
image: /img/blog/v0-7-playlist-viewer.jpg
---

Until 0.7, M3U Editor was something you set up and then left: you edited your playlist, and you found out how it looked once it reached your player. With 0.7 you can see and watch everything from inside the app, and the proxy underneath it has been rebuilt from scratch. This is a big one.

<!-- truncate -->

## See your guide

The new **EPG Viewer** shows any guide as a timeline, right in the app. It's the quickest way to check that a guide actually has data for the days you expect.

![The EPG Viewer](/img/blog/v0-7-epg-viewer.jpg)

The **Playlist Viewer** goes a step further. It shows your playlist the way a player would, as a channel guide with your channel names, numbers, and logos, and lets you play any channel from it. You can open several players at once, so you can check a few channels side by side.

![Watching three channels at once from the Playlist Viewer](/img/blog/v0-7-playlist-viewer.jpg)

## A new player

The in-app player has been rewritten on top of [mpegts.js](https://github.com/xqq/mpegts.js) and [hls.js](https://github.com/video-dev/hls.js), so MPEG-TS and HLS streams both play in the browser without a plugin.

## EPG caching

To make the viewers fast, guides are now parsed once and cached, with a health check that keeps the cache current. The same cache powers the full set of Xtream API guide endpoints: the whole guide, short guides, a single channel, or a custom number of days. Players that load the guide through the Xtream API get it much faster.

## A rebuilt proxy

The proxy has been completely refactored:

- **Shared streams.** Several players watching the same channel now share one connection to the provider, for MPEG-TS as well as HLS. That matters a lot with providers that only allow one or two connections.
- **Failover in the middle of a stream.** Assign failover channels to a channel, and if the stream fails while someone is watching, the proxy switches to the next one without the player noticing.
- **Timeshift** support, faster startup, and better cleanup when a stream ends.
- A **Stream Monitor** page showing every active stream, who's watching, and how much bandwidth it uses.

![The Stream Monitor](/img/blog/v0-7-stream-monitor.jpg)

## Also in 0.7

- **Schedules Direct** support, with a choice of how many days to import.
- Post processing can now **send emails**, and only run when conditions you set are met.
- Default `.strm` file settings for every series, set once in Settings.
- An option to turn off the login screen when M3U Editor sits behind your own authentication, such as Authentik.

## Try it

Open a playlist and choose **View** to find the Playlist Viewer, or open an EPG for its guide. Failover is set per channel under **Failover Channels**; see [Failover](/docs/proxy/failover).
