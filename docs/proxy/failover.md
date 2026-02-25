---
sidebar_position: 4
title: Failover
description: Automatic backup URL switching for uninterrupted IPTV streaming
tags:
  - Proxy
  - Failover
  - Reliability
---

# Failover

The proxy supports automatic failover to backup stream URLs. When a primary stream fails — due to a network error, timeout, or provider outage — the proxy switches to the next URL in the failover list with less than 200ms interruption. Clients experience a brief buffer, not a stream restart.

## How It Works

Each stream can be created with a list of `failover_urls`. The proxy tracks the current active URL and cycles through the list when errors occur:

1. Primary URL fails
2. Proxy updates the active URL to the next failover URL
3. Signals all connected clients via an async event
4. Each client closes the old connection and opens a new one
5. Streaming continues — the client's player sees a brief buffer

The whole process typically takes 50–200ms.

### Failover Flow

```
0ms    Clients streaming from Source 1
100ms  Connection timeout detected
101ms  Active URL updated → Source 2
       Failover event fired
       Old FFmpeg process stopped (if transcoding)
105ms  Client 1 reconnects to Source 2
107ms  Client 2 reconnects to Source 2
110ms  Client 3 reconnects to Source 2
150ms  All clients streaming from Source 2
```

### URL Ordering

Failover URLs are tried in order. Once the list is exhausted the stream fails — the proxy does **not** cycle back to the primary URL. Up to 3 failover attempts are made per streaming session (hardcoded), so if more than 3 backup URLs are configured only the first 3 will ever be tried per session.

```
Primary fails → Backup 1 → Backup 2 → Backup 3 → stream fails
```

:::tip
When the **Advanced Failover** resolver is enabled (see below), this static limit does not apply — the editor decides what URL to return next based on live capacity and health data.
:::

## Creating a Stream with Failover URLs

```bash
curl -X POST "http://localhost:8085/streams" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "http://primary.tv/live/stream.ts",
    "failover_urls": [
      "http://backup1.tv/live/stream.ts",
      "http://backup2.tv/live/stream.ts",
      "http://backup3.tv/live/stream.ts"
    ]
  }'
```

## Manual Failover

You can trigger an immediate failover without waiting for an error:

```bash
curl -X POST "http://localhost:8085/streams/{stream_id}/failover" \
  -H "X-API-Token: your-token"
```

This is useful for testing, or for manual intervention when you know a provider is degraded.

## Per-Client Isolation

Failover is **per-client** for continuous streams. If one viewer's connection drops, only that viewer experiences the failover sequence. Other clients continue streaming uninterrupted from their own provider connections.

For HLS and transcoded streams, failover is shared — all clients on a stream switch together when the shared upstream fails.

## Performance Characteristics

| Metric | Typical Value |
|--------|--------------|
| Failover detection | < 1 second (usually 100–500ms) |
| Reconnection time | 100–200ms (network dependent) |
| Total interruption per client | 200ms–1s |
| Client buffer impact | 1–2 seconds of buffering |
| Success rate (with 2+ failover URLs) | 95%+ |

## HLS Failover

For HLS streams, failover is transparent to the player:

- The next playlist refresh automatically uses the new URL
- Segment errors trigger automatic failover
- The player never receives an error response — it just gets segments from a new source

## Transcoded Stream Failover

When transcoding is active, failover stops the old FFmpeg process and starts a new one with the failover URL:

1. Error detected
2. Active URL updated
3. Old FFmpeg process stopped
4. Clients detached from the old process
5. New FFmpeg process started with the new URL
6. Clients reconnected

This adds a slightly longer interruption (500ms–2s) compared to direct stream failover.

## Monitoring Failover Events

The event system fires a `FAILOVER_TRIGGERED` event each time a failover occurs. Register a webhook to receive notifications:

```bash
curl -X POST "http://localhost:8085/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://your-server.com/alerts",
    "events": ["failover_triggered", "stream_failed"]
  }'
```

See [Event System](./event-system.md) for the full webhook payload format.

## Interaction with Retry

Retries happen **before** failover. The proxy retries the current URL up to `STREAM_RETRY_ATTEMPTS` times before switching to the next failover URL. See [Retry Configuration](./retry.md) for how to tune this behaviour.

## Interaction with Sticky Sessions

When [Sticky Sessions](./sticky-sessions.md) are enabled, the proxy locks to a specific backend after a redirect. If that backend fails:

1. Retry the locked backend up to `STREAM_RETRY_ATTEMPTS` times
2. Revert sticky session to the original URL
3. If the original URL also fails, trigger failover to the next failover URL
4. The sticky session locks to the new provider's backend

## Advanced Failover (M3U Editor)

The M3U Editor adds a higher-level **failover resolver** on top of the proxy's built-in URL cycling. When enabled, the proxy calls back to the editor to determine which playlist to use next, taking into account playlist stream limits and health state.

Configure this under **Settings → Preferences → Proxy** in the editor.

### Failover Resolver

| Setting | Description |
|---------|-------------|
| **Enable advanced failover logic** | Proxy calls the editor to resolve the next failover source based on playlist capacity |
| **Resolver URL** | The URL the proxy uses to reach the editor (e.g. `http://m3u-editor:36400`). Must be reachable from the proxy container |

When enabled, the proxy sends a request to the editor's resolver endpoint during failover, and the editor returns the best available backup source — respecting stream limits, marked-invalid playlists, and provider health.

### Fail Conditions

| Setting | Description |
|---------|-------------|
| **Enable playlist fail conditions** | Mark playlists as temporarily unavailable when specific HTTP errors are returned by the provider |
| **HTTP status codes** | Codes that trigger an invalid state (e.g. `403`, `404`, `502`, `503`) |
| **Invalid timeout (minutes)** | How long a playlist stays invalid before being retried. Default: 5 minutes |
| **Clear failed playlists** | Immediately un-marks all playlists currently flagged as invalid |

This is particularly useful when providers return `403` or `503` errors under load — the editor will temporarily route traffic away from that source without requiring a manual fix.

### Stream Limit Handling

| Setting | Description |
|---------|-------------|
| **Stop oldest stream when limit reached** | When a playlist's stream limit is hit, automatically stops the oldest active stream to free capacity for the new request. Enables instant channel switching on single-connection providers |

---

## Before vs After Failover

### Without failover
```
Client → Source 1 → [ERROR]
                        ↓
                  Stream stops
                        ↓
             Client must manually reload
Downtime: 5–30 seconds
```

### With failover
```
Client → Source 1 → [ERROR]
                        ↓
                  Auto failover
                        ↓
Client → Source 2 → Continues
Interruption: ~200ms
```
