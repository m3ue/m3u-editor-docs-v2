---
sidebar_position: 5.5
title: Watch History
description: Keep a history of every live channel, movie, and episode streamed through the proxy - who watched it, on which player, and for how long.
tags:
  - Proxy
  - Monitoring
  - Streams
---

# Watch History

*(v0.14.2+)* [Stream Monitor](stream-monitor) shows what's playing right now. **Proxy → Watch History** keeps a record of what was played: each live channel, movie, and episode streamed through M3U Proxy, which [Playlist Auth](/docs/resources/playlist-auth) watched it, on which player, and for how long.

Only streams that go through the proxy are recorded. Players that connect straight to the provider don't appear here.

## Turn it on

Watch history is built from the proxy's webhooks: the proxy tells M3U Editor each time a player connects or disconnects. Those messages have to reach M3U Editor, so set this up first:

1. Set the **Resolver URL** under **Settings → Proxy → Failover & Recovery**. It's the address the proxy uses to reach M3U Editor, like `http://m3u-editor:36400`, and webhooks are sent there. (You can also set it with [`M3U_PROXY_FAILOVER_RESOLVER_URL`](/docs/advanced/environment-variables).)
2. Under **Settings → Proxy → Watch History**, click **Test webhooks**.
3. Once the test passes, turn on **Track watch history** and save.

M3U Editor won't let you turn it on while the test fails. The error under the toggle says why.

| Setting | Default | What it does |
|---|---|---|
| **Track watch history** | Off | Records streams played through the proxy, and adds **Watch History** under **Proxy** in the menu. |
| **Keep history for** | 30 days | Older entries are removed once a day. Enter `0` to never remove them. |

## Test webhooks

M3U Editor registers its webhook with the proxy each time it starts, but a wrong address or a network between the two containers can stop the messages arriving. **Test webhooks** is on the settings section and at the top of the Watch History page. It:

1. checks the Resolver URL is set
2. asks the proxy which webhooks it has, and registers M3U Editor's again if it's missing
3. has the proxy send a real test message to M3U Editor

| Message | What to check |
|---|---|
| Set the Resolver URL... | Fill in the **Resolver URL** (step 1 above). |
| The proxy answered HTTP ... when listing webhooks | The proxy isn't reachable. Check **Settings → Proxy → Test connection**. |
| The webhook isn't registered with the proxy, and registering it failed | Check the proxy's logs. |
| The proxy couldn't deliver a test event to M3U Editor at ... | The proxy can't reach the Resolver URL. Make sure it's an address the **proxy** can reach, such as the container name on a shared Docker network, not `localhost` or your browser's address. |

## The history

Each row is one player connection, newest first, with tabs for **Live TV**, **VOD**, and **Series**:

- the poster and title, with the season and episode for series, and the show that was on air for live channels
- **Watched By**: the Playlist Auth and username the player signed in with
- **Player**: the app, worked out from its user agent (TiviMate, Kodi, VLC, and so on), and its IP address
- badges for **Watching now**, **Transcoded**, **Catch-up**, and **Failover**, and the video resolution and codecs
- how long it was watched, and when it started

When several players share one pooled stream, each is recorded on its own, under its own login.

Filter by **Playlist Auth**, **Watching now**, **Transcoded**, or the date it started. Click a row for everything recorded about it: the playlist, TMDB and IMDb IDs, the viewer, the full user agent, how much data was sent, why it ended, and the stream's media details. **Play** opens it in the in-app player.

:::note Length unknown
If the proxy never reports that a player disconnected, for example because the proxy restarted, the entry is closed after 24 hours and shows **Length unknown** instead of counting a whole day.
:::

Watch history records connections, not playback position, so it doesn't change [watch progress](/docs/integrations/trakt_simkl_integration) or resume points.
