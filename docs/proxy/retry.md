---
sidebar_position: 5
title: Retry Configuration
description: Tuning automatic retry behaviour for stream connection failures
tags:
  - Proxy
  - Retry
  - Reliability
---

# Retry Configuration

When a stream connection fails, the proxy can automatically retry before resorting to [failover](./failover.md). This helps ride out brief upstream blips without switching providers unnecessarily.

## How Retries Work

When an error is detected (timeout, network error, lost connection), the proxy follows this sequence:

1. **Retry the current URL** up to `STREAM_RETRY_ATTEMPTS` times with `STREAM_RETRY_DELAY` seconds between attempts
2. **Respect the total timeout**: if `STREAM_TOTAL_TIMEOUT` is exceeded, retries stop regardless of the attempt count
3. **Attempt failover**: if retries are exhausted and failover URLs exist, switch to the next URL
4. **Fail the stream**: only after all retries and failover attempts are exhausted

## Configuration

Add these to your `.env` file or Docker environment:

| Variable | Default | Description |
|----------|---------|-------------|
| `STREAM_RETRY_ATTEMPTS` | `3` | Retries before switching to the next failover URL |
| `STREAM_RETRY_DELAY` | `1.0` | Seconds between retry attempts |
| `STREAM_TOTAL_TIMEOUT` | `30.0` | Maximum total seconds for all retry attempts. Set to `0` to disable |
| `STREAM_RETRY_EXPONENTIAL_BACKOFF` | `false` | Multiply `STREAM_RETRY_DELAY` by 1.5 on each retry |
| `LIVE_CHUNK_TIMEOUT_SECONDS` | `15.0` | Seconds without receiving any data before a chunk timeout fires |

## When Retries Are Applied

Retries trigger automatically for:

- **Chunk timeouts**: no data received within `LIVE_CHUNK_TIMEOUT_SECONDS`
- **Connection errors**: network errors, timeout exceptions, HTTP errors
- **Read errors**: connection lost before data is received
- **Unexpected errors**: unhandled exceptions during streaming

Retries are **not** applied for:

- **VOD mid-stream failures**: once bytes have started flowing, VOD uses Range-header reconnection instead
- **Client disconnections**: errors originating from the client side
- **Streams with active data**: retries only apply when a connection fails before data is received

## Example Configurations

### Conservative (quick failover)

```bash
STREAM_RETRY_ATTEMPTS=2
STREAM_RETRY_DELAY=1.0
STREAM_TOTAL_TIMEOUT=30.0
STREAM_RETRY_EXPONENTIAL_BACKOFF=false
```

Use this when you have reliable failover URLs and want fast switching.

### Moderate (recommended)

```bash
STREAM_RETRY_ATTEMPTS=3
STREAM_RETRY_DELAY=1.0
STREAM_TOTAL_TIMEOUT=60.0
STREAM_RETRY_EXPONENTIAL_BACKOFF=false
```

A good starting point for most deployments.

### Aggressive (maximum persistence)

```bash
STREAM_RETRY_ATTEMPTS=5
STREAM_RETRY_DELAY=2.0
STREAM_TOTAL_TIMEOUT=120.0
STREAM_RETRY_EXPONENTIAL_BACKOFF=true
```

Use when the upstream provider is occasionally slow but usually recovers, and you'd rather wait than switch providers.

## Logging

Retry activity is logged at `INFO` level:

```
2026-02-10 09:53:44 - WARNING - No data received for 15.0s from upstream for stream ABCD, client client_1234
2026-02-10 09:53:44 - INFO    - Retrying connection for stream ABCD, client client_1234 (attempt 1/3, delay: 1.0s)
2026-02-10 09:53:45 - INFO    - Connection successful after 1 retries, resetting retry counter
```

When retries are exhausted:

```
2026-02-10 09:53:50 - INFO - Retries exhausted, attempting failover due to chunk timeout for client client_1234 (failover attempt 1/3)
```

## Relationship with Failover

Retries and failover work together in a two-stage hierarchy:

```
Error detected
    ↓
Retry current URL (STREAM_RETRY_ATTEMPTS times)
    ↓ (if still failing)
Switch to next failover URL (FAILOVER)
    ↓ (if all failover URLs exhausted)
Stream marked as failed
```

Retries keep you on the same URL; failover moves you to a different one. For most setups, retries handle brief hiccups while failover handles actual provider outages.

## Troubleshooting

**Streams still dropping frequently**
- Increase `STREAM_RETRY_ATTEMPTS` to 5–10
- Increase `STREAM_TOTAL_TIMEOUT` to 120–180 seconds
- Enable `STREAM_RETRY_EXPONENTIAL_BACKOFF=true`
- Check if `LIVE_CHUNK_TIMEOUT_SECONDS` is too aggressive: try 20–30 seconds

**Streams taking too long to fail**
- Decrease `STREAM_RETRY_ATTEMPTS` to 1–2
- Decrease `STREAM_TOTAL_TIMEOUT` to 20–30 seconds
- Decrease `STREAM_RETRY_DELAY` to 0.5 seconds

**Streams work but buffer frequently**
- Decrease `LIVE_CHUNK_TIMEOUT_SECONDS` to detect stalls faster
- Increase `STREAM_RETRY_DELAY` to give upstream time to recover
- Enable `STREAM_RETRY_EXPONENTIAL_BACKOFF=true`

## Best Practices

1. **Start conservative**: begin with the moderate preset and adjust based on real-world behaviour
2. **Watch the logs**: retry frequency reveals your provider's reliability patterns
3. **Account for distance**: if the upstream provider is geographically far, increase `STREAM_RETRY_DELAY`
4. **Balance with failover**: if you have reliable failover URLs, keep retry attempts low for faster switching
5. **Use exponential backoff** for providers with rate limiting or burst issues
