---
sidebar_position: 0.5
description: Enrich VOD and series with TMDB metadata, build Dynamic Groups, reclassify by genre, and browse actor filmographies
tags:
  - TMDB
  - VOD
  - Series
  - Metadata
title: TMDB Integration
---

# TMDB Integration

M3U Editor uses [The Movie Database (TMDB)](https://www.themoviedb.org/) to fill in and improve VOD and series metadata. With a TMDB API key you get:

- TMDB, TVDB, and IMDB IDs (needed for Trash Guides naming in Sonarr/Radarr and for `.strm` folders)
- Plot, artwork, clear logos (transparent title art), genres, ratings, and full cast lists
- "More like this" recommendations limited to what's in your own library
- **Dynamic Groups** such as Trending, Popular, or Top Comedy
- Optional **genre reclassification** of your VOD groups and series categories
- **Actor filmography** pages linked from cast lists

## Setup

1. Get a free API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (v3 auth).
2. Go to **Settings → Integrations → TMDB**.
3. Paste the key into **TMDB API Key** and click **Test Connection**.
4. Adjust the options below and save.

See the [Settings Reference](../advanced/settings-reference.md#tmdb-integration) for every field.

## Getting Metadata

There are three ways to fetch TMDB data. You can combine them.

### Automatically on sync

Turn on **Auto-lookup on metadata fetch**. TMDB lookups then run as part of each playlist sync. **Auto-lookup scope** controls whether this covers only enabled items (default), all new items, or both.

### Automatically on request

Turn on **Auto-enrichment on request**. A VOD title or series is enriched the first time someone opens it in a client (for example M3U TV or another Xtream client), instead of during sync. This keeps syncs fast on large playlists while still filling in the titles people actually watch.

### Manually

- **Fetch TMDB Metadata** is available on single VOD channels and series, as a bulk action, on groups and categories, and from the playlist's action menu. Turn on **Overwrite Existing Metadata** to replace data that's already there.
- **Manual TMDB Search** lets you pick the right match yourself when the automatic match is wrong.

:::info TMDB data is kept
TMDB-enriched metadata is no longer overwritten by the provider's own metadata fetch or by media server syncs. Use **Fetch Provider Metadata** if you want the provider's data instead.
:::

### Match quality

- **Match Confidence Threshold**: minimum title similarity (50 to 100%) to accept a match.
- **Minimum Vote Count**: ratings with fewer TMDB votes than this are hidden instead of shown as potentially misleading (default 25).
- **Title cleaning**: strip provider prefixes such as `EN - ` or `4K-` from titles before searching.

## Related Content ("More Like This")

During enrichment, TMDB recommendations are saved with each movie and series. When a client requests VOD or series info through the Xtream API, a `related` list is returned with only the recommendations that exist in that playlist's library, so every item shown is playable. The list grows automatically as your library grows.

## Actor Filmography

Cast members on the Series and VOD detail pages link to an **Actor Filmography** page. When opened from a playlist, the filmography only shows titles available in that playlist, and clicking one takes you to its detail page.

Xtream clients can request the same data with the `get_actor_filmography` action:

```
/player_api.php?username=USER&password=PASS&action=get_actor_filmography&person_id=12345
/player_api.php?username=USER&password=PASS&action=get_actor_filmography&name=Rebecca%20Ferguson
```

The response contains the `person` (name, photo, bio) and their `credits`. Each credit has `in_library` and `local_id` set, so clients can link straight to titles in your library. M3U TV uses this for its actor pages.

## Dynamic Groups

Dynamic Groups are per-playlist virtual groups built from TMDB lists. They are added to the top of the Xtream VOD and series category lists, and their membership updates on every sync.

### Available sources

| Source | Movies | Series | Extra options |
|---|:-:|:-:|---|
| Trending | ✓ | ✓ | Time Window: Today or This Week |
| Popular | ✓ | ✓ | |
| In Theatres | ✓ | | |
| Coming Soon | ✓ | | |
| Top Genre | ✓ | ✓ | Genre |
| By TV Network | | ✓ | TV Network |
| By Streaming Service | ✓ | ✓ | Streaming Service, Region |

Only titles that exist in your playlist are included.

### Creating a Dynamic Group

You can create them in two places:

- **VOD Channels → Dynamic Groups** or **Series → Dynamic Groups**, using **New VOD Dynamic Group** or **New Series Dynamic Group**. The group is built right away.
- On the playlist: **Edit Playlist → Processing → Dynamic Groups (TMDB)**, under **Dynamic Groups Configuration**. Use the **Preview** button on a rule to see what it matches before saving.

For each rule, set:

- **Content Type**: VOD (Movies) or Series
- **Source**, plus any source-specific options
- **Pages to Fetch**: TMDB returns about 20 results per page. Raise this if titles you expect (such as a recent release) are missing.
- **Category Name**: what clients see, for example `Trending Now` or `Netflix`

The **Dynamic Groups** list pages show each group's playlist and item count, and **View** shows the actual members. Deleting a Dynamic Group also removes its rule from the playlist.

Dynamic Groups can also be published to Emby as libraries. See [Emby Library Publishing](emby_library_publishing.md).

:::note
Dynamic Groups require a configured TMDB API key. They can be turned off entirely with the [`PLAYLIST_TMDB_DYNAMIC_GROUPS`](../advanced/environment-variables.md#playlist_tmdb_dynamic_groups) environment variable.
:::

## Reclassify to TMDB Genres

Reclassifying moves each **enabled** VOD channel or series into a group or category that matches its own TMDB genre. Items with no usable genre go to **Uncategorized**.

- **On sync**: in **Edit Playlist → Processing → Dynamic Groups (TMDB)**, turn on **Auto-reclassify VOD groups to TMDB genres on sync** and/or **Auto-reclassify Series categories to TMDB genres on sync**. The two are independent.
- **Manually**: use **Reclassify to TMDB Genres** on a VOD group or series category (edit page header, or as a bulk action on the list).

What reclassify leaves alone:

- Disabled content
- Groups or categories used by an enabled Auto-Add-to-Custom-Playlist rule
- Merged groups
- DVR recordings (they stay in their DVR Recordings group)

If TMDB isn't configured or its genre list can't be loaded, reclassify does nothing rather than risk a destructive change.

## Sorting by TMDB Data

TMDB ratings and air dates also power extra sort options. See [Sorting](../resources/playlists.md#sorting-vod-and-series).

## AIOStreams

AIOStreams movie and series details are also enriched from TMDB (cast, clear logo, seasons). This is on by default and can be turned off per integration with **Enrich metadata with TMDB**. See [AIOStreams Integration](aiostreams_integration.md).
