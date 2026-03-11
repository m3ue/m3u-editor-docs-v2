---
sidebar_position: 7
title: Silence Detection
description: Automatically trigger failover when a stream's audio goes silent
tags:
  - Proxy
  - Failover
  - Audio
  - Live TV
---

# Silence Detection

Silence Detection is an optional feature that monitors live streams for silent audio and automatically triggers failover when silence persists beyond a configurable threshold. This is useful for detecting "dead air" streams that are still connected but producing no usable audio.

## The Problem It Solves

Some upstream providers serve a technically valid stream (bytes are flowing, bitrate looks fine) but the audio is completely silent — for example:

- A provider switching sources mid-stream leaves a brief or extended dead-air period
- An encoder issue produces a valid transport stream with no audio content
- A provider's stream "freezes" at the last video frame while the connection stays open

Standard failover triggers (bitrate monitoring, circuit breaker) won't catch this because the stream *looks* healthy from a data perspective. Silence detection catches it at the audio level.

## How It Works

When enabled, the proxy buffers incoming stream data over a configurable time window (default 10 seconds). At the end of each window, a short-lived `ffmpeg` process analyses the buffer using the `silencedetect` audio filter. If silence is detected in the window, a silence counter increments. When the counter reaches the configured threshold (default 3 consecutive windows), failover is triggered.

- VOD streams are excluded — silence detection only applies to live streams
- A grace period (default 15 seconds) at stream start prevents false positives during audio decoder startup
- The silence counter resets automatically if audio recovers before the threshold is reached
- All state is fully reset when a failover occurs

:::note
Silence detection requires **ffmpeg** to be installed and accessible in the proxy environment. If ffmpeg is not found, the feature is silently disabled on a per-check basis (no crash, just a logged error).
:::

## Enabling Silence Detection

### Via the M3U Editor UI (Recommended)

Go to **Settings → Proxy** and scroll to the **Silence detection settings** section. Enable the toggle and configure the thresholds to suit your streams.

Changes take effect immediately for new streams. Existing active streams will pick up the new settings on reconnect.

### Via Environment Variable (Proxy)

Enable globally for all live streams via the proxy's environment configuration:

```bash
# .env or docker-compose environment
ENABLE_SILENCE_DETECTION=true
```

The M3U Editor UI settings take precedence over the environment variable when the editor is connected to the proxy — the UI values are passed per-stream on creation.

### Via the Proxy API

Pass silence detection parameters directly when creating a stream:

```bash
curl -X POST "http://localhost:8085/streams" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "http://provider.com/channel.ts",
    "enable_silence_detection": true,
    "silence_threshold_db": -50.0,
    "silence_duration": 3.0,
    "silence_check_interval": 10.0,
    "silence_failover_threshold": 3,
    "silence_monitoring_grace_period": 15.0,
    "failover_urls": ["http://backup.com/channel.ts"]
  }'
```

Per-stream API values override the global environment variable and the UI settings for that specific stream.

## Configuration

| Setting | ENV Variable | Default | Description |
|---------|-------------|---------|-------------|
| Enable silence detection | `ENABLE_SILENCE_DETECTION` | `false` | Master toggle. Disabled by default. |
| Silence threshold | `SILENCE_THRESHOLD_DB` | `-50.0` dB | Audio level below which audio is considered silent. Raise to `-40` dB for stricter detection. |
| Silence duration | `SILENCE_DURATION` | `3.0` s | Minimum continuous silence within a check window to count as a silent check. |
| Check interval | `SILENCE_CHECK_INTERVAL` | `10.0` s | How often to analyse the buffered audio. Shorter intervals catch silence faster but increase CPU usage. |
| Failover threshold | `SILENCE_FAILOVER_THRESHOLD` | `3` | Number of consecutive silent checks before failover is triggered. Prevents failover on brief gaps between programmes. |
| Grace period | `SILENCE_MONITORING_GRACE_PERIOD` | `15.0` s | Delay after stream start before monitoring begins. Accounts for initial buffering and audio decoder startup. |

## Resource Usage

Silence detection spawns one short-lived `ffmpeg` subprocess per active stream per check interval. For example, with the default 10-second interval and 20 concurrent streams, that is approximately 2 ffmpeg processes per second.

- **CPU**: Low-to-moderate — `ffmpeg` analysis runs on buffered data, not a live transcode
- **Memory**: Up to ~5 MB per active stream (hard-capped buffer)
- **Upstream connections**: None — the buffer is filled from data already being proxied

## Logs

When silence is detected:

```
[WARNING] Silence detected for stream abc123, count: 1/3
[WARNING] Silence detected for stream abc123, count: 2/3
[ERROR]   Persistent silence detected for stream abc123, triggering failover (attempt 1/3)
```

When audio recovers before the threshold:

```
[INFO] Audio recovered for stream abc123, resetting silence counter
```

When ffmpeg times out during analysis:

```
[WARNING] Silence analysis timed out for stream abc123, skipping check
```

## Troubleshooting

**Failover triggers too frequently**
- Increase `SILENCE_FAILOVER_THRESHOLD` to require more consecutive silent checks (e.g. `5`)
- Increase `SILENCE_DURATION` so brief gaps (e.g. between programme segments) don't count as silence
- Increase `SILENCE_MONITORING_GRACE_PERIOD` if streams have a long audio startup time

**Failover not triggering fast enough**
- Decrease `SILENCE_CHECK_INTERVAL` to analyse more frequently (e.g. `5` seconds)
- Decrease `SILENCE_FAILOVER_THRESHOLD` to `2` consecutive checks
- Lower `SILENCE_THRESHOLD_DB` to `-40` dB for stricter silence detection

**Feature appears inactive (no log output)**
- Confirm `ffmpeg` is installed in the proxy container: `docker exec <container> ffmpeg -version`
- Verify the stream is live (not VOD) — silence detection is skipped for VOD streams
- Check that failover URLs are configured — failover cannot trigger without a backup

**High CPU usage**
- Increase `SILENCE_CHECK_INTERVAL` to reduce ffmpeg invocation frequency
- Reduce the number of streams with silence detection enabled if only specific providers require it

## Best Practices

1. **Start with defaults** — the default values are conservative and won't trigger on brief silent moments between programmes
2. **Always configure failover URLs** — silence detection only helps if there is a backup to fail over to
3. **Combine with bitrate monitoring** for comprehensive stream health coverage
4. **Monitor logs** during initial rollout to tune thresholds for your specific providers
5. **Use the grace period** — leave it at 15 seconds or higher for providers with slow audio startup
