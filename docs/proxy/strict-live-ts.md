---
sidebar_position: 6
title: Strict Live TS Mode
description: Enhanced stability for live MPEG-TS streams with Kodi and PVR clients
tags:
  - Proxy
  - Kodi
  - PVR
  - Live TV
---

# Strict Live TS Mode

Strict Live TS Mode is an optional feature that improves playback stability for live MPEG-TS streams delivered over HTTP — particularly with PVR clients like Kodi PVR IPTV Simple.

## The Problem It Solves

Without this mode, many IPTV clients experience a frustrating pattern when watching live channels:

- **"1 second play → cache → repeat"** loops after channel switching
- Frequent buffering immediately after tuning
- Slow channel change times
- Rapid reconnection loops when upstream momentarily stalls

These issues are caused by how IPTV clients handle Range headers and the lack of a pre-buffer when starting a live stream.

## What It Does

When Strict Live TS Mode is enabled, the proxy applies four optimisations:

### 1. Range Header Neutralisation

Strips incoming `Range` headers from live TS requests and always responds with `HTTP 200 OK` (never `206 Partial Content`). This prevents clients from treating a live stream like a seekable file.

- Sets `Accept-Ranges: none` to tell clients not to retry with range requests
- Sends no `Content-Length` header — the stream has no defined end

### 2. Startup Pre-buffering

Reads 256–512 KB (~0.5–1 second of data) from upstream before sending the first byte to the client. This smooths the initial connection and eliminates the common first-byte delay.

- Configurable buffer size and timeout
- Pre-buffer progress is logged for monitoring

### 3. Circuit Breaker

Monitors upstream data flow. If no data arrives for more than 2 seconds (configurable), the upstream is marked as "bad":

- The endpoint is temporarily blacklisted for 60 seconds
- Automatic failover to the next backup URL is triggered
- Prevents rapid reconnection loops to stalled sources

### 4. Optimised HEAD Requests

HEAD requests for live TS streams return immediately without hitting the upstream provider. This avoids redundant connections that can interfere with live stream state.

## Quick Start

### Enable globally (all live TS streams)

```bash
# .env or docker-compose environment
STRICT_LIVE_TS=true
```

### Enable per stream (via API)

```bash
curl -X POST "http://localhost:8085/streams" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "http://provider.com/channel.ts",
    "strict_live_ts": true,
    "failover_urls": ["http://backup.com/channel.ts"]
  }'
```

Per-stream configuration overrides the global setting for that stream.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `STRICT_LIVE_TS` | `false` | Enable globally for all live TS streams |
| `STRICT_LIVE_TS_PREBUFFER_SIZE` | `262144` | Pre-buffer size in bytes (default 256 KB) |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` | `2` | Seconds without data before circuit breaker triggers |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_COOLDOWN` | `60` | Seconds to avoid a failed upstream before retrying |
| `STRICT_LIVE_TS_PREBUFFER_TIMEOUT` | `10` | Maximum seconds to wait for pre-buffer to fill |

## Compatible Clients

| Client | Status |
|--------|--------|
| Kodi PVR IPTV Simple | ✅ Primary use case |
| VLC Media Player | ✅ |
| MPV Player | ✅ |
| FFplay | ✅ |
| Android IPTV apps | ✅ (varies by app) |

## Logs

When active, you'll see entries like:

```
[INFO] STRICT MODE: Starting direct proxy with STRICT LIVE TS MODE for client abc123, stream xyz789
[INFO] STRICT MODE: Completely stripping Range header for live TS stream: bytes=0-1024
[INFO] STRICT MODE: Pre-buffering 262144 bytes (~0.5-1s) before streaming to client abc123
[INFO] STRICT MODE: Pre-buffer complete: 262144 bytes in 8 chunks
[INFO] STRICT MODE: Emitted pre-buffer, now streaming live for client abc123
```

Circuit breaker activation:

```
[ERROR]   STRICT MODE: Circuit breaker triggered - no data for 3.5s (threshold: 2s)
[WARNING] STRICT MODE: Marking upstream as bad for 60s
[INFO]    STRICT MODE: Attempting failover due to circuit breaker
```

## Performance Impact

- **CPU**: Minimal — no transcoding, just buffering logic
- **Memory**: ~256–512 KB per active stream for the pre-buffer
- **Latency**: Adds ~0.5–1 second initial delay (pre-buffer time)
- **Network**: Slightly increased upstream traffic due to pre-buffering

## Troubleshooting

**Still seeing buffering loops**
- Increase `STRICT_LIVE_TS_PREBUFFER_SIZE` to `524288` (512 KB)
- Check logs for circuit breaker activation
- Verify failover URLs are configured and reachable
- Try increasing `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` to 3–5 seconds

**Too much delay on channel switch**
- Decrease `STRICT_LIVE_TS_PREBUFFER_SIZE` to `131072` (128 KB)
- Reduce `STRICT_LIVE_TS_PREBUFFER_TIMEOUT` to 5 seconds

**Circuit breaker triggering too often**
- Increase `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` to 5–10 seconds (upstream may have natural pauses)
- Check upstream source stability and network connectivity

**Streams not detected as live continuous**
- The proxy detects live TS by URL pattern (`.ts` extension or `/live/` path segment)
- Check logs for `"is_live_continuous": true`
- Force strict mode per-stream via the API if auto-detection fails

## Best Practices

1. **Enable globally** if most of your streams are live TS channels
2. **Configure failover URLs** for critical streams — the circuit breaker is most effective with backup URLs available
3. **Monitor logs** during initial rollout to tune pre-buffer and timeout settings
4. **Start with defaults** and adjust based on your network conditions
5. **Test channel switching** thoroughly with your client before rolling out to production
