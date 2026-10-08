---
sidebar_position: 8
description: Record each stream's resolution, codecs, and audio with ffprobe, for faster channel switching and smarter transcoding, merging, and file naming.
tags:
  - Advanced
  - Channels
  - Stream Probing
title: Stream Probing
---

# Stream Probing

Probing opens a stream for a moment with ffprobe and records what's in it: resolution, video and audio codecs, frame rate, HDR, bitrate, and audio channels. M3U Editor then knows each stream's details without opening it again, which it uses for:

- **Faster channel switching** in players that read stream details from the Xtream API, like Emby with the [emby-xtream](https://github.com/firestaerter3/emby-xtream) plugin (v1.4.69.0 or later)
- **[Rule-based transcoding](/docs/proxy/transcoding#adaptive-profiles)**, which picks a profile from a channel's codec and resolution
- **[Choosing merge masters](auto-merge-channels#choosing-the-master)** by codec or resolution
- **Quality details in [`.strm` file names](strm-files)** and NFO files
- the stream details shown on each channel

## Probe after every sync

Edit the playlist and open **Processing → Stream Probing**. Live channels, and movies and episodes, have their own settings:

| Setting | Default | What it does |
|---|---|---|
| **Probe Live streams after sync**, **Probe VOD & series streams after sync** | Off | Probe after each sync. |
| **Only probe ... that have not been probed before** | On | Only probe new items, so each sync stays quick. Turn off for a while to re-probe everything, for example after a provider changes codecs. |
| **Include disabled ... streams** | Off | Probe disabled items too. |
| **Retry failed probes after (days)** | 7 | *(v0.13.2+)* Skip movies and episodes whose probe failed, until this many days have passed. `0` retries every sync. |
| **Pause probing when failures exceed (%)** | 80 | *(v0.13.2+)* Stop a run once most probes are failing, which usually means the provider is down. `0` never pauses. |
| **Series episodes to probe** | All Episodes | *(v0.13.2+)* Probe every episode, or just the first of each season or series and copy its details to the rest. Much faster for big series catalogs. |
| **Parallel processing** | Off | Probe several streams at once. Faster, but uses more provider connections. |
| **Probe timeout (seconds)** | 15 | How long to wait for each stream. |

New channels are included in probing unless you turn off **Enable stream probing by default** in **Processing → Auto-Enable Settings**.

## Probe on demand

Select channels (or movies, or series) and use **Probe Streams** from the bulk actions. It probes what you selected, even items excluded from automatic probing.

To keep items out of automatic probing, select them and use **Disable Probing**. The **Stream probed** and **Probe failed** filters find what still needs probing, or what failed. Hover a channel's probe icon to see when it was last probed.

## Go easy on your provider

Every probe opens a connection, like a viewer would.

- **Settings → Sync Options** controls how many requests run at once (**Max concurrent requests**) and adds a pause between them (**Request delay**). Probing follows both.
- With [Provider Profiles](playlist-pooled_providers), probing waits for a free connection on your primary account before each probe, for up to 2 minutes.
- A failed movie or episode probe is remembered and retried later, rather than every sync.

## Troubleshooting

| Problem | What to check |
|---|---|
| Probing takes a long time | Each probe can take up to the timeout. For big catalogs, use **Only probe ... not probed before**, sample series episodes, or turn on **Parallel processing** if your provider allows it. |
| Some streams fail | Offline, geo-blocked, or unusual streams can't be probed. Players and features fall back to working without their details. |
| A run stopped with "VOD stream probing paused" | Too many probes failed, usually because the provider was down. The rest are tried on the next sync. |
| Emby still switches channels slowly | The channels show as probed, the Emby plugin uses the Xtream API (not an M3U URL), and Emby has re-synced its channels since probing. |
