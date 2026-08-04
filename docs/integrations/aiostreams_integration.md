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

:::note Version Requirement
AIOStreams integration requires **v0.12.45+**.
:::

[AIOStreams](https://github.com/viren070/aiostreams) is a self-hosted Stremio addon aggregator that sources streaming links for movies and TV series from debrid services such as **Real-Debrid**, **Torbox**, **AllDebrid**, and others. Unlike the Emby, Plex, or Jellyfin integrations — which sync a personal media library — AIOStreams is primarily **on-demand**: content is discovered by browsing catalogs (e.g. Popular Movies, Trending Series, Netflix) and streamed at play time.

You can also explicitly **add specific movies or series to your library** from the browser (see [Adding Content to Your Library](#adding-content-to-your-library)). Added items become real entries on the integration's own Playlist, so they show up in the normal Movies/Series listings and play through any Xtream or M3U client — not just the in-app AIOStreams browser.

:::note Prerequisites
- A running AIOStreams instance (self-hosted or provided). See the [AIOStreams GitHub repository](https://github.com/viren070/aiostreams) for setup instructions.
- Your AIOStreams manifest URL, which embeds your auth tokens — no separate API key is needed.
:::

## How It Works

M3U Editor connects to your AIOStreams instance using the **Stremio addon protocol**. When you paste your manifest URL, M3U Editor fetches the available catalogs (Popular Movies, Trending, Netflix, etc.) and stores them. When simply browsing, streams are fetched at play time using the item's IMDb ID and nothing else is stored locally — unless you explicitly add an item to your library (see [Adding Content to Your Library](#adding-content-to-your-library)).

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

## Adding Content to Your Library

Every AIOStreams integration automatically provisions its own dedicated Playlist. Browsing a catalog is still on-demand and doesn't touch this playlist, but from any movie or series detail page in the browser (**Media Server Integrations → your integration → Browse Catalog**) an admin can click **Add to Library** (movies) or **Add Series to Library** (series) to create a persistent entry instead.

What happens next:

1. The movie/series is created immediately (title, poster, plot, cast, etc. via AIOStreams metadata) so it shows up right away in the **Movies**/**Series** resources and in Xtream/M3U output — with its stream still resolving in the background.
2. A background job looks up available streams, ranks them, and keeps up to **3** as an ordered failover chain (stored against the item, not just a single URL). If playback of the primary stream ever fails, M3U Editor automatically falls through to the next candidate — no re-fetching from AIOStreams is needed for ordinary link rot.
3. If AIOStreams returns no streams yet (addons sometimes need a moment to warm up), the job retries a few times over about a minute before marking the item **Failed** rather than silently dropping it.

### Resolution status

Movies and episodes added this way carry an **AIO Resolution Status**, visible as a column in the AIOStreams relation manager tables on the integration's edit page:

| Status | Meaning |
|---|---|
| `pending` | Just added; stream resolution hasn't run yet. |
| `partial` | Resolved, but fewer than 3 failover candidates were found. |
| `resolved` | Fully resolved with a healthy failover chain. |
| `failed` | No streams were found after retrying. Use **Rescan** to try again. |
| `scheduled` | A future/unaired episode — see below. |

`partial` is not a broken state — the item has a working stream, just fewer failover candidates than the target of 3. It's treated the same as `resolved` by the automatic sweep below (see why in that section); use **Rescan** if you want to check again for more candidates.

### Rescanning

If a title is stuck on `failed` (or you just want to re-check for better/additional sources), use the **Rescan** action — available both as a row action and, for selecting several at once, as a bulk action — on the AIOStreams **Movies** and **Series** tables under the integration's edit page. Rescanning a series re-checks every aired episode, including already-`resolved`/`partial` ones, in case better candidates have since appeared.

A low-frequency background sweep also runs hourly and automatically retries anything left in `failed` or a due `scheduled` state, so most stuck items resolve themselves without manual intervention. To avoid the risk of debrid services banning accounts for repeatedly re-checking already-working links, this sweep never touches anything already `resolved` or `partial` — both already have at least one working stream, so re-querying AIOStreams for them on a timer would be exactly the kind of "poking an active link" pattern some debrid providers ban for. That's what the manual **Rescan** action is for — it's a deliberate, user-initiated re-check rather than an automatic one.

### Notifications

Every trigger of stream resolution — **Add to Library**, **Rescan** (row or bulk), and the hourly sweep — reports back with a single summary notification once it finishes, e.g. *"8 episodes fetched | 4 resolved | 2 failed"* for a series, or *"3 movies fetched | 2 resolved | 1 failed"* for a movie batch. You'll also get a notification immediately if a sync fails outright (e.g. the AIOStreams instance is unreachable). Notifications appear in the bell icon in the admin panel.

### Unaired episodes

When you add a series, only episodes that have already aired are resolved right away. Future/unaired episodes are added as `scheduled` and left **disabled** (they typically have no plot, poster, or stream yet), so they don't appear as playable placeholders. Once an episode's air date passes, the hourly sweep (or a manual **Rescan**) resolves it and re-enables it automatically.

## Probing and Merging Restrictions

AIOStreams-added movies and episodes already carry their own internal failover chain (see above), so the usual **Probe Enabled** and **Merge Enabled** toggles are always **off** and can't be turned on for this content — in the Movies/Series/Episodes tables, in the channel/series edit forms, and via any bulk "Enable Probing"/"Enable Merge" action. The **Failover Channels** section is hidden entirely on AIOStreams-added movies for the same reason, since failover is already managed internally.

If you select a mix of regular and AIOStreams content in a bulk "Enable Probing"/"Enable Merge" action, only the regular content is affected — the AIOStreams items are silently skipped.

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
| Sync required | Yes — library sync job | No — browsing is on-demand; adding to the library is a one-time, per-item action |
| Content stored in M3U Editor | Yes (channels, VOD) | Only what you explicitly add via **Add to Library** |
| Probing / Merging | Configurable per item | Always disabled — AIOStreams manages its own failover chain |
| Stream selection | Single stream per item | Multiple options via stream picker (browse) or an automatic failover chain (added-to-library items) |
| Auth method | Host + API key | Manifest URL (tokens embedded) |
| Schedule tab | Full sync schedule | Manifest refresh only |

## Troubleshooting

**"No catalogs discovered yet"** — Click **Fetch Catalogs** (or **Test Connection & Fetch Catalogs**) after entering your manifest URL. The catalogs only populate after a successful connection test.

**Manifest URL rejected** — Ensure the URL ends in `/manifest.json` and is reachable from your M3U Editor host. If AIOStreams runs behind a reverse proxy, verify SSL and routing are configured correctly.

**Streams not loading in the TV app** — The stream fetch happens at play time and depends on your debrid service returning results. Check that your debrid provider account is active and that AIOStreams is functioning correctly by testing the stream URL directly in a browser.

**Continue watching not updating** — Watch progress is synced to the M3U Editor server. If progress isn't reflected, ensure the TV app is connected to the correct playlist and the AIOStreams integration is enabled.

**An added item is stuck on "Failed" or "Pending"** — Use the **Rescan** row or bulk action on the AIOStreams Movies/Series tables to retry immediately, or wait for the hourly background sweep to retry it automatically. This usually means AIOStreams/your debrid provider returned no streams the last time it was checked.

**An item is stuck on "Partial" and never changes on its own** — This is expected: `partial` already has a working stream, so (like `resolved`) it's deliberately excluded from the automatic hourly sweep to avoid repeatedly re-querying an already-working item. Use **Rescan** if you want to manually check for additional failover candidates.

**Probe/Merge toggle is greyed out** — This is expected for AIOStreams-added content: it manages its own internal failover chain, so probing and merging are disabled and can't be re-enabled, even via bulk actions.

**An episode shows as disabled with no plot/poster** — It hasn't aired yet. AIOStreams-added series only resolve and enable episodes once their air date has passed; unaired episodes are added as `scheduled` and enable themselves automatically once due.
