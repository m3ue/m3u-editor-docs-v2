---
sidebar_position: 7
description: Set up Electronic Program Guide (EPG) data
tags:
  - Getting Started
  - EPG
  - XMLTV
title: EPGs
---

# EPGs

Electronic Program Guide (EPG) data provides TV listings for your channels. M3U Editor supports multiple EPG sources.

## Supported EPG Sources

- **XMLTV Files** - Local or remote XML files
- **XMLTV URLs** - Direct links to EPG data
- **Schedules Direct** - Full integration with SD service

## Adding EPG Data

### Via XMLTV URL

1. Navigate to **EPG** in the sidebar
2. Click **Add EPG Source**
3. Select **XMLTV URL**
4. Enter the EPG URL
5. (Optional) Set refresh interval
6. Click **Save & Import**

### Via File Upload

1. Navigate to **EPG** in the sidebar
2. Click **Add EPG Source**
3. Select **Upload File**
4. Choose your XMLTV file
5. Click **Save & Import**

### Via Schedules Direct

1. Navigate to **EPG** in the sidebar
2. Click **Add EPG Source**
3. Select **Schedules Direct**
4. Enter your SD credentials
5. Select lineups and channels
6. Click **Save & Import**

## Mapping EPG to Channels

EPG-to-channel matching is managed through the **EPG Maps** resource (sidebar → **EPG** → **EPG Maps**), which runs a fuzzy-matching job across a playlist (or a subset of it) against an EPG source and reports results per channel.

### Creating an EPG Map

1. Navigate to **EPG Maps** and click **New EPG Map**
2. Select the **EPG** to map from — both standard and **Merged EPGs** are selectable, grouped in the dropdown
3. Select the **Playlist** to map to
4. Optionally scope the mapping to specific **Groups** instead of the entire playlist (leave empty to include all groups)
5. Toggle **Overwrite** to replace existing mappings, and **Recurring** to re-run the mapping automatically every time the EPG syncs
6. (Optional) Configure prefix/regex stripping and the advanced matching settings below
7. Save — the map runs as a background job and the table shows live progress

### Matching Settings

| Setting | Description |
|---|---|
| **Use regex for filtering** | Clean channel names using a regex pattern instead of a plain prefix list before matching |
| **Channel prefixes / regex patterns to remove** | Strings stripped from channel names before matching (e.g. `US: `, `UK: `, quality tags, bracketed text). Includes a regex tester when regex mode is enabled |

**Advanced Settings** (collapsed by default):

| Setting | Description |
|---|---|
| **Skip channels without EPG ID** | Skip channels missing `epg_channel_id`/`tvg-id` instead of attempting a name-based match |
| **Prioritize name/display name matching** | Prefer exact name matches over `channel_id` matches — useful when an EPG reuses one `channel_id` across multiple quality variants |
| **Set preferred icon to EPG** | Use the matched EPG channel's icon as the channel's preferred logo source |
| **Remove quality indicators** | Strip quality tags (HD, FHD, UHD, 4K, 720p, 1080p, etc.) during fuzzy matching, with a custom list override |
| **Minimum Similarity (%)** | Minimum similarity score required for a match (default `70`) |
| **Maximum Fuzzy Distance** | Maximum Levenshtein distance allowed for a fuzzy match (default `25`) |
| **Exact Match Distance** | Maximum distance still treated as an exact match (default `8`) |
| **Widen matching with pg_trgm similarity (Postgres only)** | Postgres-only, disabled by default. See [Postgres Trigram Matching](#postgres-trigram-matching-advanced) below |

### Postgres Trigram Matching (Advanced)

On Postgres, EPG matching can optionally widen its candidate search using the `pg_trgm` extension's trigram similarity operator (`%`). This catches typos and transliteration differences (e.g. `Soprtsnet` vs `Sportsnet`) that literal substring (`LIKE`) matching misses.

This is a per-**EPG Map** toggle in **Advanced Settings** → **Postgres Trigram Matching**, and is **disabled by default** — widening every search term with a trigram scan measurably slows down mapping runs on large EPGs/playlists, so it's opt-in per map rather than automatic or global.

**Implications of enabling it:**

- ⚠️ **Slower mapping jobs.** Every search term run against that map's EPG candidate pool gets an extra trigram condition, on top of the existing exact/`LIKE`/JSON matching. Expect noticeably longer mapping runs, especially on EPGs with many channels or when mapping a large playlist. Only the maps you enable it on are affected — other EPG Maps keep their existing speed.
- ✅ **Better recall for typo/transliteration mismatches** that would otherwise surface as unmatched candidates.
- It only takes effect on a Postgres connection with `pg_trgm` actually installed. On other database drivers, or on Postgres without the extension, the toggle is greyed out and disabled in the form.

**If you're using the embedded Postgres image**, the extension and its supporting GIN indexes are already provisioned automatically — the toggle is enabled and ready to use.

**If you're running your own external Postgres instance**, the toggle stays disabled until you provision `pg_trgm` yourself. Run the bundled setup command from the app container (or anywhere with `artisan` access and network access to your database):

```bash
php artisan app:configure-pg-trgm
```

By default it connects using the app's own configured `pgsql` connection. To target a different database (e.g. connecting as a superuser just for setup, separate from the app's regular role), pass overrides explicitly:

