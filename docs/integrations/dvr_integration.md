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

:::note Experimental Feature
DVR is currently available on the **experimental** branch only. It requires the proxy integration to be enabled.
:::

The built-in DVR lets you schedule recordings of live TV channels directly from the EPG guide. Recordings are saved to a configured storage location and can be enriched with TMDB metadata and NFO sidecar files for easy import into media servers like Emby or Jellyfin.

## How It Works

M3U Editor monitors your EPG data for scheduled programmes. When a recording rule fires, the proxy captures the live stream and writes it to disk. Scheduling runs in two parts: a per-minute check starts and stops recordings whose time has arrived, and a daily scan (by default at 3 AM, configurable via `DVR_DEEP_SCAN_HOUR`) matches your rules against the full EPG guide window so newly added programme data gets picked up automatically. Creating or re-enabling a rule also triggers an immediate match, so you see upcoming recordings right away instead of waiting for the next scan.

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
| **Re-run Post-Process** | Re-trigger post-processing on a completed recording |
| **Regenerate NFO** | Re-create the `.nfo` sidecar file |
| **Re-run Comskip** | Re-run commercial detection |
| **Delete** | Permanently remove the recording and its file |

## Guest Panel

When a playlist has content requests enabled, guests can:
- View their own recordings in the guest panel
- Create recording rules from the guest EPG view

Guest DVR access is controlled by the **Guest Requests** toggle on a per-playlist basis under **Playlists → Edit**.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DVR_ENABLED` | `true` | Set to `false` to globally disable all DVR features |
| `DVR_INITIAL_LOOKAHEAD_DAYS` | `14` | How many days ahead the scheduler scans when matching rules — used both for the immediate scan on rule create/re-enable and the daily deep scan |
| `DVR_DEEP_SCAN_HOUR` | `3` | Hour of the day (0–23, server time) the daily deep scan runs to pick up EPG data added since the last scan |

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
- Run a manual playlist sync to refresh EPG data
- If EPG data was added *after* the rule was created, it's picked up by the daily deep scan (default 3 AM, `DVR_DEEP_SCAN_HOUR`) — allow up to 24 hours, or disable and re-enable the rule to trigger an immediate re-match

**Metadata / poster art missing**
- Ensure a TMDB API key is configured in **Settings**
- Enable **Metadata Enrichment** in the DVR Settings tab

## Related Documentation

- [Plex Integration](./plex_integration.md) — Plex's own DVR/Live TV via HDHomeRun tuner registration
- [EPG Setup](../resources/epg-setup.md)
- [Stream Probing](../advanced/stream-probing.md)
