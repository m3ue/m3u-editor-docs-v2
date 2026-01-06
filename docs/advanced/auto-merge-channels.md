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

- [EPG Setup](/docs/resources/epg-setup) - Configure Electronic Program Guide
- [EPG Optimization](/docs/advanced/epg-optimization) - Performance tuning
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
