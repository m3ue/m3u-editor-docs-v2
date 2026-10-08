---
sidebar_position: 2
title: Guide and Playback
description: The M3U TV programme guide, catchup replay, remote buttons, display settings like refresh-rate matching and deinterlacing, sorting, and cache clearing
tags:
  - M3U TV
  - EPG
  - Playback
---

# Guide and Playback

This page covers the parts of M3U TV you use every day: the programme guide, catchup replay, remote buttons, and the playback and display settings.

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

## Remote Buttons

*(v1.2.0+)* During playback, dedicated remote buttons work alongside the D-pad:

| Button | Live TV | Movies and series |
|---|---|---|
| **Channel up / down** | Next or previous channel | (no effect) |
| **Fast forward / Rewind**, **Skip forward / back** | (no effect) | Seek 10 seconds |

## Display Settings

Under **Settings → Appearance → Display**:

| Setting | Platforms | What it does |
|---|---|---|
| **Match display refresh rate** | Android TV and Android, Apple TV, Windows | Switches the display to the video's frame rate when playback starts, so 24p films and 50 Hz broadcasts play without judder. The screen can briefly flash or go blank while it switches. Off by default. |
| **Deinterlace video** *(v1.2.2+)* | Everything except Android | Smooths out comb lines on interlaced channels (such as 1080i and 576i). Uses more CPU. |

Refresh-rate matching *(v1.2.0+ on Android TV, improved in v1.2.2)* prefers clean multiples of the video's frame rate and matches NTSC rates (23.976, 29.97, 59.94) exactly. On Apple TV, v1.2.2 also fixes HDMI mode flapping.

## Sorting

*(v1.2.2+)* The **Sort By** dialog on the Live TV, Movies, and Series screens has a **Favorites First** switch, on by default. It keeps your favorites at the top of whatever sort you pick. Each screen remembers its own choice when filter persistence is on.

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

- [Logs & Diagnostics](./logs-diagnostics.md) - collect and send logs when something isn't working
- [Continue Watching](./continue-watching.md)
- [EPG Setup](../resources/epg-setup.md) - guide data on the editor side
