---
sidebar_position: 99
description: Fixes for the most common problems with installing, syncing, playback, guide data, and players, and where to get help.
tags:
  - FAQ
  - Troubleshooting
  - Help
title: Troubleshooting
---

# Troubleshooting

Find your problem below. Most pages in these docs also end with their own troubleshooting section. If you're still stuck, see [Getting help](#getting-help).

## Installing and signing in

| Problem | What to check |
|---|---|
| The page won't load | `docker compose ps` shows every container as `healthy`. The first start takes a minute or two. `docker compose logs -f m3u-editor` shows what's happening. |
| Links in the app point to `localhost` | Set `APP_URL` to your server's address, without the port, and recreate the container. See [Editor Configuration](/docs/configuration#application). |
| The default login doesn't work | It's `admin` / `admin` on a new install. After you change it, use your new password. |
| Progress bars and notifications don't update | Live updates use websockets. **Settings → General → Test WebSocket** checks them. Behind a reverse proxy, allow websockets; see [Reverse Proxy and HTTPS](/docs/deployment/caddy-vs-nginx#what-the-reverse-proxy-needs). |
| The proxy shows as not connected | **Settings → Proxy → Test connection**, then [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration#troubleshooting). |

## Playlists and syncs

| Problem | What to check |
|---|---|
| The sync finished but there are no channels in my player | New channels are imported **disabled**. Enable the groups you want. See [Playlists](/docs/resources/playlists#add-a-playlist). |
| `cURL error 56: Recv failure: Connection reset by peer` | Your provider closed the connection. Open the playlist URL in a browser on the same network. If that works, copy your browser's user agent into the playlist's **User agent** field. |
| `Invalid EXTINF format` | A line in the M3U file is malformed. A normal line looks like `#EXTINF:-1 tvg-id="id" tvg-name="Name" tvg-logo="https://example.com/logo.png" group-title="Group",Title`. |
| Large syncs time out | Turn on **Fetch by category** in the playlist's **Processing** tab, or raise `PLAYLIST_DOWNLOAD_TIMEOUT`. |
| A sync removed most of my channels | Your provider probably returned a partial list. Turn on [sync invalidation](/docs/resources/playlists#protect-against-bad-syncs) to stop this happening again. |
| A playlist shows a spinner that never stops | Choose **Reset Processing State** on the playlist, then sync again. |
| Syncs are queued but nothing runs | Check **Tools → Job Monitor**. If nothing has run for a long time, use **Reset Queue** in **Settings → Sync Options**. See [Job Monitor](/docs/advanced/job-monitoring). |

## Playback

| Problem | What to check |
|---|---|
| A channel won't play | Try it with the **Play** button in M3U Editor. If it fails there too, the provider's stream is down, or you're at your connection limit. |
| "Too many connections" | Your provider's connection limit is reached. Use [Stop oldest stream when limit reached](/docs/proxy/failover#connection-limits), or pool accounts with [Provider Profiles](/docs/advanced/playlist-pooled_providers). |
| Streams buffer or loop in Kodi | Turn on [Strict Live TS](/docs/proxy/strict-live-ts) for the playlist. |
| HLS streams loop every few seconds | Turn on [Sticky Sessions](/docs/proxy/sticky-sessions) for the playlist. |
| A stream drops and doesn't come back | Give the channel [failovers](/docs/proxy/failover), and proxy the playlist. |
| Transcoded streams stutter | The CPU can't keep up. Use a [GPU](/docs/proxy/hardware-acceleration), or a lighter profile. Check the encoder speed in the [Stream Monitor](/docs/proxy/stream-monitor). |

### Why stream links point at M3U Editor even with the proxy off

Players always get links to M3U Editor, like `http://your-server:36400/live/user/pass/1234.ts`. When someone plays one, M3U Editor checks whether the proxy is on for it. If it is, the stream goes through the proxy. If not, the player is redirected to the provider's address and plays from there directly. This lets M3U Editor apply logins, limits, and failover, and is expected.

### The in-app player won't play a channel

Browsers can only play a few video formats, so most IPTV streams need transcoding to play inside M3U Editor:

1. Go to **Proxy → Stream Profiles** and choose **Generate Default Profiles**.
2. In **Settings → Proxy**, under **In-App Player Transcoding**, choose a **Default Live Transcoding Profile**, and a **VOD and Series Transcoding Profile** if movies don't play either.

These only affect the in-app player. Your players use the profiles set on each playlist. Seeking in a movie or episode isn't possible while it's being transcoded. See [Transcoding](/docs/proxy/transcoding).

## Guide data

| Problem | What to check |
|---|---|
| Channels have no guide | The EPG synced and has channels, and the channels are mapped. Filter **Live Channels → Channels** by **EPG is not mapped**. See [EPGs](/docs/resources/epg-setup#check-the-guide). |
| The guide is hours off | Set the channel's **EPG Shift**, or bulk-set it with **Set EPG shift**. |
| The guide matches the wrong channels | Adjust the EPG map's settings, or review its candidates. See [Improve the matches](/docs/resources/epg-setup#improve-the-matches). |
| Event channels have no guide | Use [Advanced EPG Dummies](/docs/advanced/advanced-epg-dummies). |

## Players

| Problem | What to check |
|---|---|
| The player can't connect | Use your server's LAN IP or domain, not `localhost`, and check port `36400` is reachable. See [Client Configuration](/docs/client_configuration#troubleshooting). |
| The login is rejected | The playlist's [default login](/docs/resources/playlist-auth#default-login), and whether the Playlist Auth is enabled and not expired. |
| Movies and series are missing | They come through the Xtream API. For M3U players, turn on **Include VOD in M3U output** and **Include series in M3U output**. |
| M3U TV can't connect | **Enhanced output enabled** must be on in **Settings → General**. See [M3U TV](/docs/m3u-tv/overview). |

## Getting help

When you ask for help, it's much quicker with details:

- **Tools → Debug Logs** shows M3U Editor's log. Copy the lines around the problem.
- **Tools → Job Monitor** shows failed background jobs and their errors.
- `docker compose logs m3u-proxy` shows the proxy's log, for streaming problems.
- M3U TV can send its logs to the editor; see [Logs and Diagnostics](/docs/m3u-tv/logs-diagnostics).

Then ask on [Discord](https://discord.gg/rS3abJ5dz7), or open an issue on [GitHub](https://github.com/m3ue/m3u-editor/issues). Include your version (shown in the page footer), your setup (all-in-one or modular), and what you tried. Logs hide passwords by default, but check before posting.
