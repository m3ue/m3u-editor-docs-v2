---
sidebar_position: 2
description: Every environment variable M3U Editor reads, grouped by what it controls, with defaults.
tags:
  - Advanced
  - Configuration
  - Environment
title: Environment Variables
---

# Environment Variables

Environment variables configure what M3U Editor needs before it starts. Set them in the `m3u-editor` service's `environment:` section, or in the `.env` file next to your compose file, then run `docker compose up -d` to apply them.

Most people only need the few covered in [Editor Configuration](/docs/configuration). Everything else has a sensible default. Settings you can change in the app are in the [Settings Reference](settings-reference); when a variable below also exists as a setting, the variable wins and the setting is locked.

M3U Proxy has its own variables, in the [proxy's Configuration Reference](/docs/proxy/configuration).

## Application

| Variable | Default | What it does |
|---|---|---|
| `APP_URL` | `http://localhost` | The address players use to reach the editor, without the port. Used in every link it builds. |
| `APP_PORT` | `36400` | The port the editor listens on. Added to `http://` links. |
| `TZ` | `UTC` | The timezone. **Application Timezone** in **Settings → General** overrides it. |
| `XTREAM_ONLY_ENABLED`, `XTREAM_PORT` | `false`, `36401` | Also serve only the Xtream API on a second port. |
| `APP_KEY` | Generated | The encryption key. Set it yourself only when moving an install. |
| `APP_DEBUG` | `false` | Detailed error pages. Don't use it on a server others can reach. |
| `LOG_DIR` | `/var/www/config/logs` | Where log files are written. |
| `LOG_ANONYMIZE` | `true` | Hide credentials and addresses in the logs. |

## Database

| Variable | Default | What it does |
|---|---|---|
| `DB_CONNECTION` | `sqlite` | `sqlite` or `pgsql`. The shipped compose files use `pgsql`. |
| `ENABLE_POSTGRES` | `false` | Run PostgreSQL inside the editor container. |
| `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `PG_PORT` | `m3ue`, `m3ue`, none, `5432` | The embedded PostgreSQL's database and login. |
| `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | `127.0.0.1`, `5432`, `m3ue` | Where the app connects. For embedded PostgreSQL, match the `PG_*` values. |
| `SQLITE_MIGRATE` | `false` | Move an existing SQLite database into PostgreSQL on the next start. See [SQLite to PostgreSQL](sqlite-to-postgres). |
| `TRGM_THRESHOLD` | `0.35` | Similarity threshold for [wider EPG matching](/docs/resources/epg-setup#improve-the-matches) on PostgreSQL. |

See [Editor Configuration](/docs/configuration#database) for each setup, and [SQLite to PostgreSQL](sqlite-to-postgres) to move an existing install.

## Redis

| Variable | Default | What it does |
|---|---|---|
| `REDIS_ENABLED` | `true` | Run Redis inside the editor container. Set `false` to use a separate Redis. |
| `REDIS_HOST` | `localhost` | The Redis server. |
| `REDIS_SERVER_PORT` | `36790` | The Redis port. The separate Redis container in the compose files uses `6379`. |
| `REDIS_PASSWORD` | `M3U_PROXY_TOKEN`, or generated | The Redis password. |

## M3U Proxy

| Variable | Default | What it does |
|---|---|---|
| `M3U_PROXY_ENABLED` | `true` | `true` runs the proxy inside the editor container. `false` uses a separate proxy container. |
| `M3U_PROXY_HOST`, `M3U_PROXY_PORT` | `127.0.0.1`, `8085` | Where the separate proxy is, like `m3u-proxy` and `38085`. |
| `M3U_PROXY_TOKEN` | Generated for the embedded proxy | The shared token. Must match `API_TOKEN` on a separate proxy. |
| `M3U_PROXY_INTEGRATION_ENABLED` | `true` | Set `false` to hide every proxy feature, for installs that don't use it. |
| `M3U_PROXY_FAILOVER_RESOLVER_URL` | None | The **Resolver URL** for [smart failover](/docs/proxy/failover#smart-failover). Locks the setting. |
| `M3U_PROXY_LOG_LEVEL` | `ERROR` | Log level for the embedded proxy. |
| `M3U_PROXY_ALLOW_UNAUTHENTICATED_CALLBACKS` | `false` | Accept calls from the proxy with no token. Only for a trusted local setup with no token set. |
| `PROXY_URL_OVERRIDE`, `PROXY_URL_OVERRIDE_INCLUDE_LOGOS` | None | The proxy's **Override URL**, and whether logos use it. Lock the settings. |
| `MEDIA_SERVER_PROXY_URL_VERSION` | `1` | Raise it to make every media server stream link generated before stop working. |
| `ALLOW_PRIVATE_WEBHOOK_URLS` | `false` | Let post-process webhooks call private addresses, like a media server on your LAN. |

The embedded proxy also reads these, which a separate proxy container sets for itself:

| Variable | Default | What it does |
|---|---|---|
| `HLS_TEMP_DIR` | `/var/www/html/storage/app/hls-segments` | Where transcoded HLS output is written. Mount `/dev/shm` or a `tmpfs` here to keep it in memory. |
| `HLS_BROADCAST_DIR` | Same as `HLS_TEMP_DIR` | Where [Network](/docs/integrations/media_networks_integration) broadcasts are written. |
| `HLS_GC_ENABLED`, `HLS_GC_INTERVAL`, `HLS_GC_AGE_THRESHOLD` | `true`, `600`, `7200` | Cleanup of leftover HLS files: how often, in seconds, and at what age. |
| `BROADCAST_GC_ENABLED` | `true` | Clean up leftover broadcast folders. |

## Storage

| Variable | Default | What it does |
|---|---|---|
| `DVR_STORAGE_PATH` | Inside the container | Where [DVR](/docs/integrations/dvr_integration) recordings are saved. Mount a volume here. |
| `CACHE_STORAGE_PATH` | Inside the container | Where [cached downloads](cached-content) are saved. Mount a volume here. |
| `XTREAM_MOVIE_FOLDER`, `XTREAM_SERIES_FOLDER`, `XTREAM_STRM_FOLDER` | `Movies`, `Series`, `strm` | Folder names used for [`.strm` files](strm-files). |

## Playlists and syncs

| Variable | Default | What it does |
|---|---|---|
| `INVALIDATE_IMPORT` | None | Turn [sync invalidation](/docs/resources/playlists#protect-against-bad-syncs) on or off. Locks the setting. |
| `INVALIDATE_IMPORT_THRESHOLD`, `INVALIDATE_IMPORT_SERIES_THRESHOLD`, `INVALIDATE_IMPORT_GROUP_THRESHOLD` | None | The invalidation thresholds. Lock the settings. |
| `FAILED_RETRY_COOLDOWN_MINUTES` | None (setting default 15) | Minutes before a failed playlist or EPG sync is retried. Locks the setting. |
| `AUTO_RETRY_503_ENABLED` | `true` | Retry a sync that failed because the provider's server returned an error (500, 502, 503, or 504). |
| `AUTO_RETRY_503_MAX`, `AUTO_RETRY_503_COOLDOWN_MINUTES` | `3`, `10` | How many times, and the cooldown before the count resets. |
| `AUTO_RETRY_503_DELAY_MIN_SECONDS`, `AUTO_RETRY_503_DELAY_MAX_SECONDS` | `300`, `900` | The wait before each retry is picked between these. |
| `PLAYLIST_DOWNLOAD_TIMEOUT`, `EPG_DOWNLOAD_TIMEOUT` | `900` | Seconds allowed to download a playlist or guide. Raise for very large files on slow connections. |
| `NGINX_READ_TIMEOUT` | `900` | Seconds the web server waits for large playlist and guide responses. |
| `MAX_CHANNELS` | `50000` | The most channels a playlist can import. |
| `DISABLE_SYNC_LOGS` | `false` | Turn off sync logs everywhere, for speed. |
| `DISABLE_M3U_XTREAM_FORMAT` | `false` | Put provider URLs directly in M3U output for every playlist. Locks the playlist setting. |
| `DEFAULT_EPG_DAYS` | `7` | Days of guide data to output. |
| `DEFAULT_EPG_CATCHUP_DAYS` | `7` | Catch-up days reported when a channel has catch-up but no duration. `0` reports none. |
| `STUCK_PROCESSING_MINUTES` | `240` | After this long, a playlist or EPG stuck in "processing" is reset so it can sync again. |
| `SYNC_RUN_STALE_MINUTES` | `20` | After this long without progress, a sync run is marked as failed. |
| `ALLOWED_PLAYLIST_DOMAINS` | None | Only allow playlist URLs from these domains, comma-separated, with wildcards. Locks the setting. |
| `TVGID_REGEX` | `/[^a-zA-Z0-9_\-\.]/` | Characters removed from generated `tvg-id` values. |

## Images

| Variable | Default | What it does |
|---|---|---|
| `LOGO_CACHE_EXPIRY_DAYS` | `30` | How long cached logos are kept. |
| `PROXY_IMAGE_RESIZE_ENABLED` | None (setting default on) | Turn **Optimize cached artwork** on or off. Locks the setting. |
| `PROXY_IMAGE_RESIZE_POSTER_WIDTH`, `_BACKDROP_WIDTH`, `_TITLE_LOGO_WIDTH`, `_PHOTO_WIDTH` | None (600, 1280, 800, 300) | Maximum widths for each kind of image. Lock the settings. |
| `PROXY_IMAGE_RESIZE_QUALITY` | None (70) | Compression quality, 1 to 100. Locks the setting. |
| `PROXY_IMAGE_RESIZE_MAX` | `1920` | The largest width any image can be set to. |

## Sign-in

| Variable | Default | What it does |
|---|---|---|
| `LOGIN_PATH` | `login` | The path of the sign-in page. |
| `REDIRECT_GUEST_TO_LOGIN` | `true` | Send signed-out visitors to the sign-in page. |
| `AUTO_LOGIN`, `AUTO_LOGIN_EMAIL` | `false`, `admin@test.com` | Sign in automatically as this user, with no password. Only for a private, single-user setup. |
| `OIDC_*` | | Single sign-on. See [Single Sign-On](sso-oidc). |

## Other features

| Variable | Default | What it does |
|---|---|---|
| `DVR_ENABLED` | `true` | Turn the [DVR](/docs/integrations/dvr_integration) off everywhere with `false`. |
| `DVR_INITIAL_LOOKAHEAD_DAYS` | `14` | Days of guide data recording rules are matched against. |
| `DVR_COMSKIP_PATH`, `DVR_COMSKIP_INI` | Built in | The Comskip program and its settings file. |
| `DVR_COMSKIP_TIMEOUT_SECONDS` | `0` | Longest Comskip may run. `0` means no limit. |
| `DVR_MAX_ATTEMPTS_PER_AIRING` | `3` | Attempts to record one airing. |
| `PLAYLIST_TMDB_DYNAMIC_GROUPS` | `true` | Turn off TMDB [Dynamic Groups](/docs/integrations/tmdb_integration#dynamic-groups) and genre sorting. |
| `NETWORK_BROADCAST_ENABLED` | `false` | Show broadcast status on Network playlists. Broadcasting itself is turned on per [Network](/docs/integrations/media_networks_integration). |
| `PUSH_RELAY_URL` | The shared relay | Your own [push relay](/docs/m3u-tv/push-notifications). |
| `PUSH_RELAY_STALE_DAYS` | `60` | Days before a phone that stopped checking in is removed. |
| `SHOW_WAN_DETAILS` | None | Show or hide the WAN address in the menu. Locks the setting. |
| `COPILOT_PROVIDER`, `COPILOT_MODEL`, and provider keys | | The [AI Copilot](/docs/ai-copilot/configuration#provider-and-model). |
| `BACKUP_ARCHIVE_PASSWORD` | None | Encrypt backup files with this password. |
| `PLUGIN_*` | | [Plugins](/docs/extensions/overview), such as `PLUGIN_INSTALL_MODE` and `PLUGIN_GITHUB_TOKEN`. |

## Live updates

The web interface gets live updates (progress bars and notifications) over websockets.

| Variable | Default | What it does |
|---|---|---|
| `REVERB_PORT` | `36800` | The websocket server's port inside the container. The web server forwards `/app` to it, so it doesn't need publishing. |
| `REVERB_VERIFY` | `true` | Verify TLS certificates when sending updates. Set `false` only for a self-signed certificate. |

**Test WebSocket** in **Settings → General** checks they're working.

## Web server

| Variable | Default | What it does |
|---|---|---|
| `NGINX_ENABLED` | `true` | Set `false` to serve the app from your own web server, as in the [fully external](/docs/deployment/docker-compose#fully-external) setups. |
| `FPMPORT` | `9000` | The PHP-FPM port your web server connects to. |

## Background workers

Jobs like syncs, probing, and recordings run on background workers. Each queue's workers can be tuned with `HORIZON_<QUEUE>_MAX_PROCESSES`, `_MAX_JOBS`, `_MAX_TIME`, and `_MEMORY`. Leave them unset to use the defaults.

| Queue | Prefix | Handles | Default workers |
|---|---|---|---|
| General | `HORIZON_QUEUE_` | Syncs, imports, and most jobs | 12 (1 on SQLite) |
| Schedules Direct | `HORIZON_SD_` | Schedules Direct imports | 1 |
| DVR | `HORIZON_DVR_` | Recording and post-processing | 4 (1 on SQLite) |
| AIOStreams | `HORIZON_AIOSTREAMS_` | Finding AIOStreams streams | 2 |
| Cache | `HORIZON_CACHE_` | [Cached downloads](cached-content) | 4 (1 on SQLite) |
| Plugins | `HORIZON_PLUGIN_` | [Plugin](/docs/extensions/overview) runs | 1 |

For example, `HORIZON_CACHE_MAX_PROCESSES=2` limits how many files download at once.
