---
sidebar_position: 7
title: Sticky Sessions
description: Lock clients to specific load balancer backends for stable HLS playlist sequencing
tags:
  - Proxy
  - HLS
  - Reliability
---

# Sticky Sessions

The Sticky Session feature locks a stream to a specific backend server after a load balancer redirect. This prevents the common "playback loop" problem that occurs when multiple provider backends serve out-of-sync HLS playlist sequence numbers.

## The Problem

Many IPTV providers use load balancers that distribute requests across multiple backend servers:

```
Client → Load Balancer (provider.com)
              ↓ redistributes to →
         backend1.provider.com
         backend2.provider.com
         backend3.provider.com
```

Without sticky sessions, each playlist request may land on a different backend. If those backends aren't perfectly in sync, the player sees HLS sequence numbers jump backwards — triggering a reload loop:

```
Playlist from backend1: sequence #1000
Playlist from backend2: sequence #500  ← backwards!
Player: stream jumped, must reload
```

With sticky sessions enabled, after the first redirect the proxy locks to that backend for all subsequent requests, ensuring monotonic sequence progression.

## Enabling Sticky Sessions

There are three ways to enable sticky sessions, from most specific to most broad:

### Per-Playlist (M3U Editor UI)

Open a playlist in the editor and go to the **Proxy Settings** section. Toggle **Enable Sticky Session Handler** on.

This applies to all channels from that playlist. It is the recommended approach — you can target only the providers that need it without affecting others.

### Per-Stream (Proxy API)

When calling the proxy API directly, pass `use_sticky_session: true` on the stream creation request:

```bash
curl -X POST "http://localhost:8085/streams" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://provider.com/stream.m3u8",
    "use_sticky_session": true
  }'
```

### Globally (Environment Variable)

Enable for all streams:

```bash
USE_STICKY_SESSION=true
```

Default is `false`. Per-stream and per-playlist settings override the global configuration.

## When to Enable

**Enable sticky sessions when:**
- You experience playback loops or repeated buffering every few seconds
- Logs show HLS playlist sequence numbers jumping backwards
- Your provider uses a load balancer with multiple backends
- Streams restart frequently without a clear reason
- The provider has multiple CDN endpoints that aren't synchronised

**Disable sticky sessions when:**
- Your provider uses a single origin (no load balancing)
- The load balancer maintains session affinity on its own
- You want geo-based failover (a locked backend may not be geographically optimal)
- The provider's backends are perfectly synchronised

## How It Works

1. First playlist request goes to `provider.com`
2. Load balancer redirects to `backend3.provider.com`
3. Proxy locks `current_url` to `backend3.provider.com`
4. All subsequent requests go directly to `backend3.provider.com`
5. Monotonic sequence numbers → stable playback

### Automatic Recovery

If the locked backend fails:

1. Proxy detects the error
2. Reverts `current_url` to the original `provider.com` entry point
3. Load balancer can redirect to a healthy backend
4. A new sticky lock is established

## Interaction with Failover

Sticky sessions and [failover URLs](./failover.md) work together:

```json
{
  "url": "https://provider1.com/stream.m3u8",
  "failover_urls": [
    "https://provider2.com/stream.m3u8",
    "https://provider3.com/stream.m3u8"
  ],
  "use_sticky_session": true
}
```

**Behaviour:**

1. `provider1.com` redirects to `backend-a.provider1.com` → **locked**
2. `backend-a` fails → reverts to `provider1.com`
3. `provider1.com` still unreachable → **failover to `provider2.com`**
4. `provider2.com` redirects to `backend-x.provider2.com` → **locked again**

## Interaction with Retry

[Retries](./retry.md) happen before the sticky session resets:

1. Fetch from locked URL fails
2. Retry same locked URL up to `STREAM_RETRY_ATTEMPTS` times
3. All retries fail → revert sticky session to original URL
4. If original URL also fails → attempt failover

## Troubleshooting

**Symptom: Playback loops every few seconds**

```bash
# Watch logs for sequence number patterns
docker logs m3u-proxy -f | grep "sequence"
```

If you see sequence numbers jumping backwards, enable sticky sessions:

```bash
USE_STICKY_SESSION=true
```

**Symptom: Stream won't recover after a temporary outage**

The sticky session may be locked to a dead backend. The proxy should auto-recover, but you can delete and recreate the stream if it doesn't.

**Symptom: Provider uses geo-based backends and I want geo-failover**

Sticky sessions prevent the load balancer from redirecting to geographically closer backends. Disable sticky sessions globally or per-stream:

```json
{
  "url": "https://geo-balanced-provider.com/stream.m3u8",
  "use_sticky_session": false
}
```

## Best Practices

1. **Start disabled** (the default) — only enable if you experience playback loops
2. **Test per-stream first** — use the per-stream override to validate with a specific provider before enabling globally
3. **Combine with failover** — use both sticky sessions and failover URLs for maximum reliability
4. **Monitor logs** — watch for redirect patterns and sequence number issues during initial testing
