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

:::note Version Requirement
The Sonarr & Radarr integration requires **v0.12.45+**.
:::

M3U Editor integrates with [Sonarr](https://sonarr.tv) and [Radarr](https://radarr.video) to let you request TV shows and movies for download directly from the editor — including from the guest panel. Once connected, you can search content, browse by genre via TMDB, add items to your download queue, and monitor active downloads across all your *arr servers.

**Key Features:**
- Connect multiple Sonarr and/or Radarr instances
- Search and request content from a unified discovery UI
- TMDB-powered browse/discover mode (when a TMDB API key is configured)
- Interactive episode search — trigger a manual release search for specific episodes
- Download queue monitoring with live status updates (refreshes every 10 seconds)
- Webhook notifications for real-time queue events (grab, download, etc.), registered in one click
- Optional caching through Radarr/Sonarr instead of the provider *(v0.13.2+)*
- Guest panel support — guests can request content on playlists where requests are enabled
- Quality profile and root folder selection per integration

## Prerequisites

- A running Sonarr instance (port `8989` default) and/or Radarr instance (port `7878` default)
- API keys from each *arr server
- The `use_integrations` permission granted to your user account (Admin → Users → Permissions)

## Add an Integration

1. In M3U Editor, go to **Integrations → Media Servers** and open the **Sonarr & Radarr** tab
2. Click **Add Sonarr / Radarr**
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
6. Optionally turn on **Allow Guest Requests** and the [caching options](#using-an-arr-for-caching)
7. Click **Save**

Integrations are created and edited in a slide-over. The table has quick toggles for **Enabled**, **Guest**, and **Caching**.

:::tip
The **Type** (Sonarr / Radarr) is locked after creation. Create separate integrations for TV and movies.
:::

## Discover & Request Content

Go to **Integrations → Media Servers → Request Content** to find and request content.

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

A webhook lets your *arr server push real-time status updates to M3U Editor. After saving the integration, open it again: the **Webhook** section shows the URL to use.

*(v0.13.2+)* Click **Register Webhook** to add it to Sonarr/Radarr for you. M3U Editor tests the URL first and saves nothing in the arr if the arr can't reach it. **Test Webhook** sends a test from the arr to check an existing webhook.

:::tip
The arr has to be able to reach the Webhook URL. If you opened M3U Editor at `localhost`, the URL will point at `localhost` too. Open the editor at its LAN address and try again.
:::

To set it up by hand instead:

1. In Sonarr/Radarr, go to **Settings → Connect → + (Add Connection) → Webhook**
2. Set the **URL** to the webhook URL shown in the integration's **Webhook** section
3. Enable the following triggers:
   - **On Grab**
   - **On Download**
   - **On Movie Added** *(Radarr)*
   - **On Manual Interaction Required**
4. Save in Sonarr/Radarr

With webhooks configured, the download queue in M3U Editor updates in near-real time rather than relying solely on polling.

## Using an Arr for Caching

*(v0.13.2+)* When [Cached Content Downloads](../advanced/cached-content.md) are enabled, an integration can take over caching for playlists that [prefer media server sources](../resources/playlists.md#media-server-sources). Cache Now and dynamic group caching then add new titles to the arr instead of downloading them from the provider, and playback uses the media server copy once it lands.

| Option | Shown for | What it does |
|---|---|---|
| **Use for caching** | Radarr and Sonarr | Send new cached titles here instead of downloading them from the provider. Titles already in the library are never changed or removed. |
| **Fail back to the provider** *(v0.13.3+)* | Radarr and Sonarr | If a title fails to download, or still isn't downloaded or downloading after 24 hours, download it from the provider instead. The title is unmonitored in the arr; nothing is deleted from it. |
| **Remove after leaving dynamic groups** | Radarr | Remove movies that dynamic group caching added here, files included, once they leave every dynamic group. |

These options only appear when **Enable cache** is on in **Settings → Cache**. See [Caching Through Radarr or Sonarr](../advanced/cached-content.md#caching-through-radarr-or-sonarr) for the full behavior.

## Guest Requests

When **Allow Guest Requests** is enabled on an integration, it applies to every playlist that has **Content Requests** enabled (Playlists → Edit → Request Settings). Guests on those playlists can:

- Search and browse content in the guest panel
- Add TV shows or movies to the download queue via that integration

Guest requests use the same quality profile and root folder as the admin-configured defaults.

## Troubleshooting

**"Test Connection" fails**
- Verify the server URL includes the correct scheme (`http://` or `https://`) and port
- Confirm the API key is correct — find it under **Settings → General** in Sonarr/Radarr
- Ensure Sonarr/Radarr is accessible from the M3U Editor host (check firewall / Docker networking)

**Quality profiles or root folders are empty after test**
- Use the **Sync Profiles & Folders** action on the integration's row to re-fetch them
- Confirm at least one quality profile and one root folder are configured in your *arr server

**Guest users can't see the request button**
- Check that **Allow Guest Requests** is enabled on the integration
- Check that **Content Requests** is enabled on the playlist under **Playlists → Edit → Request Settings**

**Register Webhook fails**
- The arr must be able to reach the Webhook URL. If you're browsing M3U Editor at `localhost`, open it at its LAN address and try again
- Check Docker networking between the arr container and M3U Editor

**Download queue is empty**
- Confirm your *arr server has active downloads in its own queue
- The queue page only shows items actively in the *arr download client queue

## Related Documentation

- [Cached Content Downloads](../advanced/cached-content.md)
- [DVR Integration](./dvr_integration.md)
