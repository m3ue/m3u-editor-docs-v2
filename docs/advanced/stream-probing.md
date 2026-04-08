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

Probe live channels with ffprobe to collect stream metadata — enabling near-instant channel switching in Emby via the [emby-xtream](https://github.com/firestaerter3/emby-xtream) plugin.

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
4. The **emby-xtream** plugin uses this metadata to pre-configure the player — eliminating the buffering/detection delay on channel switch

### Supported Codecs

| Type | Supported Codecs |
|------|-----------------|
| **Video** | H.264 (AVC), H.265 (HEVC), MPEG-2 |
| **Audio** | AAC, AC3 (Dolby Digital), EAC3 (Dolby Digital Plus), MP2 |

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
- **Enable stream probing by default** — controls whether newly imported channels will be included in automatic probing

#### Per-Channel Toggle

In the **Live Channels** → **Channels** table:
- The **Probe Enabled** toggle column lets you enable/disable probing for individual channels
- Disabled channels will be skipped during automatic probing after sync

:::info
When you manually select channels and use the **Probe Streams** bulk action, the per-channel toggle is intentionally ignored — your explicit selection overrides it.
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

- **Probed** column — shows a green checkmark if the channel has been probed, or a gray X if not. Hover over the icon to see when it was last probed.
- **Filters** — use the **Stream probed** / **Stream not probed** toggle filters to quickly find channels that still need probing

### Step 5: Configure Emby with emby-xtream

The emby-xtream plugin reads the `stream_stats` data automatically from the Xtream API. No additional configuration is needed in the plugin — it will use the metadata when available and fall back to auto-detection when it's not.

**Requirements:**
- emby-xtream plugin v1.4.69.0 or later
- Xtream API enabled on your playlist in M3U Editor

**In Emby:**
1. Install the **emby-xtream** plugin
2. Configure it to point to your M3U Editor Xtream API endpoint
3. Use the credentials from your playlist's Xtream API settings
4. Sync channels — the plugin will automatically use probed stream metadata

## How Probing Data Flows

```
┌─────────────┐     ffprobe      ┌─────────────┐
│   Channel   │ ───────────────► │ stream_stats │
│  Stream URL │                  │   (JSON)     │
└─────────────┘                  └──────┬───────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │  Xtream API      │
                               │ get_live_streams │
                               │  → stream_stats  │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
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

## Tips & Troubleshooting

### Probing Takes Too Long

Each channel probe has a 15-second timeout. If you have many channels, probing runs in chunks to avoid overloading your system. For a playlist with 500+ channels, expect the full probe to take several minutes.

### Some Channels Fail to Probe

This is normal — channels may be offline, geo-blocked, or use a protocol that ffprobe can't analyze. Failed channels will simply have no `stream_stats` and Emby will fall back to auto-detection for those channels.

### Keeping Data Fresh

Stream metadata rarely changes, but if a provider switches codecs or resolutions:
- Enable **Probe Streams After Sync** on your playlist to automatically re-probe after each sync
- Or manually re-probe specific channels using the bulk action

### Channel Switching Still Slow in Emby

If channel switching is still slow after probing:
1. Check the **Probed** column — ensure channels show a green checkmark
2. Verify your playlist has the **Xtream API** enabled
3. In Emby, ensure the emby-xtream plugin is configured to use the Xtream API endpoint (not a plain M3U URL)
4. Try restarting Emby after the initial probe to pick up the new metadata
