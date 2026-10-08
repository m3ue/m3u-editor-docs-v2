---
sidebar_position: 10
title: Configuration Reference
description: Every M3U Proxy environment variable, with its default.
tags:
  - Proxy
  - Configuration
  - Environment Variables
---

# Configuration Reference

M3U Proxy is configured with environment variables, set in the `m3u-proxy` service's `environment:` section or in a `.env` file. Most people only set the few the [compose files](/docs/deployment/docker-compose#modular) already include: `API_TOKEN`, `PORT`, the `REDIS_*` variables, and `LOG_LEVEL`.

Many behaviors can also be set per playlist in M3U Editor (like Strict Live TS and Sticky Sessions) or in **Settings → Proxy** (like silence detection). Those override the proxy's own defaults for streams M3U Editor starts.

## Server

| Variable | Default | What it does |
|---|---|---|
| `PORT` | `8085` | The port the proxy listens on. The compose files use `38085`, matching `M3U_PROXY_PORT` on the editor. |
| `HOST` | `0.0.0.0` | The address the proxy listens on. |
| `API_TOKEN` | Not set | The token M3U Editor uses to reach the proxy. Must match the editor's `M3U_PROXY_TOKEN`. When set, management endpoints require it. See [API Reference](api-reference#authentication). |
| `ROOT_PATH` | `/m3u-proxy` | The path the proxy is served under. Leave it as is with M3U Editor. Set it empty to serve at `/`. |
| `LOG_LEVEL` | `error` | `debug`, `info`, `warning`, or `error`. The compose files use `INFO`. |
| `LOG_ANONYMIZE` | `true` | Hide credentials and addresses in the logs. |
| `LOG_DIR`, `LOG_FILE` | `logs`, `m3u-proxy.log` | Where the log file is written. |
| `TEMP_DIR` | `/tmp/m3u-proxy-streams` | Working folder for temporary stream files. |
| `DOCS_URL`, `REDOC_URL`, `OPENAPI_URL` | `/docs`, `/redoc`, `/openapi.json` | Where the interactive API docs are served. |
| `APP_DEBUG`, `RELOAD` | `false` | Development options. |

## Timeouts and cleanup

| Variable | Default | What it does |
|---|---|---|
| `CLIENT_TIMEOUT` | `10` | Seconds of inactivity before a viewer counts as gone. |
| `STREAM_TIMEOUT` | `15` | Seconds allowed for stream operations. |
| `SHARED_STREAM_TIMEOUT` | `30` | The same, for shared streams. |
| `CLEANUP_INTERVAL` | `30` | Seconds between cleanups of finished streams and viewers. |
| `SHARED_STREAM_GRACE` | `3` | Seconds a shared transcoding process keeps running after the last viewer leaves. |
| `PRIMARY_HANDOFF_WAIT_SECONDS` | `2.0` | *(v0.4.31+)* When the viewer holding a shared live connection leaves, how long the next viewer waits to take it over before opening a new one. A new connection uses another provider slot and usually replays the last 10 to 20 seconds. |
| `VOD_READ_TIMEOUT`, `VOD_WRITE_TIMEOUT` | `3600.0` | Seconds a movie or episode connection can sit idle, so viewers can pause. |
| `LIVE_TV_WRITE_TIMEOUT` | `1800.0` | Seconds a live connection can wait on a slow viewer. |
| `ENABLE_CONNECTION_IDLE_MONITORING` | `true` | Log connections that stay idle for a long time. |
| `CONNECTION_IDLE_ALERT_THRESHOLD`, `CONNECTION_IDLE_ERROR_THRESHOLD` | `600`, `1800` | Seconds before an idle connection logs a warning, and an error. |
| `DISABLE_ASGI_DISCONNECT_MONITOR` | `false` | Testing option: rely only on timeouts to notice viewers leaving. |

## Upstream requests

