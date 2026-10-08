---
sidebar_position: 13
description: How M3U Editor prepares large guides in the background so the guide viewer, M3U TV, and the DVR stay fast.
tags:
  - Advanced
  - EPG
  - Performance
title: EPG Cache
---

# EPG Cache

Guide files can be huge: hundreds of thousands of programs in one XML file. Reading that file every time someone opens the guide would be far too slow, so after each EPG sync, M3U Editor reads it once and stores the programs in a fast, searchable cache. The guide viewer, the Xtream API's guide data, M3U TV, and the DVR all read from the cache.

It's automatic. You'll mostly notice it in **EPG → EPGs**:

| Column | Shows |
|---|---|
| **Cache Progress** | How far the cache build has got after a sync. |
| **Cached** | Whether the EPG has a cache. |
| **Has DVR** | Whether a playlist using this EPG has the [DVR](/docs/integrations/dvr_integration) on. For those, the build also prepares the programs the DVR schedules from, which takes a little longer. |
| **Cache Time** | How long the last build took. |

**Generate Cache** rebuilds an EPG's cache by hand, from its row or for several selected EPGs. Use it if the guide looks out of date or empty after a sync.

The cache is kept in the `epg-cache` folder in your `./data` volume, one folder per EPG. It's safe to delete: it's rebuilt on the next sync or **Generate Cache**.

## If the guide is slow or empty

| Problem | What to check |
|---|---|
| The guide is empty after a sync | **Cache Progress** reached 100%. If the build failed, check the EPG's status, and try **Generate Cache**. |
| Builds take a long time | Very large guides take a few minutes; this is normal. If your provider's guide covers channels you don't use, a smaller guide (or a [Merged EPG](/docs/resources/epg-setup#combine-guides) of only what you need) builds faster. |
| The guide shows old data | Check the EPG is syncing (**Last Synced**), then use **Generate Cache**. |

<details>
<summary>Reading cached guide data from the API</summary>

The guide viewer loads its data from these endpoints, which you can use too:

| Endpoint | Returns |
|---|---|
| `GET /api/epg/{epg-uuid}/data` | Channels and programs from one EPG |
| `GET /api/epg/playlist/{playlist-uuid}/data` | Programs for a playlist's enabled channels |
| `GET /api/epg/playlist/{playlist-uuid}/groups` | The playlist's groups |

Filter with `start_date` and `end_date` (`YYYY-MM-DD`), search with `search`, and page with `page` and `per_page` (default 50). Requests are limited to 60 a minute.

</details>
