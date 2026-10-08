---
sidebar_position: 10
description: Request shows and movies through Sonarr and Radarr, for you and your guests, and follow their downloads.
title: Sonarr and Radarr
tags:
  - Integrations
  - Sonarr
  - Radarr
  - Arrs
  - Downloads
---

# Sonarr and Radarr

Connect [Sonarr](https://sonarr.tv) and [Radarr](https://radarr.video) to request TV shows and movies from inside M3U Editor, and let the people you share playlists with request them too. You can search, browse what's trending through TMDB, and watch downloads progress across all your servers.

## Prerequisites

- A running Sonarr instance (port `8989` default) and/or Radarr instance (port `7878` default)
- The API key from each server
- The **Use Integrations** permission on your user account (admins have it)

## Add an Integration

1. In M3U Editor, go to **Integrations → Media Servers** and open the **Sonarr & Radarr** tab
2. Click **Add Sonarr / Radarr**
3. Fill in the **Connection** details:

| Field | Description |
|---|---|
| **Display Name** | A friendly label (e.g., `Sonarr - 1080p TV`, `Radarr - 4K Movies`) |
| **Type** | Select `Sonarr` or `Radarr` *(cannot be changed after creation)* |
| **Server URL** | Full URL to your instance (e.g., `http://192.168.1.42:8989`) |
| **API Key** | In Sonarr or Radarr, under **Settings → General → API Key** |

4. Click **Test Connection & Discover** to verify the connection and load available quality profiles and root folders
5. Under **Options**, select:
   - **Quality Profile**: the profile used when adding content
   - **Root Folder**: where new content is saved
6. Optionally turn on **Allow Guest Requests** and the [caching options](#using-an-arr-for-caching)
7. Click **Save**

Integrations are created and edited in a slide-over. The table has quick toggles for **Enabled**, **Guest**, and **Caching**.

:::tip
The **Type** (Sonarr / Radarr) is locked after creation. Create separate integrations for TV and movies.
:::

## Discover & Request Content

Go to **Integrations → Media Servers → Request Content** to find and request content.

### Searching

- Type a title in the search bar. Every enabled integration is searched at once.
- Results show whether it's TV or a movie, its status in Sonarr or Radarr, and what you can do

### Browsing via TMDB

When a TMDB API key is configured in **Settings**, a **Discover** section appears with genre-based browsing for popular and trending content, separate for movies and TV shows.

### Requesting Content

From any search or discover result:

1. Click the result to open the **Detail** panel
2. For **TV shows**, select which seasons to add
3. Click **Add to Sonarr** / **Add to Radarr**
4. The item is added using the quality profile and root folder configured on the integration

For TV shows you can also run an **Interactive Search** on a specific episode, which has Sonarr search all its indexers for that episode right away.

## Download Queue

Go to **Integrations → Download Queue** to see live download status across all your Sonarr and Radarr servers. The page auto-refreshes every 10 seconds.

Each item shows:
- Title, series, and episode
- Download client and current progress
- Status (`Downloading`, `Completed`, `Warning`, `Failed`)

## Webhook Notifications

A webhook lets Sonarr or Radarr push status updates to M3U Editor as they happen. After saving the integration, open it again: the **Webhook** section shows the URL to use.

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

Three switches must be on for a guest to request content:

1. **Allow Guest Requests** on the Sonarr or Radarr integration.
2. **Enable Content Requests** in the playlist's **Requests** tab.
3. **Content Requests** on the guest's [Playlist Auth](/docs/resources/playlist-auth#what-a-login-can-use). **Auto-approve Content Requests** there skips your approval.

Guests then get a **Request Content** page in the [guest portal](/docs/resources/playlist-auth#guest-portal). Their requests use the integration's quality profile and root folder.

## Troubleshooting

**"Test Connection" fails**
- Verify the server URL includes the correct scheme (`http://` or `https://`) and port
- Confirm the API key is correct. It's under **Settings → General** in Sonarr or Radarr.
- Ensure Sonarr/Radarr is accessible from the M3U Editor host (check firewall / Docker networking)

**Quality profiles or root folders are empty after test**
- Use the **Sync Profiles & Folders** action on the integration's row to re-fetch them
- Confirm at least one quality profile and one root folder are set up in Sonarr or Radarr

**Guest users can't see the request button**
- Check that **Allow Guest Requests** is enabled on the integration
- Check that **Enable Content Requests** is on in the playlist's **Requests** tab, and **Content Requests** is on for their Playlist Auth

**Register Webhook fails**
- The arr must be able to reach the Webhook URL. If you're browsing M3U Editor at `localhost`, open it at its LAN address and try again
- Check Docker networking between the arr container and M3U Editor

**Download queue is empty**
- Confirm Sonarr or Radarr has active downloads in its own queue
- The queue page only shows items actively in the download client queue

## Related Documentation

- [Cached Content Downloads](../advanced/cached-content.md)
- [DVR Integration](./dvr_integration.md)
