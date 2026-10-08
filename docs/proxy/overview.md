---
sidebar_position: 1
title: M3U Proxy Overview
description: What M3U Proxy does, when to turn it on, and the features it adds - shared connections, failover, transcoding, and stream monitoring.
tags:
  - Proxy
  - Architecture
  - Streaming
---

import LinkCards from '@site/src/components/LinkCards';

# M3U Proxy

M3U Proxy is the streaming half of M3U Editor. Without it, your players get your provider's stream addresses and connect to the provider themselves. With it, they connect to your server, and the proxy fetches the stream for them.

That middle step is what makes these possible:

- **Shared connections.** Several people watching the same channel use one provider connection. This matters most when your provider limits how many streams you can run at once.
- **Connection limits.** Cap streams per playlist or per login, and stop the oldest stream to make room for a new one.
- **Failover.** When a stream drops, switch to a backup channel or provider, usually with only a short pause.
- **Transcoding.** Convert streams for devices that can't play the original, with your GPU if you have one.
- **Monitoring.** See what's playing, who's watching, and how each stream is doing.
- **Recording.** The [DVR](/docs/integrations/dvr_integration) and [Networks](/docs/integrations/media_networks_integration) both rely on it.

Setting up the proxy is covered in [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration). The shipped compose files include it.

## Turn it on

The proxy is opt-in per playlist. In a playlist's **Output** tab, under **Streaming Output**, turn on **Enable Stream Proxy**. Every stream in that playlist then goes through the proxy. Custom Playlists, Merged Playlists, and Aliases have the same switch.

Other ways to use it:

- **One channel:** turn on **Enable Stream Proxy** on a channel's edit page to proxy just that channel. When its playlist is proxied, every channel in it already is.
- **One player:** add `?proxy=true` to a playlist's M3U URL. See [Client Configuration](/docs/client_configuration#pick-an-output).
- **M3U TV:** apps can offer proxied playback per device when a login has **Proxy Access**. See [Playlist Auths](/docs/resources/playlist-auth#what-a-login-can-use).

Provider Profiles (pooling several logins from one provider) always use the proxy. See [Provider Profiles](/docs/advanced/playlist-pooled_providers).

## How it handles streams

The proxy works out each stream's type and delivers it the right way:

| Stream | How it's delivered |
|---|---|
| **Live MPEG-TS** (`.ts`) | One provider connection per channel, shared with every viewer. When the viewer holding the connection leaves, another takes it over, so nobody else is interrupted. |
| **HLS** (`.m3u8`) | The playlist is rewritten so segments come through the proxy, and viewers of the same channel share it. |
| **VOD** (movies and episodes) | Each viewer gets their own connection, so everyone can pause and seek on their own. |
| **DASH** (`.mpd`) | The manifest and segments are passed through as they are. |

Streams aren't transcoded unless you ask for it, so by default the proxy passes the original stream through untouched. The connection closes as soon as the last viewer stops watching.

If your source M3U sets per-channel request headers with `#EXTVLCOPT` (`http-user-agent`, `http-referrer`, `http-origin`, `http-cookie`) or `#KODIPROP:inputstream.adaptive.stream_headers`, the proxy sends them to the provider. When both set the same header, `#KODIPROP` wins.

## Features

<LinkCards
  items={[
    { to: '/docs/proxy/transcoding', icon: 'movie', title: 'Transcoding', text: 'Stream profiles, presets, and rule-based profiles.' },
    { to: '/docs/proxy/hardware-acceleration', icon: 'memory', title: 'Hardware acceleration', text: 'Transcode with NVIDIA, Intel, or AMD GPUs.' },
    { to: '/docs/proxy/failover', icon: 'swap_horiz', title: 'Failover and retries', text: 'Keep streams playing when a source fails.' },
    { to: '/docs/proxy/stream-monitor', icon: 'monitoring', title: 'Stream Monitor', text: 'See every active stream and who is watching.' },
  ]}
/>

For specific players and providers:

- [Strict Live TS](strict-live-ts): steadier live TV in Kodi and other PVR clients.
- [Sticky Sessions](sticky-sessions): stops playback loops with load-balanced providers.
- [Silence Detection](silence-detection): fails over when a channel's audio goes silent.
- [Redis Pooling](redis-pooling): shares transcoding between viewers.

The [Configuration Reference](configuration) lists every proxy setting, and the [API Reference](api-reference) covers using the proxy from your own tools.
