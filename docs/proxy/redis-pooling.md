---
sidebar_position: 10
title: Redis Pooling
description: Share streams across multiple clients and coordinate multiple proxy workers
tags:
  - Proxy
  - Redis
  - Scaling
  - Performance
---

# Redis Pooling

Redis pooling enables two capabilities:

1. **Shared streams** — multiple clients watching the same transcoded stream share one FFmpeg process instead of spawning one per client
2. **Multi-worker coordination** — multiple proxy instances coordinate over Redis so streams survive worker restarts and load is distributed

Redis is **optional**. Without it, the proxy works perfectly for pass-through streaming and single-worker setups.

## Architecture

### Without Redis (default)

```
Client 1 → FFmpeg Process 1 → Stream
Client 2 → FFmpeg Process 2 → Stream  (same source, separate process)
Client 3 → FFmpeg Process 3 → Stream  (same source, separate process)
```

Each client gets its own process. Simple, isolated, but resource-intensive when many clients watch the same transcoded channel.

### With Redis pooling

```
Client 1 ─┐
Client 2 ──┼→ Shared FFmpeg Process → Stream
Client 3 ─┘
```

One shared process serves all clients watching the same stream (same URL + transcoding profile). Resource usage scales with unique channels, not viewers.

**Before:** 100 clients on 10 channels = 100 FFmpeg processes
**After:** 100 clients on 10 channels = 10 shared FFmpeg processes

## Configuration

```bash
# Enable Redis
REDIS_ENABLED=true
REDIS_HOST=redis                # Redis hostname
REDIS_SERVER_PORT=6379          # Redis port
REDIS_DB=6                      # Redis database number
REDIS_PASSWORD=                 # Optional auth password

# Pooling behaviour
ENABLE_TRANSCODING_POOLING=true
MAX_CLIENTS_PER_SHARED_STREAM=10
STREAM_SHARING_STRATEGY=url_profile   # url_profile | url_only | disabled

# Multi-worker settings
WORKER_ID=worker-1              # Unique per instance (auto-assigned if omitted)
HEARTBEAT_INTERVAL=30           # Seconds between worker heartbeats
CLEANUP_INTERVAL=60             # Seconds between stale process cleanup
```

### Stream sharing strategies

| Strategy | Description |
|----------|-------------|
| `url_profile` | Share based on URL + transcoding profile (default) |
| `url_only` | Share based on URL only (ignores profile differences) |
| `disabled` | No sharing — one process per client |

## Docker Compose Setup

```yaml
services:
  m3u-proxy:
    image: sparkison/m3u-proxy:latest
    environment:
      - API_TOKEN=your-token
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
      - REDIS_SERVER_PORT=6379
      - REDIS_DB=6
      - ENABLE_TRANSCODING_POOLING=true
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

## Multi-Worker Setup

Run multiple proxy instances sharing the same Redis backend. Each worker needs a unique `WORKER_ID`:

```bash
# Worker 1
WORKER_ID=worker-1
PORT=8085
REDIS_ENABLED=true
REDIS_HOST=redis

# Worker 2
WORKER_ID=worker-2
PORT=8086
REDIS_ENABLED=true
REDIS_HOST=redis
```

Both workers share stream state and FFmpeg processes. A load balancer in front distributes client connections between them.

## Monitoring

### Via API

```bash
# Get statistics (includes pooling info when enabled)
curl "http://localhost:8085/stats" -H "X-API-Token: your-token"
```

### Via Redis CLI

```bash
# List active workers
redis-cli HGETALL workers

# List active streams
redis-cli KEYS "stream:*"

# Inspect a specific stream
redis-cli HGETALL "stream:{stream_id}"

# Monitor Redis memory
redis-cli INFO memory
```

### Via process list

```bash
# With Redis pooling: fewer processes for the same number of clients
ps aux | grep ffmpeg
```

## Benefits

| | Without Redis | With Redis |
|-|---------------|------------|
| 100 clients, 10 channels | 100 processes | ~10 processes |
| CPU usage | High | Low |
| Memory usage | High | Low |
| Multi-worker support | ❌ | ✅ |
| Worker failover | ❌ | ✅ |
| Startup time | Instant | Instant |
| Pass-through streams | ✅ Same | ✅ Same |

## Limitations

- Redis pooling applies to **transcoded streams** only. Pass-through streams use per-client connections regardless of Redis configuration.
- Stream state is stored in Redis memory — it is lost if Redis restarts without persistence configured.
- `MAX_CLIENTS_PER_SHARED_STREAM` limits how many clients share one process. Additional clients above this limit get their own process.

## Troubleshooting

**Redis connection refused**
- Confirm Redis is running and reachable from the proxy container
- Check `REDIS_HOST` and `REDIS_SERVER_PORT` match your Redis setup
- Test connectivity: `docker exec -it m3u-proxy redis-cli -h redis ping`

**Streams not being shared**
- Confirm `ENABLE_TRANSCODING_POOLING=true`
- Verify clients are using the same URL and profile combination
- Check `STREAM_SHARING_STRATEGY` is not set to `disabled`

**High memory usage despite pooling**
- Lower `MAX_CLIENTS_PER_SHARED_STREAM` to prevent one process from growing too large
- Check `CLEANUP_INTERVAL` — stale processes should be cleaned up regularly
