---
sidebar_position: 2
title: Guide and Playback
description: The M3U TV programme guide and its preview player, catchup replay, Multiview, the player and its remote buttons, trailers, refresh-rate matching, sorting, and cache clearing
tags:
  - M3U TV
  - EPG
  - Playback
---

# Guide and Playback

This page covers the parts of M3U TV you use every day: the programme guide, catchup replay, Multiview, and the player. Every setting mentioned here is listed in [Settings](settings).

## Programme Guide

*(v1.2.1+)* The Live TV timeline guide is built for D-pad remotes. A cursor moves through the grid instead of focus jumping between hundreds of programme blocks.

| Button | What it does |
|---|---|
| **Left / Right** | Step through a channel's programmes. Left of the first programme goes to the channel, then to the sidebar. Right past the last programme moves to the next day. |
| **Up / Down** | Move between channels at the same time. On a live programme the cursor follows "now", so stepping down stays on what's live. |
| **CH+ / CH-** or **Page Up / Page Down** | Page through channels |
| **OK** | Play a live programme, replay a past one (catchup), or open options for an upcoming one |
| **Hold OK** | Open options for any programme |
| **Back** | From a programme, return to its channel. From the channel, go to the sidebar. |

On a TV or desktop screen, a preview panel above the grid shows the selected programme's artwork, a **LIVE** or **REPLAY** tag, the time range and time left (or when it starts), the episode, category, rating and year chips (**NEW**, **PREMIERE**, **REPEAT**), the recording state, and the description. Phones and tablets get their own layout.

*(v1.2.2+)* On desktop, the arrow keys work in the guide too.

### Preview playback

*(v1.2.3+)* The preview panel can play the channel you're on, so you can check what's showing without leaving the guide. Turn it on with **Settings → Appearance → Guide preview playback**:

| Mode | How it works |
|---|---|
| **Off** (default) | The panel shows artwork only. |
| **Play after pausing** | Rest on a live programme and it starts playing in the panel, after the **Preview delay** (5 seconds by default). |
| **Press OK to preview** | OK starts the channel in the panel. OK again on the same channel opens the full-screen player. |

Preview playback is available on TVs and desktop, not on phones, tablets, or the web app.

:::tip More guide details with a newer editor
The extra details (episode numbers, badges, ratings) come from M3U Editor v0.13.1 or later. With an older editor, the guide still works but shows less.
:::

## Catchup (Replay)

When your provider supports catchup, past programmes in the guide show **REPLAY** and play with **Watch replay**.

*(v1.2.2+)* Seeking in a replay works across the whole programme:

- The scrub bar uses the programme's real start and end from the guide, so it always shows and has the right length, even when the stream is transcoded or the provider doesn't support seeking.
- Long jumps reopen the replay at the target minute. Providers only accept whole-minute start times, so a jump can land up to 59 seconds before the target, never after.
- Short skips inside what's already buffered seek in place, without a new request.
- On mpv (Apple devices, desktop, and the Android fallback), opening a replay now takes one request to the provider instead of three, which makes jumps noticeably faster on slow providers.

When you stop or leave a stream, the app tells M3U Editor right away so the proxy connection is released. This keeps playlists with a one-connection limit from returning "too many connections" when you switch quickly.

## Multiview

Watch up to nine live channels at once. In Live TV, hold OK on a channel and choose **Add to Multiview**, then open **Multiview** from the Live TV screen once it has a channel.

- Only one tile plays sound. Moving between tiles moves the sound with you, and OK makes a tile the sound source.
- Hold OK on a tile for its menu: **Move** it, **Make Featured** (shown larger, with three channels or fewer), **Picture-in-Picture** (with exactly two), **Open Fullscreen** in the normal player, or **Remove from Multiview**.
- **Manage Multiview** removes channels or clears them all.

Multiview works everywhere except the web app. Each tile is a separate stream, so keep within your provider's connection limit.

## The Player

### Remote buttons

*(v1.2.0+)* During playback, dedicated remote buttons work alongside the D-pad:

