---
sidebar_position: 13
title: API Reference
description: Complete REST API reference for the M3U Proxy
tags:
  - Proxy
  - API
  - Reference
---

# API Reference

The proxy exposes a REST API for managing streams, monitoring clients, and configuring webhooks. Interactive API docs are available at `/docs` (Swagger UI) and `/redoc` when the proxy is running.

All management endpoints require the `X-API-Token` header when [authentication](./authentication.md) is enabled. Streaming endpoints are always public.

---

## Streams

### Create stream

`POST /streams`

Creates a new proxy stream and returns a stream ID and endpoint URL.

**Request body:**

```json
{
  "url": "https://provider.com/stream.m3u8",
  "failover_urls": ["https://backup.com/stream.m3u8"],
  "user_agent": "MyApp/1.0",
  "strict_live_ts": false,
  "use_sticky_session": false,
  "metadata": {
    "local_id": "channel_123",
    "category": "sports"
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `url` | (required) | Primary stream URL |
| `failover_urls` | — | Ordered list of backup URLs |
| `user_agent` | — | User-Agent to send upstream |
| `strict_live_ts` | — | Enable [Strict Live TS Mode](./strict-live-ts.md) for this stream |
| `use_sticky_session` | — | Enable [Sticky Sessions](./sticky-sessions.md) for this stream |
| `metadata` | — | Arbitrary key/value pairs; see [Stream Metadata](./stream-metadata.md) |

**Response:**

```json
{
  "stream_id": "abc123def456",
  "primary_url": "https://provider.com/stream.m3u8",
  "stream_type": "hls",
  "stream_endpoint": "/hls/abc123def456/playlist.m3u8",
  "message": "Stream created successfully (hls)"
}
```

---

### List streams

`GET /streams`

Returns all registered streams with their current status and stats.

**Response:**

```json
{
  "streams": [
    {
      "stream_id": "abc123",
      "original_url": "https://provider.com/stream.m3u8",
      "current_url": "https://backup.com/stream.m3u8",
      "stream_type": "HLS",
      "client_count": 3,
      "total_bytes_served": 10485760,
      "error_count": 1,
      "is_active": true,
      "has_failover": true,
      "created_at": "2025-10-05T14:30:00.000000",
      "last_access": "2025-10-05T14:35:00.000000",
      "metadata": { "local_id": "channel_123" }
    }
  ],
  "total": 1
}
```

---

### Get stream

`GET /streams/{stream_id}`

Returns information about a specific stream.

---

### Delete stream

`DELETE /streams/{stream_id}`

Removes a stream and disconnects all clients.

---

### Trigger failover

`POST /streams/{stream_id}/failover`

Immediately switches the stream to the next failover URL without waiting for an error.

---

### Filter by metadata

`GET /streams/by-metadata?field={key}&value={value}&active_only={true|false}`

Returns streams matching a metadata field/value pair. See [Stream Metadata](./stream-metadata.md).

---

## Streaming

These endpoints are **always public**: no authentication required.

### Direct stream

`GET /stream/{stream_id}`

Returns the raw stream content. Used for continuous (`.ts`, `.mp4`) streams.

---

### HLS playlist

`GET /hls/{stream_id}/playlist.m3u8`

Returns the HLS playlist with segment URLs rewritten to route through the proxy.

---

### HLS segment

`GET /hls/{stream_id}/segment`
`GET /hls/{stream_id}/segment.ts`

Returns an individual HLS segment.

---

## Transcoding

### Create transcoded stream

`POST /transcode`

Creates a stream with FFmpeg transcoding applied. See [Transcoding & Profiles](./transcoding.md).

**Request body:**

```json
{
  "url": "https://source.example.com/stream.m3u8",
  "profile": "hq",
  "profile_variables": {
    "video_bitrate": "3500k",
    "audio_bitrate": "192k"
  },
  "failover_urls": [],
  "metadata": {}
}
```

---

## Statistics

### Overall stats

`GET /stats`

Returns an overview of active streams, clients, and data served.

---

### Detailed stats

`GET /stats/detailed`

Extended statistics with per-stream and per-client breakdowns.

---

### Performance stats

`GET /stats/performance`

Performance-focused metrics including throughput and latency.

---

### Stream stats

`GET /stats/streams`

Statistics broken down by stream.

---

### Client stats

`GET /stats/clients`

Statistics broken down by connected client.

---

## Clients

### List clients

`GET /clients`

Returns all currently connected clients.

---

### Get client

`GET /clients/{client_id}`

Returns information about a specific client.

---

### Disconnect client

`DELETE /hls/{stream_id}/clients/{client_id}`

Forcibly disconnects a client from an HLS stream.

---

## Health

### Health check

`GET /health`

Returns the proxy health status. Useful for container orchestration liveness/readiness probes.

**Response:**

```json
{
  "status": "healthy",
  "active_streams": 5,
  "active_clients": 12,
  "uptime_seconds": 3600
}
```

---

## Webhooks

### Register webhook

`POST /webhooks`

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["stream_started", "failover_triggered"],
  "timeout": 10,
  "retry_attempts": 3
}
```

See [Event System & Webhooks](./event-system.md) for event types and payload formats.

---

### List webhooks

`GET /webhooks`

---

### Remove webhook

`DELETE /webhooks?webhook_url={url}`

---

### Test webhook

`POST /webhooks/test?webhook_url={url}`

Sends a test payload to verify the webhook endpoint is reachable.

---

## Authentication Methods

All protected endpoints accept the token via:

1. **Header** (recommended): `X-API-Token: your_token`
2. **Query parameter**: `?api_token=your_token`

See [Authentication](./authentication.md) for full details.
