---
sidebar_position: 1
description: Every page under Settings in M3U Editor, and what each setting does.
tags:
  - Settings
  - Configuration
  - Reference
title: Settings Reference
---

# Settings Reference

Most of M3U Editor is configured in the app, under **Settings** (in the **Administration** section of the sidebar). This page goes through each settings page in order. Things that must be set before the app starts are [environment variables](environment-variables) instead.

When an environment variable is set for a setting, the field is locked and shows **Already set by environment variable!**

## General

| Setting | What it does |
|---|---|
| **Show breadcrumbs**, **Navigation position**, **Max width of the page content** | Layout of the interface. The sidebar can sit on the left or along the top. |
| **Show queue indicator** | Show background job activity in the top bar. |
| **Output WAN address in menu** | Show your server's public IP address in the menu. |
| **Suppress success notifications** | Hide success and information pop-ups from background tasks. Errors and warnings always show. |
| **Application Timezone** | The timezone for every date and time in the app, and for schedules. Overrides `TZ`. |
| **Date Format** | How dates are shown, from presets or a custom format. |
| **Allowed domains** | Only allow playlist URLs from these domains (wildcards allowed). Empty allows any. |
| **Enhanced output enabled** | Extra Xtream API fields that [M3U TV](/docs/m3u-tv/overview) needs. On by default; leave it on. |
| **HTTP Port**, **HTTPS Port** | The ports your Xtream API tells players to use, when they differ from `APP_PORT` and 443, for example behind a reverse proxy. |
| **Xtream API panel message** | A message players can show from the Xtream API. |

