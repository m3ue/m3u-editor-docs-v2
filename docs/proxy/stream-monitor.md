---
sidebar_position: 13
title: Stream Monitor
description: Real-time visibility into active streams — EPG, encoder stats, failover status, and URL management
tags:
  - Proxy
  - Monitoring
  - Streams
---

# Stream Monitor

The Stream Monitor gives you a live view of every stream currently being served by the proxy — including what clients are watching, real-time encoding stats, current and upcoming EPG programmes, and failover status.

**Access**: Sidebar → **Proxy** → **Stream Monitor**

:::note
The Stream Monitor is only available when the proxy integration is enabled. If you don't see it in the sidebar, check that `M3U_PROXY_INTEGRATION_ENABLED` is not set to `false`.
:::

---

## Overview

The Stream Monitor page shows one card per active stream, updated automatically. Each card shows:

- **Channel name** and logo
- **Source playlist / alias** the stream is coming from
- **Active client count** connected to this stream
- **Current URL** (toggleable visibility — see below)
- **Failover status** — which source is currently active when failover has triggered
- **Encoder stats** — live FFmpeg output metrics when transcoding is active
- **EPG: Now & Next** — current programme and upcoming programme (when EPG data is available)

The page auto-refreshes on a configurable interval and pauses when the browser tab is hidden to save resources.

---

## Auto-Refresh

The Stream Monitor refreshes automatically to keep data current.

### Configuring the Refresh Interval

1. Open the Stream Monitor page
2. Use the **Refresh interval** selector in the top toolbar
3. Choose from available intervals (e.g. 5s, 10s, 30s, 60s)

### Visibility-Aware Refresh

The monitor detects when the browser tab is hidden and **pauses** auto-refresh automatically. Refresh resumes when you bring the tab back into focus. This prevents unnecessary background requests when you are not actively watching the monitor.

---

## URL Visibility Toggle

Stream URLs are hidden by default in the Stream Monitor output to prevent accidental exposure of provider credentials in screen shares or recordings.

To toggle URL visibility:
1. Click the **eye icon** (👁) in the top toolbar of the Stream Monitor
2. URLs become visible / hidden across all stream cards

URL visibility is per-session and resets when you reload the page.

---

## EPG: Now & Next

When EPG data is available for a channel, the stream card shows:

| Section | Description |
|---|---|
| **Now** | Title of the currently airing programme |
| **Progress** | A progress bar showing how far through the current programme the stream is |
| **Next** | Title of the upcoming programme (when available in the EPG data) |

EPG is fetched from the cached EPG data that M3U Editor maintains. Channels without EPG mapping show no programme information.

---

## Live Encoder Output Stats

When a stream is being transcoded via FFmpeg or Streamlink, the stream card shows live encoder output metrics:

| Stat | Description |
|---|---|
| **Bitrate** | Current output bitrate (kbps or Mbps) |
| **FPS** | Frames per second being encoded |
| **Speed** | Encoding speed relative to real-time (1.0x = real-time) |
| **Quality** | Quality factor (CRF/QP) if applicable |

These stats come directly from the FFmpeg or encoder process output and update on each refresh cycle.

:::tip
If **Speed** drops below `1.0x`, the encoder is falling behind real-time. This causes buffering for clients. Consider using hardware acceleration or a less demanding profile. See [Hardware Acceleration](./hardware-acceleration.md).
:::

---

## Failover Status

When advanced failover is enabled and a stream has switched to a backup source, the stream card displays:

- **Failover active** indicator
- The **failover channel name** or source that is currently serving the stream

This makes it easy to spot streams that are degraded or using backup providers at a glance.

---

## Stopping a Stream

You can stop an active stream directly from the monitor:

1. Click the **Stop** button on a stream card
2. If clients are connected, a confirmation prompt appears
3. Use the **Force stop** option to stop the stream even with active clients

The **Force stop** flag overrides the safety check that normally prevents stopping streams with connected viewers. Use it when you need to immediately terminate a stuck or problematic stream.

---

## Related Resources

- [Failover](./failover.md) - Automatic backup URL switching
- [Transcoding & Stream Profiles](./transcoding.md) - FFmpeg transcoding configuration
- [Hardware Acceleration](./hardware-acceleration.md) - GPU-accelerated encoding
- [Job Monitoring](../advanced/job-monitoring.md) - Background job tracking
