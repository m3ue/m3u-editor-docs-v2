---
slug: m3u-tv-1-1-1-2-grows-up
title: "M3U TV 1.1 and 1.2: the app grows up"
description: M3U TV 1.1 and 1.2 add Multiview, Skip Intro, mpv playback everywhere, a remote-friendly programme guide, scheduling recordings from the TV, display scaling, refresh-rate matching, and in-app logs.
authors: [sparkison]
tags: [release, tv]
image: /img/tv/tv2.webp
---

M3U TV 1.0 got the app onto every screen. The 1.1 and 1.2 series, from August to early October, were about making it feel at home on each of them: a better player, a guide built for a remote, and a long list of settings for getting the picture right.

<!-- truncate -->

## One player engine

1.1.0 moved every platform's playback onto **mpv**, the same engine on Apple devices, Mac, Windows, Linux, and as the fallback on Android when ExoPlayer can't play a stream. Formats that played on one device but not another now behave the same everywhere, and work on one platform helps all of them.

## Multiview

Watch up to nine live channels at once (1.1.0). Hold OK on a channel and choose **Add to Multiview**. Only one tile plays sound, and it follows you as you move around the grid. Feature one tile larger, or switch to picture-in-picture with two. See [Guide and Playback](/docs/m3u-tv/guide-and-playback#multiview).

## Skip Intro and Skip Credits

Movies and episodes get **Skip Intro** and **Skip Credits** buttons (1.1.0), using community timestamps from [TheIntroDB](https://theintrodb.org). *(1.1.3)* **Up next** offers the next episode as the credits start, and series pages got a richer season view.

## A guide built for the remote

The guide in 1.2.1 replaces focus jumping between hundreds of programme blocks with a **cursor** that moves through the grid. Up and down stay on what's live, CH+ and CH- page through channels, and a preview panel shows the selected programme's artwork, badges, and recording state. Earlier, 1.1 added recording indicators to the guide, a list of catch-up shows on each channel, and an On Now section.

![The programme guide](/img/tv/tv2.webp)

*(1.2.2)* Catch-up replays can now be seeked across the whole programme, and open faster on slow providers.

## Recording from the TV

You no longer need a computer to set up recordings. 1.1 lets you schedule a single airing, or several hand-picked airings at once, from the TV, and search finds shows in the guide and in your library, not just channel names.

## Getting the picture right

- **Display size** (1.1.4) scales the whole interface for the distance you sit from the screen.
- **Match display refresh rate** (Android TV in 1.2.0, improved in 1.2.2) switches the display to the video's frame rate, so films play without judder.
- **Deinterlace video** (1.2.2) for 1080i and 576i broadcast channels.
- **Remote buttons** (1.2.0): channel up and down change channels, and fast forward and rewind seek.

## Also in 1.1 and 1.2

- **Sort options** on Movies, Series, and Live TV, with **Favorites First** (1.2.2).
- **More Like This** and **actor filmography** on movie and series pages.
- **What's New** in Settings, with the release notes for your version.
- **Logs & Diagnostics** (1.2.1): send a device's logs to your M3U Editor when something isn't working. See [Logs and Diagnostics](/docs/m3u-tv/logs-diagnostics).
- **Clear & Refresh** lets you choose what to clear: everything, content, the guide, or images.
- A **Default start page** (1.1.2), a setting to turn off the navigation click sound, and volume control on desktop.

Every setting the app has is listed in [Settings](/docs/m3u-tv/settings).
