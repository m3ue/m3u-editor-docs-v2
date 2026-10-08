---
sidebar_position: 9
description: Turn movies and series from your media server into 24/7 live TV channels, with a schedule and guide.
title: Networks
tags:
  - Integrations
  - Networks
  - Media Servers
  - Broadcasting
---

import { Steps, Step } from '@site/src/components/Steps';

# Networks

A Network is a live TV channel made from your own library: a classic sitcom channel that plays episodes around the clock, or a movie channel that loops through a collection. M3U Editor builds the schedule and guide, and [M3U Proxy](/docs/proxy/overview) broadcasts it like a real channel.

You need a [media server integration](emby_integration_settings) with its content synced, and the proxy set up. For transcoding, a [separate proxy container with hardware acceleration](/docs/proxy/hardware-acceleration) helps a lot.

## Create a network

Go to **Integrations → Networks** and choose **New network**. The wizard has four steps:

<Steps>
<Step title="Media Server">

Pick the media server the network plays from. A network uses one media server.

</Step>
<Step title="Network Info">

A **Network Name**, an optional **Channel Number**, **Logo URL**, and **Group Name** (`Networks` if empty).

</Step>
<Step title="Schedule">

How content is ordered (**Schedule Type**), whether it loops, and the **Output Playlist** the network is published in. Networks are served through playlists made for them, so create one here if you don't have one yet.

</Step>
<Step title="Broadcast">

Optional. Turn on **Enable Broadcasting** to stream the channel live (below). You can do this later.

</Step>
</Steps>

Then open the network and add what it plays, with **Add Movies** and **Add Episodes**, and choose **Generate Schedule**.

## Scheduling

| Schedule Type | Plays |
|---|---|
| **Sequential** | Content in the order you list it. |
| **Shuffle** | Content in a random order. |
| **Manual** | What you place on a visual timeline in the **Schedule Builder**, repeating **Per Day**, as a **Weekly Template**, or as a **One Shot** that fills the window once. |

**Loop Content** starts over when everything has played. **Schedule Window** sets how many days ahead the schedule is built (7 by default), and **Auto-regenerate Schedule** tops it up before it runs out. **Gap Between Programmes** adds space between items.

Each item in the content list can also be **pinned** to a day and time, given a **Weight**, **chained** to the next item so they always play together, or set to a preferred audio and subtitle track.

When you choose **Generate Schedule**, **Continue from current position** keeps what's airing and extends the schedule. **Fresh start** rebuilds it, which you'll want after reordering content.

## Broadcasting

Broadcasting streams the schedule live, so everyone watching sees the same thing at the same time. Settings are in the network's **Broadcast Settings** tab:

| Setting | What it does |
|---|---|
| **Enable Broadcasting** | Stream the network live. |
| **Start On Viewer Connection** | Wait for someone to tune in before starting, instead of running all the time. |
| **Schedule Start Time** | Wait until a set date and time to start. |
| **Output Format** | **HLS** (recommended) or **MPEG-TS**. |
| **Segment Duration** | Length of each HLS segment (6 seconds is recommended). |

Start and stop it with **Start Broadcast** and **Stop Broadcast**. The **Broadcast Status** section shows whether it's running.

### Transcoding

**Transcode Mode** chooses where video is converted, if at all:

- **Direct (Passthrough):** no transcoding. The lightest option, but every file must already be in a format players can handle.
- **Media Server:** Emby, Jellyfin, or Plex transcodes.
- **Local (FFmpeg via Proxy):** the proxy transcodes, with your choice of **Video Bitrate**, **Audio Bitrate**, **Resolution**, codecs, **Encoder Preset**, and **Hardware Acceleration**.

**Preferred Audio Language** and **Preferred Subtitle Language** pick tracks for the whole network. Restart the broadcast after changing any of these.

## Watch it

A network's **Stream Output** and **EPG Output** tabs list its URLs. Most people use the **Output Playlist** instead: it carries all its networks as live channels, with their guide, through the usual [playlist outputs](/docs/client_configuration). Each media server integration's **Networks** tab also has a playlist and guide URL covering every network built from that server.

:::tip Broadcast segments in memory
The proxy writes broadcast segments to `HLS_BROADCAST_DIR` (by default `/tmp/m3u-proxy-broadcasts`). Mounting a `tmpfs` there keeps them in RAM, which is faster and spares your disk. Allow roughly 50 to 200 MB per running network.
:::

## Troubleshooting

| Problem | What to check |
|---|---|
| The network won't start | It has content and a generated schedule, and **Settings → Proxy → Test connection** succeeds. The proxy needs to reach the editor's **Resolver URL**; see [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration#settings-that-affect-the-connection). |
| It plays but stutters | Transcoding is too much for the CPU. Use hardware acceleration, a lower bitrate, or **Direct** mode. |
| The guide is empty | Choose **Generate Schedule**, then refresh the guide in your player. |
