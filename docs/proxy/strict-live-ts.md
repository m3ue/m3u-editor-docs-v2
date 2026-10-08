---
sidebar_position: 6
title: Strict Live TS
description: Steadier live MPEG-TS playback in Kodi and other PVR clients - no buffering loops after tuning, faster stall detection, and no jump-back on reconnect.
tags:
  - Proxy
  - Kodi
  - PVR
  - Live TV
---

# Strict Live TS

Strict Live TS makes live MPEG-TS channels play more steadily in PVR clients like Kodi's IPTV Simple Client. Turn it on if you see:

- a "play for a second, buffer, repeat" loop after changing channels
- buffering right after tuning, or slow channel changes
- playback jumping back a few seconds after a brief dropout

Turn it on for a playlist with **Enable Strict Live TS Handling**, in its **Output** tab under **Streaming Output**. It applies to live TS channels that aren't being [transcoded](transcoding).

## What it changes

| Change | Why |
|---|---|
| **Treats live streams as unseekable.** Players' range requests are ignored, and the response never has a length. | Some players treat live TV like a file and keep requesting byte ranges, which causes the buffering loop. |
| **Pre-buffers** about 256 KB (half a second to a second) before sending anything. | A smoother start, without the first-byte stall. |
| **Fails over faster.** If no data arrives for 2 seconds, the source is marked bad for 60 seconds and the proxy [fails over](failover). | Stops the player reconnecting over and over to a stalled source. |
| **Answers `HEAD` requests itself**, without contacting the provider. | Avoids extra provider connections. |
| **Trims the replay after a reconnect.** *(Proxy v0.4.31+)* | When a provider drops the connection, it usually resumes a few seconds back. The proxy finds where the player left off and continues from there, so nothing replays. |

It adds a short delay when tuning (the pre-buffer) and uses a little memory per stream, and no extra CPU.

## Settings

To turn it on for every live TS stream instead, set `STRICT_LIVE_TS=true` on the proxy. The details can be tuned with the proxy's [environment variables](configuration#strict-live-ts):

| Variable | Default | What it does |
|---|---|---|
| `STRICT_LIVE_TS_PREBUFFER_SIZE` | `262144` | Bytes to pre-buffer (256 KB). |
| `STRICT_LIVE_TS_PREBUFFER_TIMEOUT` | `10` | Longest wait, in seconds, for the pre-buffer to fill. |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` | `2` | Seconds without data before the source is marked bad. |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_COOLDOWN` | `60` | Seconds a bad source is avoided. |
| `STRICT_LIVE_TS_OVERLAP_TRIM` | `true` | Trim the replay after a reconnect. |

## Troubleshooting

| Problem | Try |
|---|---|
| Still buffering after tuning | A bigger pre-buffer: `STRICT_LIVE_TS_PREBUFFER_SIZE=524288`. |
| Channel changes feel slow | A smaller pre-buffer: `131072`, and `STRICT_LIVE_TS_PREBUFFER_TIMEOUT=5`. |
| It fails over too often | The provider pauses briefly now and then. Raise `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` to 5. |
| It doesn't seem to apply | Strict mode only applies to live TS streams (a `.ts` address or a `/live/` path) that aren't transcoded. |
