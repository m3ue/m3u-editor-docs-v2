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
| **Default start page** | Home | All | The screen the app opens on: Home, Search, Live TV, Movies, or Series. *(v1.2.5+)* Also [Sports](sports). If the screen you pick isn't available for this login, the app opens on Home. |
| **Home screen** | Simplified | TV, desktop | **Spotlight** adds a large hero above the Home rows. It shows the backdrop, title, and details of whatever you're focused on, and the rows dock beneath it as you move. For a live channel, the hero uses the current programme's artwork from the guide. Phones and tablets always use the simplified Home. |
| **Live TV layout** | List | All | How Live TV opens: **List**, **Grid**, or **Timeline** (the programme guide). |
| **Live TV channels column** | Logo Only | All | What the guide's channel column shows: **Logo + Title**, **Logo Only**, or **Title Only**. |
| **EPG starts at** | Current time | All | Where the guide scrolls to when it opens: now, or **Prime time** (8 PM). |
| **Guide preview playback** | Off | TV, desktop (not web) | Play the selected channel in the guide's preview panel. **Play after pausing** starts it once you rest on a live programme. **Press OK to preview** starts it on the first OK, and a second OK opens the full-screen player. **Off** shows artwork only. |
| **Preview delay** | 5 seconds | With **Play after pausing** | How long to rest on a programme before the preview starts: 2, 3, 5, 8, or 10 seconds. |

### Navigation & Home

*(v1.2.5+)* **Navigation & Home**, under **Layout**, lets you clean up the app. It lists your sections (Live TV, Movies, Series, and so on), with two switches for each:

- **Nav** shows the section in the sidebar or bottom bar.
- **Home** shows its row on Home.

The two are separate, so you can take a section out of the nav and still reach it from its Home row. The order applies to both. With a remote, press OK on a row to pick it up, move it with Up and Down, and press OK to drop it, or Back to cancel. On a touchscreen, drag a row by its handle. **Reset to default** restores the original order and switches.

Home and Search stay at the top, Notifications and Settings stay at the bottom, and Continue Watching stays first on Home. AIOStreams and Requests have no Home row until you turn one on.

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
| **DVR** | **Auto-skip commercials** | On | In [DVR](/docs/integrations/dvr_integration) recordings with commercial detection, skip marked breaks automatically. Off, the player offers **Skip commercial** instead. |

## Storage

*(v1.2.5+)* What M3U TV keeps on this device, with a way to clear each part. The summary at the top shows the **Total**, the space your **Playlists** take (each one's channels, movies, series, and guide), and the **Artwork** cache.

| Section | Setting | Default | What it does |
|---|---|---|---|
| **Playlists** | One row per saved playlist | | How many items it has stored and their size, or **Not stored on this device**. Select it to clear what's stored. The active playlist downloads again right away, and any other the next time you switch to it. |
| | **Playlists kept on this device** | The 3 most recent | How many playlists keep their content stored, most recently used first: 1, 2, 3, or 5. A stored playlist opens at once when you [switch](#playlists) to it. The rest are cleared after you connect or switch. |
| **Guide** | **Guide data** | | The size of the active playlist's guide. Select it to download the guide again. The current guide stays visible while it reloads. |
| | **EPG refresh interval** | 1 hour | How often guide data is refreshed in the background: 30 minutes, 1 hour, or 6 hours. |
| **Artwork** | **Artwork cache** | | Posters and logos. Select it to clear them. They reload as you browse. |

**Clear everything**, at the bottom, removes your other playlists' stored content and all artwork, and downloads the active playlist's channels, movies, series, and guide again.

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
| **Playlists** | The playlists saved on this device. See [Playlists](#playlists). |
| **Active Viewer** | Switch between the viewers on this login, or add one with **Add New Viewer**. Each viewer has its own [Continue Watching](continue-watching) and favorites, like profiles on a streaming service. Shown when the login has viewers. |
| **Disconnect** | Sign out of the active playlist and remove it from this device. Any other saved playlists stay, listed under **Saved Playlists** when you sign in. If it was the only one, you'll need to [pair](device-pairing) or sign in again. |

### Playlists

*(v1.2.5+)* M3U TV can keep several playlists on one device and switch between them. Each one is a login: a playlist's [default login](/docs/resources/playlist-auth#default-login), a [Playlist Auth](/docs/resources/playlist-auth), or a [playlist alias](/docs/resources/playlist-alias), on one server or several.

**Settings → Account → Playlists** lists them and marks the active one. Select a playlist to **Switch to Playlist**, **Rename Playlist**, or **Remove Playlist**. **Add Playlist** pairs or signs in to another one, and it becomes the active playlist.

- **Names:** a playlist is named after its login's username. When the same username is saved for two servers, the server is added, such as `admin@tv.example.com`. Your default login opens every playlist with the same username, so those are numbered. **Rename Playlist** gives one a clearer name.
- **Switching:** a playlist with its content stored on the device opens at once, then signs in and refreshes in the background. If it can't sign in, it stays on screen with the error at the top of Home. A playlist that isn't stored downloads first. How many are kept is set under [Storage](#storage).
- **What each playlist keeps:** its favorites, active viewer, proxy and transcoding choices, and guide. Your appearance and playback settings apply to every playlist.
- **Notifications** come from the active playlist only.

## Related

- [Guide and Playback](guide-and-playback) - using the guide, the player, and Multiview
- [M3U TV](overview) - getting the app and connecting it
