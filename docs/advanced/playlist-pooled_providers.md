---
sidebar_position: 7
description: Pool several accounts from the same Xtream provider into one playlist, so more people can watch at once.
tags:
  - Playlists
  - Advanced
  - Xtream
title: Provider Profiles
---

# Provider Profiles

Most providers limit how many streams one account can play at once. If you have several accounts with the same provider, Provider Profiles pools them into one playlist: each new stream goes to an account with a free connection, so the playlist can play as many streams as all the accounts together.

You keep one playlist, one set of channels, and one lineup for your players. M3U Editor swaps in the right account's login for each stream.

:::note Same provider only
Profiles are for several accounts with **one** provider. Their stream addresses must have the same layout, with only the login (and optionally the server) changing. For a second provider, add another playlist and link the two with [Auto-Merge](auto-merge-channels).
:::

## Set it up

Profiles work with Xtream playlists streamed through the [proxy](/docs/proxy/overview), which tracks how many streams each account is using. Turning them on turns on the playlist's proxy.

1. Edit the playlist, open its **Type** tab, and expand **Provider Profiles**.
2. Turn on **Enable Provider Profiles**. The playlist's own login becomes the **Primary Profile**. **Test Primary** checks it and fills in its connection limit.
3. Under **Additional Profiles**, add each extra account:

| Field | What to enter |
|---|---|
| **Profile Name** | A name for you, like "Second account" |
| **Provider URL** | Leave empty to use the playlist's server. Enter another server from the same provider to use that one. |
| **Username**, **Password** | The account's login |
| **Max Streams** | Its connection limit. **Test** checks the login and fills this in. You can set it lower to keep connections free for other apps. |
| **Priority** | Lower numbers are used first. |
| **Enabled** | Turn an account off without removing it. |

4. Save. The playlist's page shows how many streams each account is using.

## Options

| Setting | What it does |
|---|---|
| **Enable Provider Affinity** | Keep sending each player to the account it used last, so channel changes don't hop between accounts. |
| **Bypass Provider Connection Limits** | Try to start streams even when the provider says an account is full. Some providers' reported limits are wrong. |

The playlist's **Available Streams** (in **Output → Streaming Output**) is still the overall limit across all accounts. `0` means no limit beyond the accounts' own.

## Get the most out of your connections

- Viewers watching the same channel share one connection, so ten people watching one game use one account slot.
- **Stop oldest stream when limit reached** in **Settings → Proxy** frees a slot for a new stream when every account is full.
- Set the proxy's **Resolver URL** in **Settings → Proxy**. Pooled accounts use it to keep their stream counts accurate. See [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration#settings-that-affect-the-connection).

## Troubleshooting

| Problem | What to check |
|---|---|
| **Test** fails | The username and password, and the **Provider URL** if you set one. Try the provider's main server. |
| New streams won't start | Every enabled account is at its limit. Check the counts on the playlist's page, wait for a stream to end, or add an account. |
| Streams play on one account but not another | Each account must have the same channels. Some providers give different accounts different packages. |
