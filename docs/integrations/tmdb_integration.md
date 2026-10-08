---
sidebar_position: 1
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
- US age certifications (for example `PG-13` or `TV-MA`), series networks, and movie studios *(v0.13.1+)*
- "More like this" recommendations limited to what's in your own library
- **Dynamic Groups** such as Trending, Popular, or Top Comedy
- Optional **genre reclassification** of your VOD groups and series categories
- **Actor filmography** pages linked from cast lists

## Setup

1. Get a free API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) (v3 auth). **Get API Key** on the settings page links there.
2. Go to **Settings → Integrations → TMDB**.
3. Paste the key into **TMDB API Key** and click **Test Connection**.
4. Choose a **Search Language**, adjust the options below, and save.

**Rate Limit (requests/second)** keeps lookups under TMDB's limits on big libraries. See the [Settings Reference](/docs/advanced/settings-reference#tmdb) for every field.

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
- **Title cleaning**: strip provider prefixes such as `EN - ` or `4K-` from titles before searching, with separate pattern lists for VOD and series.
- **Auto-create groups/categories from TMDB genres**: file new items under their TMDB genre.

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

Dynamic Groups are per-playlist virtual groups built from TMDB lists. They are added to the top of the Xtream VOD and series category lists, and their membership refreshes daily and on every playlist sync.

Members are listed in TMDB's own order *(v0.13.1+)*, so a **Trending** group shows the most-trending title first rather than the most recently added one.

### Available sources

| Source | Movies | Series | Extra options |
|---|---|---|---|
| Trending | Yes | Yes | Time Window: Today or This Week |
| Popular | Yes | Yes | |
| In Theatres | Yes | | |
| Coming Soon | Yes | | |
| Top Genre | Yes | Yes | Genre |
| By TV Network | | Yes | TV Network |
| By Streaming Service | Yes | Yes | Streaming Service, Region |

Only titles that exist in your playlist are included.

### Creating a Dynamic Group

You can create them in two places:

- **VOD Channels → Dynamic Groups** or **Series → Dynamic Groups**, using **Create VOD Dynamic Group** or **Create Series Dynamic Group**. The rule is saved right away and its members are fetched from TMDB in the background, so they appear shortly after.
- On the playlist: **Edit Playlist → Processing → Dynamic Groups (TMDB)**, under **Dynamic Groups Configuration**. Use the **Preview** button on a rule to see what it matches before saving.

For each rule, set:

- **Content Type**: VOD (Movies) or Series
- **Source**, plus any source-specific options
- **Pages to Fetch**: TMDB returns about 20 results per page. The default is 3 pages and the maximum is 10 (about 200 titles). Raise this if titles you expect (such as a recent release) are missing.
- **Category Name**: what clients see, for example `Trending Now` or `Netflix`
- **Caching** *(v0.13.2+)*: when Cached Content Downloads are enabled, a rule can download its members automatically. See [Dynamic Group Caching](../advanced/cached-content.md#dynamic-group-caching).

The **Dynamic Groups** list pages show each group's playlist and item count, and **View** shows the actual members. **Edit** opens the same rule form used on the playlist, including **Preview**. Deleting a Dynamic Group also removes its rule from the playlist.

Dynamic Groups can also be published to Emby as libraries. See [Emby Library Publishing](emby_library_publishing.md).

:::note
Dynamic Groups require a configured TMDB API key. They can be turned off entirely with the [`PLAYLIST_TMDB_DYNAMIC_GROUPS`](../advanced/environment-variables.md#other-features) environment variable.
:::

## Ratings, Networks and Studios

*(v0.13.1+)* TMDB enrichment also stores:

- **Movies**: the US certification (theatrical release preferred) and the production studios.
- **Series**: the US content rating and the networks the show airs on.

These come from the same TMDB request enrichment already makes, so there are no extra API calls. Titles enriched before v0.13.1 pick up the new fields the first time a client opens their details.

Where they show up:

- Xtream `get_vod_info` and `get_series_info` return the rating as `mpaa_rating`. For series, a media server's official rating is used when TMDB has none.
- The Xtream `age` field is filled from the TMDB certification only when the provider left it blank. A provider-sent age always wins.
- `.nfo` files written for [STRM output](../advanced/strm-files.md) include the rating as `<mpaa>`, plus the studios (movies) or networks (series) as `<studio>`.

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

TMDB ratings and air dates also power extra sort options: **Rating** for VOD and series, and **Most Recent Activity** (the latest aired episode) for series. Use them in a playlist's **Sort Alpha Configs** (see [Processing](/docs/resources/playlists#processing)) or with **Sort by Date** on the Series list.

## AIOStreams

AIOStreams movie and series details are also enriched from TMDB (cast, clear logo, seasons). This is on by default and can be turned off per integration with **Enrich metadata with TMDB**. See [AIOStreams Integration](aiostreams_integration.md).