**Test WebSocket** at the top of the page checks that live updates reach your browser. If no pop-up appears, see [Reverse Proxy and HTTPS](/docs/deployment/caddy-vs-nginx#what-the-reverse-proxy-needs).

## Navigation

Reorder the sidebar's groups and items by dragging, and hide what you don't use. **Use Simplified Default** switches to a shorter layout, and **Restore Default** brings back the full one. Changes apply to every user; refresh the page to see them.

## Proxy

Settings for [M3U Proxy](/docs/proxy/overview). The buttons at the top are **Test connection**, **API key**, and **API docs**.

| Section | Setting | What it does |
|---|---|---|
| **URL & Connection** | **Override URL** | A different address for proxied stream links than `APP_URL`. Also `PROXY_URL_OVERRIDE`. See [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration#settings-that-affect-the-connection). |
| | **Resolve proxy public URL dynamically at request time** | Give each player stream links on the address it used, for LAN plus VPN or Tailscale access. |
| | **Stop oldest stream when limit reached** | At a playlist's connection limit, stop its oldest stream to start the new one. |
| | **Include logos in proxy URL override** | Use the override address for logos too. Turn off to keep HTTPS logo links for Plex while streams use a local address. |
| **Failover & Recovery** | **Resolver URL**, **Enable advanced failover logic**, **playlist fail conditions** | [Smart failover](/docs/proxy/failover#smart-failover). |
| | **Enable silence detection** and its settings | [Silence Detection](/docs/proxy/silence-detection). |
| **In-App Player Transcoding** | **Default Live Transcoding Profile**, **VOD and Series Transcoding Profile** | [Transcoding](/docs/proxy/transcoding#use-a-profile) for the player built into M3U Editor. |
| | **Max Concurrent Players** | How many in-app players can be open at once. |

## TV App

Settings for [M3U TV](/docs/m3u-tv/overview): **Get the app**, [push notifications](/docs/m3u-tv/push-notifications) (**Enable push relay**, **Send Notification**, **Notification Channels**), and [device pairing](/docs/m3u-tv/device-pairing) (**Enable device pairing**, **Pair a Device**).

## Sync Options

| Section | Setting | Default | What it does |
|---|---|---|---|
| **Provider Rate Limiting & Concurrency** | **Max concurrent requests** | 2 | How many requests run at once against providers, including stream probing and channel scrubbing. |
| | **Enable request delay**, **Request delay** | Off, 500 ms | Wait between provider requests, for providers that block fast clients. |
| **Sync Invalidation & Retries** | **Enable sync invalidation** and thresholds | Off; 100 channels, 100 series, 50 groups | Cancel a sync that would remove too much. See [Protect against bad syncs](/docs/resources/playlists#protect-against-bad-syncs). |
| | **Failed sync retry cooldown** | 15 minutes | How long a failed playlist or EPG sync waits before it's retried. |
| **Series stream file settings**, **VOD stream file settings** | **Default Series Stream File Setting**, **Default VOD Stream File Setting** | None | The default [`.strm` file](strm-files) settings. Empty turns off `.strm` files. |

**Reset Queue** at the top restarts the background workers and removes every pending job, including running syncs. Use it only when syncs are stuck.

## Assets

| Section | Setting | What it does |
|---|---|---|
| **Logo Cache** | **Keep cache permanently** | Never expire cached logos. |
| | **Enable Logo Repository endpoint** | Serve your logos publicly at `/logo-repository`, for apps like UHF. |
| **Image Optimization** | **Optimize cached artwork** | Cache logos, posters, and artwork at a size that suits where they're shown, so players download less. On by default. |
| | **Poster**, **Backdrop**, **Title logo**, **Cast photo** | Maximum width of each kind of image (600, 1280, 800, and 300 pixels by default). |
| | **Image quality** | Compression quality, 1 to 100 (default 70). |
| **Placeholder Images** | **Logo placeholder**, **Episode preview placeholder**, **VOD/Series poster placeholder** | Your own images for items with no artwork. |

**Clear Expired Logo Cache** and **Clear All Logo Cache** are at the top. **Manage Assets** opens **Tools → Assets**, where you can upload images to use as logos.

## Backups

| Setting | What it does |
|---|---|
| **Enable Automatic Database Backups** | Back up the database on a schedule. |
| **Backup Schedule** | When to back up, as a cron schedule. |
| **Max Backups**, **Delete Backups After (Days)** | How many to keep, and for how long. `0` means no limit. |

Backups are listed, downloaded, uploaded, and restored under **Tools → Backup & Restore**. See [Users, Backups, and Tools](admin-tools#backups).

## SMTP

Settings for sending email, such as password resets: **SMTP Host**, **SMTP Port**, **SMTP Username**, **SMTP Password**, **SMTP Encryption**, and **SMTP From Address**. **Send Test Email** at the top checks them.

## API

**Allow access to API docs** shows the API documentation at `/docs/api` (the **API Docs** button). The API works either way. **Manage API Tokens** opens **Tools → API Tokens**, where you create tokens for scripts.

## Cache

| Setting | Default | What it does |
|---|---|---|
| **Enable cache** | Off | Show the **Cache Now** actions, and play downloaded copies. See [Cached Content](cached-content). |
| **Cache retention mode** | Automatic | When cached files are deleted. Playlists can override it. |
| **Share cache across playlists by default** | Off | The default for new playlists. |

## Integrations

### TMDB

| Setting | What it does |
|---|---|
| **TMDB API Key** | Your TMDB key. **Test Connection** checks it, and **Get API Key** links to TMDB. |
| **Search Language** | The language of titles and descriptions. |
| **Auto-lookup on metadata fetch**, **Auto-lookup scope** | Look up TMDB details during each sync, for enabled items, new items, or both. |
| **Auto-enrichment on request** | Look up an item the first time someone opens it, instead of during sync. |
| **Auto-create groups/categories from TMDB genres** | File items under their TMDB genre. |
| **Rate Limit (requests/second)** | Stay under TMDB's limits on large libraries. |
| **Match Confidence Threshold (%)**, **Minimum Vote Count** | How strict matching is, and how many votes a rating needs before it's shown. |
| **Title Cleaning for TMDB Lookup** | Text to strip from VOD and series titles before searching, like `EN - `. |

See [TMDB Integration](/docs/integrations/tmdb_integration).

### AIOStreams

**Rate Limit (requests/minute)** (default 20) and **Max Failover Candidates** (default 3), for every [AIOStreams](/docs/integrations/aiostreams_integration) integration.

### MediaFlow Proxy

[MediaFlow Proxy](https://github.com/mhdzumair/mediaflow-proxy) is a separate proxy you can use instead of M3U Proxy, for example on ElfHosted.

| Setting | What it does |
|---|---|
| **Proxy URL**, **Proxy Port (Alternative)** | Your MediaFlow Proxy's address. **Test connection** checks it. |
| **API Password** | The `API_PASSWORD` set on MediaFlow Proxy. |
| **Proxy User Agent for Media Streams**, **Use Proxy User Agent for Playlists (M3U8/MPD)** | The user agent MediaFlow sends to providers. |
| **Automatically Rewrite Stream URLs** | Route stream links in your playlists and Xtream API through MediaFlow, for playlists not already using M3U Proxy. |

Once set up, each playlist's page has a **MediaFlow Proxy** tab with its MediaFlow M3U and EPG links.

## AI Copilot

The [AI Copilot](/docs/ai-copilot/overview): **Enable AI Copilot**, **Enable AI Copilot Management**, the provider, model, API key, and base URL, the **System Prompt**, **Enabled Tools**, and **Quick Actions**. See [Configuration](/docs/ai-copilot/configuration).

## Alerts

Send errors and other events to Discord, Slack, or Telegram. See [Alerts](alerts).
