---
sidebar_position: 1.5
title: Settings
description: Every setting in M3U TV, where to find it, its default, and which devices show it.
tags:
  - M3U TV
  - Settings
  - Reference
---

# Settings

M3U TV keeps its settings on each device, so a TV and a phone signed in with the same login can be set up differently. Open **Settings** from the sidebar. This page goes through it in order.

Some settings only appear where they do something. For example, there's no **Navigation sound** on a phone, because the click only plays when you move with a remote or keyboard. The **Shown on** column says where each one appears.

:::tip Settings that live in M3U Editor
What a login can use (the proxy, transcoding, DVR, requests, AIOStreams) is decided in M3U Editor, on the login's [Playlist Auth](/docs/resources/playlist-auth#what-a-login-can-use). If a setting below is missing, check there first.
:::

## General

| Section | Setting | What it does |
|---|---|---|
| **Language & Region** | **Language** | The app's language: **System language** (the default), English, German, Spanish, French, or Chinese (Simplified). |
| **App** | Version | The installed version, and whether an update is available. **View release** opens the release page, or shows a QR code for your phone on a TV. |
| | **Logs & Diagnostics** | Device details and this session's logs, with **Upload to server**. See [Logs and Diagnostics](logs-diagnostics). |
| **Connection** | Status | The server you're connected to, its **Source**, **Server Timezone**, and the **Last error** if there was one. **Retry connection** and **Edit server settings** are here too. |

## Appearance

### Layout

| Setting | Default | Shown on | What it does |
|---|---|---|---|
| **Default start page** | Home | All | The screen the app opens on: Home, Search, Live TV, Movies, or Series. |
| **Home screen** | Simplified | TV, desktop | **Spotlight** adds a large hero above the Home rows. It shows the backdrop, title, and details of whatever you're focused on, and the rows dock beneath it as you move. For a live channel, the hero uses the current programme's artwork from the guide. Phones and tablets always use the simplified Home. |
| **Live TV layout** | List | All | How Live TV opens: **List**, **Grid**, or **Timeline** (the programme guide). |
| **Live TV channels column** | Logo Only | All | What the guide's channel column shows: **Logo + Title**, **Logo Only**, or **Title Only**. |
| **EPG starts at** | Current time | All | Where the guide scrolls to when it opens: now, or **Prime time** (8 PM). |
| **Guide preview playback** | Off | TV, desktop (not web) | Play the selected channel in the guide's preview panel. **Play after pausing** starts it once you rest on a live programme. **Press OK to preview** starts it on the first OK, and a second OK opens the full-screen player. **Off** shows artwork only. |
| **Preview delay** | 5 seconds | With **Play after pausing** | How long to rest on a programme before the preview starts: 2, 3, 5, 8, or 10 seconds. |

### Display

| Setting | Default | Shown on | What it does |
|---|---|---|---|
| **HDR mode** | On | Windows, Linux | Let HDR videos switch the display into HDR mode. |
| **Match display refresh rate** | Off (on for Apple TV) | Android TV and Android, Apple TV, Windows | Switch the display to the video's frame rate when playback starts, so 24p films and 50 Hz broadcasts play without judder. The screen can briefly flash or go blank while it switches. See [Guide and Playback](guide-and-playback#refresh-rate-matching). |
| **Deinterlace video** | Off | Everything except Android | Smooth out comb lines on interlaced channels (such as 1080i and 576i). Uses more CPU. |
| **Navigation sound** | On | TV, desktop | A click sound when you move focus with the remote or keyboard. |
| **Optimize for** | Quality | All | **Quality** loads sharper images and uses more memory. **Speed** loads faster with lower-quality images, which helps on low-memory TV boxes. |
| **Display size** | Very Large on TV, Normal elsewhere | All | Text and layout size: **Normal**, **Large**, or **Very Large**. |

### Filters

**Filter Persistence** (off by default) remembers each screen's sort and filters between visits, including the **Favorites First** switch. Off, they reset each time you open the screen.

## Playback

| Section | Setting | Default | What it does |
|---|---|---|---|
| **Streaming** | **Proxy Playback** | Off | Stream through [M3U Proxy](/docs/proxy/overview) on this device. Shown only when the login is allowed to use the proxy. If the playlist forces the proxy, this says so and can't be turned off. |
| | **Live transcoding profile**, **VOD & Series transcoding profile** | Default | With the proxy on, pick a [transcoding profile](/docs/proxy/transcoding) for this device. **Default** uses the playlist's profile, and **Direct (no transcoding)** uses the proxy without transcoding. Only the profiles the login may use are listed. |
| **Content Cache** | **EPG refresh interval** | 1 hour | How often guide data is refreshed in the background: 30 minutes, 1 hour, or 6 hours. |
| | **Clear & Refresh** | | Clear cached content, guide data, or images, and reload them. See [Guide and Playback](guide-and-playback#clearing-the-cache). |
| **DVR** | **Auto-skip commercials** | On | In [DVR](/docs/integrations/dvr_integration) recordings with commercial detection, skip marked breaks automatically. Off, the player offers **Skip commercial** instead. |

## Integrations

| Setting | Default | What it does |
|---|---|---|
| **Trakt** | Not connected | **Connect with Trakt** syncs your watch history with [Trakt](https://trakt.tv). It signs in with a code, like [device pairing](device-pairing). |
| **TheIntroDB** | On | Show **Skip Intro** and **Skip Credits** for movies and episodes, using community timestamps from [TheIntroDB](https://theintrodb.org). There's no account or key. Turn it off and the player never contacts TheIntroDB, and **Up next** appears at its usual time near the end instead of when the credits start. |

## What's New

The release notes for your version and every newer one. Left and Right change the version. M3U Editor has its own **What's New** too.

## Account

| Setting | What it does |
|---|---|
| **Active Viewer** | Switch between the viewers on this login, or add one with **Add New Viewer**. Each viewer has its own [Continue Watching](continue-watching) and favorites, like profiles on a streaming service. Shown when the login has viewers. |
| **Disconnect** | Sign out. You'll need to [pair](device-pairing) or sign in again. |

## Related

- [Guide and Playback](guide-and-playback) - using the guide, the player, and Multiview
- [M3U TV](overview) - getting the app and connecting it
