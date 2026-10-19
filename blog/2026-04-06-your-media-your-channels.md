---
slug: m3u-editor-0-9-0-10-your-media-your-channels
title: "M3U Editor 0.9 and 0.10: your media, your channels"
description: Networks turn your own media into live TV channels, alongside Plex, Local Media, and WebDAV integrations, Merged EPGs, user permissions, watch progress, the channel scrubber, and single sign-on.
authors: [sparkison]
tags: [release, editor]
image: /img/blog/v0-9-media-servers.jpg
---

Up to now, everything in M3U Editor started with an IPTV provider. 0.9 and 0.10 changed that. Your own media library became a first-class source, and you can now turn it into live TV channels of your own.

<!-- truncate -->

## Networks: your own TV channels

**Networks** are 24/7 channels built from your media library. Pick the movies or episodes, choose how they're scheduled, and M3U Editor broadcasts them as a live channel with a guide, served through your playlists like any other channel. Think of a channel that only plays your favourite sitcom, or a movie channel built from one genre.

0.10 added a **manual schedule builder** with 5-minute time slots, for when you want to decide exactly what airs when. See [Networks](/docs/integrations/media_networks_integration).

## More places your media can come from

Emby and Jellyfin were the first media servers, in 0.8. These releases added:

- **Plex** (0.9), with library selection and transcoding through the proxy.
- **Local Media** (0.9): point M3U Editor at folders of video files, and it builds a library from them with metadata. See [Local Media](/docs/integrations/local_media_integration).
- **WebDAV** (0.10), for media on a remote share. See [WebDAV](/docs/integrations/webdav_integration).

![The Media Servers page today, with Plex, Emby, and AIOStreams connected](/img/blog/v0-9-media-servers.jpg)

## Guides

**Merged EPGs** combine several guides into one, with a priority order deciding which guide wins when two cover the same channel. See [EPGs](/docs/resources/epg-setup).

## Sharing the app safely

- **User permissions** (0.9) control what each M3U Editor user can see and do.
- **Single sign-on with OpenID Connect** (0.10.35), with an option to hide the local login form. See [SSO with OIDC](/docs/advanced/sso-oidc).
- An **allowed domains** list (0.9.17), so playlists can only be added from providers you trust.

## Remembering where you left off

0.10 introduced **viewers** and **watch progress**: the in-app player remembers where you stopped a movie or episode and offers to resume. It's the groundwork for Continue Watching in players.

## Keeping your channels healthy

- The **Channel Scrubber** (0.10.35) checks your channels for dead streams and can disable them for you. See [Channel Scrubbers](/docs/advanced/channel-scrubbers).
- **Xtream fallback URLs** (0.10.35): give a playlist more than one provider address, and M3U Editor moves to the next when one stops answering. See [Xtream DNS Failover](/docs/resources/xtream-dns-failover).
- **Silence detection** in the proxy notices when a live stream stays connected but its sound has gone, and fails over to a backup. See [Silence Detection](/docs/proxy/silence-detection).

## Also in 0.9 and 0.10

- Custom channel numbers on Custom Playlists, with drag-and-drop ordering.
- Cast, director, and YouTube trailers from TMDB.
- Saved Find & Replace rules that run on every sync, for groups and categories as well as channels.
- Sort rules that run after every sync.
- An asset library for uploading logos and covers once and reusing them.
- Provider timezones, fetched with one click, so catch-up lines up.
- A release log page inside the app.

Most of this came out of conversations in Discord about what people wanted to do with their own libraries. If you've got ideas for where Networks should go next, that's the place to share them.
