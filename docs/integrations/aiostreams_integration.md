---
sidebar_position: 9
description: Browse and stream on-demand content from Real-Debrid, Torbox, and other debrid services via AIOStreams
title: AIOStreams Integration
hide_title: true
tags:
  - Integrations
  - AIOStreams
  - Stremio
  - Real-Debrid
  - Torbox
  - Debrid
---

# AIOStreams Integration

[AIOStreams](https://github.com/viren070/aiostreams) is a self-hosted Stremio addon aggregator that sources streaming links for movies and TV series from debrid services such as **Real-Debrid**, **Torbox**, **AllDebrid**, and others. Unlike the Emby, Plex, or Jellyfin integrations — which sync a personal media library — AIOStreams is **on-demand only**: content is discovered by browsing catalogs (e.g. Popular Movies, Trending Series, Netflix) and streamed at play time without storing anything locally.

:::note Prerequisites
- A running AIOStreams instance (self-hosted or provided). See the [AIOStreams GitHub repository](https://github.com/viren070/aiostreams) for setup instructions.
- Your AIOStreams manifest URL, which embeds your auth tokens — no separate API key is needed.
:::

## How It Works

M3U Editor connects to your AIOStreams instance using the **Stremio addon protocol**. When you paste your manifest URL, M3U Editor fetches the available catalogs (Popular Movies, Trending, Netflix, etc.) and stores them. Streams are fetched at play time using the item's IMDb ID — no content is synced or stored locally.

Your AIOStreams manifest URL contains all necessary authentication embedded in the path, so credentials are never exposed to clients.

## Add the Integration

1. Go to **Integrations → Media Server Integrations** and click **New Integration**.
2. Select **AIOStreams** as the type.
3. Enter a descriptive **Name** (e.g. `My AIOStreams`).
4. Paste your **Manifest URL** — this is the full URL ending in `/manifest.json` that your AIOStreams instance provides (e.g. `https://your-aiostreams.example.com/stremio/uuid/token/manifest.json`).
5. Assign the integration to a **Playlist** to control which users can access it.
6. Click **Test Connection & Fetch Catalogs** to verify the URL and discover available catalogs.

:::tip Finding Your Manifest URL
Your AIOStreams manifest URL is displayed on the AIOStreams web UI dashboard. Copy the full URL — it contains your auth tokens and should be treated like a password.
:::

## Catalog Configuration

After a successful connection test, M3U Editor displays all catalogs discovered from your manifest — such as Popular Movies, Trending Series, Netflix, Amazon, and any others configured in your AIOStreams instance.

### Enable All Catalogs

When **Enable All Catalogs** is on (the default), every current and future catalog from your manifest is automatically available to users. This is the simplest option — as you add or change catalogs in AIOStreams, they appear in the TV app automatically.

### Select Specific Catalogs

Turn off **Enable All Catalogs** to choose exactly which catalogs are exposed. Use the checklist to enable or disable individual catalogs. Each entry shows the catalog name and type (Movie or Series).

## Auto Refresh

AIOStreams catalogs can change over time (new services added, catalog IDs updated). The **Auto Refresh** schedule controls how often M3U Editor re-fetches the manifest to pick up changes. Configure this under the **Schedule** tab of the integration.

You can also trigger an immediate refresh at any time using the **Sync Now** action on the integration list, which re-fetches the manifest and updates the available catalogs without affecting any other data.

## TV App Experience

When a playlist with an AIOStreams integration is used in the m3u-tv app, users gain access to a dedicated **AIOStreams** tab. From there they can:

- Browse catalogs grouped by type (Movies, Series)
- Search across all connected catalogs
- View full item detail pages with metadata, ratings, cast, and backdrop art
- Select from multiple stream options (quality, source, audio) via a stream picker
- Track watch progress across movies and series episodes — including resume, progress bars, and continue watching rows

### Continue Watching

Movies and in-progress episodes appear in the **Continue Watching** section. Tapping a card shows a resume modal (resume from where you left off, or start from the beginning), then opens the stream picker to play directly. Watch progress is managed server-side and cleared remotely — the app always reflects the current server state.

### Stream Picker

Because AIOStreams returns multiple stream options per item (different quality tiers, debrid providers, audio tracks), the TV app shows a **stream picker** sheet before playback begins. Each option displays the source name and quality details so users can choose their preferred stream.

## Differences from Media Server Integrations

| Feature | Emby / Plex / Jellyfin | AIOStreams |
|---|---|---|
| Content source | Your personal media library | Debrid-cached content |
| Sync required | Yes — library sync job | No — on-demand only |
| Content stored in M3U Editor | Yes (channels, VOD) | No |
| Stream selection | Single stream per item | Multiple options via stream picker |
| Auth method | Host + API key | Manifest URL (tokens embedded) |
| Schedule tab | Full sync schedule | Manifest refresh only |

## Troubleshooting

**"No catalogs discovered yet"** — Click **Fetch Catalogs** (or **Test Connection & Fetch Catalogs**) after entering your manifest URL. The catalogs only populate after a successful connection test.

**Manifest URL rejected** — Ensure the URL ends in `/manifest.json` and is reachable from your M3U Editor host. If AIOStreams runs behind a reverse proxy, verify SSL and routing are configured correctly.

**Streams not loading in the TV app** — The stream fetch happens at play time and depends on your debrid service returning results. Check that your debrid provider account is active and that AIOStreams is functioning correctly by testing the stream URL directly in a browser.

**Continue watching not updating** — Watch progress is synced to the M3U Editor server. If progress isn't reflected, ensure the TV app is connected to the correct playlist and the AIOStreams integration is enabled.
