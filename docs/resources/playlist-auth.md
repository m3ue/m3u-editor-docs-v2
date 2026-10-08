---
sidebar_position: 6
description: Give each person or device its own login to a playlist, with connection limits, an expiry date, and access to the DVR, requests, and the proxy.
tags:
  - Resources
  - Security
  - Authentication
title: Playlist Auths
---

# Playlist Auths

A Playlist Auth is a username and password for one playlist. Give one to each person or device, and you can limit their streams, set an expiry date, or switch them off, without touching anyone else's.

Every playlist also has a built-in owner login, the [default login](#default-login). Playlist Auths are the extra logins you hand out.

## Create one

Go to **Playlist → Playlist Auths** and choose **New playlist auth**:

| Field | What it's for |
|---|---|
| **Name** | A label for you, like "Living room TV" or "Sam". Players never see it. |
| **Enabled** | Turn the login off without deleting it. |
| **Username**, **Password** | What the person enters in their player. Both are case-sensitive. Avoid spaces and `/ \ ? # %`, since Xtream players put them in every stream URL. |
| **Expiration (date & time)** | The login stops working at this moment. Leave empty to never expire. |
| **Max Connections** | How many streams this login can play at once. Leave empty for unlimited. |
| **Stop Oldest Stream on Limit** | At the limit, stop this login's oldest stream to start the new one, instead of refusing it. When off, the global setting in **Settings → Proxy** applies. |
| **Assigned to Playlist** | The playlist, Custom Playlist, Merged Playlist, or Alias this login opens. |

Each Playlist Auth opens one playlist at a time. Choosing another playlist moves it. You can also assign logins from the playlist's own **Auth** tab, under **Assigned Auths**.

:::note Connection limits need the proxy
**Max Connections** and **Stop Oldest Stream on Limit** are only enforced when the playlist has the [stream proxy](/docs/deployment/m3u-proxy-integration) turned on, since that's how M3U Editor sees what's playing.
:::

## What a login can use

Below the login details, each Playlist Auth has switches for the extra features its user can reach. They're all off by default, and each also needs the feature turned on for the playlist.

| Section | Allows |
|---|---|
| **Proxy Access** | Lets apps like [M3U TV](/docs/m3u-tv/overview) offer proxied playback, and choose which [transcoding profiles](/docs/proxy/transcoding) they may use: all, selected, or none. |
| **DVR Access** | Viewing and scheduling [recordings](/docs/integrations/dvr_integration), with optional **Max Concurrent Recordings** and **Storage Quota (GB)** for this user. |
| **Content Requests** | Requesting movies and shows through [Sonarr and Radarr](/docs/integrations/arrs_integration). **Auto-approve Content Requests** skips your approval. |
| **AIOStreams Access** | Browsing and playing [AIOStreams](/docs/integrations/aiostreams_integration) catalogs. |
| **Library Publishing Access** | Letting the Emby plugin read [published libraries](/docs/integrations/emby_library_publishing) with this login. |

## Guest portal

Anyone with a login can also watch in a web browser. The **Public URL** action on a playlist opens its guest portal, at `http://your-server:36400/playlist/v/{uuid}`. After signing in with a login for that playlist, guests can browse live TV, movies, and series, and, if their login allows it, use the DVR, request content, and browse AIOStreams.

## Default login

Every playlist has a built-in login for its owner: your M3U Editor username, plus a password. *(v0.13.3+)* **Default login**, under **Default Authentication** in the playlist's **Auth** tab, sets which password that is. It's on Playlists, Custom Playlists, Merged Playlists, and Aliases.

| Mode | Owner password | M3U and HDHomeRun URLs |
|---|---|---|
| **UUID as Password** (default) | The playlist's unique identifier (UUID) | Work with just the UUID, unless Playlist Auths are assigned |
| **Custom Password** | A password you choose. The UUID stops working. | Need your login or a Playlist Auth |
| **Disabled** | Not accepted | Playlist Auths only |

- **Custom Password** must be URL-safe, and different from your other Custom Password playlists. The button next to the field generates one.
- In Custom Password mode, the URLs shown in the editor include your login, and Plex DVR setup uses them automatically.
- Links the editor makes for itself (the in-app player, the guide viewer, the proxy, and `.strm` files) keep working in every mode. Changing the mode or the password changes those links, so copied URLs stop working and `.strm` files are rewritten.
- Duplicating a playlist never copies the custom password. A copy of a Custom Password playlist starts with the default login **Disabled**.

The mode never affects Playlist Auths or alias logins.

:::tip Hand out logins without sharing yours
Set **Default login** to **Disabled**, and assign a Playlist Auth to each person or device. Nobody can then use the owner login.
:::
