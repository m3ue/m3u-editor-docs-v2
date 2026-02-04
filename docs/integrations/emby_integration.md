---
sidebar_position: 2
description: Import VOD and Series data into M3U-Editor
title: Emby Integration
hide_title: true
tags:
  - Integrations
  - Emby
  - Jellyfin
 
---

# Emby Integration

:::note Read Me First
These instructions assume you have a working Emby or Jellyfin Media server
:::

You will need to make sure you have your url for your Emby Server. This can be in the form of an IP address or FQDN (DNS). To facilitate the integration, you will also need to generate or use an existing Emby API key.

### Generate API Key
1. Access the Management Dashboard by clicking the gear icon in the upper right of the screen
  
  ![Emby Management Dashboard](/img/doc_imgs/emby_settings.png)
   
2. In the left panel scroll down to `Adanced` and select `API Keys`

  ![Emby Management Dashboard](/img/doc_imgs/emby_settings_advanced_api.png)

3. Select New API Key and assign in descriptive name for your records
  :::tip
  You can use an existing API key for the integration.
  :::

![Emby New API Key](/img/doc_imgs/emby_api_new.png)

## 🛠️ Configure the Integration

1. In M3U-Editor expand the sidebar (left side), locate the integrations section and select **Media Servers**

  ![Media Server Integration Sidenav](/img/doc_imgs/media_server_integration_sidenav.png)

2. Click **Add Media Server**
3. Fill in the details:
   - **Display Name**: A friendly name for your server (e.g., "My Emby Server")
   - **Server Type**: Select **Emby** or **Jellyfin** (depending on your server type) from the dropdown
   - **Host / IP Address**: Your Emby server address (e.g., `192.168.1.100` or `emby.example.com`)
   - **Port**: The default Emby port is `8096`
   - **Use HTTPS**: Enable if your server uses SSL/TLS
   - **API Key/Token**: Paste your Emby token obtained above

4. Click **Test Connection & Discover Libraries** to verify the connection and discover available libraries
5. Select which libraries you want to import (Movies and/or TV Shows)
6. Click **Create** to save the integration


:::tip
Your media server should now be displayed under the Media Servers integrations
:::

## What Gets Synced

When you sync your Emby server, M3U-Editor imports:

- **Movies**: All movies from selected libraries, including metadata (title, year, genre, rating, overview, cast, poster art)
- **TV Series**: Complete series with seasons and episodes, including all associated metadata
- **Artwork**: Posters and backdrop images are proxied through M3U-Editor to protect your token

:::info
The sync process respects your library selection and genre handling settings. For large libraries, the initial sync may take several minutes.
:::