---
sidebar_position: 10
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

You can move the cache folder with the [`CACHE_STORAGE_PATH`](environment-variables.md#storage) environment variable.
:::

## Caching Content

Use **Cache Now** on:

- A VOD movie (**VOD Channels → Channels**)
- A series episode (the **Episodes** table on a series)

Use **Cache all episodes** on a series to queue every episode it has.

*(v0.13.2+)* Both also work as bulk actions: select several movies and use **Cache Now**, or several series and use **Cache all episodes**. They are available on the **VOD** and **Series** tables and on a dynamic group's member list. Items that are already cached, already queued, or have no cacheable source URL are skipped.

The download is queued and runs in the background. If the item is already cached or already queued, you'll be told so instead of getting a second download.

To queue every enabled VOD movie and episode at once, run:

```bash
php artisan cache:content                 # all playlists
php artisan cache:content --playlist=12   # one playlist
php artisan cache:content --dry-run       # report what would be queued
```

### Cached column

When caching is enabled, the VOD and Episodes tables get a **Cached** column. Its icon shows where the item will play from:

| Icon | Meaning |
|---|---|
| Green | A local cached file. Playback uses it. |
| Blue (server) | A matching file on your media server ([Prefer media server sources](../resources/playlists.md#media-server-sources)). Playback uses it. |
| Amber (clock) | Sent to Radarr or Sonarr and waiting for the download. Playback uses the provider until then. |
| Grey | Not cached. |

## Dynamic Group Caching

*(v0.13.2+)* A [TMDB Dynamic Group](../integrations/tmdb_integration.md#dynamic-groups) rule can cache its members automatically, so a group like **Trending Movies** is always ready to play locally. Each rule has a **Caching** section:

| Setting | Default | What it does |
|---|---|---|
| **Cache group members** | Off | Download the group's members through Cached Downloads. Series rules cache only each series' latest season. |
| **Top N members** | `20` | Only cache the top N members, in TMDB order. Leave empty for no limit. |
| **Keep after leaving (days)** | `0` | How long a cached item is kept after it drops out of the group. `0` removes it at the next daily cleanup. |
| **Never expire** | Off | Keep everything this rule caches, even after it leaves the group. |

Caching runs whenever the group's members refresh (daily, and on each playlist sync). If caching is turned off in **Settings → Cache**, the rule's options are locked but kept as saved.

Files cached by a rule show **Auto** in the **Source** column on Cached Downloads. Files you cached yourself with Cache Now show **Manual**. Dynamic group cleanup only ever removes Auto files, and it runs whatever the playlist's [retention mode](#retention) is. To hold on to an Auto file, use **Keep** (or **Keep selected** for several). It then shows as Manual and is never removed by group cleanup.

## Caching Through Radarr or Sonarr

*(v0.13.2+)* Instead of downloading from your provider, Cache Now and dynamic group caching can send new titles to Radarr (movies) or Sonarr (series). The arr downloads the title into your media server library, and playback then uses the media server copy.

This applies when all three are true:

1. Caching is enabled in **Settings → Cache**.
2. The playlist has [Prefer media server sources](../resources/playlists.md#media-server-sources) turned on.
3. A Radarr or Sonarr integration has **Use for caching** turned on (see [Sonarr & Radarr](../integrations/arrs_integration.md#using-an-arr-for-caching)).

How titles are handled:

- Only titles the arr doesn't have yet are sent. Nothing already in its library is changed or removed.
- A title the arr already has, with a file, counts as cached. If it has no file yet, Cache Now downloads it from the provider instead, so running Cache Now again gets past an arr that can't find a release.
- For a single episode, Cache Now asks Sonarr for that episode only. Caching a whole series adds it to Sonarr. Dynamic group caching adds the series with only its latest season monitored.
- If the arr is unreachable or rejects the title, the provider is used instead.
- Progress is shown on **Integrations → Download Queue**, and the **Cached** column shows the clock icon until the download lands on your media server.

### Fail back to the provider

*(v0.13.3+)* With **Fail back to the provider** on the integration, a title sent to the arr is downloaded from the provider instead when the arr fails to download it, or when it still isn't downloaded or downloading after 24 hours. The title is then unmonitored in the arr, but nothing is deleted from it. This check runs every 10 minutes.

### Radarr cleanup

*(v0.13.2+)* Titles sent to an arr are managed by that arr, and cache retention never removes them. The one exception is a Radarr integration with **Remove after leaving dynamic groups** on. Movies that dynamic group caching added to that Radarr are removed from it, files included, once they have left every dynamic group.

- Removal waits for the longest **Keep after leaving (days)** among your caching rules, and at least 1 day.
- Only movies added while the option is on are removed, never movies that were already in the library.
- Running **Cache Now** on a movie keeps it.
- When any such movies exist, the VOD table shows a **Radarr Cleanup** column marking them.

## Cached Downloads Page

**Playlist → Cached Downloads** (or **Manage Cached Items** on **Settings → Cache**) lists every cached item with its status, source (Auto or Manual), progress, size, ETA, and failure count.

*(v0.13.2+)* A header shows totals for **Cached** (movies and episodes), **Storage Used**, **In Progress**, and **Failed**. The totals follow the table's filters and refresh every 10 seconds.

Click a row to open its details: type, playlist, TMDB/TVDB IDs, quality, dynamic groups, format, size, whether the file is on disk, speed and ETA while downloading, and the last error. Admins also see the full file path on disk.

From here you can:

- **Retry download** for a failed item
- **Cancel download** for an item that is queued or in progress
- **Keep** a file cached by a dynamic group, so group cleanup leaves it alone
- **Delete cache** to remove a completed file
- **View error** to see why a download failed
- Keep, retry, cancel, or delete several items at once with the bulk actions

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

A playlist's own setting wins; otherwise the global default from **Settings → Cache** applies. Downloads in progress are never removed by cleanup. Files cached by a dynamic group follow their rule's own keep settings instead (see [Dynamic Group Caching](#dynamic-group-caching)).

Two scheduled tasks handle cleanup:

| Command | Schedule | What it does |
|---|---|---|
| `cache:cleanup` | Daily at 03:00 | Deletes cached files whose movie or episode is no longer in its playlist (Automatic mode only), releases dynamic group files past their keep period, and runs [Radarr cleanup](#radarr-cleanup) |
| `cache:cleanup-orphans` | Daily at 03:30 | Removes download records that never produced a file and haven't been touched for a while |

## Performance

Downloads run on their own `cache-queue` Horizon supervisor, so a slow provider or a multi-GB download can't hold up playlist imports and syncs. Each playlist downloads one file at a time, and the total number of downloads running at once is capped by [`HORIZON_CACHE_MAX_PROCESSES`](environment-variables.md#background-workers) (1 on SQLite, 4 otherwise).

Opening the provider connection goes through the same provider rate limiting as imports (**Settings → Sync Options**).