| Variable | Default | What it does |
|---|---|---|
| `DEFAULT_USER_AGENT` | A desktop Chrome user agent | The user agent sent to providers, unless the playlist sets one. |
| `DEFAULT_CONNECTION_TIMEOUT` | `10.0` | Seconds to wait for a provider to accept a connection. |
| `DEFAULT_READ_TIMEOUT` | `30.0` | Seconds to wait for data from a provider. |
| `DEFAULT_MAX_RETRIES`, `DEFAULT_BACKOFF_FACTOR` | `3`, `1.5` | Retries for the proxy's own requests to providers. |
| `DEFAULT_RETRY_ATTEMPTS`, `DEFAULT_RETRY_DELAY` | `3`, `5` | Defaults for streams created without their own retry settings. |
| `DEFAULT_HEALTH_CHECK_INTERVAL` | `300.0` | Seconds between health checks of active streams. |
| `STREAMLINK_ENABLED`, `YTDLP_ENABLED` | `true` | Allow the Streamlink and yt-dlp [profile backends](transcoding#create-your-own-profile). |

## Retries and failover

See [Failover and Retries](failover).

| Variable | Default | What it does |
|---|---|---|
| `STREAM_RETRY_ATTEMPTS` | `3` | Retries on the same source before failing over. |
| `STREAM_RETRY_DELAY` | `1.0` | Seconds between retries. |
| `STREAM_RETRY_EXPONENTIAL_BACKOFF` | `false` | Wait 1.5 times longer before each retry. |
| `STREAM_TOTAL_TIMEOUT` | `30.0` | Seconds to spend retrying in total. `0` means no limit. |
| `MAX_FAILOVER_ATTEMPTS` | `0` | Backups to try before giving up. `0` tries them all. |
| `LIVE_CHUNK_TIMEOUT_SECONDS` | `15.0` | Seconds without data before a live stream counts as stalled. |
| `VOD_CHUNK_TIMEOUT_SECONDS` | `5.0` | Seconds without data before a movie or episode reconnects from where it stopped. |
| `LIVE_SILENT_RECONNECT_MIN_CHUNKS` | `10` | Data a live connection must deliver before the proxy quietly reconnects it, so a stream that has really ended isn't reconnected forever. |

## Bitrate monitoring

Fails over when a stream's bitrate stays too low.

| Variable | Default | What it does |
|---|---|---|
| `ENABLE_BITRATE_MONITORING` | `false` | Turn on bitrate monitoring. |
| `MIN_BITRATE_THRESHOLD` | `62500` | The lowest acceptable bitrate, in bytes per second (about 500 kbps). |
| `BITRATE_CHECK_INTERVAL` | `5.0` | Seconds between checks. |
| `BITRATE_FAILOVER_THRESHOLD` | `3` | Low checks in a row before failing over. |
| `BITRATE_MONITORING_GRACE_PERIOD` | `10.0` | Seconds after a stream starts before checking. |

## Silence detection

These are the defaults when silence detection isn't set in M3U Editor. See [Silence Detection](silence-detection).

| Variable | Default |
|---|---|
| `ENABLE_SILENCE_DETECTION` | `false` |
| `SILENCE_THRESHOLD_DB` | `-50.0` |
| `SILENCE_DURATION` | `3.0` |
| `SILENCE_CHECK_INTERVAL` | `10.0` |
| `SILENCE_FAILOVER_THRESHOLD` | `3` |
| `SILENCE_MONITORING_GRACE_PERIOD` | `15.0` |

## Strict Live TS

See [Strict Live TS](strict-live-ts).

| Variable | Default | What it does |
|---|---|---|
| `STRICT_LIVE_TS` | `false` | Use strict mode for every live TS stream. |
| `STRICT_LIVE_TS_PREBUFFER_SIZE` | `262144` | Bytes to pre-buffer (256 KB). |
| `STRICT_LIVE_TS_PREBUFFER_TIMEOUT` | `10` | Longest wait, in seconds, for the pre-buffer. |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_TIMEOUT` | `2` | Seconds without data before a source is marked bad. |
| `STRICT_LIVE_TS_CIRCUIT_BREAKER_COOLDOWN` | `60` | Seconds a bad source is avoided. |
| `STRICT_LIVE_TS_OVERLAP_TRIM` | `true` | *(v0.4.31+)* Trim the replay after a reconnect. |
| `STRICT_LIVE_TS_OVERLAP_SIGNATURE_SIZE` | `16384` | Bytes already sent that are used to find where to resume. |
| `STRICT_LIVE_TS_OVERLAP_MAX_SEARCH_SIZE` | `8388608` | Most bytes held from the new connection while searching (8 MB). |
| `STRICT_LIVE_TS_OVERLAP_MAX_WAIT` | `0.5` | Most seconds to search before sending the data unchanged. |

## Sticky sessions

| Variable | Default | What it does |
|---|---|---|
| `USE_STICKY_SESSION` | `false` | Use [sticky sessions](sticky-sessions) for every stream. |

## Transcoding and HLS

| Variable | Default | What it does |
|---|---|---|
| `HLS_TEMP_DIR` | The system temp folder | Where transcoded HLS output is written. |
| `HLS_WAIT_TIME` | `10` | Seconds to wait for FFmpeg's first HLS playlist before giving up. |
| `HLS_GC_ENABLED` | `true` | Clean up leftover HLS files. |
| `HLS_GC_INTERVAL` | `600` | Seconds between cleanups. |
| `HLS_GC_AGE_THRESHOLD` | `3600` | Age, in seconds, at which leftover files are removed. |

## Redis

See [Redis Pooling](redis-pooling).

| Variable | Default | What it does |
|---|---|---|
| `REDIS_ENABLED` | `false` | Connect to Redis. The compose files turn it on. |
| `REDIS_HOST` | `localhost` | The Redis server. |
| `REDIS_SERVER_PORT` | `6379` | The Redis port. |
| `REDIS_PASSWORD` | Not set | The Redis password. |
| `REDIS_DB` | `0` | The Redis database. Use `6` when sharing a Redis server with M3U Editor. |
| `ENABLE_TRANSCODING_POOLING` | `true` | Share transcoding processes between viewers. |
| `STREAM_SHARING_STRATEGY` | `url_profile` | `url_profile`, `url_only`, or `disabled`. |
| `MAX_CLIENTS_PER_SHARED_STREAM` | `10` | Viewers per shared process. |
| `CHANGE_BUFFER_CHUNKS` | `100` | Buffer used while shared streams change source. |
| `WORKER_ID` | Generated | This proxy's name, when running several. |
| `HEARTBEAT_INTERVAL` | `30` | Seconds between worker heartbeats. |

## Networks and DVR

Used by [Networks](/docs/integrations/media_networks_integration) and the [DVR](/docs/integrations/dvr_integration).

| Variable | Default | What it does |
|---|---|---|
| `HLS_BROADCAST_DIR` | `/tmp/m3u-proxy-broadcasts` | Where network broadcasts are written. |
| `BROADCAST_GC_ENABLED` | `true` | Clean up leftover broadcast folders, on the HLS cleanup schedule. |
| `BROADCAST_CALLBACK_TIMEOUT` | `3` | Seconds to wait when telling the editor a broadcast ended. |
| `BROADCAST_MAX_START_RETRIES` | `3` | Attempts to start a broadcast within `BROADCAST_START_RETRY_WINDOW`. |
| `BROADCAST_START_RETRY_WINDOW` | `300.0` | Seconds over which start attempts are counted. |
| `BROADCAST_START_RETRY_COOLDOWN` | `15.0` | Seconds to wait after running out of attempts before trying again. |
| `BROADCAST_START_FAILURE_GRACE` | `3.0` | Seconds before a broadcast that failed to start is cleaned up. |
| `BROADCAST_SUBTITLE_SYNC_OFFSET_SECONDS` | `1.0` | Shifts embedded subtitles to stay in sync. Adjust if they're always early or late by the same amount. |
| `DVR_RECORDING_DIR` | `/tmp/m3u-proxy-dvr` | Where recordings are written while they record. M3U Editor collects them from the proxy afterwards, so this doesn't need to be shared. |
| `DVR_RESTART_WINDOW_SECONDS` | `60.0` | How long a recording keeps restarting after its source drops before it fails. Resets each time new video arrives. |
| `DVR_STALL_TIMEOUT_SECONDS` | `30.0` | Seconds without new video before a running recording is restarted. |
