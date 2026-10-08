---
sidebar_position: 4
description: Connect an Emby or Jellyfin server to M3U Editor with an API key, and import its movies and series.
title: Emby and Jellyfin
tags:
  - Integrations
  - Emby
  - Jellyfin
---

# Emby and Jellyfin

Emby and Jellyfin connect the same way: with the server's address and an API key.

## Get an API key

In Emby:

1. Open the dashboard with the gear icon at the top right.

   ![Emby dashboard](/img/doc_imgs/emby_settings.png)

2. In the left panel, under **Advanced**, choose **API Keys**.

   ![Emby API Keys](/img/doc_imgs/emby_settings_advanced_api.png)

3. Choose **New API Key** and name it, for example "M3U Editor". An existing key works too.

   ![Emby new API key](/img/doc_imgs/emby_api_new.png)

In Jellyfin, open the **Dashboard**, find **API Keys** (under **Advanced** in most versions), and choose **+** to create one.

## Add the server

Go to **Integrations → Media Servers** and choose **Add Media Server**:

| Field | Enter |
|---|---|
| **Display Name** | Any name, like "Living room Emby" |
| **Server Type** | **Emby** or **Jellyfin** |
| **Host / IP Address** | The server's LAN IP or domain, for example `192.168.1.100` |
| **Port** | `8096` by default |
| **Use HTTPS** | On if you reach the server over HTTPS |
| **API Key/Token** | The key from above |

Choose **Test Connection & Discover Libraries**, select the movie, TV, or mixed libraries to import, and save. The first sync starts straight away.

M3U Editor imports each movie and series with its details (plot, cast, genres, ratings, and artwork), plus every season and episode. The [Media Servers](emby_integration_settings) page covers the integration's other settings and actions.

## Publish to Emby

This integration brings content *from* Emby into M3U Editor. To go the other way, and publish your IPTV movies and series *into* Emby as libraries, see [Emby Library Publishing](emby_library_publishing).