| Button | Live TV | Movies and series |
|---|---|---|
| **Channel up / down** | Next or previous channel | (no effect) |
| **Fast forward / Rewind**, **Skip forward / back** | (no effect) | Seek 10 seconds |

### On-screen details

- *(v1.2.3+)* The player shows the current time, and **Ends at** with the time the movie, episode, or live programme finishes.
- **Skip Intro** and **Skip Credits** appear on movies and episodes that [TheIntroDB](https://theintrodb.org) has timestamps for, and **Up next** offers the next episode as the credits start. *(v1.2.3+)* To turn this off, go to **Settings → Integrations → TheIntroDB**.
- In [DVR](/docs/integrations/dvr_integration) recordings with commercial detection, marked breaks are skipped automatically. Turn off **Settings → Playback → Auto-skip commercials** to get a **Skip commercial** button instead.
- *(v1.2.3+)* Movies and series played with a [transcoding profile](/docs/proxy/transcoding) can't be seeked, so the player hides the seek bar and shows **Seeking isn't available while transcoding**. The direct proxy, catchup, and live TV are not affected. To seek, choose **Direct (no transcoding)** under **Settings → Playback**.

### Full screen on desktop

*(v1.2.3+)* On Mac, Windows, and Linux, press **F11** to go full screen, or use the full-screen button next to the volume slider. On Windows and Linux, **Alt+Enter** works too, and on a Mac the green window button and **Ctrl+Cmd+F** stay in sync with it. **Escape** leaves full screen first, before it goes back.

## Trailers

*(v1.2.3+)* Movie and series pages have a **Trailer** button when a YouTube trailer is known. With M3U Editor v0.13.5 or later, a season with its own trailer gets its own button too, like **Season 2 Trailer**. Trailers come from your provider or [TMDB](/docs/integrations/tmdb_integration).

Trailers open outside M3U TV: in the YouTube app where it's installed, otherwise in the browser. On a TV that can't open the link, a QR code appears so you can watch it on your phone.

## Refresh-rate Matching

**Settings → Appearance → Match display refresh rate** switches the display to the video's frame rate when playback starts, so 24p films and 50 Hz broadcasts play without judder. It's available on Android TV and Android, Apple TV, and Windows. It's off by default, except on Apple TV.

Refresh-rate matching *(v1.2.0+ on Android TV, improved in v1.2.2)* prefers clean multiples of the video's frame rate and matches NTSC rates (23.976, 29.97, 59.94) exactly. On Apple TV, v1.2.2 also fixes HDMI mode flapping, and *(v1.2.3+)* MKV files that don't declare a frame rate are matched too.

The screen can briefly flash or go blank while it switches. On Windows, a short blank screen before playback is the display changing mode.

## Sorting

On the Movies and Series screens, **Sort By** orders titles by the provider's order, rating, or release date. *(v1.2.3+)* Movies can also sort by **Recently Added**, and series by **Recently Updated**. With M3U Editor v0.13.5 or later, Recently Added uses the date your provider or media server added the title, not the date M3U Editor imported it.

*(v1.2.2+)* On Live TV, Movies, and Series, **Favorites First** (on by default) keeps your favorites at the top of whatever sort you pick. Each screen remembers its own sort when **Filter Persistence** is on in [Settings](settings#filters).

## Clearing the Cache

*(v1.2.0+)* **Clear & Refresh**, under **Settings → Playback → Content Cache**, lets you choose what to clear instead of wiping everything:

| Option | Clears |
|---|---|
| **Everything** | Channels, movies, series, guide data, and artwork |
| **Content only** | Channels, movies, and series |
| **Guide (EPG) only** | Guide data. The current guide stays visible while it reloads. |
| **Images only** | Posters and logos. They reload as you browse. |

Cleared content is reloaded from your source in the background.

## Related

- [Settings](./settings.md) - every M3U TV setting
- [Logs & Diagnostics](./logs-diagnostics.md) - collect and send logs when something isn't working
- [Continue Watching](./continue-watching.md)
- [EPG Setup](../resources/epg-setup.md) - guide data on the editor side
