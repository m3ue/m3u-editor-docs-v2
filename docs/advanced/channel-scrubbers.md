---
sidebar_position: 9
description: Find channels whose streams no longer work, and disable them automatically after each sync.
tags:
  - Advanced
  - Channels
  - Reliability
title: Channel Scrubbers
---

# Channel Scrubbers

Providers often keep channels in their lists long after the streams stop working. A channel scrubber checks every channel's stream, and disables the dead ones so they don't clutter your players.

## Create a scrubber

Go to **Playlist → Channel Scrubbers** and choose **New channel scrubber**. Pick the **Playlist**, then:

| Setting | Default | What it does |
|---|---|---|
| **Recurring** | Off | Run again after every sync of the playlist. |
| **Check Method** | HTTP | **HTTP** sends a quick request to each stream. Fast, but some providers reject it, so working channels can look dead. **FFprobe** opens each stream and checks it plays. Much more accurate, but much slower. |
| **Parallel processing** | Off | Check several streams at once. Much faster; how many is set by **Max concurrent requests** in **Settings → Sync Options**. |
| **Probe timeout (seconds)** | 10 | How long to wait for each stream before calling it dead. |
| **Scan all channels (including disabled)** | Off | Check disabled channels too. This means many more connections to your provider. |
| **Include VOD** | Off | Check movies as well as live channels. |
| **Disable dead channels** | On | Disable channels that don't respond. |
| **Re-enable live channels** | Off | Enable disabled channels that turn out to work. Needs **Scan all channels**. |
| **Keep failover channels hidden** | On | Don't re-enable channels that [Auto-Merge](auto-merge-channels) disabled as failovers. |
| **Rebuild failovers after scan** | Off | Run the playlist's auto-merge after the scan, so failover chains skip dead channels. |

Save, and choose **Run Now**. The list shows how many channels were checked and how many were dead, and each run's results are logged on the scrubber.

:::tip Mind your connection limit
Each check opens a connection to your provider, like a viewer would. If your provider limits connections, run scrubbers when nobody is watching, and keep **Max concurrent requests** low.
:::

Scrubbers need the **Use Scrubber** permission, which admins have. To check stream quality instead (resolution, codecs), see [Stream Probing](stream-probing).