```bash
php artisan app:configure-pg-trgm \
  --host=your-db-host \
  --port=5432 \
  --database=your_database_name \
  --username=postgres \
  --threshold=0.35
```

| Option | Description |
|---|---|
| `--host`, `--port`, `--database`, `--username`, `--password` | Override the connection to use. Defaults to the app's configured `pgsql` connection if omitted; you'll be prompted for a password if `--username` is given without one |
| `--threshold` | `pg_trgm.similarity_threshold` to set. Defaults to `TRGM_THRESHOLD` or `0.35` |

The command:

1. Installs the `pg_trgm` and `fuzzystrmatch` extensions
2. Sets `pg_trgm.similarity_threshold` at the database level (needs superuser or `GRANT SET ON PARAMETER` — if your role can't set it, the command warns and continues; matching still works using Postgres's built-in default of `0.3` instead)
3. Builds the GIN trigram indexes on `epg_channels` (`channel_id`, `name`, `display_name`) using `CREATE INDEX CONCURRENTLY`, so it's safe to run against a database with EPG imports already in progress
4. Refreshes table statistics with `ANALYZE`

If `epg_channels` doesn't exist yet (a fresh install before its first `php artisan migrate`), the command installs the extensions and warns you to re-run it after migrating to build the indexes.

Once it completes, reload the EPG Map form — the toggle becomes enabled immediately, no restart needed.

### Reviewing Candidates

Channels that don't clear the auto-match bar are recorded as **candidates** rather than silently skipped. Click **Review Candidates** on an EPG Map row to open a per-channel review table showing:

- The top-matched EPG channel, its confidence score, and the reason for the match (exact, fuzzy, etc.)
- Any alternative candidates found
- Whether the match was automatic or needs a human decision

From there you can **Apply** the top suggestion, **Change** it to pick from alternatives (or search the EPG source manually), **Skip** a channel, or use the bulk **Apply top candidate** / **Mark as skipped** actions across many rows at once. Tabs filter by status: Pending, Applied, Skipped, and Stale (candidates invalidated by a later re-run).

### Automatic / AI Copilot Mapping

If [AI Copilot](../ai-copilot/overview.md) is enabled, the **Smart EPG Mapper** tool can suggest and apply EPG mappings for unmapped live channels directly from a chat request (e.g. "map EPG for unmapped channels in this playlist"). It shares the same similarity settings saved on your EPG Maps, so results stay consistent with any manual runs. See [Copilot Tools](../ai-copilot/tools.md#smart-epg-mapper).

### Manual Mapping (Single Channel)

For one-off corrections without running a full map:

1. Go to your playlist's **Channels**
2. Click on a channel
3. Scroll to **EPG Mapping**
4. Search for the correct EPG channel
5. Click **Map**

## EPG Preview

View the program guide:

1. Navigate to **EPG Preview**
2. Select your playlist
3. Browse the TV guide
4. Click on any program to see details
5. (Optional) Click play to test the stream

## EPG Cache Overview

For large EPG files, M3U Editor includes caching:

- **Automatic Caching** - Generated after EPG import
- **Date-Chunked Storage** - Efficient data retrieval
- **Fast API Access** - Instant program guide loading

The cache is automatically updated when EPG data is refreshed.

## EPG Output

M3U Editor can generate EPG for your output playlists:

1. Go to your playlist settings
2. Enable **Include EPG in Output**
3. Choose EPG format:
   - Full XMLTV (all programs)
   - Filtered (only mapped channels)
   - Time-limited (e.g., 7 days)

## Troubleshooting

### EPG Not Showing

1. Verify EPG import completed successfully
2. Check channel mappings
3. Ensure time zones are correct
4. Refresh EPG cache

### Slow EPG Loading

For very large EPG files:
1. Enable EPG caching (automatic)
2. Use time-limited outputs
3. Filter to only needed channels

## Next Steps

- [EPG Cache Overview](/docs/advanced/epg-optimization) - EPG caching and optimization overview
- [Advanced EPG Dummies (AED)](/docs/advanced/advanced-epg-dummies) - Smart dummy EPG from stream titles
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel management
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
