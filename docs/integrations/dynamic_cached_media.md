---
sidebar_position: 7
description: Blend provider VOD and Series with locally-grabbed arr copies using trending-based dynamic groups — with provider failback and optional purge-on-leave
title: Dynamic Cached Media
hide_title: true
tags:
  - Integrations
  - Dynamic Groups
  - TMDB
  - Caching
  - Arr
  - Emby
---

# Dynamic Cached Media

Dynamic Cached Media lets you get the **best of both worlds**: keep your provider's VOD and Series catalogs available to clients, while an integrated **arr stack** (Radarr / Sonarr) quietly pulls high-quality local copies of the content people are actually watching — based on **TMDB trending data**. Storage stays small, and quality stays high.

Playback always prefers your own copies first:

1. **Media server copy** (Emby / Jellyfin / Plex) — where arr-downloaded titles surface
2. **Cached download** — from M3U Editor's provider cache
3. **Provider stream** — direct from the provider (the failback)

And when content falls off the trending lists and **leaves a dynamic group**, optional cleanup settings can automatically remove it again — so your storage footprint follows demand.

## How It Works

Cached content lives in one of **two places**, and which one gets used depends on your playlist's **Prefer Media Server Sources** setting:

| | **Provider Cache** *(default)* | **Arr Library** *(media-server mode)* |
|---|---|---|
| Downloaded by | M3U Editor, straight from the provider | Radarr / Sonarr, at your arr's quality |
| Stored in | M3U Editor's cache disk (`storage/app/private/cache`) | Your arr's root folder → your media server library |
| Played by | M3U Editor itself | Your media server |
| Cleaned by | **Keep After Leaving (days)** retention | **Remove after leaving dynamic groups** (Radarr only) |

- Dynamic groups are built from TMDB endpoints (Trending, Popular, In Theatres, Coming Soon, Top Genre, ...) and refresh daily (plus on every playlist sync)
- **By default**, group members are downloaded from the provider into the cache disk
- **In media-server mode** (Prefer Media Server Sources + an arr with *Use for caching*), requests go to the arr instead — content lands in your media server library at full arr quality
- **Fail back to the provider**: if the arr can't deliver within **24 hours**, the request flips and M3U Editor downloads the title into the provider cache instead — so you never end up with nothing

## Prerequisites

Before starting, make sure you have:

