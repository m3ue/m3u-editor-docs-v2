---
sidebar_position: 9
title: Redis Pooling
description: Share one transcoding process between everyone watching the same channel, using Redis.
tags:
  - Proxy
  - Redis
  - Performance
---

# Redis Pooling

Transcoding is expensive, and without pooling every viewer of a transcoded channel gets their own FFmpeg process. With Redis pooling, viewers watching the same channel with the same profile share one process, so the work grows with the number of channels being watched, not the number of viewers.

Live streams that aren't transcoded already share one provider connection per channel, with or without Redis.

## Turn it on

The [modular compose files](/docs/deployment/docker-compose#modular) already set it up. To set it up yourself, point the proxy at a Redis server:

```bash
REDIS_ENABLED=true
REDIS_HOST=redis
REDIS_SERVER_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=6
```

Use the same port and password as the Redis server. When the proxy shares a Redis server with M3U Editor, keep it on database `6`, so it stays out of the editor's way.

**Settings → Proxy → Test connection** shows whether **Redis Pooling** is on, the maximum viewers per shared stream, and the sharing strategy.

## Settings

| Variable | Default | What it does |
|---|---|---|
| `ENABLE_TRANSCODING_POOLING` | `true` | Share transcoding processes when Redis is on. |
| `STREAM_SHARING_STRATEGY` | `url_profile` | When viewers share a process: `url_profile` (same channel and same profile), `url_only` (same channel, any profile), or `disabled`. |
| `MAX_CLIENTS_PER_SHARED_STREAM` | `10` | Viewers per shared process. More viewers get another process. |
| `SHARED_STREAM_GRACE` | `3` | Seconds to keep a shared process running after the last viewer leaves, in case they come straight back. |

## Troubleshooting

| Problem | What to check |
|---|---|
| The proxy can't connect to Redis | `REDIS_HOST`, `REDIS_SERVER_PORT`, and `REDIS_PASSWORD` match the Redis server. `docker exec m3u-redis redis-cli -a your-password ping` should answer `PONG`. |
| Viewers aren't sharing a process | They're watching with the same profile, and `STREAM_SHARING_STRATEGY` isn't `disabled`. |

<details>
<summary>Running several proxy workers</summary>

Redis also lets several proxy instances share their state. Give each a unique `WORKER_ID` (one is generated if you don't), point them at the same Redis server and database, and put a load balancer in front. Workers report in every `HEARTBEAT_INTERVAL` seconds (default 30). Most setups only need one proxy.

</details>
