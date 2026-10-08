---
sidebar_position: 2
description: Add guide data from XMLTV or Schedules Direct, combine guides, map them to your channels, and fill gaps with placeholder guides.
tags:
  - Getting Started
  - EPG
  - XMLTV
title: EPGs
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { Steps, Step } from '@site/src/components/Steps';

# EPGs

An EPG (electronic program guide) is the TV listings your players show: what's on now, and what's on next. In M3U Editor, guide data comes from an **EPG** source, and an **EPG map** links its listings to your channels. Your players then get the guide with the playlist, through the Xtream API or the playlist's XMLTV URL.

:::tip Your provider's guide may already be set up
For Xtream playlists, **Import EPG** (on by default) adds the provider's guide and maps it to your channels for you. Check **EPG → EPGs** before adding one by hand.
:::

## Add guide data

Go to **EPG → EPGs**, choose **New EPG**, and pick the **EPG type**:

<Tabs groupId="epg-type" queryString>
<TabItem value="xmltv" label="File, URL or Path" default>

For an XMLTV guide, enter its **URL or Local file path**, or upload a **File**. Compressed files (`.xml.gz`) work too.

- **User agent** and **Disable SSL verification** help with sources that block the default client.
- **Provider Playlist** ties the guide to a playlist from the same provider, so the guide's URL follows that playlist's [DNS failover](xtream-dns-failover).

</TabItem>
<TabItem value="sd" label="SchedulesDirect">