- A working M3U Editor installation (Docker) with queue workers and the scheduler running
- A **TMDB API key** — [get one free here](https://www.themoviedb.org/settings/api)
- *(For the default provider cache)* just the cache volume below
- *(For arr mode)* a working **arr stack** — Radarr (movies) and/or Sonarr (series) — plus a working **Emby** (or Jellyfin / Plex) server, since arr downloads reach clients through your media server's library
- A playlist with **TMDB IDs** matched on its VOD/Series content

:::note Read Me First
The two modes stack: the provider cache works on its own, and when the arr path is engaged it *replaces* provider downloads for titles the arr can get — with the provider cache as the automatic fallback when it can't.
:::

## Step 1 — Add the Cache Volume

Cached files live on a dedicated `cache` disk inside the container at `/var/www/html/storage/app/private/cache`. Add a volume to your `docker-compose.yml` so downloads survive container rebuilds:

```yaml
services:
  m3u-editor:
    volumes:
      - ./cache:/var/www/html/storage/app/private/cache
```

:::tip
You can relocate the cache with the `CACHE_STORAGE_PATH` environment variable if you'd rather keep it somewhere else (e.g., a dedicated SSD pool).
:::

:::info
This volume matters in **both** modes — it holds the default provider downloads *and* it's where arr-mode titles land when they fail back to the provider.
:::

## Step 2 — Configure Your TMDB API Key

Dynamic group membership is driven by TMDB, so this comes first.

1. Open the sidebar and go to **Settings → Integrations**, then select the **TMDB** tab
2. Paste your key into **TMDB API Key** (v3 auth)
3. Click **Test Connection** and confirm it succeeds
4. Configure the lookup behavior — this is what makes the rest of the guide work:
   - **Auto-lookup on metadata fetch** — **enable this.** It stamps TMDB IDs onto your VOD and Series automatically during import/metadata fetch. Dynamic group membership is matched by TMDB ID, and arr requests are sent by TMDB/TVDB ID — content without IDs can't join trending groups and skips the arr path. *(Heads-up: lookups slow down imports for large playlists.)*
   - **Auto-lookup scope** *(appears once auto-lookup is on)* — whether to look up **Only enabled**, **All new**, or **Both**
   - **Auto-enrichment on request** — *(optional)* enriches a title with full TMDB data (cast, artwork, plot) the first time a client requests it, instead of at sync time
   - **Auto-create groups/categories from TMDB genres** — *(optional)* creates genre groups/categories automatically during metadata fetch; pairs well with the reclassify toggles in Step 7

![TMDB integration settings with auto-lookup enabled](/img/doc_imgs/dynamic_cached_media_tmdb_settings.png)

:::tip
Already have a playlist without TMDB IDs? You can run **Fetch TMDB IDs** on the playlist instead of re-importing with auto-lookup enabled.
:::

## Step 3 — Enable Caching

1. Go to **Settings → Cache**
2. Enable **Enable Cache** — this is the master switch for everything: the Cached Downloads page, Cache Now, auto-caching, and playback serving

![Cache settings with Enable Cache on](/img/doc_imgs/dynamic_cached_media_cache_settings.png)

:::warning
If you skipped Step 1, this page shows a warning callout. Files written without the volume mount are lost on container rebuild — fix the mount first.
:::

## Step 4 — Connect Emby and Prefer Its Sources

1. Follow the [Emby Integration](./emby_integration.md) guide to connect your media server, including **Media Library Paths** — these are what let M3U Editor match provider items to files Emby already has
2. On your playlist, open the **Media Server Sources** section and enable **Prefer Media Server Sources** (this requires TMDB IDs on the playlist)

This is the switch that changes *where* caching happens: with it on (and an arr configured in Step 5), downloads route to the arr and play from your media server. With it off, downloads go straight into the provider cache and play from M3U Editor itself. Either way, playback checks your media server's existing library first.

## Step 5 — Connect Sonarr & Radarr

1. Go to **Media Servers → Sonarr & Radarr** and click to add your arr
2. Fill in **Display Name**, **Type** (`radarr` or `sonarr`), **Server URL**, and **API Key**
3. Click **Sync Profiles & Folders** to pull in **Quality Profile** and **Root Folder** — arr additions use these
4. Enable the caching toggles:
   - **Use for caching** — route dynamic group downloads to this arr *instead of* the provider (only active on playlists that prefer media server sources)
   - **Remove after leaving dynamic groups** *(Radarr only)* — purge movies (files included) once they leave every group
   - **Fail back to the provider** — a title that fails to download, or still isn't downloaded or downloading after 24 hours, is downloaded into the provider cache instead and unmonitored in the arr

![Sonarr & Radarr integration with caching toggles](/img/doc_imgs/dynamic_cached_media_arr_cache_toggles.png)

:::info
Movie requests go to Radarr by TMDB ID; series and per-episode requests go to Sonarr by TVDB ID. Whole-series Sonarr requests never fail back — only per-episode requests do. Sonarr content is never deleted on leave.

If the arr can't find a title at all (not in its library, add rejected), the dispatch falls through to the provider cache immediately — no need to wait out the 24-hour window. The 24-hour failback only applies to titles the arr accepted and couldn't finish. And you're never stuck waiting: running **Cache Now** again on a title still queued in the arr switches it to the provider download right away.
:::

## Step 6 — Prepare Your VOD Content

Dynamic groups can only match and cache VODs that are **enabled** and carry a **TMDB ID**. Both gates are easy to miss:

- **Disabled channels are never cached.** A group's auto-cache only covers enabled members, in TMDB rank order.
- **TMDB lookups skip disabled channels by default.** With the default *Auto-lookup scope* ("Only enabled"), a playlist full of disabled VODs never gets TMDB IDs — so trending matching finds nothing.

Newly imported VOD channels are **disabled by default**, so a fresh playlist typically needs this step:

1. **For future imports** — on the playlist's **Processing** step, enable **Enable new VOD channels**. This applies to channels added by subsequent syncs (it only affects *new* channels, not existing ones).
2. **For channels already imported** — go to **VOD Channels**, select the disabled VODs and use the bulk action to **enable** them.
3. **Stamp the TMDB IDs** — any of:
   - Re-run the playlist sync: auto-lookup now sees the enabled channels (default scope "Only enabled")
   - Or set **Auto-lookup scope** to **Both** in Settings → Integrations → TMDB
   - Or run **Fetch TMDB VOD Metadata** on your VOD groups
4. **Sanity-check** one VOD channel: it should be enabled and show a TMDB ID.

:::info You do NOT need "Fetch metadata"
The Processing step's **Fetch metadata** toggles fetch *provider* metadata (plot, cover, plain-text cast) — a separate phase from TMDB lookups. The TMDB ID stamping above is driven solely by the global **Auto-lookup on metadata fetch** setting from Step 2 — and that same TMDB pass also backfills the TMDB-only fields clients care about: **`clearlogo`** and structured **`cast_list`** never come from the provider, only from TMDB enrichment. Leave "Fetch metadata" off for lighter syncs (Xtream clients trigger provider fetches on first request anyway); if any titles end up missing clearlogos, run the bulk **Fetch TMDB VOD Metadata** action to backfill.
:::

:::note
This guide configures VODs end-to-end. Series work the same way one step offset: **Enable new series**, bulk-enable existing series, and **Fetch TMDB Series Metadata** — Sonarr then receives series by TVDB ID.
:::

:::warning Privacy
The playlist type/sync configuration screens embed provider specifics (group names, counts, source URLs). This guide deliberately shows no screenshots of those screens — and you may want to follow the same rule when sharing your own setup.
:::

## Step 7 — Create a Dynamic Group with Caching

1. Edit your playlist and go to the **Processing** step
2. In the **Dynamic Groups (TMDB)** section, add a rule:
   - **Source** — e.g. `Trending`, `Popular`, `In Theatres`, `Coming Soon`, `Top Genre`, `By Streaming Service`
   - **Time Window** (Trending) — `day` or `week`
   - **Pages to Fetch** — how many pages of ~20 TMDB results to pull (default 3)
3. Expand the rule's **Caching** fieldset:
   - **Enabled** — turn on caching for this group
   - **Top N Members** — how many members to keep locally, ranked by TMDB position (default 20)
   - **Keep After Leaving (days)** — days a file survives after its item leaves the group (`0` = next nightly cleanup)
   - **Never Expire** — pin this group's files permanently
4. Use **Preview** to sanity-check the membership, then save and sync the playlist

![Dynamic Groups (TMDB) rule with the Caching fieldset](/img/doc_imgs/dynamic_cached_media_playlist_dynamic_groups.png)

:::note
VOD groups cache every member (up to **Top N Members**). Series groups cache **only each series' latest season** — keeping the footprint small.
:::

### Optional — Reclassify Categories to TMDB Genres

Also in the **Processing** step are two optional toggles that reorganize content around TMDB genre data after each sync:

- **Auto-reclassify VOD groups to TMDB genres on sync** — routes each enabled VOD channel out of any group that doesn't match its TMDB genre into its own genre group (or "Uncategorized" if no genre data). Groups referenced by an Auto-Add to Custom Playlist rule, or merged groups, are never touched.
- **Auto-reclassify Series categories to TMDB genres on sync** — the same idea for series categories, independent of the VOD toggle.

These don't affect caching directly — they keep provider groups tidy while TMDB-driven groups serve the trending content.

## Step 8 — Watch It Work

- **Cached Downloads** (sidebar → Playlist) shows every cache file with status (`pending`, `downloading`, `completed`, `failed`) and actions: **Cache Now**, **Retry**, **Keep**, **Cancel**
- The **Arr Download Queue** shows live Radarr/Sonarr progress
- Anything that fails or stalls past 24 hours flips to provider source automatically

![Cached Downloads with active downloads](/img/doc_imgs/dynamic_cached_media_cached_downloads.png)

## Purge-on-Leave Behavior

With cleanup enabled, storage follows demand automatically. What gets removed — and what never does:

| Content | Removed when it leaves? | Controlled by |
|---|---|---|
| Provider cache files (VOD / episodes) | ✅ after **Keep After Leaving (days)** | Rule's Caching fieldset |
| Radarr movies *(arr library, files included)* | ✅ after the longest keep period (min 1 day) | **Remove after leaving dynamic groups** |
| Sonarr series *(arr library)* | ❌ never | — |
| Manual **Cache Now** downloads | ❌ never (kept permanently) | — |

Nightly cleanup runs at **03:00**. Nothing is ever purged while TMDB is unconfigured, and in-flight downloads are protected.

## Troubleshooting

### Dynamic Groups Don't Appear
- Confirm a working **TMDB API Key** (Step 2) — the Dynamic Groups screens are hidden without one
- Trigger a sync on the playlist, or use the refresh action on the Dynamic Groups listing
- Groups also refresh daily at **04:15**

### Nothing Is Downloading
- Check **Enable Cache** is on (Step 3) and the rule's **Caching → Enabled** is on
- Confirm your queue worker is running — downloads process one at a time per playlist on the `cache` queue
- Verify the cache volume mount exists and is writable
- In arr mode, check the Radarr/Sonarr **Download Queue** — if the arr accepted the title, progress shows there, not on Cached Downloads

### Plays From the Provider Instead of Local
- **Prefer Media Server Sources** must be enabled on the playlist
- Check **Media Library Paths** on the Emby integration point at the right content
- Confirm the item has a TMDB ID — matching is done by TMDB ID

### Arr Never Grabs, or Requests Stall
- Run **Sync Profiles & Folders** — additions need a Quality Profile and Root Folder
- Confirm the arr is reachable and the API key is valid
- Failed downloads fall back to the provider on the next 10-minute sweep; titles that never got grabbed fall back after **24 hours**
- Titles stuck in the arr's queue (e.g., import blocked, manual interaction needed) also wait out the 24-hour deadline — or run **Cache Now** again to pull from the provider immediately

### Old Files Aren't Being Purged
- Cleanup runs nightly at **03:00** — give it a cycle
- **Never Expire** pins a group's files; manual **Keep** marks a file permanent
- Radarr cleanup only touches movies that were **auto-added** while **Remove after leaving dynamic groups** was on

## Related Documentation

- [Emby Integration](./emby_integration.md)
- [Media Server Integration Settings](./emby_integration_settings.md)
- [Local Media Integration](./local_media_integration.md)
- [Docker Compose Deployments](../deployment/docker-compose.md)
