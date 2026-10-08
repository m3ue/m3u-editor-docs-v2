---
sidebar_position: 7
description: Schedule and manage DVR recordings from your IPTV EPG guide
title: DVR Integration
hide_title: true
tags:
  - Integrations
  - DVR
  - Recordings
  - EPG
---

# DVR Integration

:::note Version Requirement
DVR requires **v0.12.45+**. It also requires the proxy integration to be enabled.
:::

The built-in DVR lets you schedule recordings of live TV channels directly from the EPG guide. Recordings are saved to a configured storage location and can be enriched with TMDB metadata and NFO sidecar files for easy import into media servers like Emby or Jellyfin.

## How It Works

M3U Editor monitors your EPG data for scheduled programmes. When a recording rule fires, the proxy captures the live stream and writes it to disk. Scheduling runs in two parts: a per-minute check starts and stops recordings whose time has arrived, and a deep scan matches your rules against the EPG guide window (`DVR_INITIAL_LOOKAHEAD_DAYS` days ahead) so newly added programme data gets picked up automatically. The deep scan runs on every EPG sync, scoped to just the playlists that sync affected, rather than on a fixed daily schedule. Creating or re-enabling a rule also triggers an immediate match, so you see upcoming recordings right away instead of waiting for the next sync.

**Key Features:**
- Schedule single, series, and manual recordings
- Configurable start-early / end-late padding
- Concurrent recording limit per playlist
- Commercial detection via Comskip (optional)
- TMDB metadata enrichment with poster art
- NFO file generation for Emby/Jellyfin imports
- Disk quota management with automatic oldest-first cleanup
- Guest panel support (guests can view recordings and create rules on enabled playlists)

## Prerequisites

- Proxy integration enabled (`M3U_PROXY_ENABLED=true` or an external proxy configured)
- `DVR_ENABLED` environment variable set to `true` (default)
- The `use_dvr` permission granted to your user account (Admin → Users → Permissions)
- EPG data configured on your playlist so programme guides are available

## Persisting Recordings in Docker

By default, recording files are written inside the container to `storage/app/private/dvr`, which is **not** one of the paths persisted by the standard `docker-compose.yml` volumes (only the config directory, Postgres data, and the public asset storage are mounted by default). Without an explicit mount, recordings are lost if the container is recreated.

To persist recordings on the host, set `DVR_STORAGE_PATH` to a container path and mount a host directory there:

```yaml
services:
  m3u-editor:
    environment:
      - DVR_STORAGE_PATH=/recordings
    volumes:
      - ./recordings:/recordings
```

