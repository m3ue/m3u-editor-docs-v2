---
sidebar_position: 6
title: Logs and Diagnostics
description: View M3U TV's device details and session logs, and upload them to M3U Editor for troubleshooting
tags:
  - M3U TV
  - Troubleshooting
---

# Logs and Diagnostics

*(M3U TV v1.2.1+ with M3U Editor v0.13.1+)* When something isn't working on a TV, it's hard to see what went wrong. **Logs & Diagnostics** shows the app's device details and this session's logs on screen, and can send them to your M3U Editor so you (or whoever helps you) can read them on a computer.

## In the App

Open **Settings → General → Logs & Diagnostics**. The screen shows:

- **Device**: app version, platform and OS, device name and ID, screen size, renderer, memory use, and the server it's connected to
- **Logs**: everything the app logged since it started, newest at the bottom

Use **Refresh** to pull in new lines, **Clear logs** to start fresh before reproducing a problem, and **Upload to server** to send the logs to M3U Editor. A confirmation shows the upload number.

Logs are kept in memory only, for the current session. Your username and password, and credentials inside stream URLs, are removed from every line before it is shown or uploaded.

:::tip Reproduce, then upload
Clear the logs, reproduce the problem, then upload right away. That keeps the report short and focused on the problem.
:::

## In M3U Editor

Uploaded logs are attached to the device that sent them. An admin can read them under **Administration → Devices → Registered Devices**: the **Logs** button on a device's row shows how many uploads it has and opens them in a slide-over.

- Each device keeps its last 10 uploads, and uploads older than 30 days are removed.
- An upload is capped at 1 MB. The app trims older lines to fit.
- The device needs to be connected to the editor to upload. If it isn't, the app says so.

When opening a [GitHub issue](https://github.com/m3ue/m3u-tv/issues), paste the relevant part of the log along with what you did and what you expected.

## Related

- [Guide & Playback](./guide-and-playback.md)
- [Push Notifications](./push-notifications.md) - Registered Devices also lists devices for push
- [Troubleshooting](../troubleshooting.md)
