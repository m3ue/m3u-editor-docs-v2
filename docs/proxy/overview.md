---
sidebar_position: 1
title: Overview & Architecture
description: How the M3U Proxy works — streaming design, stream types, and performance model
tags:
  - Proxy
  - Architecture
  - Streaming
---

# M3U Proxy Overview

The M3U Proxy is a high-performance HTTP proxy server purpose-built for IPTV streaming. It sits between your media players and IPTV providers, handling stream delivery, failover, transcoding, and monitoring — all without introducing unnecessary overhead.

## Design Philosophy

The proxy is built around a **true live proxy** model: every byte delivered to a client comes directly from the upstream provider with no persistent buffering layer. This means:

- **Zero transcoding by default** — pure pass-through for maximum performance
- **Connection sharing for live streams** — multiple viewers share one upstream provider connection
- **Immediate cleanup** — connections close the moment the last client stops watching
- **Isolated failover** — one client's problem never affects another

## Stream Types

The proxy automatically detects the stream type and applies the correct delivery strategy.

### Continuous Streams (`.ts`, `.mp4`, `.mkv`, `.webm`, `.avi`)

For **live** streams, the proxy uses a **primary/subscriber broadcast model**: the first client opens a single upstream connection and broadcasts chunks to all subsequent clients via in-memory queues. Only one provider connection is ever opened per channel, regardless of how many viewers are watching.

```
Provider → primary client → Client A (direct yield)
                          ↘ Queue → Client B (subscriber)
                          ↘ Queue → Client C (subscriber)
```

Key properties:
- **One upstream connection** per live channel — conserves provider connection slots
- **Subscriber promotion** — if the primary disconnects, the longest-running subscriber seamlessly takes over and inherits the upstream TCP connection
- Truly ephemeral — connection closes when the last client disconnects
- **VOD is excluded** — each VOD client gets an independent connection for full seek/range support

### HLS Streams (`.m3u8`)

HLS uses a **shared connection model**: multiple clients share one upstream connection, and segments are fetched on demand. The proxy rewrites playlist URLs so segments are served through the proxy itself.

- One upstream connection serves many clients
- Efficient playlist processing and URL rewriting
- Shared HTTP client with connection pooling
- Per-stream failover with seamless playlist switching

### VOD Streams (Video on Demand)

VOD streams support full byte-range requests, allowing clients to seek freely within the content:

- Each client can be at a different position simultaneously
- Range headers are honoured and forwarded to the upstream
- Works correctly with all standard video players

## Performance Architecture

### uvloop

The proxy uses [uvloop](https://github.com/MagicStack/uvloop) as the event loop, providing 2–4x faster async I/O than the Python default. It is detected and enabled automatically at startup.

### Connection Pooling

HTTP clients are configured with optimised connection limits to maximise throughput while avoiding resource exhaustion:

- `max_keepalive_connections: 20`
- `max_connections: 100`
- `keepalive_expiry: 30s`

### Lightweight Stats Tracking

Per-client metrics (bytes served, segments delivered, error counts) are tracked with minimal overhead. No database writes occur during streaming.

## Seamless Failover

When an upstream connection fails, the proxy switches to a backup URL with less than 100ms interruption — transparent to the client. Failover is **per-client**, so a single viewer experiencing a hiccup doesn't impact anyone else.

See [Failover](./failover.md) for the full architecture and configuration.

## Optional Features

The proxy is designed to work well out of the box, but includes several advanced capabilities you can enable as needed:

| Feature | Default | Description |
|---------|---------|-------------|
| [Transcoding](./transcoding.md) | Off | FFmpeg-based video transcoding with hardware acceleration |
| [Redis Pooling](./redis-pooling.md) | Off | Shared streams across multiple workers |
| [Strict Live TS](./strict-live-ts.md) | Off | Enhanced stability for Kodi and PVR clients |
| [Sticky Sessions](./sticky-sessions.md) | Off | Lock clients to specific load balancer backends |
| [Bitrate Monitoring](./configuration.md#bitrate-monitoring) | Off | Auto-failover on degraded streams |
| [Authentication](./authentication.md) | Off | API token protection for management endpoints |
| [Event System](./event-system.md) | Built-in | Webhook notifications for stream lifecycle events |

## Quick Start

The proxy ships as a Docker image. The quickest way to get started is via Docker Compose — see the [M3U Proxy Integration](/docs/deployment/m3u-proxy-integration) deployment guide.

For a standalone run:

```bash
docker run -d \
  -p 8085:8085 \
  -e API_TOKEN="your-secret-token" \
  sparkison/m3u-proxy:latest
```

The proxy starts on port `8085` by default. Visit `http://localhost:8085/health?api_token=your-secret-token` to confirm it is running.

## Further Reading

- [Configuration](./configuration.md) — All environment variables
- [Authentication](./authentication.md) — Securing the management API
- [Failover](./failover.md) — Automatic backup URL switching
- [Retry Configuration](./retry.md) — Fine-tuning retry behaviour
- [API Reference](./api-reference.md) — REST endpoint reference
