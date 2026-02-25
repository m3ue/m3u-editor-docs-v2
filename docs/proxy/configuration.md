---
sidebar_position: 2
title: Configuration Reference
description: Complete reference for all M3U Proxy environment variables
tags:
  - Proxy
  - Configuration
  - Environment Variables
---

# Configuration Reference

All proxy settings are configured via environment variables — in a `.env` file, Docker Compose `environment:` block, or directly in the shell.

## Server

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | IP address the server binds to |
| `PORT` | `8085` | Port the server listens on |
| `ROOT_PATH` | _(empty)_ | URL prefix for all routes (e.g. `/m3u-proxy`). Leave empty if serving at root |
| `LOG_LEVEL` | `error` | Logging verbosity: `error`, `warning`, `info`, `debug` |
| `APP_DEBUG` | `false` | Enable debug mode |
| `RELOAD` | `false` | Enable auto-reload on code changes (development only) |
| `DOCS_URL` | `/docs` | URL for interactive API docs (Swagger UI) |
| `REDOC_URL` | `/redoc` | URL for ReDoc API docs |
| `OPENAPI_URL` | `/openapi.json` | URL for OpenAPI schema |
| `TEMP_DIR` | `/tmp/m3u-proxy-streams` | Base directory for temporary stream files |
| `LOG_FILE` | `m3u-proxy.log` | Log file name |

## Authentication

| Variable | Default | Description |
|----------|---------|-------------|
| `API_TOKEN` | _(unset)_ | When set, all management endpoints require this token. Leave unset to disable auth. See [Authentication](./authentication.md) |

## Timeouts & Cleanup

| Variable | Default | Description |
|----------|---------|-------------|
| `CLIENT_TIMEOUT` | `10` | Seconds of client inactivity before the connection is considered dead |
| `STREAM_TIMEOUT` | `15` | Seconds allowed for stream operations |
| `SHARED_STREAM_TIMEOUT` | `30` | Seconds for shared (pooled) stream operations |
| `CLEANUP_INTERVAL` | `30` | Seconds between cleanup cycles for inactive streams and clients |
| `SHARED_STREAM_GRACE` | `3` | Grace period (seconds) before a shared FFmpeg process is cleaned up after all clients leave |

## Connection Idle Monitoring

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_CONNECTION_IDLE_MONITORING` | `true` | Monitor connections for unusual inactivity |
| `CONNECTION_IDLE_ALERT_THRESHOLD` | `600` | Seconds before a warning log is emitted for an idle connection |
| `CONNECTION_IDLE_ERROR_THRESHOLD` | `1800` | Seconds before an error log is emitted for an idle connection |

## Stream Defaults

These values apply when a stream is created without explicit overrides.

| Variable | Default | Description |
|----------|---------|-------------|
| `DEFAULT_USER_AGENT` | Mozilla/5.0 … | User-Agent header sent to upstream providers |
| `DEFAULT_CONNECTION_TIMEOUT` | `10.0` | Timeout (seconds) for establishing upstream connections |
| `DEFAULT_READ_TIMEOUT` | `30.0` | Timeout (seconds) for reading data from upstream |
| `DEFAULT_MAX_RETRIES` | `3` | Maximum connection retries |
| `DEFAULT_BACKOFF_FACTOR` | `1.5` | Exponential backoff multiplier between retries |
| `DEFAULT_HEALTH_CHECK_INTERVAL` | `300.0` | Seconds between health checks on active streams |
| `VOD_READ_TIMEOUT` | `3600.0` | Read timeout for VOD streams (1 hour, to allow pause/resume) |
| `VOD_WRITE_TIMEOUT` | `3600.0` | Write timeout for VOD streams |
| `LIVE_TV_WRITE_TIMEOUT` | `1800.0` | Write timeout for live TV streams (30 minutes) |

## Stream Retry

Controls automatic retry behaviour when a stream encounters a connection error. See [Retry Configuration](./retry.md) for full details.

| Variable | Default | Description |
|----------|---------|-------------|
| `STREAM_RETRY_ATTEMPTS` | `3` | Number of retry attempts before failing over to the next URL |
| `STREAM_RETRY_DELAY` | `1.0` | Seconds to wait between retry attempts |
| `STREAM_TOTAL_TIMEOUT` | `30.0` | Maximum total time (seconds) across all retries. Set to `0` to disable |
| `STREAM_RETRY_EXPONENTIAL_BACKOFF` | `false` | Multiply `STREAM_RETRY_DELAY` by 1.5 on each retry |
| `LIVE_CHUNK_TIMEOUT_SECONDS` | `15.0` | Seconds without receiving data before a chunk timeout is triggered |

## HLS

| Variable | Default | Description |
|----------|---------|-------------|
| `HLS_GC_ENABLED` | `true` | Enable garbage collection for stale HLS segments |
| `HLS_GC_INTERVAL` | `600` | Seconds between HLS GC runs |
| `HLS_GC_AGE_THRESHOLD` | `3600` | Seconds before an unused HLS segment is eligible for removal |
| `HLS_TEMP_DIR` | _(auto)_ | Base directory for HLS output files |
| `HLS_WAIT_TIME` | `10` | Seconds to wait for an initial HLS playlist to become available |

## Stream Sharing (Transcoded Streams)

| Variable | Default | Description |
|----------|---------|-------------|
| `STREAM_SHARING_STRATEGY` | `url_profile` | How shared streams are keyed: `url_profile` (URL + profile), `url_only`, or `disabled` |

## Broadcast

| Variable | Default | Description |
|----------|---------|-------------|
| `HLS_BROADCAST_DIR` | `/tmp/m3u-proxy-broadcasts` | Directory for HLS broadcast output |
| `BROADCAST_CALLBACK_TIMEOUT` | `3` | Seconds before a broadcast callback times out |
| `BROADCAST_MAX_START_RETRIES` | `3` | Maximum attempts to start a broadcast process |
| `BROADCAST_START_RETRY_WINDOW` | `300.0` | Time window (seconds) in which retries are counted |
| `BROADCAST_START_RETRY_COOLDOWN` | `15.0` | Cooldown (seconds) between retry attempts |
| `BROADCAST_START_FAILURE_GRACE` | `3.0` | Grace period (seconds) before a failed broadcast is cleaned up |

## Strict Live TS Mode

Improves stability for live MPEG-TS streams with PVR clients like Kodi. See [Strict Live TS](./strict-live-ts.md).

| Variable | Default | Description |
|----------|---------|-------------|
| `STRICT_LIVE_TS` | `false` | Enable globally for all live TS streams |
| `STRICT_LIVE_TS_PREBUFFER_SIZE` | `262144` | Pre-buffer size in bytes (default 256 KB) |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` | `2` | Seconds without data before circuit breaker triggers |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_COOLDOWN` | `60` | Seconds to avoid a failed upstream after circuit breaker fires |
| `STRICT_LIVE_TS_PREBUFFER_TIMEOUT` | `10` | Maximum seconds to wait for pre-buffer to complete |

## Bitrate Monitoring

Automatically triggers failover when the stream bitrate drops below a threshold.

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_BITRATE_MONITORING` | `false` | Enable bitrate monitoring |
| `MIN_BITRATE_THRESHOLD` | `62500` | Minimum acceptable bitrate in bytes/s (default ≈ 500 Kbps) |
| `BITRATE_CHECK_INTERVAL` | `5.0` | Seconds between bitrate checks |
| `BITRATE_FAILOVER_THRESHOLD` | `3` | Consecutive low-bitrate readings before failover is triggered |
| `BITRATE_MONITORING_GRACE_PERIOD` | `10.0` | Seconds after stream start before monitoring begins |

