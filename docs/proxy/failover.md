---
sidebar_position: 4
title: Failover and Retries
description: Keep streams playing when a source fails, with backup channels, retries, smart failover across providers, and fail conditions.
tags:
  - Proxy
  - Failover
  - Reliability
---

# Failover and Retries

When a stream stops working, M3U Proxy first tries it again, then switches to a backup. Viewers usually see a short pause rather than an error.

Failover only works for streams going through the [proxy](overview#turn-it-on).

## Give channels backups

A channel's backups are other channels carrying the same thing, often from another provider. There are three ways to set them up:

- **By hand:** edit a channel and add **Failover Channels**, in the order to try them.
- **In bulk:** select the backup channels and choose **Add as failover** from the bulk actions, then pick the main channel.
- **Automatically:** [Auto-Merge Channels](/docs/advanced/auto-merge-channels) links duplicates across your playlists as failovers after each sync.

## What happens when a stream fails

1. **Retry.** The proxy reconnects to the same source, up to 3 times, a second apart. This rides out brief hiccups without switching sources.
2. **Fail over.** If retries don't help, the proxy moves on to the next backup and keeps going down the list.
3. **Give up.** When every backup has failed, the stream ends.

A live stream counts as failed when its connection errors, or when no data arrives for 15 seconds. A movie or episode that stalls mid-play reconnects from where it stopped instead, so the viewer doesn't lose their place.

[Silence Detection](silence-detection) can also trigger failover when a channel's audio goes quiet, and [Strict Live TS](strict-live-ts) adds a faster stall detector for live TV.

To fail over by hand, use **Trigger Failover** on a stream in the [Stream Monitor](stream-monitor).

## Smart failover

By default, the proxy is given the list of backups and tries them in order. With **smart failover**, it asks M3U Editor for the best backup each time, and the editor skips any that can't take another stream right now:

- playlists at their connection limit
- playlists marked as failing (below)

This is most useful when backups are spread across several providers or accounts. Set it up in **Settings → Proxy → Failover & Recovery**:

| Setting | What it does |
|---|---|
| **Resolver URL** | The address the proxy uses to reach M3U Editor, like `http://m3u-editor:36400`. **Test resolver connection** checks it. |
| **Enable advanced failover logic** | Turns smart failover on. Needs the Resolver URL. |

### Fail conditions

With smart failover on, **Enable playlist fail conditions** lets M3U Editor take a whole playlist out of rotation when its provider returns certain errors. Every channel from that playlist is skipped until it's tried again.

| Setting | Default | What it does |
|---|---|---|
| **HTTP status codes** | None | The responses that mark a playlist as failing, for example `403`, `404`, `502`, `503`. |
| **Invalid timeout (minutes)** | 5 | How long the playlist stays out of rotation. |
| **Clear failed playlists** | | Put every failing playlist back into rotation now. |

## Connection limits

A provider's connection limit is a common reason streams fail to start. Two settings help:

- **Stop oldest stream when limit reached** (**Settings → Proxy**) frees a connection for the new stream by stopping the playlist's oldest one, so channel changes on a one-connection account work. It can also be turned on for a single Playlist Auth.
- [Provider Profiles](/docs/advanced/playlist-pooled_providers) pool several accounts from one provider, so each new stream goes to an account with a free connection.

## Tuning

The proxy's [environment variables](configuration#retries-and-failover) control the details. The defaults suit most providers.

| Variable | Default | What it does |
|---|---|---|
| `STREAM_RETRY_ATTEMPTS` | `3` | Retries before failing over. |
| `STREAM_RETRY_DELAY` | `1.0` | Seconds between retries. |
| `STREAM_RETRY_EXPONENTIAL_BACKOFF` | `false` | Wait 1.5 times longer before each retry. |
| `STREAM_TOTAL_TIMEOUT` | `30.0` | Seconds to spend retrying in total. `0` means no limit. |
| `LIVE_CHUNK_TIMEOUT_SECONDS` | `15.0` | Seconds without data before a live stream counts as stalled. |
| `VOD_CHUNK_TIMEOUT_SECONDS` | `5.0` | Seconds without data before a movie or episode reconnects. |
| `MAX_FAILOVER_ATTEMPTS` | `0` | How many backups to try. `0` tries them all. |

For a provider that drops often but comes back quickly, raise the retries and turn on backoff. If you have good backups and want to switch to them sooner, lower the retries to 1 or 2.

The proxy logs each retry and failover at `INFO`. Set `LOG_LEVEL=INFO` on the proxy to see them.
