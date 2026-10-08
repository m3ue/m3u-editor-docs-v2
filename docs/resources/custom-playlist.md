---
sidebar_position: 3
description: Build your own lineup from channels, movies, and series across all your playlists, with your own groups and order.
tags:
  - Resources
  - Playlists
  - Customization
title: Custom Playlists
---

# Custom Playlists

A Custom Playlist is a lineup you build by hand, picking channels, movies, and series from any of your playlists. It has its own groups, order, and channel numbers, and its own outputs, so you can give one to each person or room: a kids' lineup, a sports package, or your favorites from three providers.

Custom Playlists don't copy channels. They point at the originals, so when a source playlist syncs, the streams stay current.

:::info Custom or merged?
A **Custom Playlist** holds only what you add to it. A [Merged Playlist](merged-playlist) takes everything from the playlists you pick. To expose part of one playlist with its own login, an [Alias](playlist-alias) is often simpler.
:::

## Create one

Go to **Playlist → Custom Playlists** and choose **New custom playlist**. Only a name is needed; the other tabs can wait.

## Add content

There are three ways to fill it:

- **From the channel lists:** in **Live Channels → Channels** (or VOD, or Series), select items, open the bulk actions, and choose **Add to Custom Playlist**. You can put them straight into a custom group.
- **From the Custom Playlist:** on its **Channels**, **VOD**, or **Series** tab, choose **Attach** and search for items.
- **Automatically after each sync:** in a source playlist's **Processing** tab, add an **Auto-Add to Custom Playlist** rule. It keeps chosen groups in the Custom Playlist, including channels the provider adds later.

You can also add streams of your own with **Create Custom Channel** on the **Channels** tab.

## Organize it

Each tab lists the Custom Playlist's items, with your own grouping and order:

- **Add to custom group** (or **Add to custom category** for series) files items under groups that only exist in this playlist. Manage those groups, and their order, on the **Groups** and **Categories** tabs.
- Drag rows to reorder them, or use **Sort Alpha** and **Renumber Channels** on a selection.
- **Detach Selected** removes items from the Custom Playlist. The originals aren't touched.

To re-sort or renumber automatically after each sync, add **Processing Configs** in the **Processing** tab. Each one runs **Sort Alpha** or **Renumber Channels** on all channels, live, or VOD, for all or some groups, in the order you list them.

## Settings

| Tab | What's in it |
|---|---|
| **General** | Name, user agent, short URLs, and the unique identifier used in its URLs |
| **Auth** | [Playlist Auths](playlist-auth) and the [default login](playlist-auth#default-login) |
| **Processing** | Processing Configs (above) |
| **Output** | The same output options as a regular playlist: output types, numbering, VOD and series in M3U, placeholder guides, the proxy, connection limits, and transcoding. See [Playlists](playlists#output). |
| **DVR**, **Requests**, **AIOStreams** | The [DVR](/docs/integrations/dvr_integration), [content requests](/docs/integrations/arrs_integration), and [AIOStreams](/docs/integrations/aiostreams_integration) for this lineup |

**Available Streams** on a Custom Playlist only limits custom channels you created in it; other channels follow their source playlist's limits.

**Duplicate** in the actions menu copies a Custom Playlist with all its settings and content. The copy is independent of the original.

## Manage it from a script

Custom Playlists have their own API, using a token from **Tools → API Tokens** (sent as `Authorization: Bearer <token>`). Find a Custom Playlist's UUID with `GET /user/playlists`.

| Method | Endpoint | Does |
|---|---|---|
| `GET` | `/custom-playlist/{uuid}/channels` | List its channels |
| `POST` | `/custom-playlist/{uuid}/channels` | Add channels: `{"ids": [1, 2, 3], "group": "Sports", "channel_number": 100}` (`group` and `channel_number` optional) |
| `DELETE` | `/custom-playlist/{uuid}/channels` | Remove channels: `{"ids": [1, 2, 3]}` |
| `PATCH` | `/custom-playlist/{uuid}/channels/{id}` | Change a channel's `group`, `channel_number`, or `sort` in this playlist |
| `GET` | `/custom-playlist/{uuid}/groups` | List its groups |
| `POST` | `/custom-playlist/{uuid}/groups` | Create a group: `{"name": "Sports"}` |
| `PATCH` | `/custom-playlist/{uuid}/groups/{id}` | Rename a group (`name`) or move it (`order_column`) |

The full API is documented in the app under **Settings → API → API Docs**.
