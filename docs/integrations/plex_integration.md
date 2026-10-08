---
sidebar_position: 5
description: Import a Plex library into M3U Editor, and manage Plex from the editor - including registering your playlists as Live TV & DVR tuners.
title: Plex
tags:
  - Integrations
  - Plex
---

# Plex

The Plex integration does two things:

- **Imports** your Plex movies and series into M3U Editor, like the other [media servers](emby_integration_settings).
- **Manages** Plex from M3U Editor: register your playlists as Live TV & DVR tuners, refresh the guide, and scan libraries.

## Get your Plex token

Plex uses a token instead of an API key. The easiest way to find it:

1. Sign in to Plex in a browser, open any item in your library, and choose **Get Info** from its menu.

   ![Plex Get Info](/img/doc_imgs/plex-library-get-info.png)

2. Choose **View XML** at the bottom of the window.

   ![Plex View XML](/img/doc_imgs/view-xml.png)

3. In the new tab's address bar, your token is the value after `X-Plex-Token=`.

   ![Plex token in the URL](/img/doc_imgs/plex-token.png)

:::warning Keep your token private
The token gives full access to your Plex server.
:::

## Add the server

Go to **Integrations → Media Servers** and choose **Add Media Server**. Set **Server Type** to **Plex**, enter the server's **Host / IP Address** and **Port** (`32400` by default), and paste the token into **API Key/Token**. Choose **Test Connection & Discover Libraries**, pick the libraries to import, and save.

## Plex Management

Open the integration after it's created, go to the **Plex Management** tab, and turn on **Enable Plex Management**. The top of the tab shows the server's details and whether your tuners and guide are in sync with Plex.

### Live TV & DVR tuners

Register any playlist as an HDHomeRun tuner in Plex, so Plex's **Live TV & DVR** shows your channels and guide. Choose **Register DVR Tuner in Plex** (or **Add Tuner** for another playlist):

| Field | Enter |
|---|---|
| **Playlist** | The playlist, Custom Playlist, or Merged Playlist to use as a tuner |
| **HDHR Base URL** | Filled in for you. Plex must be able to reach it, so use your server's LAN address, not `localhost`. |
| **EPG URL** | The playlist's guide URL, filled in for you. Also must be reachable from Plex. |
| **Country Code**, **Language Code** | For Plex's guide, for example `us` and `en` |

:::warning Set the playlist's TVG ID output first
For Plex to match the guide to channels, set the playlist's **Preferred TVG ID output** (in **Output → EPG Output**) to **Channel Number**. M3U Editor warns you if it isn't.
:::

After registering:

| Action | When to use it |
|---|---|
| **Force Sync Channels** | After adding or removing channels, to update Plex's channel list. |
| **Refresh EPG Guide** | After your guide data changes. It also sets Plex to refresh the guide on its own. |
| **Remove Tuner** | Remove one playlist's tuner. Removing the last one removes the DVR too. |
| **Remove Entire DVR** | Remove the DVR and every tuner from Plex. |

### Libraries and recordings

**Libraries & Scanning** lists your Plex libraries and whether each is scanning. **Scan All Libraries** starts a scan of every library. **Recordings / DVR Subscriptions** lists what Plex's DVR is set to record; manage those in Plex.

## Troubleshooting

| Problem | What to check |
|---|---|
| Plex can't reach the tuner | The **HDHR Base URL** uses an address Plex can reach. If Plex runs in Docker, that may be a different address than you use in your browser. |
| The guide doesn't match the channels | **Preferred TVG ID output** is **Channel Number**, then **Force Sync Channels**. |
| Server details show "Connection failed" | The token is still valid, and the host and port in the **Connection** tab are right. |
| Movies and episodes won't play, but syncing works | If M3U Editor runs behind a VPN on the same machine, Plex may treat it as remote. See [Modular + VPN](/docs/deployment/docker-compose#modular--vpn). |
