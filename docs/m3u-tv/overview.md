---
sidebar_position: 1
title: M3U TV
description: The free M3U TV app for TV, mobile, and desktop - platforms, downloads, and how to connect it to M3U Editor.
tags:
  - M3U TV
  - Getting Started
---

import { Steps, Step } from '@site/src/components/Steps';

# M3U TV

M3U TV is a free, open-source player app made for M3U Editor. It has live TV with a guide, movies, series, search, favorites, and Continue Watching that follows you between devices. It runs on TVs, phones, tablets, and computers.

M3U Editor works with any player, so M3U TV is optional. What it adds is tighter integration: [pairing a TV without typing a password](device-pairing), [push notifications](push-notifications), [Continue Watching](continue-watching) across devices, DVR and request access, and [AIOStreams](/docs/integrations/aiostreams_integration).

## Get it

| Platform | Where |
|---|---|
| iPhone, iPad, Apple TV, Mac | [TestFlight beta](https://testflight.apple.com/join/hqJYVsJr) |
| Android phones, tablets, Android TV | [Google Play](https://play.google.com/store/apps/details?id=dev.sparkison.tv) |
| Windows 10 and 11 | [Microsoft Store](https://apps.microsoft.com/detail/9P2PBHQ4XZ1L) |
| Linux, and sideloading | [GitHub releases](https://github.com/m3ue/m3u-tv/releases): APK, IPA, macOS DMG, Windows installer and ZIP, Linux ZIP |

The [M3U TV page](/tv#download) has direct download links and screenshots. In M3U Editor, **Settings → TV App → Get the app** links there too.

## Connect it

<Steps>
<Step title="Check enhanced output is on">

M3U TV needs **Enhanced output enabled**, under **Settings → General** in M3U Editor. It's on by default. If it's off, the app can't connect at all.

</Step>
<Step title="Sign in">

On a TV, choose **Pair with code** and enter the code it shows in M3U Editor from your phone or computer. See [Device Pairing](device-pairing).

On other devices you can also sign in with your server's address and a username and password: your playlist's [default login](/docs/resources/playlist-auth#default-login) or a [Playlist Auth](/docs/resources/playlist-auth).

</Step>
<Step title="Choose what each login can use">

M3U TV respects the same limits as any other player. A Playlist Auth's settings decide whether its user can use [proxied playback and transcoding](/docs/resources/playlist-auth#what-a-login-can-use), the DVR, content requests, and AIOStreams.

</Step>
</Steps>

## Platforms

| Platform | Video player | HDR |
|---|---|---|
| Android TV, Android phones and tablets | ExoPlayer, with mpv for media ExoPlayer can't play | Yes |
| Apple TV, iPhone, iPad | mpv, with Apple's player for media mpv can't play | Yes |
| Mac | mpv | Yes |
| Windows | mpv | Yes |
| Linux | mpv | On Wayland |

Video is decoded on the GPU on every platform, except Linux under X11. All platforms support external subtitles. The app is available in English, German, Spanish, French, and Simplified Chinese.

## Learn more

- [Guide and Playback](guide-and-playback): the guide, catch-up, remote buttons, and display settings
- [Device Pairing](device-pairing): signing in a TV without typing a password
- [Push Notifications](push-notifications): alerts on your phone, and what the relay does
- [Continue Watching](continue-watching): resuming across devices
- [Logs and Diagnostics](logs-diagnostics): sending logs from a device when something's wrong

M3U TV is open source under GPL-3.0, with an exception that allows app store distribution. Report issues and contribute on [GitHub](https://github.com/m3ue/m3u-tv).
