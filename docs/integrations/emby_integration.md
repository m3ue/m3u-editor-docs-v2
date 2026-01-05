---
sidebar_position: 2
description: Import VOD and Series data into M3U-Editor
title: Emby Integration
hide_title: true
tags:
  - Integrations
  - Emby
  - Jellyfin
  - Experimental
 
---

# Emby Integration

:::note Read Me First
These instructions assume you have a working Emby or Jellyfin Media serverv
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
3. FIll in the details that were gathered earlier and click **Create**
   
  ![Create Media Server integration for Emby](/img/doc_imgs/media_server_integration_configuration.png)

:::tip
Your media server should not be displayed under the Media Servers integrations
:::
