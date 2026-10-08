---
sidebar_position: 2
description: Record live TV from the guide - single shows, whole series, or fixed time slots - with padding, retention, metadata, and commercial detection.
title: DVR
tags:
  - Integrations
  - DVR
  - Recordings
  - EPG
---

import { Steps, Step } from '@site/src/components/Steps';

# DVR

The built-in DVR records live TV from your playlists' guide data. Record a single show, every episode of a series, or a fixed time slot. Recordings can be enriched with artwork and episode details, have commercials marked, and be served back to your players like any other movie or episode.

[M3U Proxy](/docs/proxy/overview) does the recording, so the proxy must be set up. Your user also needs the **Use DVR** permission, which admins have.

## Set it up

<Steps>
<Step title="Keep recordings on your disk">

Recordings are written inside the container by default, so they'd be lost when it's recreated. Mount a folder for them and point `DVR_STORAGE_PATH` at it:

```yaml
services:
  m3u-editor:
    environment:
      - DVR_STORAGE_PATH=/recordings
    volumes:
      - ./recordings:/recordings
```

</Step>
<Step title="Turn on the DVR for a playlist">

Edit a playlist (or a Custom or Merged Playlist), open its **DVR** tab, and turn on **Enable DVR**. The playlist needs guide data, since the DVR schedules from it.

</Step>
<Step title="Pick something to record">

Go to **DVR → Browse Shows**, choose the playlist under **DVR Setting (Playlist)**, and browse what's coming up. Record a single airing, or the whole series. Rules can also be created by hand under **DVR → Recording Rules**.

</Step>
</Steps>

## DVR settings

Each playlist's **DVR** tab has its own settings:

| Setting | Default | What it does |
|---|---|---|
| **Output Format** | MPEG-TS | The file type: `.ts`, `.mp4`, or `.mkv`. The stream is copied, not re-encoded. |
| **Transcode Recordings** | Off | Deinterlace and convert to H.264/AAC while recording. Turn on for HDHomeRun and over-the-air sources, so recordings play in a browser and take less space. |
| **Max Concurrent Recordings** | 2 | How many recordings can run at once. Keep it within your provider's connection limit. |
| **Start Early**, **End Late** | 30s, 60s | Padding before and after each show. |
| **Retention (days)** | 0 | Delete recordings older than this. `0` keeps them. |
| **Disk Quota (GB)** | 0 | Delete the oldest recordings when this is exceeded. `0` means no limit. |
| **Enable Metadata Enrichment** | Off | Fetch artwork, descriptions, and episode details from TMDB and TVMaze after recording. |
| **Enable Commercial Detection (Comskip)** | Off | Mark commercials after recording. |
| **Generate NFO Files** | Off | Write `.nfo` files next to recordings, for Kodi, Jellyfin, and Plex. |
| **Show Disabled Channels in Browse Shows** | Off | Let Browse Shows include channels you've disabled. |

**Series Recording Defaults** set what new series rules start with: **Record Episodes**, **Keep Last N Recordings**, and the **Sports Dedup Window (Days)** (below).

## Recording rules

**DVR → Recording Rules** lists what's set to record. There are three kinds:

| Type | Records |
|---|---|
| **Once** | One airing of a show, picked from the guide. |
| **Series** | Every matching airing of a show, by its title. Optionally limit it to one **Channel**. |
| **Manual** | A channel between a **Manual Start** and **Manual End** time, whatever the guide says. |

For series rules, **Record Episodes** chooses which airings to keep:

- **Unique Episodes (S/E)** (the default) skips episodes you already have, by season and episode number.
- **New Episodes Only** records airings the guide marks as new.
- **All Episodes** records every airing.

Sports and other shows without episode numbers are matched by title. A same-title airing within the **Sports Dedup Window** (2 days unless you set it) counts as a replay and is skipped.

While you edit a series rule, **Upcoming Airings** shows exactly what it would record, and which airings it would skip. **Keep Last N Recordings** deletes older episodes as new ones arrive. When more recordings are due than **Max Concurrent Recordings** allows, rules with a higher **Priority** (default 50) start first. A rule's **Start Early**, **End Late**, and **Commercial Detection** can override the playlist's defaults.

:::tip No matched airings?
A series rule matches the show's title in the guide (not case-sensitive). If it matches nothing, check the exact title in **Browse Shows**. New guide data is matched after each EPG sync, and saving a rule matches it right away.
:::

## Recordings

**DVR → Recordings** lists every recording with its status, size, and artwork. From a recording you can **Watch** it, **Download** the file, **Cancel** one that's scheduled or recording, **Reprocess Comskip**, or **Retry Post-Processing**. **Generate NFO files** works on a selection.

Finished recordings are added to the playlist as VOD, in a **DVR Recordings** group, so they reach your players like any other movie or episode. While a show is still recording, players can watch it and seek back to the start.

