---
sidebar_position: 2
description: Automatically merge duplicate channels with failover support
tags:
  - Advanced
  - Channels
  - Auto-Merge
title: Auto-Merge Channels
---

# Auto-Merge Channels

Automatically merge duplicate channels into a single master channel with failover relationships.

## Overview

The Auto-Merge Channels feature streamlines playlist management by:

- ✅ Automatically merging channels with identical stream IDs
- ✅ Creating failover relationships for reliability
- ✅ Optionally disabling failover channels to clean up your playlist
- ✅ Supporting resolution-based prioritization (use with caution)

## How It Works

### 1. Automatic Trigger

Auto-merge runs automatically after playlist sync when:
- Playlist has **Auto-merge channels** enabled
- Sync completes successfully
- Channels exist with duplicate stream IDs

### 2. Channel Grouping

The system groups channels by their stream ID:
- Uses `stream_id_custom` if set, otherwise `stream_id`
- Only processes channels within the configured playlists
- Excludes already-configured failovers (unless force re-merge is enabled)

### 3. Master Channel Selection

Two modes for selecting the master channel:

#### Default Mode (Recommended for IPTV)

**✅ Safe for all IPTV providers**

Selection priority:
1. If **Preferred Playlist** is set: First channel from that playlist (sorted by ID)
2. Otherwise: First channel based on playlist priority, then sorted by ID

**Benefits:**
- No stream access required
- Prevents provider rate limiting
- Fast processing

#### Resolution Mode

**⚠️ Use with caution - May trigger rate limiting**

Selection priority:
1. Analyzes each stream to determine resolution
2. If **Preferred Playlist** is set: First channel from that playlist with highest resolution
3. Otherwise: First channel with highest resolution

**Warning:**
This mode accesses each stream to check resolution, which can:
- Trigger rate limiting from IPTV providers
- Cause IP blocking
- Significantly slow down processing

Only use when:
- Your provider explicitly allows stream analysis
- You have confirmed no rate limiting
- Resolution quality is critical for your use case

### 4. Failover Configuration

Remaining channels become failovers:
- Sorted by playlist priority and channel ID (or resolution if enabled)
- Optionally disabled if **Deactivate failover channels** is enabled
- Existing relationships are updated automatically

## Priority Order (multi-attribute ranking)

Beyond the single Default / Resolution Mode toggle, you can configure a full **Priority Order** that ranks channels using a weighted combination of attributes. The Priority Order is configured under **Playlists → Edit → Auto-Merge Processing → Priority Order** and applies whenever auto-merge picks a master from a group of duplicates.

The same Priority Order is also reused by:

