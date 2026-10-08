---
sidebar_position: 5
title: Stream Monitor
description: See every stream the proxy is serving - who's watching, what's on, bandwidth, encoder speed, and failover - and stop or fail over streams.
tags:
  - Proxy
  - Monitoring
  - Streams
---

# Stream Monitor

**Proxy → Stream Monitor** shows every stream M3U Proxy is serving right now. It's the first place to look when someone says a channel isn't working.

The top of the page totals active streams, viewers, and bandwidth, and shows how long the proxy has been running. Below, each stream has a card with:

- the channel, and the playlist or alias it's from
- its viewers, and the data and bandwidth they're using
- **Now** and **Next** from the guide, with how far into the current show it is
- the source and output format, and, when it's being transcoded, the encoder's bitrate, frame rate, and speed
- whether it has failed over to a backup, and whether [smart failover](failover#smart-failover) is choosing its backups

:::tip Encoder speed
If a transcoded stream's speed is below `1.0x`, the encoder can't keep up and viewers will buffer. Use a [GPU](hardware-acceleration) or a lighter profile.
:::

## Actions

| Action | What it does |
|---|---|
| **Trigger Failover** | Switch the stream to its next backup now. |
| **Remove Stream** | Stop the stream and disconnect everyone watching it. |
| **Refresh** | Update the page now. |

The page refreshes on its own every 5 seconds. Change the interval (3, 5, 10, or 30 seconds) or turn it off with **Auto-refresh**. It pauses while the browser tab is hidden.

**Hide URLs** blurs stream addresses, which contain provider logins, for screenshots and screen sharing. Both choices are remembered in your browser.

If the page shows no streams when something is playing, check the stream is actually [proxied](overview#turn-it-on), and that **Settings → Proxy → Test connection** succeeds.
