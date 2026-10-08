---
sidebar_position: 5
description: Serve a playlist under a second identity, with its own login, provider credentials, channel filter, and output settings.
tags:
  - Resources
  - Playlists
  - Advanced
title: Playlist Aliases
---

# Playlist Aliases

An alias serves an existing playlist under a second identity. It has its own URLs and login, and can change what's exposed and how it's streamed, while the content stays in the original playlist.

Common uses:

- **A second provider line.** Your provider gives you two logins. Point an alias at your playlist with the second line's credentials, so two people can watch at once without importing everything twice.
- **A filtered lineup.** Give someone only the sports and news groups.
- **Different streaming settings.** Transcode for a remote device while your home players get the original stream.

An alias can point at a regular playlist, a [Custom Playlist](custom-playlist), or a [Merged Playlist](merged-playlist).

## Create one

Go to **Playlist → Playlist Aliases**. The page has two tabs, **Aliases** and **[Bouquets](#bouquets)**. On **Aliases**, choose **New playlist alias**, then in the **General** tab pick the **Playlist type** and the **Playlist**.

*(v0.13.3+)* Aliases open as a full page with these tabs:

| Tab | Contains |
|---|---|
| **General** | Name, description, user agent, unique identifier, and the source playlist |
| **Auth** | The alias's own login ([below](#its-own-login)) |
| **Providers** | Provider credentials and URL replacement ([below](#provider-credentials-and-url-replacement)) |
| **Channel Filter** | Which groups it exposes, and in what order ([below](#channel-filter)) |
| **Output** | Output types, the proxy, connection limits, transcoding, and HTTP headers, as on a [playlist](playlists#output) |

**Duplicate** copies an alias with its settings and *(v0.13.2+)* its bouquets. The login isn't copied, so set a new one.

## Its own login

In the **Auth** tab, give the alias a **Username** and **Password** for the Xtream API, and optionally an **Expiration (date & time)**. They must be unique across all aliases and [Playlist Auths](playlist-auth), and can't contain spaces, `/`, `\`, `?`, `#`, or `%`, because Xtream players put them in every stream URL.

The **Auth** tab also has the alias's [default login](playlist-auth#default-login) setting, and [Playlist Auths](playlist-auth) can be assigned to an alias from the Playlist Auth's side.

## Provider credentials and URL replacement

The **Providers** tab has an entry for each provider URL the source playlist's streams use. For each one, you can:

- **Swap credentials:** enter a different **Xtream API Username** and **Xtream API Password**, such as a second line from the same provider. **Test connection** next to the URL checks them and shows the connection limit and expiry.
- **Replace the provider URL:** turn on **Replace provider URL** and enter a **Replacement URL**. Players get this address instead of the provider's, with the rest of the stream URL kept. Use it for a VPN-only address or another host for the same provider.

You can do both. With **Replace provider URL** on, the credentials are optional; leave them empty to keep the source playlist's.

:::note With the proxy
When the stream proxy is on, the proxy fetches from the replacement URL, so the proxy must be able to reach it.
:::

**Inherit DNS failover from source playlist** makes the alias follow the source playlist when it [fails over](xtream-dns-failover) to a backup URL, while keeping its own credentials.

## Channel filter

The **Channel Filter** tab limits which live groups, VOD groups, and series categories the alias exposes. Leave it empty to expose everything. The filter applies everywhere the alias is used: M3U, the guide, the Xtream API, and the guest portal.

For an alias of a Merged Playlist, choices are tracked per source, so picking one provider's "Sports" group doesn't include another provider's. The picker shows a **Source Playlist** column when that matters.

### Custom group order

To deliver live groups in your own order instead of the playlist's, turn on **Sort groups in custom order** under **Live channel groups** and drag the groups into place. The list includes groups from assigned bouquets, *(v0.13.2+)* with a **Bouquet** column showing where each came from.

New groups are added to the end. **Reset to playlist order** starts over from the source playlist's order. VOD and series always follow the source playlist's order.

## Bouquets

A bouquet is a named, reusable set of groups and categories from one playlist. Instead of picking the same groups on every alias, assign them a bouquet.

**Create one** on the **Bouquets** tab:

1. Choose **New bouquet**, enter a **Name**, and pick the **Target Playlist** (a regular or Custom Playlist). The playlist can't be changed later.
2. Select the **Live channel groups**, **VOD groups**, and **Series categories** to include.
3. Optionally, turn on **Automatically include new live groups** or **Automatically include new VOD groups**, so groups the provider adds join the bouquet on each sync. *(v0.13.3+)* To only include some of them, add regex patterns under **Only include new live groups matching**, for example `^FR\|`. Patterns are case-sensitive and have no delimiters.

You can also add groups to a bouquet from the **Groups**, **VOD Groups**, and **Categories** lists with **Add to Bouquet**.

**Assign it** in an alias's **Channel Filter** tab, under **Assigned bouquets**. A channel is allowed if its group is in **any** assigned bouquet **or** in the alias's own selections, so a bouquet only ever adds. Editing a bouquet updates every alias that uses it.

Bouquets look after themselves:

- When a provider renames a group, bouquets follow the new name.
- If a group disappears, it stays in the bouquet and works again if the provider brings it back. The bouquet's page flags missing groups, and **Clean up missing** removes them.
- A group you removed from an auto-include bouquet stays removed, *(v0.13.3+)* even if the provider re-issues it under a new ID.

Bouquets can't be assigned to aliases of Merged Playlists. Use the per-source channel filter for those.
