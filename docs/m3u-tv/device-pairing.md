---
sidebar_position: 3
title: Device Pairing
description: Sign M3U TV in on a TV with a short code entered from your phone or computer, instead of typing a password with the remote.
tags:
  - M3U TV
  - Security
  - Authentication
---

# Device Pairing

Typing a username and password with a TV remote is painful. With device pairing, the TV shows a short code, you enter it in M3U Editor on your phone or computer, and the TV signs itself in.

## Pair a TV

1. In M3U TV, choose **Pair with code**. The TV shows a code like `XKQP-9F3T`, and a QR code that opens the right page.
2. In M3U Editor, go to **Administration → Devices → Device Pairing** (or scan the QR code), and enter the code.
3. Choose which login the TV should use: a playlist's [default login](/docs/resources/playlist-auth#default-login) or a [Playlist Auth](/docs/resources/playlist-auth).

The TV signs in within a few seconds. Pairing doesn't create a new login: the TV gets the one you chose, exactly as if you'd typed it in.

## Why it's safe

Pairing follows the same design ([OAuth device authorization](https://datatracker.ietf.org/doc/html/rfc8628)) that streaming services use for their TV apps:

- **Codes only work for you.** A code can only be entered by someone signed in to M3U Editor, and the login you pick is checked against your account on the server.
- **Codes don't last.** Each expires after 10 minutes, and is deleted as soon as the TV collects its login, so it can't be reused.
- **Guessing doesn't work.** The TV polls with a long random code it never shows. Unknown and pending codes look the same from outside, requests are rate limited, and repeated wrong entries lock pairing for 10 minutes.

## Turn it off

Pairing is on by default. To turn it off, go to **Settings → TV App → Device Pairing** and turn off **Enable device pairing**. Pending pairing requests are rejected, and the **Device Pairing** tab is hidden.

Pairing also needs **Enhanced output enabled** under **Settings → General**, like the rest of M3U TV.
