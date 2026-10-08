---
sidebar_position: 11
title: API Reference
description: Use M3U Proxy from your own tools - authentication, endpoints, stream metadata, and webhooks for stream events.
tags:
  - Proxy
  - API
  - Reference
---

# API Reference

M3U Editor drives M3U Proxy through its REST API, and you can use the same API from your own scripts and tools. This page is an overview. The proxy serves complete, interactive docs for every endpoint at `/docs`: in M3U Editor, open **Settings → Proxy** and choose **API docs**.

## Authentication

When `API_TOKEN` is set on the proxy (the compose files always set it), management endpoints need that token. Send it as a header, or as a query parameter where a header isn't possible:

```bash
curl -H "X-API-Token: your-token" http://m3u-proxy:38085/stats
curl "http://m3u-proxy:38085/health?api_token=your-token"
```

A missing or wrong token gets a `401` response. In M3U Editor, **Settings → Proxy → API key** shows the token in use.

Endpoints that serve video to players never need the token: `/stream/{id}`, `/hls/{id}/...`, `/dash/{id}/...`, and broadcast playlists and segments. The stream ID itself is hard to guess, and only M3U Editor hands it out.

:::warning
Keep the proxy on your Docker network, as the compose files do, and reach it through M3U Editor. Don't publish its port to the internet.
:::

## Endpoints

All paths are relative to the proxy's root (`/m3u-proxy` when reached through M3U Editor).

| Method | Path | Does |
|---|---|---|
| `GET` | `/health` | Health check, with the proxy's version |
| `GET` | `/info` | Version, hardware acceleration, FFmpeg, Streamlink, yt-dlp, and Redis details |
| `POST` | `/streams` | Start proxying a stream, and get its ID and playback path |
| `POST` | `/transcode` | Start a transcoded stream (see [Transcoding](transcoding)) |
| `GET` | `/transcode/profiles` | List the built-in transcoding profiles |
| `GET` | `/streams`, `/streams/{id}` | List streams, or get one, with viewers and statistics |
| `DELETE` | `/streams/{id}` | Stop a stream and disconnect its viewers |
| `POST` | `/streams/{id}/failover` | Switch a stream to its next backup now |
| `GET` | `/streams/by-metadata` | Find streams by a metadata field (below) |
| `GET` | `/streams/counts-by-metadata` | Count streams grouped by a metadata field |
| `DELETE` | `/streams/by-metadata`, `/streams/oldest-by-metadata` | Stop matching streams, or the oldest one |
| `DELETE` | `/hls/{id}/clients/{client_id}` | Disconnect one viewer |
| `GET` | `/stats`, `/stats/detailed`, `/stats/performance`, `/stats/streams`, `/stats/clients` | Statistics |
| `GET` | `/clients` | List connected viewers |
| `POST` | `/test-connection` | Check the proxy can reach a URL |
| `POST`, `GET`, `DELETE` | `/webhooks` | Add, list, or remove webhooks (below) |
| `POST` | `/webhooks/test` | Send a test event to a webhook |
| `POST`, `GET`, `DELETE` | `/broadcast/...` | Network broadcasts and DVR recordings, used by M3U Editor |

### Start a stream

```bash
curl -X POST http://m3u-proxy:38085/streams \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "http://provider.example/live/channel.ts",
    "failover_urls": ["http://backup.example/live/channel.ts"],
    "user_agent": "MyPlayer/1.0",
    "metadata": { "channel": "news-1" }
  }'
```

The response includes the `stream_id` and the path to play it from (`/stream/{id}` or `/hls/{id}/playlist.m3u8`). Optional fields include `headers`, `strict_live_ts`, `use_sticky_session`, and the silence detection settings.

### Stream metadata

`metadata` is any set of keys and values you attach to a stream, returned with it everywhere. Use it to find streams by your own IDs:

```bash
curl -H "X-API-Token: your-token" \
  "http://m3u-proxy:38085/streams/by-metadata?field=channel&value=news-1&active_only=true"
```

M3U Editor uses metadata this way to count and limit streams per playlist and per login.

## Webhooks

The proxy can call a URL when something happens to a stream:

| Event | When |
|---|---|
| `stream_started`, `stream_stopped`, `stream_failed` | A stream starts, stops, or fails for good |
| `client_connected`, `client_disconnected` | A viewer joins or leaves |
| `failover_triggered` | A stream switches to a backup |
| `connection_idle_warning`, `connection_idle_error` | A connection has been idle for longer than `CONNECTION_IDLE_ALERT_THRESHOLD` or `CONNECTION_IDLE_ERROR_THRESHOLD` |

Add a webhook for some or all events (all, if `events` is left out):

```bash
curl -X POST http://m3u-proxy:38085/webhooks \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{ "url": "https://example.com/hook", "events": ["failover_triggered", "stream_failed"] }'
```

Each call is a JSON `POST`:

```json
{
  "event_id": "2b7e...",
  "event_type": "failover_triggered",
  "stream_id": "abc123",
  "timestamp": "2026-10-08T21:38:15.724Z",
  "data": { "old_url": "http://provider.example/...", "new_url": "http://backup.example/..." }
}
```

M3U Editor registers its own webhook on the proxy to keep its stream counts current. Running `php artisan m3u-proxy:register-webhook` in the editor container registers it again if needed.
