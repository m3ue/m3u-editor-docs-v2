---
sidebar_position: 7
description: Serve movies and TV shows from a WebDAV server, such as a Synology NAS, Nextcloud, or TorBox.
title: WebDAV
tags:
  - Integrations
  - WebDAV
  - NAS
  - TorBox
---

# WebDAV

WebDAV serves video files from any WebDAV server: a NAS (Synology, Nextcloud, and others) or a remote service like TorBox. It works like [Local Media](local_media_integration), but reads the files over the network. M3U Editor logs in to the WebDAV server for your players, so they never see its credentials.

## Add the integration

Go to **Integrations → Media Servers**, choose **Add Media Server**, and set **Server Type** to **WebDAV**:

| Field | Enter |
|---|---|
| **Host / IP Address**, **Port** | The WebDAV server, like `192.168.1.200` and `5005`, or `webdav.torbox.app` and `443` |
| **Use HTTPS** | On for remote services and HTTPS servers (on by default) |
| **WebDAV Username**, **WebDAV Password** | Your WebDAV login. Leave empty for servers that don't need one. |
| **Base Path** | The path to the WebDAV root, if the server uses one: `/` for TorBox, `/remote.php/webdav` for Nextcloud |
| **Skip SSL Verification** | Only for a NAS with a self-signed certificate. Leave off for remote services. |

Then add a library under **Media Library Paths** for each folder, with its **WebDAV Path** (like `/movies`) and **Content Type**. The scan options are the same as [Local Media's](local_media_integration#set-it-up), and so are the [file naming rules](local_media_integration#name-your-files).

## Examples

| Server | Host and port | Notes |
|---|---|---|
| **TorBox** | `webdav.torbox.app`, `443`, HTTPS | Base Path `/`, your TorBox login. Turn on **Torrent/NZB Title Parsing**, so release-style file names group into proper series. |
| **Synology** | Your NAS IP, `5005` (or `5006` for HTTPS) | Turn on WebDAV in **DSM → Control Panel → File Services → WebDAV** first. Use your DSM login, and shared folder paths like `/video/movies`. |
| **Nextcloud** | Your Nextcloud host, `443` | Base Path `/remote.php/webdav`. Use an app password, not your account password. |

## Troubleshooting

| Problem | What to check |
|---|---|
| The connection fails | Host, port, and **Use HTTPS** match the server. Try the WebDAV address in a browser from the same network. |
| The login is rejected | The username and password. Nextcloud needs an app password. |
| Nothing is found | The **WebDAV Path** exists and holds videos, the **Content Type** is right, and the file extensions are in the list. |
