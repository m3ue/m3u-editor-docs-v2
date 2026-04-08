---
sidebar_position: 8
description: Configure multiple server URLs for Xtream playlists with automatic failover
tags:
  - Playlists
  - Xtream
  - Reliability
title: Xtream DNS Failover
---

# Xtream DNS Failover

M3U Editor supports configuring multiple server URLs for Xtream Codes playlists. When the primary server is unreachable, the application will automatically try the next URL in the list — no manual intervention required.

This is useful when your IPTV provider supplies backup server addresses, or when you want to load-balance across multiple DNS entries pointing to the same service.

## How It Works

Each Xtream playlist has a **primary URL** and an optional list of **fallback URLs**. When M3U Editor makes a request to the primary URL and it fails (connection error, timeout, or HTTP error response), it will:

1. Try each fallback URL in order.
2. On success, **promote** the working URL to primary and persist the change to the database, so future requests use the new primary without delay.
3. If all URLs fail, the operation is aborted and an error is reported.

URL promotion is permanent — the working URL stays as primary until another failover or until you reorder them manually.

## Adding Fallback URLs

1. Navigate to **Playlists** in the sidebar.
2. Open the edit page for an Xtream playlist.
3. Scroll to the **DNS failover URLs** section.
4. Click **Add URL** and enter an alternative server address.
5. Repeat for each additional URL (up to 10 fallbacks supported).
6. Use the drag handles to reorder fallback priority.
7. Click **Save**.

:::tip
Enter only the base server URL, e.g. `https://backup.example.com:8080`. Do not include path or credentials — these are taken from the primary playlist configuration.
:::

## Health Status Panel

When at least one fallback URL is configured, a live health status panel appears on the playlist edit page. It shows:

- **Online / Offline** status for each URL
- **Response time** (ms) for reachable URLs
- Which URL is currently marked as **Primary**
- Error details for unreachable URLs

The panel updates automatically every 5 seconds. You can also trigger an immediate check by clicking **Check All**.

Health check results are cached for 5 minutes to avoid hammering your servers. The cache is refreshed when you load the edit page or click **Check All**.

## URL Rotation Behaviour

Failover follows a round-robin rotation:

- If the current primary fails, the next URL in the ordered list is tried.
- The list wraps around cyclically, so all URLs are eventually tried.
- Once a working URL is found, it is promoted to primary and the previously-failed URL is moved to the fallback list.

This means over time, the list self-organizes to keep the fastest/most-reliable URL at the top.

## Limitations

- Fallback URLs are only available for **Xtream Codes API** playlists — not M3U URL or file-based playlists.
- Up to **10** fallback URLs can be configured per playlist.
- Health checks use the same credentials (username/password) as the primary URL.
- SSL verification follows the playlist's existing SSL setting.

## Troubleshooting

### Failover is not triggering

- Check that the fallback URLs are saved correctly on the playlist edit page.
- Verify the URLs are reachable using the **Check All** button in the health panel.
- Ensure URLs include the correct port number and scheme (`http://` or `https://`).

### Health panel shows all URLs as offline

- Confirm your network/Docker configuration allows outbound connections to the provider servers.
- Try the URL directly in a browser to rule out a credential or provider issue.
- Check your SSL settings — if the provider uses a self-signed certificate you may need to disable SSL verification on the playlist.

### Promoted URL reverted after container restart

This should not happen — promoted URLs are persisted to the database immediately after a successful failover. If you observe this, verify your database volume is correctly mounted and persisted.