See [DVR_STORAGE_PATH](../advanced/environment-variables.md#dvr_storage_path) for the full variable reference.

## Enable DVR on a Playlist

DVR is enabled per-playlist (or per-Merged/Custom playlist — see below). Each gets its own DVR settings.

1. Go to **Playlists** and click **Edit** on the playlist you want to enable DVR for
2. Open the **DVR** tab
3. Toggle **Enable DVR** on

### Merged & Custom Playlists

DVR (and guest content **Requests**) are no longer limited to standard playlists — Merged Playlists and Custom Playlists have their own **DVR** tab with the same settings and Recording Rules described below. This lets you schedule recordings against a merged channel lineup or a hand-curated custom playlist, not just the source playlist it was built from.

### DVR Settings

| Setting | Description |
|---|---|
| **Enable DVR** | Activates DVR scheduling for this playlist |
| **Output Format** | Container format for recordings (`ts` recommended for compatibility) |
| **Transcode Recordings** | Have the proxy deinterlace and transcode recordings to H.264/AAC while they record. Recommended for HDHomeRun / OTA sources so recordings play in a browser and take less disk space. Leave off for IPTV sources that are already H.264 (stream copy, no re-encoding). Default: off. |
| **Max Concurrent Recordings** | Maximum simultaneous captures (default: `2`) |
| **Start Early (seconds)** | Begin recording this many seconds before the scheduled start (default: `30`) |
| **End Late (seconds)** | Continue recording this many seconds past the scheduled end (default: `60`) |
| **Retention (days)** | Auto-delete recordings older than this. Set to `0` to keep forever. |
| **Disk Quota (GB)** | Maximum total storage for DVR recordings. Oldest recordings are deleted first when exceeded. Set to `0` for no limit. |
| **Metadata Enrichment** | Fetch TMDB poster art and metadata for recordings |
| **Comskip** | Run commercial detection after recording completes |
| **Generate NFO Files** | Write `.nfo` sidecar files alongside recordings for media server imports |
| **Include Disabled Channels** | Allow recording of channels that are toggled off in the channel list |

### Series Recording Defaults

| Setting | Description |
|---|---|
| **Record Episodes** | Default series mode: record only unique episodes, all airings, or a rolling keep-last count |
| **Keep Last (n)** | When using keep-last mode, retain only the most recent `n` episodes |

## Recording Rules

Recording rules define *what* to record. Navigate to **DVR → Recording Rules** to manage them.

### Rule Types

| Type | Description |
|---|---|
| **Once** | Record a single specific programme from the EPG (selected by title and channel) |
| **Series** | Record every episode of a series by title across all future airings |
| **Manual** | Record a channel between two specific date/time values, regardless of EPG |

### Creating a Recording Rule

1. Go to **DVR → Recording Rules**
2. Click **New Recording Rule**
3. Select the **DVR Setting (Playlist)** to record from
4. Choose the **Rule Type**
5. Fill in the relevant fields:
   - **Channel** — the channel to record (or leave blank to use the EPG source channel)
   - **Series Title** — for Series rules, the programme title to match (e.g., `Breaking Bad`)
   - **Record Episodes** — per-rule override for series mode
   - **Start Early / End Late** — per-rule override for padding (inherits from DVR Setting if blank)
   - **Commercial Detection (Comskip)** — per-rule override
6. Click **Save**

While you create or edit a **Series** rule, the **Upcoming Airings** preview shows exactly what the rule would record. Airings it would skip are labelled **Skipped - Already Scheduled** or **Skipped - Already Recorded**. The preview updates as you change the series title, channel, or **Record Episodes** mode.

Duplicate handling depends on **Record Episodes**: "All" records every airing, while the unique and new-only modes skip repeats. For sports and other programmes without season/episode data, repeats are detected by title. **Sports Dedup Window (Days)** controls this: a same-title airing within that many days of a recent game counts as a replay and is skipped (blank uses the playlist default of 2 days; 0 records every same-title airing).

When a channel is offered by your provider in several variants (for example "HD" and "FHD" copies), the channel picker lists each title once.

:::tip
The **Matched Airings** count shown in the rules table tells you how many upcoming EPG slots match the rule. A count of `0` usually means the series title doesn't match any current EPG programme titles.
:::

## Viewing Recordings

Navigate to **DVR → Recordings** to see all recordings. Each row shows:

- Title, series, and episode information
- Recording status (`Scheduled`, `Recording`, `Completed`, `Failed`)
- Duration and file size
- Thumbnail / poster art (when metadata enrichment is enabled)

### Recording Actions

| Action | Description |
|---|---|
| **View** | Open the recording detail view with full metadata |
| **Stop** | Interrupt an in-progress recording |
| **Download** | Download the recording file directly (streamed from storage; only shown once the recording is `Completed`) |
| **Re-run Post-Process** | Re-trigger post-processing on a completed recording |
| **Regenerate NFO** | Re-create the `.nfo` sidecar file |
| **Re-run Comskip** | Re-run commercial detection |
| **Delete** | Permanently remove the recording and its file |

**Download** is also available as a header action on the recording's **View** page. Both open the file URL in a new tab and stream it straight from the configured storage disk, so it works the same whether recordings are stored locally or on a remote/S3-compatible disk.

## HDHomeRun / OTA Sources

Over-the-air channels from an HDHomeRun tuner are usually MPEG-2 video with AC3 audio, which browsers can't play and which take a lot of disk space.

- **Recordings**: turn on **Transcode Recordings** in the playlist's DVR settings. Recordings are deinterlaced and converted to H.264/AAC (roughly 40% smaller than raw MPEG-2).
- **Live viewing**: **Proxy → Stream Profiles → Generate Default Profiles** includes an **HDHomeRun / OTA Live** profile that deinterlaces and transcodes OTA channels for live playback. Assign it as a playlist's live streaming profile.

## DVR API (Dispatcharr-Compatible)

The DVR can be controlled over HTTP with endpoints that follow Dispatcharr's DVR API, so players built for Dispatcharr's DVR work with M3U Editor by changing the base URL. The endpoints appear in the in-app API docs (**Settings → API**).

### Authentication

Use a Sanctum personal access token, created under **Tools → Personal Access Tokens**. Any of these work:

- `Authorization: Bearer <token>`
- `X-API-Key: <token>`
- `Authorization: ApiKey <token>`
- `?token=<token>` (for players that can't set headers on video requests)

The token needs the matching ability: `view`, `create`, `update`, or `delete`. A token sees every recording in its owner's DVR settings.

### Recordings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/recordings` | List recordings |
| `GET` | `/recordings/{id}` | Get one recording |
| `POST` | `/recordings` | Schedule a recording (`channel`, `start_time`, `end_time`, optional `custom_properties.program`) |
| `DELETE` | `/recordings/{id}` | Stop if needed, then delete the recording and its files |
| `POST` | `/recordings/{id}/stop` | Stop early, keeping what was captured |
| `POST` | `/recordings/{id}/extend` | Extend a recording that hasn't started yet |
| `POST` | `/recordings/{id}/update-metadata` | Edit title and description |
| `POST` | `/recordings/{id}/refresh-artwork` | Re-run TMDB/TVMaze metadata enrichment |
| `POST` | `/recordings/{id}/comskip` | Queue commercial detection |
| `POST` | `/recordings/bulk-delete-upcoming` | Cancel all upcoming recordings |
| `GET` | `/recordings/{id}/file` | Stream the finished file (range requests supported), or the live HLS playlist while recording |
| `GET` | `/recordings/{id}/hls/index.m3u8` | Live HLS playlist |

### Series Rules

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/series-rules` | List series rules |
| `POST` | `/series-rules` | Create a rule, or update the existing rule for the same show |
| `DELETE` | `/series-rules?title=&tvg_id=` | Delete a rule (`title` or `tvg_id` is required) |
| `POST` | `/series-rules/preview` | Airings the rule would match in the next 7 days, without saving |
| `POST` | `/series-rules/evaluate` | Run the scheduler now and report how many recordings were added |
| `POST` | `/series-rules/bulk-remove` | Cancel upcoming recordings for a series title or channel |

### Differences from Dispatcharr

- Recording statuses are translated to Dispatcharr's (post-processing shows as `recording`, failed as `interrupted`). Cancelled and purged recordings are hidden.
- A recording can only be scheduled on a channel whose playlist (or a Custom/Merged Playlist containing it) has DVR enabled.
- `extend` only works before a recording starts. An in-progress recording returns `409`.
- Weekly `recurring-rules`, regex title matching, and description matching aren't supported.
- M3U Editor keeps one series rule per show, matched on title.

## Guest Panel

When a playlist has content requests enabled, guests can:
- View their own recordings in the guest panel
- Create recording rules from the guest EPG view

Guest DVR access is controlled by the **Guest Requests** toggle on a per-playlist basis under **Playlists → Edit**.

### Recording Through Outages

*(Editor v0.13.3+ with proxy v0.4.33+)* A recording survives short problems with the source or the proxy:

- **Source drops or stalls.** When FFmpeg exits early, the proxy restarts the capture in place for the remaining time and appends to the same recording, so you get one file with a short gap rather than a failed or split recording. A capture that is still running but hasn't written a segment for 30 seconds is restarted too. The recording is only marked failed once the outage lasts longer than 60 seconds. Both limits are proxy settings: [`DVR_RESTART_WINDOW_SECONDS` and `DVR_STALL_TIMEOUT_SECONDS`](../proxy/configuration.md).
- **Proxy restarts.** If the proxy restarts mid-recording, the editor's per-minute scheduler notices the capture is gone and resumes it into the same recording. Recordings that started less than a minute ago or end within 30 seconds are left alone.
- **Retrying a failed recording** continues the existing recording instead of starting over. Before proxy v0.4.33, a retry could lose everything recorded before the failure.

While a recording is in progress, players can seek across everything recorded so far, not just a short live window.

*(v0.13.3+)* Links to recordings shared with guests (a channel being recorded, and recordings listed as VOD) now use signed URLs scoped to that one recording, instead of URLs that carried the playlist owner's login.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DVR_ENABLED` | `true` | Set to `false` to globally disable all DVR features |
| `DVR_INITIAL_LOOKAHEAD_DAYS` | `14` | How many days ahead the scheduler scans when matching rules, used both for the immediate scan on rule create/re-enable and the deep scan triggered by EPG sync |

## Troubleshooting

**Recording never starts**
- Confirm the proxy is running and reachable from M3U Editor
- Verify the `use_dvr` permission is granted to your user
- Check that EPG data is populated for the playlist — the DVR scheduler needs programme start/end times

**Recording status stays "Scheduled" past the start time**
- Make sure `DVR_ENABLED=true` is set in your environment
- Confirm the proxy integration is enabled (not just the embedded proxy being disabled)

**No Matched Airings on a Series rule**
- The series title must match the EPG programme title exactly (case-insensitive)
- Run a manual playlist sync to refresh EPG data; the deep scan runs automatically as part of that sync and picks up newly added programme data right away
- If it's still not matching after a sync, disable and re-enable the rule to trigger an immediate re-match

**Recording has a short gap**
- This is expected when the source dropped or the proxy restarted mid-recording. The capture was resumed into the same file (see [Recording Through Outages](#recording-through-outages))
- If gaps are frequent, check the provider stream's stability, or raise `DVR_RESTART_WINDOW_SECONDS` on the proxy for sources with longer drops

**Metadata / poster art missing**
- Ensure a TMDB API key is configured in **Settings**
- Enable **Metadata Enrichment** in the DVR Settings tab

## Related Documentation

- [Plex Integration](./plex_integration.md) — Plex's own DVR/Live TV via HDHomeRun tuner registration
- [EPG Setup](../resources/epg-setup.md)
- [Stream Probing](../advanced/stream-probing.md)