### Recording through outages

*(v0.13.3+ with proxy v0.4.33+)* A recording survives short problems:

- **The source drops or stalls.** The proxy restarts the capture and appends to the same recording, so you get one file with a short gap. It only gives up after 60 seconds of outage. A capture that stops writing for 30 seconds is restarted. Both limits are proxy settings, [`DVR_RESTART_WINDOW_SECONDS` and `DVR_STALL_TIMEOUT_SECONDS`](/docs/proxy/configuration).
- **The proxy restarts.** The editor notices within a minute and resumes the capture into the same recording.

## Guests

People you've given a [Playlist Auth](/docs/resources/playlist-auth) can use the DVR in the [guest portal](/docs/resources/playlist-auth#guest-portal) when both the playlist's DVR and their login's **DVR Access** are on. They see and schedule their own recordings, within the **Max Concurrent Recordings** and **Storage Quota (GB)** set on their login.

## Over-the-air (HDHomeRun) sources

Antenna channels from an HDHomeRun tuner are usually MPEG-2 video with AC3 audio, which browsers can't play and which take a lot of space:

- For recordings, turn on **Transcode Recordings**. They come out as H.264/AAC, about 40% smaller.
- For live viewing, **Proxy → Stream Profiles → Generate Default Profiles** adds an **HDHomeRun / OTA Live** profile. Set it as the playlist's live streaming profile.

## Environment variables

| Variable | Default | What it does |
|---|---|---|
| `DVR_ENABLED` | `true` | Set to `false` to turn off the DVR everywhere. |
| `DVR_STORAGE_PATH` | Inside the container | Where recordings are written. Mount a volume here. |
| `DVR_INITIAL_LOOKAHEAD_DAYS` | `14` | How many days of guide data rules are matched against. |

<details>
<summary>DVR API (Dispatcharr-compatible)</summary>

The DVR can be controlled over HTTP with endpoints that follow Dispatcharr's DVR API, so apps built for Dispatcharr's DVR work by changing the base URL. They're listed in the in-app API docs (**Settings → API → API Docs**).

**Authentication:** a token from **Tools → API Tokens** with the `view`, `create`, `update`, or `delete` ability, sent as `Authorization: Bearer <token>`, `X-API-Key: <token>`, `Authorization: ApiKey <token>`, or `?token=<token>` for players that can't set headers.

| Method | Endpoint | Does |
|---|---|---|
| `GET` | `/recordings`, `/recordings/{id}` | List recordings, or get one |
| `POST` | `/recordings` | Schedule a recording (`channel`, `start_time`, `end_time`, optional `custom_properties.program`) |
| `DELETE` | `/recordings/{id}` | Stop if needed, then delete the recording and its files |
| `POST` | `/recordings/{id}/stop` | Stop early, keeping what was recorded |
| `POST` | `/recordings/{id}/extend` | Extend a recording that hasn't started yet |
| `POST` | `/recordings/{id}/update-metadata` | Edit the title and description |
| `POST` | `/recordings/{id}/refresh-artwork` | Fetch metadata again |
| `POST` | `/recordings/{id}/comskip` | Queue commercial detection |
| `POST` | `/recordings/bulk-delete-upcoming` | Cancel all upcoming recordings |
| `GET` | `/recordings/{id}/file` | Stream the file, or the live HLS playlist while recording |
| `GET` | `/recordings/{id}/hls/index.m3u8` | Live HLS playlist |
| `GET`, `POST`, `DELETE` | `/series-rules` | List, create (or update the rule for the same show), or delete (`?title=` or `?tvg_id=`) series rules |
| `POST` | `/series-rules/preview` | Airings a rule would match in the next 7 days |
| `POST` | `/series-rules/evaluate` | Run the scheduler now |
| `POST` | `/series-rules/bulk-remove` | Cancel upcoming recordings for a title or channel |

Differences from Dispatcharr: statuses are mapped to Dispatcharr's; recordings can only be scheduled on channels whose playlist has the DVR on; `extend` only works before a recording starts; weekly `recurring-rules`, regex titles, and description matching aren't supported; and there's one series rule per show, matched on title.

</details>

## Troubleshooting

| Problem | What to check |
|---|---|
| Recordings never start | The proxy is running (**Settings → Proxy → Test connection**), your user has **Use DVR**, and the playlist has guide data. |
| A series rule has no matched airings | The title matches the guide's title. Check it in **Browse Shows**. |
| A recording has a short gap | The source dropped and the capture resumed. For sources with longer drops, raise `DVR_RESTART_WINDOW_SECONDS` on the proxy. |
| No artwork or details | **Enable Metadata Enrichment** is on, and a [TMDB](tmdb_integration) key is set. |
| Recordings disappear after an update | Mount a volume and set `DVR_STORAGE_PATH` (above). |
