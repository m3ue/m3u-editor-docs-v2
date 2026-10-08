---
sidebar_position: 0
description: Add an Xtream login, M3U URL, or file as a playlist, keep it in sync, and find every playlist setting.
tags:
  - Getting Started
  - Playlists
title: Playlists
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Playlists

A playlist is one source from your provider: an Xtream login, or an M3U URL or file. M3U Editor imports its channels, movies (VOD), and series, keeps them in sync on a schedule, and serves your cleaned-up version to your players.

Everything else builds on playlists. [Custom Playlists](custom-playlist), [Merged Playlists](merged-playlist), and [Aliases](playlist-alias) all draw from them.

## Add a playlist

Go to **Playlist → Playlists** and choose **New playlist**. Pick the **Playlist type**, then fill in the source:

<Tabs groupId="playlist-type" queryString>
<TabItem value="xtream" label="Xtream API" default>

1. **Xtream API URL:** the server address from your provider, as `http://host:port` with no trailing slash. Choose **Test connection** next to it to check the login and see your connection limit and expiry date.
2. **Xtream API Username** and **Password.**
3. **Groups and Streams to Import:** choose **Live**, **VOD**, and **Series**.
4. **Import EPG:** on by default. After the first sync, it adds your provider's guide as an [EPG](epg-setup) named after the playlist, and maps it to your channels every time the guide syncs.

**Input Stream Format** chooses whether streams are imported as MPEG-TS (`.ts`, the default) or HLS (`.m3u8`).

</TabItem>
<TabItem value="m3u" label="M3U URL or file">

Enter the playlist's **URL or Local file path**, or upload the **File**. A local path is read from inside the container, so the file must be in a mounted folder.

If the provider blocks the default client, set a **User agent**. **Disable SSL verification** is there for providers with broken certificates.

</TabItem>
</Tabs>

The wizard then walks through the playlist's other settings. They can all be changed later, so it's fine to skip ahead and save. The first sync starts right away, and a notification tells you when it's done.

:::tip New channels start disabled
By default, imported channels, movies, and series are **disabled**, so a large provider doesn't flood your players. Enable what you want from **Live Channels → Groups** (**Enable group channels**), or turn on **Enable new Live channels** (and the VOD and series equivalents) under **Processing → Auto-Enable Settings** before the first sync.
:::

To import only some groups, turn on **Preprocess playlist** under **Processing → Playlist Processing**. After a sync, choose the groups to keep, then sync again.

## Keep it in sync

Playlists sync on the schedule in their **Scheduling** tab:

