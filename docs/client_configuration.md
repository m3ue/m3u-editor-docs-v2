---
sidebar_position: 4
description: Configure clients to work with M3U Editor environment variables and settings
tags:
  - Getting Started
  - Configuratione
title: Client Configuration
hide_title: true
---

<div style={{ textAlign: 'center', padding: '0 0 2rem 0' }}>
  <img src="/img/logo.png" alt="M3U-Editor logo" style={{ width: '220px', maxWidth: '10%' }} />
</div>

# Client Configuration

## 📋 Prerequisites

Before configuring any integration:

1. Create and configure your playlist in m3u-editor
2. Note your playlist UUID from Playlists → Edit → Step 1 (Links)
3. Ensure m3u-editor is accessible from your client/media server (same network or via DNS)
4. Replace `YOUR_M3U_EDITOR_IP` with your actual IP or hostname (e.g., `192.168.1.50`, `m3u.example.com`)

## ➰ Output Methods

m3u-editor provides multiple ways to consume your playlists. Choose based on what your client supports.

### Xtream API

Standard IPTV provider protocol. Clients authenticate with username/password and receive structured data (channels, VOD, series).
**Use when:** Client supports Xtream API (TiviMate, IPTV Smarters, OTT Navigator, etc.)
**Server URL:** `http://YOUR_M3U_EDITOR_IP:36400`

### HDHomeRun

Emulates a physical HDHomeRun tuner. Provides channel discovery and live TV integration at the OS/media-server level.

**Use when:** Media server has native HDHomeRun support (Jellyfin, Emby, Plex)

**Discovery URL:** `http://YOUR_M3U_EDITOR_IP:36400/{playlist-uuid}/discover.json`

### Direct M3U Playlist

Raw M3U file for generic players. Works everywhere but minimal metadata/structure.

**Use when:** Client only supports M3U or you need maximum compatibility

**Playlist URL:** `http://YOUR_M3U_EDITOR_IP:36400/{playlist-uuid}/playlist.m3u`

**With Proxy:** `http://YOUR_M3U_EDITOR_IP:36400/{playlist-uuid}/playlist.m3u?proxy=true`

### EPG (Electronic Program Guide)

XMLTV format guide data for live TV listings. Works with HDHomeRun and some Xtream clients.

**EPG URL:** `http://YOUR_M3U_EDITOR_IP:36400/{playlist-uuid}/epg.xml`

***

## 🔎 Finding Your Playlist Details

:::tip
Information in this section will be helpful for the steps outlined in** [Client Configurations](#client-config)**
:::
In m3u-editor:

1. Go to **Playlists**
2. Click **Edit** on your playlist
3. In **Step 1 (Links)**, you'll see:
   * **Playlist UUID** (used in URLs)
   * **Username/Password** (for Xtream API)
   * Direct URLs for M3U, EPG, HDHomeRun, etc.

Copy these values as needed for your client configuration.

***

## 🔧 Client Configuration {#client-config}

### TiviMate

Popular Android IPTV client supporting both Xtream API and M3U.

#### Xtream API Setup

1. Open TiviMate
2. Select **Add Playlist**
3. Choose **Xtream Codes**
4. Enter:
   * **Server URL:** `http://YOUR_M3U_EDITOR_IP:36400`
   * **Username:** Your playlist username
   * **Password:** Your playlist password
5. Click **Next** and complete setup

#### M3U Setup

1. Open TiviMate
2. Select **Add Playlist**
3. Choose **M3U Playlist**
4. Enter playlist URL: `http://YOUR_M3U_EDITOR_IP:36400/{playlist-uuid}/playlist.m3u`
5. (Optional) Add EPG URL: `http://YOUR_M3U_EDITOR_IP:36400/{playlist-uuid}/epg.xml`
6. Click **Save**

***

:::danger Disclaimer
M3U-Editor is an independent, open‑source playlist manager — not an IPTV provider. We don’t host channels or partner with streaming services; please only use content you’re authorized to access.
:::

