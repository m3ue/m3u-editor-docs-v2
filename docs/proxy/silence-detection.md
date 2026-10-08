---
sidebar_position: 8
title: Silence Detection
description: Fail over automatically when a live channel's audio goes silent, even though the stream is still connected.
tags:
  - Proxy
  - Failover
  - Audio
  - Live TV
---

# Silence Detection

Sometimes a provider's stream stays connected and keeps sending data, but the sound has gone: a frozen picture, an encoder fault, or dead air. Normal failover can't tell, because the stream looks healthy. Silence detection listens to the audio, and [fails over](failover) when it stays silent.

It only applies to live channels, and only helps when the channel has a backup to fail over to.

## Turn it on

In **Settings → Proxy**, under **Failover & Recovery**, turn on **Enable silence detection**. The settings below it apply to every proxied live stream, starting with the next stream that opens.

| Setting | Default | What it does |
|---|---|---|
| **Silence threshold (dB)** | `-50` | Audio quieter than this counts as silent. `-40` is stricter. |
| **Silence duration (seconds)** | `3` | How long the audio must stay silent within a check to count. |
| **Check interval (seconds)** | `10` | How often the audio is checked. |
| **Consecutive silent checks before failover** | `3` | How many silent checks in a row trigger failover, so a pause between shows doesn't. |
| **Monitoring grace period (seconds)** | `15` | How long to wait after a stream starts before checking. |

With the defaults, a channel fails over after about 30 seconds of silence. The silent count resets as soon as sound comes back.

Each check runs a short FFmpeg analysis of audio the proxy already has, so it doesn't open extra provider connections. It uses a little CPU per stream, and up to about 5 MB of memory.

Without M3U Editor, the same settings are the proxy's `ENABLE_SILENCE_DETECTION` and `SILENCE_*` [environment variables](configuration#silence-detection).

## Tuning

| Problem | Try |
|---|---|
| Channels fail over during quiet scenes or breaks | More **Consecutive silent checks** (5), or a longer **Silence duration**. |
| It takes too long to fail over | A shorter **Check interval** (5 seconds), or 2 consecutive checks. |
| Nothing happens | The channel has a backup, and the stream is live, not a movie or episode. |
