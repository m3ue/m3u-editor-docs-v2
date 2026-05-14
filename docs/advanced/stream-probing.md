---
sidebar_position: 7
description: Probe live channels with ffprobe for fast channel switching in Emby
tags:
  - Advanced
  - Channels
  - Emby
  - Performance
  - Stream Probing
title: Stream Probing (Fast Channel Switching)
---

# Stream Probing (Fast Channel Switching)

Probe live channels with ffprobe to collect stream metadata and enable near-instant channel switching in Emby via the [emby-xtream](https://github.com/firestaerter3/emby-xtream) plugin.

## Overview

Stream probing provides:

- **Fast channel switching** in Emby (~1s instead of 5–10s)
- **Automatic metadata collection** (codec, resolution, bitrate, framerate)
- **Per-channel control** to include or exclude channels from probing
- **Automatic probing after sync** to keep metadata up to date

## How It Works

1. **ffprobe** connects to each channel's stream URL and reads the first few seconds
2. Stream metadata (video codec, audio codec, resolution, bitrate, etc.) is extracted and stored
3. When Emby requests channel data via the Xtream API (`get_live_streams`), the stored metadata is included in the response as `stream_stats`
4. The **emby-xtream** plugin uses this metadata to pre-configure the player, eliminating the buffering/detection delay on channel switch

### Supported Codecs

| Type | Supported Codecs |
|------|-----------------|
| **Video** | H.264 (AVC), H.265 (HEVC), MPEG-2 |
| **Audio** | AAC, AC3 (Dolby Digital), EAC3 (Dolby Digital Plus), MP2 |

### Bitrate enrichment for live streams

ffprobe is invoked with `-show_streams -show_format`, which returns both the per-stream metadata (codec, resolution, fps, etc.) and container-level metadata (overall duration, bit rate, format name).

For VOD content this is enough — the container reports a video bitrate and probing finishes in a single pass. For **live MPEG-TS and HLS** sources, neither the per-stream `bit_rate` nor the format-level `bit_rate` is typically populated (there's no known total duration to compute one from). When that happens, M3U Editor runs a short follow-up packet-sampling probe to measure actual throughput:

```
ffprobe -read_intervals "%+5" -select_streams v:0 \
        -show_entries packet=size,pts_time <url>
```

This reads roughly 5 seconds of the video stream and computes a real bitrate from the packet sizes and timestamps. The result is back-filled into the video stream's `bit_rate` field, so downstream consumers (Auto-Merge scoring, Smart Channel ranking, the stats UI) see a meaningful number on live channels.

The sampling pass is capped at 10 seconds regardless of the metadata-pass timeout, so it doesn't materially extend probe time per channel even when many channels are probed in sequence.

## Setup Guide

### Step 1: Enable Probing on Your Playlist

1. Go to **Playlists** → select your playlist → **Edit**
2. Switch to the **Processing** tab
3. Enable **Probe Streams After Sync**

This will automatically run ffprobe on all eligible channels after each playlist sync.

:::tip
If you don't want to wait for a sync, you can manually trigger probing from the Channels table (see Step 3).
:::

### Step 2: Configure Per-Channel Probing

By default, all new channels have probing enabled. You can control this at two levels:

#### Default for New Channels

In your playlist settings under **Processing** → **Default options for new Live channels**:
- **Enable stream probing by default**: controls whether newly imported channels will be included in automatic probing

#### Per-Channel Toggle

In the **Live Channels** → **Channels** table:
- The **Probe Enabled** toggle column lets you enable/disable probing for individual channels
- Disabled channels will be skipped during automatic probing after sync

#### Bulk Enable / Disable Probing

You can also toggle probing for multiple channels at once using bulk actions:

1. Select the channels you want to change (use the checkboxes)
2. Click **Actions** → **Bulk channel actions**
3. Choose **Enable probing** or **Disable probing**

This updates the `probe_enabled` flag on all selected channels in one go — useful when you want to exclude a large number of channels from automatic probing, or re-enable them after a temporary pause.

:::info
When you manually select channels and use the **Probe Streams** bulk action, the per-channel toggle is intentionally ignored. Your explicit selection overrides it.
:::

### Step 3: Run Probing Manually

To probe channels without waiting for a sync:

1. Go to **Live Channels** → **Channels**
2. Select the channels you want to probe (use checkboxes)
3. Click **Actions** → **Bulk channel actions** → **Probe Streams**
4. Confirm to start probing

The probing runs in the background. You'll receive a notification when it completes.

### Step 4: Verify Probing Status

The Channels table includes visual indicators:

- **Probed** column: shows a green checkmark if the channel has been probed, or a gray X if not. Hover over the icon to see when it was last probed.
- **Filters**: use the **Stream probed** / **Stream not probed** toggle filters to quickly find channels that still need probing

### Step 5: Configure Emby with emby-xtream

The emby-xtream plugin reads the `stream_stats` data automatically from the Xtream API. No additional configuration is needed in the plugin. It will use the metadata when available and fall back to auto-detection when it is not.

**Requirements:**
- emby-xtream plugin v1.4.69.0 or later
- Xtream API enabled on your playlist in M3U Editor

**In Emby:**
1. Install the **emby-xtream** plugin
2. Configure it to point to your M3U Editor Xtream API endpoint
3. Use the credentials from your playlist's Xtream API settings
4. Sync channels. The plugin will automatically use probed stream metadata.

## How Probing Data Flows

```
┌─────────────┐     ffprobe      ┌──────────────┐
│   Channel   │ ───────────────► │ stream_stats │
│  Stream URL │                  │   (JSON)     │
└─────────────┘                  └──────┬───────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │  Xtream API      │
                               │ get_live_streams │
                               │  → stream_stats  │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │  emby-xtream     │
                               │  plugin in Emby  │
                               │  → fast switch   │
                               └──────────────────┘
```

## Metadata Returned

When a channel is probed, the following metadata is available via the Xtream API:

| Field | Description | Example |
|-------|-------------|---------|
| `resolution` | Video resolution | `1920x1080` |
| `video_codec` | Video codec name | `h264`, `hevc` |
| `video_profile` | Encoding profile | `High`, `Main` |
| `video_level` | Codec level | `41` |
| `video_bit_depth` | Bit depth | `8`, `10` |
| `source_fps` | Frame rate | `25`, `50` |
| `ffmpeg_output_bitrate` | Bitrate in kbps | `5000` |
| `audio_codec` | Audio codec name | `aac`, `ac3` |
| `audio_channels` | Channel layout | `stereo`, `5.1` |
| `sample_rate` | Audio sample rate | `48000` |
| `audio_bitrate` | Audio bitrate in kbps | `128` |

## Rate Limiting & Connection-Aware Probing

When probing large playlists, sending rapid ffprobe connections can trigger provider bans or exhaust your allowed connection slots. M3U Editor integrates the global **Provider Request Delay** settings directly into the probing process to prevent this.

### Request Delay Between Probes

If **Provider Request Delay** is enabled in **Settings → Sync**, M3U Editor will automatically pause between each channel probe by the configured delay amount. This is the same delay that applies to normal playlist syncs, so you only need to enable it once.

| Setting | Location | Effect on Probing |
|---|---|---|
| **Enable request delay** | Settings → Sync → Provider Request Delay | Inserts a pause between each individual channel probe |
| **Request delay (ms)** | Settings → Sync → Provider Request Delay | Duration of the pause in milliseconds (default: 500 ms) |

The delay is only inserted *between* channels — there is no artificial wait before the very first probe starts.

### Connection-Aware Probing

If your playlist uses **Playlist Profiles** and has a primary profile configured, the probing job will check your provider's active connection count before probing each channel. This prevents the prober from being kicked off the provider for exceeding the allowed concurrent stream limit.

**How it works:**

1. Before probing each channel, M3U Editor reads the connection info from the primary profile.
2. If the provider reports no free slots (i.e. `active connections ≥ max streams`), the job pauses and waits.
3. Provider connection info is refreshed every **5 seconds** while waiting.
4. Once a slot becomes free, probing of the next channel begins immediately.
5. If no slot opens within **120 seconds**, probing proceeds anyway to avoid the job being stuck indefinitely.

```
Channel → check slot free? ──yes──► ffprobe ──► next channel
                   │
                   no
                   │
             wait 500 ms → refresh provider info (every 5 s) → re-check
```

**Requirements:**
- Playlist has **Playlist Profiles** enabled
- A profile is configured as the **Primary Profile**
- The profile has valid provider info (fetched during at least one sync)

:::tip
Connection-aware probing works entirely automatically — no extra configuration is needed beyond having a primary profile set up. If no primary profile is found, or if the provider has never been queried, the connection check is skipped and probing runs at full speed.
:::

:::info
The request delay and connection check are complementary. You can use either or both:
- **Request delay only**: slows down probing to avoid rate limits even when slots are available
- **Connection-aware only**: pauses only when slots are actually exhausted
- **Both together**: the delay is applied after each successful slot acquisition, giving the gentlest possible probing behaviour
:::

## Tips & Troubleshooting

### Probing Takes Too Long

Each channel probe has a 15-second timeout. If you have many channels, probing runs in chunks to avoid overloading your system. For a playlist with 500+ channels, expect the full probe to take several minutes.

### Some Channels Fail to Probe

This is normal. Channels may be offline, geo-blocked, or use a protocol that ffprobe can't analyze. Failed channels will simply have no `stream_stats` and Emby will fall back to auto-detection for those channels.

### Keeping Data Fresh

Stream metadata rarely changes, but if a provider switches codecs or resolutions:
- Enable **Probe Streams After Sync** on your playlist to automatically re-probe after each sync
- Or manually re-probe specific channels using the bulk action

### Channel Switching Still Slow in Emby

If channel switching is still slow after probing:
1. Check the **Probed** column and ensure channels show a green checkmark
2. Verify your playlist has the **Xtream API** enabled
3. In Emby, ensure the emby-xtream plugin is configured to use the Xtream API endpoint (not a plain M3U URL)
4. Try restarting Emby after the initial probe to pick up the new metadata

## Where probed data is used

Beyond the Emby fast-switching integration, the same `stream_stats` blob feeds:

- [Auto-Merge Channels](./auto-merge-channels.md) — Resolution, FPS, Bitrate, and Codec attributes in the Priority Order
- [Smart Channels](./smart-channels.md) — both the initial ranking when a smart channel is created and the periodic rescoring that keeps it pointing at the highest-quality source

So enabling probing pays off well beyond Emby — anything that ranks channels by quality reads from this data.