| Setting | What it does |
|---|---|
| **Automatically sync playlist** | On by default. Turn off to sync only when you choose **Sync and Process**. |
| **Sync Schedule** | A cron schedule, like `0 3 * * *` for 3am daily. The field shows the next run. |
| **Backup Before Sync** | Takes a [backup](/docs/advanced/settings-reference#backups) before each sync. |
| **Auto resync on failure** | *(v0.13.1+)* On by default. Retries a failed sync instead of waiting for the next scheduled one. |
| **Max retry attempts** | How many retries before giving up until the next scheduled sync (default `3`, up to `10`). |

Retries wait for the **Failed sync retry cooldown** in **Settings → Sync Options** (default 15 minutes). Choosing **Sync and Process** yourself resets the count.

### Protect against bad syncs

When a provider has an outage, it can return a partial list, and a sync would remove most of your channels. **Sync invalidation** cancels a sync like that and keeps what you have. Turn it on in **Settings → Sync Options → Sync Invalidation & Retries** with **Enable sync invalidation**:

| Setting | Default | Cancels the sync when it would remove more than |
|---|---|---|
| **Channel removal threshold** | `100` | this many channels |
| **Series removal threshold** | `100` | this many series |
| **Group/category removal threshold** | `50` | this many groups or categories |

An invalidated sync isn't retried early; it waits for the next scheduled sync. Turn on **Notify on invalidated playlist syncs** in [Alerts](/docs/advanced/alerts) to hear about it. The thresholds can also be set with the [`INVALIDATE_IMPORT`](/docs/advanced/environment-variables#playlists-and-syncs) environment variables, which lock the fields.

### Sync history

**View Sync Runs** on the playlist lists each sync with its status and timing. With **Enable Sync Logs** on (under **Output → Playlist Output**), **View Sync Logs** shows what each sync added and removed. *(v0.13.3+)* Logs include series, and can be filtered by **Content Type** and by change.

If a sync looks stuck, **Reset Processing State** clears its lock so a new sync can run.

## Playlist settings

Open a playlist and choose **Edit Playlist**. Settings are grouped in tabs:

| Tab | What's in it |
|---|---|
| **General** | Name, **Use Short URLs**, and the playlist's **Unique Identifier**. The identifier is part of every output URL, so changing it changes them all. |
| **Auth** | [Playlist Auths](playlist-auth) assigned to this playlist, and its [default login](playlist-auth#default-login). |
| **Type** | The source and credentials, plus [DNS failover URLs](xtream-dns-failover) and [Provider Profiles](/docs/advanced/playlist-pooled_providers) for Xtream playlists. |
| **Scheduling** | Auto sync, the schedule, and failed-sync retries (above). |
| **Processing** | What happens during and after each sync (below). |
| **Output** | How the playlist is served to players (below). |
| **DVR**, **Requests**, **AIOStreams** | Per-playlist settings for the [DVR](/docs/integrations/dvr_integration), [content requests](/docs/integrations/arrs_integration), and [AIOStreams](/docs/integrations/aiostreams_integration). |

### Processing

| Section | Use it to |
|---|---|
| **Playlist Processing** | Choose which groups to import (with **Preprocess playlist**), match groups by prefix or regex, skip file types like `.mkv`, and **Fetch by category** for providers that time out on one big request. |
| **Dynamic Groups (TMDB)** | Add groups like Trending or Top Comedy, built from TMDB lists, and sort VOD and series into genre groups. See [TMDB Integration](/docs/integrations/tmdb_integration#dynamic-groups). |
| **URL Find & Replace Preprocessing** | Fix provider stream URLs (a wrong scheme or port, for example) before channels are saved. |
| **Stream Probing** | Probe streams after each sync to record resolution and codecs. See [Stream Probing](/docs/advanced/stream-probing). |
| **Auto-Enable Settings** | Enable new live channels, VOD, and series automatically, and set their defaults for EPG mapping, merging, and probing. |
| **Series Processing**, **VOD Processing** | Fetch provider metadata after each sync, generate [`.strm` files](/docs/advanced/strm-files), and include VOD or series in the M3U output. |
| **Media Server Sources** | Play matching files from your media servers instead of provider streams (below). |
| **Auto-Merge Processing** | Link duplicate channels as failovers of each other after each sync. See [Auto-Merge Channels](/docs/advanced/auto-merge-channels). |
| **Find & Replace Rules** | Rename channels, groups, or other fields after each sync, with plain text or regex. |
| **Auto Enable/Disable Rules** | Enable or disable channels whose name or title matches a pattern. The last matching rule wins. |
| **Sort Alpha Configs** | Sort groups and channels after each sync. VOD and series can also sort by **Release Date** or **Rating**, and series by **Most Recent Activity**. |
| **Auto-Add to Custom Playlist** | Copy chosen groups into a [Custom Playlist](custom-playlist) after each sync, so new channels in those groups show up there too. |

### Output

| Section | Use it to |
|---|---|
| **Playlist Output** | Turn off outputs you don't use (**Enabled output types**: HDHR, M3U, Xtream API, XMLTV), number channels automatically, *(v0.13.1+)* **Sort by channel number** instead of by group, strip catch-up, and add `tvg-type` tags. |
| **Streaming Output** | **Enable Stream Proxy** to send streams through [M3U Proxy](/docs/proxy/overview), proxy and cache logos, set connection limits, and choose [transcoding profiles](/docs/proxy/transcoding) and custom HTTP headers. |
| **Cache** | Share [cached downloads](/docs/advanced/cached-content) with your other playlists, and override the retention mode. |
| **EPG Output** | Generate a placeholder guide for channels without one (**Enable dummy EPG**), and choose which ID channels use in the guide. See [EPGs](epg-setup#placeholder-guides). |

A few output settings are worth knowing:

- **HDHR/Xtream API Streams** is the number of tuners HDHomeRun clients see, and the connection count Xtream clients are told. `0` means unlimited.
- **Available Streams** caps how many streams the proxy will run for this playlist at once.
- **Provider Timezone** is needed for catch-up (timeshift) to line up. **Get from playlist status** fills it in from your provider.
- **Disable Xtream URL format in M3U output** puts the provider's own stream URLs in the M3U file, for players that can't use the Xtream-style links.

## Media server sources

*(v0.13.2+)* If the same movies and episodes are also in one of your [media servers](/docs/integrations/overview) (Emby, Jellyfin, Plex, or Local Media), the playlist can play those copies instead of the provider's streams. Turn on **Prefer media server sources** under **Processing → Media Server Sources**.

- Items are matched by TMDB, TVDB, or IMDB ID, so the playlist needs TMDB IDs first. See [TMDB Integration](/docs/integrations/tmdb_integration).
- Matching runs when you turn it on, after each playlist sync, and after each media server sync.
- Players keep the same URLs. If the media server copy can't be reached, playback falls back to the provider.
- With [caching](/docs/advanced/cached-content) enabled, the **Cached** column shows a server icon for matched items, and caching can [send titles to Radarr or Sonarr](/docs/advanced/cached-content#caching-through-radarr-or-sonarr) instead of downloading them.

The option isn't shown on playlists created by a media server integration.

## Playlist actions

The actions menu on a playlist has more tools:

| Action | What it does |
|---|---|
| **Sync and Process** | Sync now. |
| **Fetch Provider VOD / Series Metadata** | Fetch details like plot and cast from your provider, for enabled items. |
| **Fetch TMDB Metadata** | Look up TMDB IDs and details. See [TMDB Integration](/docs/integrations/tmdb_integration). |
| **Download M3U**, **HDHomeRun URL** | Get the playlist's outputs. |
| **Public URL** | Open the guest portal, where people with a login for this playlist can browse and watch in a browser. See [Playlist Auths](playlist-auth#guest-portal). |
| **Duplicate** | Copy the playlist and its settings. |
| **Copy Changes** | Copy your channel edits (names, logos, numbers, groups, and more) onto matching channels in another playlist. |
| **Migrate Provider** | Move your whole lineup to a new provider's playlist (below). |
| **Purge Series** | Delete every series in the playlist. |

### Moving to a new provider

**Migrate Provider** moves your channel setup onto another playlist, for example when you switch providers. Nothing changes until you've reviewed it:

1. **Configure:** choose the **Replacement playlist**, how channels are matched (shared TVG ID or stream ID, then normalized name or title), and what to copy (enabled state, group, order, number, names, logos, EPG mapping, and more). **Preserve EPG mappings** re-points mappings at the new provider's guide where it can. **Update Custom Playlist membership** swaps the new channels into your Custom Playlists.
2. **Preview:** check every match. You can change a match, and include or exclude channels.
3. **Apply migration:** it runs in the background, and you're notified when it's done.

**Disable channels that are not in this lineup** turns off unmatched channels on the new playlist. Nothing is deleted.

## Change a playlist from a script

You can update a playlist's source URL and credentials with the API, for example to rotate credentials automatically. Create a token under **Tools → API Tokens**, then:

```http
PATCH /playlist/{uuid}
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://new-provider.com:8080",
  "username": "new_username",
  "password": "new_password",
  "resync": true
}
```

For an M3U playlist, send only `url`. `resync: true` starts a sync straight away. `GET /user/playlists` lists your playlists and their UUIDs. The full API is documented in the app under **Settings → API → API Docs**.