- The **Make smart channel** bulk action (initial ranking — see [Smart Channels](./smart-channels.md))
- The per-channel **Rescore now** action on the channel info pane
- The scheduled failover rescore job (see [Failover Rescoring](#failover-rescoring))

So tuning it once propagates everywhere ranking happens.

### Available attributes

| Attribute | What it measures | Needs stream stats? |
|---|---|---|
| 📋 Playlist Priority | Position of the source's playlist in the failover list | No |
| 📁 Group Priority | Weight assigned to the source's group in **Group Priorities** | No |
| ⏪ Catch-up Support | Whether the source supports catch-up / replay | No |
| 📺 Resolution | Pixel count of the probed video stream | Yes |
| 🎞️ Frame Rate | Source frames-per-second (50/60 fps scores higher than 25/30) | Yes |
| 📊 Bitrate | Probed video bitrate in kbps | Yes |
| 🎬 Codec | Match against the configured **Preferred Codec** (e.g. HEVC over H.264) | Yes |
| 🏷️ Keyword Match | Substring match against the configured priority keywords list | No |

Drag attributes to reorder them. The **first attribute is weighted highest**, the last is weighted lowest, and each attribute contributes a 0–100 sub-score. The final score is normalised to 0–100, so adding or removing attributes never breaks comparability across channels.

:::tip
Resolution, Frame Rate, Bitrate, and Codec all need probed data. Make sure **Probe Streams After Sync** is enabled on the playlist — see [Stream Probing](./stream-probing.md) for setup.

For live MPEG-TS and HLS sources where the container doesn't expose a bitrate, the probe pipeline runs a short packet-sampling pass to back-fill the video bitrate, so these attributes still produce useful scores on live streams.
:::

### What's new

- **Frame Rate** and **Bitrate** are first-class priority attributes.
- All scoring rules are normalised to a 0–100 sub-score, so the weighting is intuitive regardless of how many attributes you pick.
- Score breakdowns persist on the failover row so you can come back later and see *why* a particular channel ranked where it did.

## Failover Rescoring

Stream quality drifts. A provider that was 1080p last month may have dropped to 720p; a new failover you added last week hasn't been probed yet. **Failover rescoring** re-probes stale members, recalculates scores using the configured Priority Order, and re-sorts the failover list — without ever touching the master channel.

Configure it under **Playlists → Edit → Failover Rescoring**:

| Setting | Description |
|---|---|
| **Periodic rescoring** | `Off` (default) / `Daily` / `Weekly`. When set, every failover group on the playlist is rescored on the schedule. |
| **Re-probe channels older than (days)** | Default `7`. During a rescore, channels with stats older than this are re-probed first. Set to `0` to always re-probe. |

A scheduler tick runs hourly and dispatches a `RescoreChannelFailovers` job per playlist whose configured interval has elapsed. You can also trigger a one-off run from the terminal:

```bash
php artisan app:rescore-channel-failovers <playlist_id>
```

Or from the UI: open any channel that has failovers attached, scroll to the **Failover Ranking** section in the info pane, and click **Rescore now**. This rescores just that one channel's failovers.

Rescoring respects the global **Provider Request Delay** and uses a `WithoutOverlapping` middleware keyed on the playlist ID, so a manual click and a scheduled run never double up against the same provider.

For the full picture of how rescoring is used alongside smart channels, see the [Smart Channels guide](./smart-channels.md#rescoring-failovers).

## Configuration

### Enable Auto-Merge

1. Navigate to **Playlists** → Edit your playlist
2. Scroll to **Sync Settings**
3. Enable **Auto-merge channels after sync**
4. (Optional) Enable **Deactivate failover channels**

### Advanced Settings

Click **Advanced Settings** to configure:

**Prioritize by resolution:**
- ⚠️ Enables resolution-based master selection
- Analyzes streams (may cause rate limiting)
- Only use with provider permission

**Force complete re-merge:**
- Reprocesses all channels, not just new ones
- Useful after configuration changes
- More resource intensive

### Preferred Playlist

Set a preferred playlist to prioritize:
1. During auto-merge or manual merge
2. Select the playlist to favor for master channels
3. Channels from this playlist become masters when possible

## Manual Merge

Merge channels manually from the Channels page:

1. Navigate to **Channels** for your playlist
2. Select **Merge Same ID** action
3. Configure:
   - **Preferred Playlist**: Playlist to prioritize as master
   - **Failover Playlists**: Playlists to use for failovers
   - **Order by Resolution**: ⚠️ Enable resolution check (caution!)
   - **Deactivate Failover Channels**: Disable failover channels

4. Click **Merge**

## Use Cases

### Multiple Provider Sources

Merge channels from multiple IPTV providers:
- Set your most reliable provider as **Preferred Playlist**
- Other providers become automatic failovers
- Disable failover channels to keep playlist clean

### Redundant Streams

Handle providers that offer duplicate streams:
- Auto-merge consolidates them
- Maintains reliability through failovers
- Reduces playlist clutter

### Quality Prioritization

When providers allow stream analysis:
- Enable **Prioritize by resolution**
- Highest quality becomes master
- Lower qualities serve as failovers

## Best Practices

### For IPTV Providers

**✅ Recommended:**
- Use default mode (no resolution check)
- Set preferred playlist for reliable provider
- Enable **Deactivate failover channels** for clean output

**❌ Avoid:**
- Resolution-based prioritization (unless confirmed safe)
- Frequent force re-merges
- Processing during peak hours

### For Custom Streams

If using custom/self-hosted streams:
- Resolution checking is safe to use
- Force re-merge as needed
- Process at any time

## Performance Considerations

### Minimal Impact

For most playlists:
- Default mode processes quickly
- Uses efficient database queries
- Minimal resource usage

### Higher Impact Scenarios

Watch for:
- Very large playlists (10,000+ channels)
- Resolution checking enabled
- Force complete re-merge
- Many duplicate stream IDs

**Mitigation:**
- Run during off-peak hours
- Use default mode (no resolution check)
- Avoid force re-merge unless needed
- Monitor queue workers

## Troubleshooting

### Auto-merge Not Running

**Check:**
- ✅ Auto-merge is enabled in playlist settings
- ✅ Playlist sync completed successfully
- ✅ Queue workers are running
- ✅ Channels have matching stream IDs

### No Channels Merging

**Possible causes:**
- Channels don't have matching stream IDs
- Channels already in failover relationships
- Need to enable **Force complete re-merge**

**Solution:**
1. Check channel stream IDs match
2. Enable force re-merge once
3. Manually trigger sync
4. Check notifications for results

### Rate Limiting Issues

**If you experience rate limiting:**
1. Immediately disable **Prioritize by resolution**
2. Wait for provider cooldown period
3. Re-sync with default mode
4. Contact provider about analysis restrictions

## Database Schema

Auto-merge uses these fields:

### Playlists Table
```
auto_merge_channels_enabled (boolean)
auto_merge_deactivate_failover (boolean)
auto_merge_config (JSON)
```

### Channel Failovers Table
```
channel_id (references master channel)
failover_channel_id (references failover)
order (failover priority)
user_id (owner)
```

## API Integration

### Programmatic Dispatch

```php
use App\Jobs\MergeChannels;

dispatch(new MergeChannels(
    user: $user,
    playlists: collect([['playlist_failover_id' => $playlist->id]]),
    playlistId: $playlist->id,
    checkResolution: false,
    deactivateFailoverChannels: true,
    forceCompleteRemerge: false
));
```

## Next Steps

- [Smart Channels](./smart-channels.md) - Custom channels that auto-route to the highest-quality source
- [Stream Probing](./stream-probing.md) - Probe live channels for the metadata used in scoring
- [EPG Setup](/docs/resources/epg-setup) - Configure Electronic Program Guide
- [EPG Cache Overview](/docs/advanced/epg-optimization) - Performance tuning
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
