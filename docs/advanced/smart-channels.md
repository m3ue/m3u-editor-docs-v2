---
sidebar_position: 3
description: Custom channels that auto-route to the highest-quality source from a pool of failovers
tags:
  - Advanced
  - Channels
  - Smart Channels
  - Failover
title: Smart Channels
---

# Smart Channels

A **smart channel** is a custom channel that has no URL of its own — instead, the playlist streams whichever source channel is currently ranked highest in its failover list. Ranking is recalculated against actual stream stats (resolution, frame rate, bitrate, codec, etc.), so quality drift on one provider automatically promotes a better one to the top.

The user-facing identity of the smart channel — title, logo, EPG mapping, channel number — never changes when ranking shifts. Only the failover order is rewritten.

## When to use a smart channel

Use a smart channel when you have **the same channel from multiple providers** and want the playlist to always serve the best-looking version without you babysitting it.

Typical scenarios:

- Provider A has the channel in 1080p H.264, Provider B in 720p HEVC, Provider C drops to SD during peak hours — let the smart channel pick the right one automatically.
- One provider periodically degrades quality but you don't want to manually re-prioritise channels every week.
- You want a single, stable channel entry in your client (Plex, Emby, Channels DVR, Jellyfin) backed by several rotating sources.

If you only have one source per channel, a smart channel adds nothing — use the channel directly.

## How it works

Under the hood, a smart channel is a custom channel where:

| Property | Value |
|---|---|
| `is_custom` | `true` |
| `is_smart_channel` | `true` |
| `url` | `null` |
| `channel_failovers` | one row per source, sorted by score |

The streaming path uses an existing fallback in the editor: when a custom channel has no URL of its own, the playlist serves the channel sitting at `channel_failovers.sort = 0`. Re-ranking simply rewrites the sort column on those failover rows. The smart channel itself is never replaced or modified, which is why its identity (title, logo, EPG mapping, channel number) stays stable forever.

```
Smart channel (no URL)
        │
        ▼
   Failover list (sorted by score, descending)
        │
        ├── Source A — score 87  ◄── currently streaming
        ├── Source B — score 74
        └── Source C — score 61
```

When a rescore changes the ranking, it just rewrites the sort order:

```
   Failover list (after rescore)
        │
        ├── Source B — score 91  ◄── now streams from here
        ├── Source A — score 80
        └── Source C — score 55
```

## Creating a smart channel

The fastest way is the **Make smart channel** bulk action on the Channels list.

1. Go to **Live Channels** → **Channels**
2. Filter or search to find the source channels you want to combine — they must all belong to the **same playlist**
3. Tick the checkboxes next to each source
4. Click **Actions** → **Make smart channel**
5. Review the ranked preview in the modal:
    - Each row shows the channel, its total score (0–100), and a per-attribute breakdown (also 0–100 each)
    - The rank column reflects the order failovers will be created in
6. Optionally:
    - **Virtual channel title** — leave blank to copy the highest-scoring source's title
    - **Disable source channels** — when on, the source channels are disabled after creation. They'll only be reachable via the new smart channel
7. Click **Create smart channel**

The new channel appears in the Channels list with a sparkles icon in the **Smart** column.

