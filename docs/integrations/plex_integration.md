---
sidebar_position: 3
description: Import VOD and Series data into M3U-Editor
title: Plex Integration
hide_title: true
tags:
  - Integrations
  - Plex

---

# Plex Integration

:::note Read Me First
These instructions assume you have a working Plex Media Server (PMS)
:::

You will need to make sure you have your URL for your Plex Server. This can be in the form of an IP address or FQDN (DNS). To facilitate the integration, you will need to obtain your Plex authentication token (X-Plex-Token).

## Obtain Your Plex Token

:::info Info
As of 2/4/2026 -- Plex integration is only available in the **experimental** branch
:::

Unlike Emby and Jellyfin which use API keys generated from the dashboard, Plex uses an authentication token. There are several ways to find your Plex token:

### Method 1: From Plex Web App (Recommended)

1. Sign into the Plex Web App
2. Browse to any item in your library and click the three-dot menu and select **Get Info**

  ![Plex Library - Get Info](/img/doc_imgs/plex-library-get-info.png)

3. Click **View XML** at the bottom left of the window that appears

  ![Plex Library - Get Info](/img/doc_imgs/view-xml.png)

4. In the new browser tab, look at the URL - your token is the value after `X-Plex-Token=`

  ![Plex Library - Get Info](/img/doc_imgs/plex-token.png)

### Method 2: From Plex Account Page

1. Go to [plex.tv/devices.xml](https://plex.tv/devices.xml) while signed in
2. Your token will be visible in the XML data as `token="YOUR_TOKEN_HERE"`

:::warning Keep Your Token Secret
Your Plex token grants full access to your server. Never share it publicly or commit it to version control.
:::

## 🛠️ Configure the Integration

1. In M3U-Editor expand the sidebar (left side), locate the integrations section and select **Media Servers**

  ![Media Server Integration Sidenav](/img/doc_imgs/media_server_integration_sidenav.png)

2. Click **Add Media Server**
3. Fill in the details:
   - **Display Name**: A friendly name for your server (e.g., "My Plex Server")
   - **Server Type**: Select **Plex** from the dropdown
   - **Host / IP Address**: Your Plex server address (e.g., `192.168.1.100` or `plex.example.com`)
   - **Port**: The default Plex port is `32400`
   - **Use HTTPS**: Enable if your server uses SSL/TLS
   - **API Key/Token**: Paste your Plex token obtained above

4. Click **Test Connection & Discover Libraries** to verify the connection and discover available libraries
5. Select which libraries you want to import (Movies and/or TV Shows)
6. Click **Create** to save the integration

:::tip
Your media server should now be displayed under the Media Servers integrations. The integration will automatically sync your Plex content based on your configured schedule.
:::

## What Gets Synced

When you sync your Plex server, M3U Editor imports:

- **Movies**: All movies from selected libraries, including metadata (title, year, genre, rating, overview, cast, poster art)
- **TV Series**: Complete series with seasons and episodes, including all associated metadata
- **Artwork**: Posters and backdrop images are proxied through M3U-Editor to protect your token

:::info
The sync process respects your library selection and genre handling settings. For large libraries, the initial sync may take several minutes.
:::