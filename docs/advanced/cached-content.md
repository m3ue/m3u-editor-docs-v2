---
sidebar_position: 3.5
description: Download VOD movies and series episodes to local storage and play them from the local copy
tags:
  - VOD
  - Series
  - Cache
title: Cached Content Downloads
---

# Cached Content Downloads

Cached Content Downloads save provider VOD movies and series episodes to local storage. Once a download finishes, playback uses the local copy automatically instead of fetching the stream from your provider every time. Clients don't need a different URL.

If caching is turned off, or a cached file is incomplete, missing, or unavailable, playback falls back to the provider stream as usual.

## Enabling the Cache

1. Go to **Settings → Cache**.
2. Turn on **Enable cache**.
3. Pick a **Cache retention mode** (see [Retention](#retention)).
4. Save.

When caching is enabled, the **Cache Now** actions appear and the **Cached Downloads** page is added to the **Playlist** menu group.

:::warning Mount a volume in Docker
Cached files are written inside the container unless you mount a volume at the cache folder. Without one, every cached file is lost when the container is rebuilt or updated. The Cache settings page shows the exact path to mount, for example:

```yaml
volumes:
  - ./cache:/var/www/html/storage/app/private/cache
```

You can move the cache folder with the [`CACHE_STORAGE_PATH`](environment-variables.md#cache_storage_path) environment variable.
:::

## Caching Content

Use **Cache Now** on:

- A VOD movie (**VOD Channels → Channels**)
- A series episode (the **Episodes** table on a series)

The download is queued and runs in the background. If the item is already cached or already queued, you'll be told so instead of getting a second download.

To queue every enabled VOD movie and episode at once, run:

```bash
php artisan cache:content                 # all playlists
php artisan cache:content --playlist=12   # one playlist
php artisan cache:content --dry-run       # report what would be queued
```

## Cached Downloads Page

**Playlist → Cached Downloads** lists every cached item with its status, progress, size, ETA, and failure count. From here you can:

- **Retry download** for a failed item
- **Cancel download** for an item that is queued or in progress
- **Delete cache** to remove a completed file
- **View error** to see why a download failed
- Retry, cancel, or delete several items at once with the bulk actions

## Per-Playlist Options

Each playlist has a **Cache** section on its edit page (only shown when caching is enabled):

- **Share cache across playlists**: lets your other playlists play this playlist's cached files for the same movie or episode instead of downloading their own copy. It only applies to playlists you own. Cached files are never shared between users.
- **Cache retention mode**: overrides the global retention mode for this playlist.

## Retention

| Mode | Behavior |
|---|---|
| **Automatic** (default) | A cached file is deleted once its movie or episode is removed from the playlist. |
| **Never expire** | Files are kept until you delete them from the Cached Downloads page. |
| **Manual** | Same as Never expire: nothing is cleaned up automatically. |

A playlist's own setting wins; otherwise the global default from **Settings → Cache** applies. Downloads in progress are never removed by cleanup.

Two scheduled tasks handle cleanup:

| Command | Schedule | What it does |
|---|---|---|
| `cache:cleanup` | Daily at 03:00 | Deletes cached files whose movie or episode is no longer in its playlist (Automatic mode only) |
| `cache:cleanup-orphans` | Daily at 03:30 | Removes download records that never produced a file and haven't been touched for a while |

## Performance

Downloads run on their own `cache-queue` Horizon supervisor, so a slow provider or a multi-GB download can't hold up playlist imports and syncs. Each playlist downloads one file at a time, and the total number of downloads running at once is capped by [`HORIZON_CACHE_MAX_PROCESSES`](environment-variables.md#horizon_cache_max_processes) (1 on SQLite, 4 otherwise).

Opening the provider connection goes through the same provider rate limiting as imports (**Settings → Sync Options**).