:::info
The bulk action uses **existing stream stats** when ranking — it does not re-probe the sources first. If your stats are stale, [probe the sources](./stream-probing.md) before creating the smart channel, or run a [rescore](#rescoring-failovers) right after.
:::

:::warning
**One playlist at a time.** All sources must belong to the same playlist. Selecting channels from multiple playlists triggers a warning notification and no smart channel is created.

**No nesting.** A smart channel cannot be used as a source for another smart channel. The bulk action skips smart channels in the selection (or refuses to run if the entire selection is smart channels).
:::

### Creating one manually

You can also build a smart channel from the **Custom Playlist** flow if you prefer to hand-pick:

1. Edit (or create) a custom channel
2. Set **Smart channel** to **On** (this is only visible when **Custom channel** is also on)
3. The **URL** field is locked — smart channels never have their own URL
4. Add at least one channel to the **Failovers** repeater

A warning banner appears in the form until at least one failover is attached:

> **Smart channel without failovers won't stream.**

## Ranking attributes

The score is computed from a configurable list of attributes, each contributing a 0–100 sub-score. Configure the list under **Playlists → Edit → Auto-Merge Processing → Priority Order**.

| Attribute | What it measures |
|---|---|
| 📋 Playlist Priority | Position of the source's playlist in the failover list (higher = better) |
| 📁 Group Priority | Weight assigned to the source's group in **Auto-Merge Processing → Group Priorities** |
| ⏪ Catch-up Support | Whether the source supports catch-up / replay |
| 📺 Resolution | Pixel count of the probed video stream |
| 🎞️ Frame Rate | Source frames-per-second (50/60 fps scores higher than 25/30) |
| 📊 Bitrate | Probed video bitrate in kbps |
| 🎬 Codec | Match against the configured **Preferred Codec** (e.g. HEVC over H.264) |
| 🏷️ Keyword Match | Substring match against the configured priority keywords list |

Drag the attributes to reorder them. The **first attribute is weighted highest**, the last is weighted lowest, and the final score is normalised to 0–100 so adding or removing attributes never breaks comparability across channels.

:::tip
Resolution, Frame Rate, Bitrate, and Codec all need probed stream stats. Make sure **Probe Streams After Sync** is enabled on the playlist (or run a manual probe) so the sources have the data needed for scoring. See [Stream Probing](./stream-probing.md) for details.
:::

The same Priority Order is reused in three places:

- The **Make smart channel** bulk action (preview + initial ranking)
- The per-channel **Rescore now** action on the channel info pane
- The **scheduled rescore job** for the whole playlist

So whatever you tune in Auto-Merge applies everywhere ranking happens.

## Rescoring failovers

Stream quality drifts. A provider that was 1080p last month may have dropped to 720p; a new failover you added last week hasn't been probed yet. Rescoring re-probes stale members, recalculates scores, and re-sorts the failover list — **without ever touching the master channel**.

### Per-channel: "Rescore now"

Open a smart channel's view page, scroll to the **Failover Ranking** section, and click **Rescore now**. The job runs in the background; refresh the page in a moment to see the updated order.

The expandable cards in this section show:

- Rank (1, 2, 3…) and total score
- Per-attribute breakdown badges
- Probed technical details (resolution, fps, bitrate, codec, audio info, last probed)

Score breakdowns persist to `channel_failovers.metadata`, so the rationale is durable — you can come back later and see *why* the ranking landed where it did.

### Per-playlist: scheduled rescoring

Configure under **Playlists → Edit → Failover Rescoring**:

| Setting | Description |
|---|---|
| **Periodic rescoring** | `Off` (default) / `Daily` / `Weekly`. When set, every failover group on the playlist is rescored on the schedule. |
| **Re-probe channels older than (days)** | Default `7`. During a rescore, channels with stats older than this are re-probed first. Set to `0` to always re-probe. |

How the schedule actually fires:

1. The scheduler runs `app:rescore-channel-failovers` **every hour**
2. The command iterates all playlists with a configured interval
3. For each one, it dispatches a `RescoreChannelFailovers` job only if enough time has elapsed since the last run

The hourly cadence is a polling tick — you don't need to configure it, and increasing it doesn't make rescoring more frequent (the per-playlist interval is the real ceiling).

:::tip
**Manual full-playlist rescore.** From any terminal:

```bash
php artisan app:rescore-channel-failovers <playlist_id>
```

This skips the schedule check and dispatches a rescore immediately. Useful for ad-hoc runs after re-tuning the Priority Order.
:::

### Throttling and overlap protection

Rescoring re-probes stale sources, which means hitting your providers with ffprobe connections. The job integrates the existing **Provider Request Delay** (Settings → Sync) to space out probes during a rescore — the same delay that applies to playlist sync and one-off channel probing.

If a manual click and a scheduled run land on the same playlist at the same time, only one runs. The job uses a `WithoutOverlapping` middleware keyed on the playlist ID, so the second dispatch is dropped instead of doubling up the probe load.

## Visibility

Smart channels are surfaced in several places so you can tell at a glance which channels are "live-ranked" and which are static.

### Channels list

The **Smart** column shows a sparkles icon for any channel flagged `is_smart_channel`. The column is empty for normal channels.

### Stream Monitor

When a smart channel is actively streaming, the stream entry on the **M3U Proxy → Stream Monitor** page picks up a sky-blue **Smart Channel** badge with a sparkles icon. This makes it easy to tell which active streams are coming through a smart-channel indirection vs. a direct provider URL.

### Channel info pane

For smart channels, the pane shows:

- **No** Technical Details section — the smart channel itself doesn't carry stream stats; its sources do
- A **Failover Ranking** section with expandable cards (one per failover), showing rank, score, breakdown, and the failover's own probed details
- A **Rescore now** action button in the section header

For regular channels with failovers attached, the Failover Ranking section is also shown — it's a general-purpose view of any channel's failover health, not exclusive to smart channels.

## How smart channels relate to other features

| Feature | Relationship |
|---|---|
| [Auto-Merge Channels](./auto-merge-channels.md) | Auto-merge creates failover relationships at sync time, driven by stream-ID matching. Smart channels reuse the same scoring engine and Priority Order, but are created by hand from a chosen selection — there's no stream-ID requirement. |
| [Stream Probing](./stream-probing.md) | The scoring attributes that depend on stream stats (Resolution, FPS, Bitrate, Codec) need probed data. The probe pipeline backfills video bitrate for live MPEG-TS / HLS streams via packet sampling, so live channels score correctly even when the container reports no bitrate. |
| Custom Channels | A smart channel **is** a custom channel — it just has the `is_smart_channel` flag set and a locked URL field. You can edit its title, logo, group, and EPG mapping like any other custom channel. |
| Failover Resolver (Proxy) | Independent of smart channels. The proxy's failover resolver decides what to do *during a stream* when an upstream URL fails. Smart-channel ranking decides what to *start streaming* in the first place. The two layers compose cleanly. |

## Limitations and known gaps

- **Channel scrubbers don't know about failover relationships.** If a scrubber rule disables a smart channel's source channel, the smart channel's quality silently drops without a warning. Worth keeping in mind when you set up scrubbers that touch the same playlists as your smart channels.
- **HLS variant selection is whatever ffprobe picks.** For multi-variant HLS sources, the score reflects the variant ffprobe selected during probing (usually the highest-bandwidth listed in the master playlist), which is not necessarily the variant your client's player would adapt to. Most of the time these match, but it's a caveat for unusual setups.
- **The "Make smart channel" bulk action uses existing stats only.** It does not re-probe the selection before scoring. If your stats are stale, probe the sources first, or rescore the smart channel right after creation.
- **Backfill for legacy custom channels.** When this feature was rolled out, any existing custom channel with no URL of its own that already had at least one failover attached was automatically flagged as a smart channel. This means previously-handcrafted "no-URL custom channel + failovers" setups now show up with the sparkles badge and can be rescored — no migration work needed on your part.

## Troubleshooting

### "Smart channel created" but it won't play

Check the failover ranking — the warning banner in the channel form (**Smart channel without failovers won't stream**) is the most common cause. A smart channel with zero failovers has nothing to stream.

If failovers exist but playback fails, check whether the top-ranked failover's URL is reachable. Open the failover ranking section in the info pane, expand the top card, and verify the technical details look reasonable. Click **Rescore now** to re-probe and potentially promote a healthier source.

### Make smart channel doesn't show ranked stats

If your sources haven't been probed yet, the score breakdowns will be all zeros for stream-stat attributes (Resolution, FPS, Bitrate, Codec). Probe the sources first via **Bulk channel actions → Probe Streams**, then re-open the bulk action.

### Scheduled rescore isn't running

Verify in order:

1. **Periodic rescoring** is set to Daily or Weekly on the playlist (not Off)
2. The Laravel scheduler is running (`php artisan schedule:work` or a cron entry calling `schedule:run` every minute)
3. Queue workers are running — the command dispatches `RescoreChannelFailovers` to the queue, it doesn't run inline
4. Enough time has elapsed since `last_failover_rescore_at` — the hourly check is a no-op until the configured interval has passed

### "Mixed playlists not supported" when creating

The bulk action requires all selected sources to share a single `playlist_id`. Narrow your selection to one playlist's channels and try again. If you need to combine sources across playlists, you'll need to first merge those into one playlist (e.g. via [Custom Playlists](../resources/custom-playlist.md) or [Merged Playlists](../resources/merged-playlist.md)) and re-do the selection from there.

## Next Steps

- [Auto-Merge Channels](./auto-merge-channels.md) — Configure the Priority Order shared with smart-channel ranking
- [Stream Probing](./stream-probing.md) — Make sure your sources have the stats needed for accurate scoring
- [Custom Playlists](../resources/custom-playlist.md) — Curate which channels appear where
