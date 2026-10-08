---
sidebar_position: 3
description: Manage users and what they can do, back up and restore M3U Editor, and use the Tools menu - API tokens, assets, post processing, and logs.
tags:
  - Advanced
  - Users
  - Backups
title: Users, Backups, and Tools
---

# Users, Backups, and Tools

## Users

Admins can add more users under **Administration → Users**. Each user signs in to M3U Editor with their own account and has their own playlists, EPGs, and settings; they don't see each other's.

To share playlists with family or friends for watching, you usually don't need users at all: give them a [Playlist Auth](/docs/resources/playlist-auth) instead. Users are for people who manage their own playlists.

A new user can only manage playlists and EPGs. Turn on extra features under **User Permissions**:

| Permission | Allows |
|---|---|
| **Use Proxy** | Streaming through [M3U Proxy](/docs/proxy/overview), and its settings on their playlists |
| **Use Integrations** | [Media servers](/docs/integrations/emby_integration_settings), Sonarr and Radarr, and other integrations |
| **Use Tools** | API tokens and post processing |
| **Use Stream File Sync** | [`.strm` files](strm-files) |
| **Use Scrubber** | [Channel Scrubbers](channel-scrubbers) |
| **View Release Logs** | The release notes page |
| **Use AI Copilot** | The [AI Copilot](/docs/ai-copilot/overview) |
| **Use DVR** | The [DVR](/docs/integrations/dvr_integration) |

Admins have every permission. **Force password change on next login** makes someone pick a new password the next time they sign in, which happens automatically for the default `admin` account. **Notify Users** sends a message to users' notification bells.

To sign in through an identity provider instead of passwords, see [Single Sign-On](sso-oidc).

## Backups

**Tools → Backup & Restore** keeps backups of your database: playlists, settings, channel edits, and everything else.

| Action | What it does |
|---|---|
| **Create Backup** | Back up now. **Include Files** adds your uploaded playlist and EPG files. |
| **Upload Backup** | Add a backup `.zip` from another machine. |
| **Restore Backup** | Replace everything with a backup. |

Backups are saved in the `m3u-editor-backups` folder inside your `./data` volume, so they survive updates. They're still on the same disk as everything else, so download one from the list now and then, or copy that folder somewhere safe.

To back up on a schedule, turn on **Enable Automatic Database Backups** in **Settings → Backups**, and choose how many to keep. A playlist can also take a backup before each sync with **Backup Before Sync**. Set `BACKUP_ARCHIVE_PASSWORD` to encrypt backup files.

## Tools

| Page | Use it to |
|---|---|
| **API Tokens** | Create tokens for scripts and apps that use the M3U Editor API, each with a name, permissions (`view`, `create`, `update`, `delete`), and an optional expiry date. The API is documented in the app under **Settings → API → API Docs**. |
| **Assets** | Upload images to use as channel logos and placeholders. |
| **Backup & Restore** | See [Backups](#backups). |
| **Post Processing** | Run something after a sync (below). |
| **Debug Logs** | Read, download, or clear the app's logs. Include the relevant part when asking for help. |
| **Release Logs** | Read the release notes for each version. |
| **Job Monitor** | Follow background jobs, and retry failed ones. See [Job Monitor](job-monitoring). |
| **API Docs** | Open the M3U Editor API documentation. |

### Post processing

A post process does something when a playlist or EPG changes: calls a URL, runs a script, or sends an email. For example, ask Jellyfin to refresh its guide after your EPG syncs, or get an email when a playlist sync fails.

1. Go to **Tools → Post Processing** and choose **New post process**.
2. Pick the **Event**: **Synced**, **Created**, **Deleted**, or **VOD Stream Files Synced** and **Series Stream Files Synced** (after [`.strm` files](strm-files) are written). **Process failed** also runs it after failed syncs.
3. Pick the **Type**:
   - **URL:** a `GET` or `POST` request, with your own headers, and variables such as the playlist's name, status, sync time, and the channels and groups added or removed. **Send as JSON body** sends them as JSON; **Send without body** sends an empty `POST`.
   - **Local file:** a script inside the container, with the same values as environment variables. Admins only.
   - **Email:** an email, sent with your [SMTP settings](settings-reference#smtp).
4. Save, then add the playlists and EPGs it applies to with **Assign processing to item**.

Each run is logged on the post process. URLs on your local network are blocked unless you set `ALLOW_PRIVATE_WEBHOOK_URLS=true`.
