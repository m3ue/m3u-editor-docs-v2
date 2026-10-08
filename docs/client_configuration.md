---
sidebar_position: 4
description: Connect IPTV apps, media servers, and players to M3U Editor through Xtream Codes, M3U, HDHomeRun, and XMLTV.
tags:
  - Getting Started
  - Configuration
title: Client Configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LinkCards from '@site/src/components/LinkCards';

# Client Configuration

M3U Editor serves every playlist in four formats, so almost any player or media server can use it. This page shows where to find your connection details, which format to pick, and how to set up common clients.

## Find your connection details

Open your playlist under **Playlists**:

- The **Xtream API** tab shows the server URL, username, and password.
- The **Links** tab has the M3U, guide, and HDHomeRun URLs, ready to copy.

The same applies to [Custom Playlists](/docs/resources/custom-playlist), [Merged Playlists](/docs/resources/merged-playlist), and [Playlist Aliases](/docs/resources/playlist-alias), each of which has its own outputs.

The Xtream password depends on the playlist's [default login](/docs/resources/playlist-auth#default-login): the playlist's UUID unless you've set a custom password. To give each person or device its own login, use [Playlist Auths](/docs/resources/playlist-auth).

:::tip Use an address your player can reach
The URLs use `APP_URL` from your [configuration](/docs/configuration#application). If they show `localhost`, players on other devices can't reach them. Set `APP_URL` to your server's LAN IP or domain.
:::

## Pick an output

| Output | Use it for | Address |
|---|---|---|
| **Xtream Codes API** | IPTV apps like TiviMate, IPTV Smarters, OTT Navigator, and M3U TV. One login brings live TV, movies, series, and the guide. | Server `http://your-server:36400`, plus username and password |
| **M3U playlist** | Players that only take a playlist URL, like VLC or Kodi's IPTV Simple Client | `http://your-server:36400/{uuid}/playlist.m3u` |
| **HDHomeRun** | Live TV in Plex, Emby, and Jellyfin, which see M3U Editor as a network tuner | `http://your-server:36400/{uuid}/hdhr` |
| **XMLTV guide** | The guide, to pair with an M3U playlist or an HDHomeRun tuner | `http://your-server:36400/{uuid}/epg.xml` (or `epg.xml.gz`) |

Prefer Xtream when your player supports it: it carries the most metadata and needs no separate guide URL.

**Logins in URLs.** When a login is needed (a [Playlist Auth](/docs/resources/playlist-auth), or the Custom Password login mode), add it to the M3U URL as `?username=...&password=...`. For HDHomeRun, it goes in the path: `/{uuid}/hdhr/{username}/{password}`. The URLs in the **Links** tab already include it when your login mode needs it.

**Proxy per URL.** Add `?proxy=true` (or `&proxy=true`) to an M3U URL to send its streams through [M3U Proxy](/docs/proxy/overview), or `proxy=false` to skip it, whatever the playlist's own setting.

Each output can be turned off per playlist under **Output → Playlist Output → Enabled output types**. A disabled output answers with "Output disabled".

## Set up your player

<Tabs groupId="client" queryString>
<TabItem value="tivimate" label="TiviMate" default>

1. Choose **Add playlist**, then **Xtream Codes**.
2. Enter the server URL `http://your-server:36400` and your username and password.
3. Choose **Next** and finish setup. The guide comes in automatically.

To use M3U instead, choose **M3U playlist**, enter the playlist URL, and add the XMLTV URL as the guide source.

</TabItem>
<TabItem value="smarters" label="IPTV Smarters / OTT Navigator">

Add a new profile or provider with an **Xtream Codes** login:

- **Server URL:** `http://your-server:36400`
- **Username** and **Password** from the playlist's Xtream API tab

Live TV, movies, series, and the guide all come from that one login.

</TabItem>
<TabItem value="kodi" label="Kodi">

Use the **PVR IPTV Simple Client** add-on (in **Add-ons → My add-ons → PVR clients**):

1. Open the add-on's **Configure** screen.
2. Under **General**, set the location to a remote path and enter the M3U playlist URL.
3. Under **EPG**, enter the XMLTV guide URL.
4. Restart Kodi, or disable and re-enable the add-on, to load the channels.

</TabItem>
<TabItem value="plex" label="Plex">

The easiest way is the [Plex integration](/docs/integrations/plex_integration#dvr--live-tv-tuner): it registers the playlist as a tuner in Plex for you, guide included.

To add it by hand, go to **Settings → Live TV & DVR → Set up Plex DVR**. If the tuner isn't found automatically, enter its address manually as `your-server:36400/{uuid}/hdhr`. When asked for guide data, choose the XMLTV option and enter the guide URL.

</TabItem>
<TabItem value="emby" label="Emby / Jellyfin">

In the server's **Live TV** settings:

1. Add a **tuner device** of type **HDHomeRun** with the URL `http://your-server:36400/{uuid}/hdhr`. An **M3U tuner** with the playlist URL works too.
2. Add a **TV guide data provider** of type **XMLTV** with the guide URL, and map it to the tuner.

For Emby, M3U Editor can also sync your Emby libraries and publish content into them. See [Emby Integration](/docs/integrations/emby_integration).

</TabItem>
<TabItem value="m3utv" label="M3U TV">

[M3U TV](/docs/m3u-tv/overview) is built for M3U Editor. On a TV, choose **Pair with code** and enter the code in M3U Editor from your phone or computer; no typing passwords on the remote (see [Device Pairing](/docs/m3u-tv/device-pairing)). On other devices you can also sign in with the Xtream server URL, username, and password.

M3U TV needs **Enhanced output enabled**, under **Settings → General**, which is on by default.

</TabItem>
<TabItem value="vlc" label="VLC">

Choose **Media → Open Network Stream** and enter the M3U playlist URL. VLC loads the channels as a playlist; it doesn't show a guide.

</TabItem>
</Tabs>

## Troubleshooting

| Problem | What to check |
|---|---|
| The player can't connect | Use your server's LAN IP or domain, not `localhost`. Make sure port `36400` is reachable from the player's network, then try opening the URL in a browser on the same device. |
| The login is rejected | The playlist's [default login](/docs/resources/playlist-auth#default-login) mode, and whether the Playlist Auth is enabled and not expired. |
| "Output disabled" | That output type is turned off for the playlist under **Output → Playlist Output**. |
| Channels load but don't play | Try the stream with `?proxy=true` on the M3U URL, and check your provider's connection limit. See [Troubleshooting](/docs/troubleshooting). |
| No guide data | Map guide data to your channels ([EPG Setup](/docs/resources/epg-setup)), and give M3U and HDHomeRun clients the XMLTV URL. Xtream clients get the guide automatically. |

## Next steps

<LinkCards
  items={[
    { to: '/docs/resources/playlist-auth', icon: 'groups', title: 'Playlist Auths', text: 'Give each person or device its own login and connection limit.' },
    { to: '/docs/resources/playlist-alias', icon: 'merge', title: 'Playlist Aliases', text: 'Serve the same playlist with different credentials, groups, or settings.' },
    { to: '/docs/m3u-tv/overview', icon: 'tv', title: 'M3U TV', text: 'The native player for TV, mobile, and desktop.' },
    { to: '/docs/integrations/plex_integration', icon: 'live_tv', title: 'Plex integration', text: 'Register tuners and sync libraries with Plex.' },
  ]}
/>