## Sticky Sessions

See [Sticky Sessions](./sticky-sessions.md).

| Variable | Default | Description |
|----------|---------|-------------|
| `USE_STICKY_SESSION` | `false` | Lock clients to a specific backend after a redirect |

## Redis (Pooling & Multi-Worker)

Required when using stream pooling or running multiple proxy workers. See [Redis Pooling](./redis-pooling.md).

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_ENABLED` | `false` | Enable Redis integration |
| `REDIS_HOST` | `localhost` | Redis server hostname |
| `REDIS_SERVER_PORT` | `6379` | Redis server port |
| `REDIS_DB` | `0` | Redis database number |
| `REDIS_PASSWORD` | _(unset)_ | Redis password (if auth is enabled) |
| `ENABLE_TRANSCODING_POOLING` | `true` | Share transcoding processes across clients |
| `MAX_CLIENTS_PER_SHARED_STREAM` | `10` | Maximum clients per shared stream |
| `CHANGE_BUFFER_CHUNKS` | `100` | Buffer size for stream change coordination |
| `WORKER_ID` | _(auto)_ | Unique identifier for this worker instance |
| `HEARTBEAT_INTERVAL` | `30` | Seconds between worker heartbeat updates |

## Example Configurations

### Minimal (no auth, local testing)

```bash
HOST=0.0.0.0
PORT=8085
LOG_LEVEL=info
```

### Production (with auth and Redis)

```bash
HOST=0.0.0.0
PORT=8085
LOG_LEVEL=error
API_TOKEN=your-secure-token-here

REDIS_ENABLED=true
REDIS_HOST=redis
REDIS_SERVER_PORT=6379
REDIS_DB=6

STREAM_RETRY_ATTEMPTS=3
STREAM_RETRY_DELAY=1.0
STREAM_TOTAL_TIMEOUT=30.0

CLEANUP_INTERVAL=60
```

### PVR / Kodi optimised

```bash
STRICT_LIVE_TS=true
STRICT_LIVE_TS_PREBUFFER_SIZE=262144
STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT=2
STRICT_LIVE_TS_CIRCUIT_BREAKER_COOLDOWN=60

STREAM_RETRY_ATTEMPTS=3
STREAM_RETRY_DELAY=1.0
```

### High concurrency

```bash
REDIS_ENABLED=true
MAX_CLIENTS_PER_SHARED_STREAM=20
CLEANUP_INTERVAL=30
ENABLE_BITRATE_MONITORING=true
MIN_BITRATE_THRESHOLD=62500
BITRATE_CHECK_INTERVAL=5.0
BITRATE_FAILOVER_THRESHOLD=3
```
