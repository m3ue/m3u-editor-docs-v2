---
slug: m3u-editor-0-13-5-m3u-tv-1-2-3
title: "M3U Editor 0.13.5 and M3U TV 1.2.3: spotlight, previews, and privacy"
description: M3U TV gets a Spotlight home screen, live previews in the guide, trailers, and new sorts. M3U Editor adds Privacy mode, catch-up for plain M3U providers, local media in merged playlists, and more flexible DVR padding.
authors: [sparkison]
tags: [release, editor, tv, proxy]
image: /img/tv/tv1.webp
---

This release lands on both sides at once. M3U TV 1.2.3 gives the app a new look on the big screen, and M3U Editor 0.13.5 fills in features people have been asking about for a while, from catch-up on plain M3U providers to blurring your logins for screenshots.

<!-- truncate -->

## M3U TV 1.2.3

### A Spotlight home screen

Set **Settings → Appearance → Home screen** to **Spotlight**, and Home gets a large hero above its rows. It shows the backdrop, title, and details of whatever you're on, and the rows dock beneath it as you move. Live channels use the current programme's artwork from the guide. Spotlight is for TVs and desktop; phones and tablets keep the simplified Home.

![The Spotlight home screen](/img/tv/tv1.webp)

### Live previews in the guide

The guide's preview panel can now play the channel you're on, so you can check what's showing without leaving the guide. Choose **Play after pausing** to start it when you rest on a programme, or **Press OK to preview** to start it on demand, under **Settings → Appearance → Guide preview playback**. See [Guide and Playback](/docs/m3u-tv/guide-and-playback#preview-playback).

### Trailers and new sorts

Movie and series pages get a **Trailer** button, and seasons with their own trailer get one too. Trailers open in the YouTube app or your browser, and on a TV that can't open them, as a QR code for your phone.

Movies can now sort by **Recently Added**, and series by **Recently Updated**. Recently Added now uses the date your provider or media server added the title, not the date M3U Editor imported it.

![Movies sorted by Recently Added](/img/tv/tv3.webp)

### Also in M3U TV 1.2.3

- The player shows the current time and when the programme, movie, or episode **ends**.
- **TheIntroDB** can be turned off under **Settings → Integrations**, if you'd rather not see Skip Intro and Skip Credits.
- **Full screen on desktop** with F11, Alt+Enter on Windows and Linux, or the new player button.
- Movies and series played with a transcoding profile now say that **seeking isn't available**, instead of offering a seek bar that does nothing.
- Multichannel audio on iPhone and iPad, refresh-rate matching for MKV files that don't declare a frame rate, and smoother playback on Android with mpv.
- **Copy code** on the pairing screen for desktop and phones.

Every setting is now documented in one place: [M3U TV Settings](/docs/m3u-tv/settings).

## M3U Editor 0.13.5

### Privacy mode

Sharing a screenshot of M3U Editor used to mean carefully cropping out provider URLs and passwords. Turn on **Privacy mode** under **Settings → General**, and URLs, usernames, passwords, and API keys are blurred everywhere in the app until you hover over them. See [Settings Reference](/docs/advanced/settings-reference#general).

### Catch-up for every provider

Catch-up used to work well with Xtream providers and less well with plain M3U ones. M3U Editor now understands every catch-up style Kodi does, so providers like EPGenius work too, and reads archive lengths the way Kodi, TiviMate, and IPTVnator do. The M3U output uses the catch-up form all three understand. See [Catch-up](/docs/resources/channels-vod-series#catch-up).

### Your local media in a provider playlist

**Prefer media server sources** plays your own copy of titles your provider also has. Titles that are only on your media server can now join them in one lineup: **Create Merged Playlist with Local Media** builds a Merged Playlist of the provider playlist plus your media server libraries, without listing anything twice. Network playlists can be merged in too. See [Merged Playlists](/docs/resources/merged-playlist#add-your-local-media-to-a-provider-playlist).

### DVR padding both ways

Recording rules can now **start late** or **finish early**, as well as start early and end late, in seconds or minutes. Start two minutes late to skip the end of the previous show, or finish early to drop the closing credits. See [DVR](/docs/integrations/dvr_integration#recording-rules).

### Also in M3U Editor 0.13.5

- **A bad download no longer wipes your guide.** If a guide source sends an error page or a cut-off file, the EPG keeps its last good guide.
- **Retry the same stream before failing over** (with M3U Proxy 0.4.34): when a provider drops a healthy live stream, reconnect to it once before switching to a backup. Off by default. See [Failover](/docs/proxy/failover#when-the-provider-closes-a-live-stream).
- **Jellyfin 12** support.
- New managed Emby libraries get Emby's metadata and image downloaders turned on, so items get artwork, cast, and genres.
- A channel's **EPG shift** now applies to the Xtream API guide too.
- TMDB lookups no longer repeat on every sync, and TMDB-filled plots and covers survive provider refreshes.

As always, the full lists are in the [M3U Editor](https://github.com/m3ue/m3u-editor/releases) and [M3U TV](https://github.com/m3ue/m3u-tv/releases) release notes.