[Schedules Direct](https://www.schedulesdirect.org/) is a paid listings service with detailed North American and international guide data.

1. Enter your Schedules Direct **Username** and **Password**, then choose **Test Connection**.
2. Choose your **Country** and **Postal Code**, then pick one or more **Lineups** (for example your antenna lineup and your cable lineup).
3. Set **Days to Import**, from 1 to 14 (default 3).
4. **Import Metadata** adds program images. It can make imports much slower.

Lineups not yet on your Schedules Direct account are added on the next sync. Stations in more than one lineup are only included once, and if one lineup fails to load, the others still import.

**Manage SD Lineups** removes lineups from your account to free up slots. When you delete a Schedules Direct EPG, **Also delete lineups from SchedulesDirect account** keeps any lineup another EPG still uses.

</TabItem>
</Tabs>

Each EPG syncs on its own schedule under **Scheduling**. **Auto resync on failure** retries a failed sync, or one that finds no channels, after 1 minute, then 2, then 3, up to **Max retry attempts**.

### Combine guides

A **Merged EPG** (**EPG → Merged EPGs**) combines several EPGs into one, for example a regional guide plus a sports guide. Drag the sources into order; when two sources have the same channel, the first one wins. Map the merged EPG to your channels like any other.

## Map guide data to channels

An EPG map matches a guide's channels to a playlist's channels by ID and name, so you don't have to pair them one by one.

<Steps>
<Step title="Create the map">

Go to **EPG → EPG Maps** and choose **New EPG Map**. Pick the **EPG** (or Merged EPG) and the **Playlist**. To map only part of the playlist, pick some **Groups**.

</Step>
<Step title="Choose how it runs">

**Recurring** runs the map again every time the EPG syncs, which keeps new channels mapped. **Overwrite** replaces mappings channels already have; leave it off to only fill in unmapped channels.

</Step>
<Step title="Save and review">

The map runs in the background, and the list shows its progress and how many channels it matched. Channels it wasn't sure about wait for you in **Review Candidates** (below).

</Step>
</Steps>

### Improve the matches

Provider channel names are often messy, like `US: ESPN HD`. The map's settings clean them up before matching:

| Setting | What it does |
|---|---|
| **Channel prefixes** (or regex patterns) **to remove** | Strip text such as `US: ` or `[UK]` from names before matching. Turn on **Use regex for filtering** to use patterns. |
| **Skip channels without EPG ID** | Only map channels that have a `tvg-id`, instead of also matching by name. |
| **Prioritize name/display name matching** | Prefer an exact name match over an ID match, for guides that reuse one ID for several versions of a channel. |
| **Set preferred icon to EPG** | Use the guide's channel logo for matched channels. |
| **Remove quality indicators** | Ignore HD, FHD, 4K, and similar labels while matching. Add your own list, or leave it empty for the built-in one. |
| **Minimum Similarity (%)** | How close a name must be to count as a match (default `70`). Higher is stricter. |
| **Maximum Fuzzy Distance**, **Exact Match Distance** | How many character differences are allowed (defaults `25` and `8`). Lower is stricter. |

*(v0.13.3+)* Fuzzy matches are also checked for conflicts before they're applied. Numbers must agree, so `TSN+ 42` won't match `TSN+ 12`. Words that differ must look like a typo, so `NHL GP 16` won't match `NFL GP 16`. Typos, plurals, and extra words still match.

**Preferred Locale** on the EPG itself (under **Mapping**) picks which language to prefer when a guide has entries like `CHANNEL.en` and `CHANNEL.fr`.

<details>
<summary>Wider matching on PostgreSQL (pg_trgm)</summary>

On PostgreSQL, **Widen matching with pg_trgm similarity** (under the map's **Advanced Settings**) also catches typos and transliterations like `Soprtsnet` and `Sportsnet`. It's off by default because it makes mapping noticeably slower on large guides, and it only affects maps you turn it on for.

The embedded PostgreSQL in the editor container is already set up for it. For your own PostgreSQL server, the toggle stays greyed out until you install the extension and indexes by running this in the editor container:

```bash
php artisan app:configure-pg-trgm
```

It uses the app's own database connection. To run it as a different user, such as a superuser just for setup, pass `--host`, `--port`, `--database`, `--username`, and `--password`. `--threshold` sets the similarity threshold (default `0.35`, or `TRGM_THRESHOLD`). Reload the map's form afterwards; no restart is needed.

To measure mapping speed on your own data, `php artisan epg:benchmark-mapping --map=<id>` runs an existing map and rolls back every change.

</details>

### Review candidates

Channels that didn't clear the bar for an automatic match are kept as **candidates** instead of being skipped. Choose **Review Candidates** on a map to see each one with its best match, a confidence score, and the alternatives. **Apply** the suggestion, **Change** it, or **Skip** the channel, one at a time or in bulk with **Apply top candidate** and **Mark as skipped**.

### Map one channel

To fix a single channel, edit it and choose its **EPG Channel**, or select channels and use **Map EPG to selected** from the bulk actions. To keep map runs from changing a channel, select it and use **Disable EPG mapping** from the bulk actions.

If [AI Copilot](/docs/ai-copilot/overview) is set up, you can also ask it to map unmapped channels. It uses the same matching settings. See [Tools](/docs/ai-copilot/tools#optional-tools).

## Placeholder guides

Channels with no guide data can still get one, so they don't show as empty in your player. On the playlist's **Output** tab, under **EPG Output**, turn on **Enable dummy EPG**:

| Setting | What it does |
|---|---|
| **Dummy program length (in minutes)** | How long each placeholder program is (default 120). |
| **Dummy EPG length (in days)** | How many days to generate (default 5). |
| **Channel group as category** | Adds the channel's group as the program category. |
| **Dummy EPG Title Source** | Which field to use as the program title, tried in order. The channel title is used if it's empty. |

For guides built from the event names in channel titles (common for sports and PPV channels), use [Advanced EPG Dummies](/docs/advanced/advanced-epg-dummies).

## Check the guide

Open a playlist or an EPG to see its guide below the details, as a TV-style grid. Large guides are prepared in the background after each sync (**Generate Cache** runs it by hand). See [EPG Cache](/docs/advanced/epg-optimization).

If channels show no guide in your player:

1. Check the EPG synced, and has channels, in **EPG → EPGs**.
2. Check the channel is mapped: filter **Live Channels → Channels** by **EPG is not mapped**.
3. If times are off by whole hours, set the channel's **EPG Shift**.
4. M3U and HDHomeRun clients need the playlist's XMLTV URL as well. See [Client Configuration](/docs/client_configuration#pick-an-output).
