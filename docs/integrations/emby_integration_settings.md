---
sidebar_position: 3
description: Bring movies and series from Emby, Jellyfin, Plex, local folders, or WebDAV into M3U Editor, and serve them alongside your IPTV content.
title: Media Servers
tags:
  - Integrations
  - Emby
  - Jellyfin
  - Plex
---

# Media Servers

A media server integration brings your own movie and TV library into M3U Editor. Each one gets its own playlist of movies and series, served to your players through the Xtream API and M3U like any other playlist, with streams and artwork passed through M3U Editor so the server's address and key stay private.

| Type | Use it for | Setup guide |
|---|---|---|
| **Emby**, **Jellyfin** | An Emby or Jellyfin server | [Emby and Jellyfin](emby_integration) |
| **Plex** | A Plex Media Server, including Live TV & DVR tuner setup | [Plex](plex_integration) |
| **Local Media** | Video files in a folder mounted into the container | [Local Media](local_media_integration) |
| **WebDAV** | Files on a NAS, Nextcloud, or a service like TorBox | [WebDAV](webdav_integration) |
| **AIOStreams** | On-demand debrid catalogs | [AIOStreams](aiostreams_integration) |

## Add a media server

Go to **Integrations → Media Servers**, choose **Add Media Server**, and pick the **Server Type**. The type can't be changed later.

1. **Connection:** a **Display Name**, the server's **Host / IP Address** and **Port**, **Use HTTPS** if it uses SSL, and its **API Key/Token**. The guides above show where to find the key.
2. **Test Connection & Discover Libraries** connects and lists the server's libraries (for Local Media and WebDAV, **Scan & Discover Libraries** checks your paths). Choose the ones to import under **Libraries to Import**.
3. Save. The first sync starts, and the integration's playlist is created.

## Settings

The integration's settings are split into tabs:

| Tab | What's in it |
|---|---|
| **Connection** | The server address and key. |
| **Import** | **Import Movies**, **Import Series**, **Genre Handling**, and which libraries to import. Turn off **Enabled** to pause syncing without deleting anything. |
| **Schedule** | How often it syncs, from every hour to once a week. Every 6 hours by default. |
| **Status** | When it last synced, and what changed. |
| **Plex Management** | Plex only. See [Plex](plex_integration#plex-management). |
| **Networks** | The playlist and guide URLs for [Networks](media_networks_integration) built from this server. |
| **Requests** | Let guests on this integration's playlist [request content](arrs_integration). |

**Genre Handling** decides where an item with several genres goes:

- **Primary Genre Only** (recommended): one group or category per item, using its first genre.
- **All Genres**: the item appears in every one of its genres. This creates duplicates and makes syncs slower.

## Actions

| Action | What it does |
|---|---|
| **Sync Now** | Sync the library now. Large libraries can take several minutes; you're notified when it's done. |
| **Test Connection** | Check the server is reachable, and show its name and version. |
| **Refresh Libraries** | Re-read the server's library list, for libraries added since setup. |
| **View Playlist** | Open the integration's playlist, to organize or [cache](/docs/advanced/cached-content) its content like any other. |
| **Cleanup Duplicates** | Merge duplicate series left over from older sync formats. |
| **Flush Library** | Delete everything this integration imported, then sync from scratch. This can't be undone. |
| **Reset status** | Clear a sync that looks stuck. |

## Using media server copies in your IPTV playlists

If a movie or episode is on your media server and also offered by your IPTV provider, an IPTV playlist can play the media server's copy instead. Turn on **Prefer media server sources** in that playlist's **Processing** tab. See [Media server sources](/docs/resources/playlists#media-server-sources).

## Troubleshooting

| Problem | What to check |
|---|---|
| **Test Connection** fails | The host and port are reachable from the M3U Editor container (try the server's LAN IP, not `localhost`), and the key is valid. |
| A new library is missing | Use **Refresh Libraries**, select it under **Libraries to Import**, and sync. |
| Items appear twice | **Genre Handling** is set to **All Genres**, or old duplicates remain. Switch to **Primary Genre Only**, or run **Cleanup Duplicates**. |
| Movies and episodes won't play, but syncing works | If M3U Editor runs behind a VPN on the same machine as the media server, see [Modular + VPN](/docs/deployment/docker-compose#modular--vpn). |
