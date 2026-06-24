---
sidebar_position: 8
description: Integrate Sonarr and Radarr to request and manage TV show and movie downloads
title: Sonarr & Radarr (Arrs) Integration
hide_title: true
tags:
  - Integrations
  - Sonarr
  - Radarr
  - Arrs
  - Downloads
---

# Sonarr & Radarr (Arrs) Integration

:::note Experimental Feature
The Sonarr & Radarr integration is currently available on the **experimental** branch only.
:::

M3U Editor integrates with [Sonarr](https://sonarr.tv) and [Radarr](https://radarr.video) to let you request TV shows and movies for download directly from the editor — including from the guest panel. Once connected, you can search content, browse by genre via TMDB, add items to your download queue, and monitor active downloads across all your *arr servers.

**Key Features:**
- Connect multiple Sonarr and/or Radarr instances
- Search and request content from a unified discovery UI
- TMDB-powered browse/discover mode (when a TMDB API key is configured)
- Interactive episode search — trigger a manual release search for specific episodes
- Download queue monitoring with live status updates (refreshes every 10 seconds)
- Webhook notifications for real-time queue events (grab, download, etc.)
- Guest panel support — guests can request content on playlists where requests are enabled
- Quality profile and root folder selection per integration

## Prerequisites

- A running Sonarr instance (port `8989` default) and/or Radarr instance (port `7878` default)
- API keys from each *arr server
- The `use_integrations` permission granted to your user account (Admin → Users → Permissions)

## Add an Integration

1. In M3U Editor, expand the sidebar and navigate to **Integrations → Sonarr & Radarr**
2. Click **New Sonarr/Radarr**
3. Fill in the **Connection** details:

| Field | Description |
|---|---|
| **Display Name** | A friendly label (e.g., `Sonarr - 1080p TV`, `Radarr - 4K Movies`) |
| **Type** | Select `Sonarr` or `Radarr` *(cannot be changed after creation)* |
| **Server URL** | Full URL to your instance (e.g., `http://192.168.1.42:8989`) |
| **API Key** | Found in your *arr server under **Settings → General → API Key** |

4. Click **Test Connection & Discover** to verify the connection and load available quality profiles and root folders
5. Under **Options**, select:
   - **Quality Profile** — the default profile used when adding content
   - **Root Folder** — where new content will be placed on disk
6. Optionally toggle **Allow Guest Requests** to let guests request content via this integration
7. Click **Save**

:::tip
The **Type** (Sonarr / Radarr) is locked after creation. Create separate integrations for TV and movies.
:::

## Discover & Request Content

Navigate to the **Integrations → Download Queue** page or use the integrated search available within the app to find and request content.

### Searching

- Type a title in the search bar — M3U Editor queries all enabled *arr integrations simultaneously
- Results show the content type (TV / Movie), current status in *arr, and available actions

### Browsing via TMDB

When a TMDB API key is configured in **Settings**, a **Discover** section appears with genre-based browsing for popular and trending content, separate for movies and TV shows.

### Requesting Content

From any search or discover result:

1. Click the result to open the **Detail** panel
2. For **TV shows**, select which seasons to add
3. Click **Add to Sonarr** / **Add to Radarr**
4. The item is added using the quality profile and root folder configured on the integration

For TV shows you can also trigger an **Interactive Search** on specific episodes — this forces *arr to search all configured indexers for a particular episode release immediately.

## Download Queue

Navigate to **Integrations → Download Queue** to see live download status across all your Sonarr and Radarr servers. The page auto-refreshes every 10 seconds.

Each item shows:
- Title, series, and episode
- Download client and current progress
- Status (`Downloading`, `Completed`, `Warning`, `Failed`)

## Webhook Notifications

Configure a webhook in your *arr server to push real-time status updates to M3U Editor:

1. In Sonarr/Radarr, go to **Settings → Connect → + (Add Connection) → Webhook**
2. Set the **URL** to the webhook URL shown on the integration's **Webhook** section (visible after saving)
3. Enable the following triggers:
   - **On Grab**
   - **On Download**
   - **On Movie Added** *(Radarr)*
   - **On Manual Interaction Required**
4. Save in Sonarr/Radarr

With webhooks configured, the download queue in M3U Editor updates in near-real time rather than relying solely on polling.

## Guest Requests

When **Allow Guest Requests** is enabled on an integration, and the playlist has **Content Requests** enabled (Playlists → Edit → Request Settings), guests can:

- Search and browse content in the guest panel
- Add TV shows or movies to the download queue via that integration

Guest requests use the same quality profile and root folder as the admin-configured defaults.

## Troubleshooting

**"Test Connection" fails**
- Verify the server URL includes the correct scheme (`http://` or `https://`) and port
- Confirm the API key is correct — find it under **Settings → General** in Sonarr/Radarr
- Ensure Sonarr/Radarr is accessible from the M3U Editor host (check firewall / Docker networking)

**Quality profiles or root folders are empty after test**
- Use the **Sync Profiles & Folders** action on the integration's edit page to re-fetch them
- Confirm at least one quality profile and one root folder are configured in your *arr server

**Guest users can't see the request button**
- Check that **Allow Guest Requests** is enabled on the integration
- Check that **Content Requests** is enabled on the playlist under **Playlists → Edit → Request Settings**

**Download queue is empty**
- Confirm your *arr server has active downloads in its own queue
- The queue page only shows items actively in the *arr download client queue

## Related Documentation

- [DVR Integration](./dvr_integration.md)
- [Alerts Integration](./alerts.md)
- [Roadmap](./roadmap_integrations.md)
