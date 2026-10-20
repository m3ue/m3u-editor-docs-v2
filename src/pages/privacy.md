---
title: Privacy Policy
description: Privacy policy for the M3U TV app and m3u-editor.
---

# Privacy Policy

**Last updated:** October 20, 2026

This privacy policy covers the M3U TV app (Android, Android TV, Apple TV, iOS, iPadOS, macOS, Windows, and Linux) and the m3u-editor web application (collectively, "the app"). The app is a client for your own self-hosted or third-party IPTV/media server - it is not a hosted service, and the developer does not operate a backend that stores your content or personal data.

## Information We Collect

**Server connection details.** When you configure the app to connect to your m3u-editor server, the server URL, username, and password/API token you provide are stored only on your device, using the operating system's secure/encrypted storage (such as Keychain on Apple platforms or the Android Keystore). This information is sent only to the server you configure - it is never transmitted to the app developer or any third party.

**Push notification token.** If you enable notifications, the app registers a device token with Firebase Cloud Messaging (a Google service) so that your configured server can deliver notifications to your device (for example, recording or DVR status updates). This token identifies your device installation for message delivery purposes only; the developer does not use it to build a profile of you or track you across apps or services.

**Data sent to your own server.** To work, the app sends the following to the server you configure, and only to that server: your viewing progress and watch history, favorites, viewer profiles, DVR schedules, and basic device details (device name, platform, app version, and a random ID the app generates on first launch) so your server can list the device under Registered Devices. If you choose "Upload to server" on the Logs & Diagnostics screen, the app's recent diagnostic logs are also sent to your server so its administrator can troubleshoot. None of this is sent to the app developer.

## Information We Do Not Collect

The app does not include analytics, crash reporting, advertising, or tracking SDKs. The developer does not collect usage statistics, viewing history, or any other personal data. Everything described above stays on your device, your own server, or the optional third-party services you choose to connect.

## Third-Party Services

The app uses **Firebase Cloud Messaging** (Google) solely for push notification delivery. Google's handling of data related to this service is governed by [Google's Privacy Policy](https://policies.google.com/privacy).

The following services are optional and only contacted when you use the related feature:

- **Trakt** (trakt.tv). If you connect a Trakt account, the app sends your watch history to Trakt to keep it in sync. The Trakt access tokens are stored in your device's secure storage, and you can disconnect at any time in Settings. Trakt's handling of your data is governed by the [Trakt Privacy Policy](https://trakt.tv/privacy).
- **TheIntroDB** (theintrodb.org). When Skip Intro and Skip Credits are enabled, the app sends the public TMDB or IMDb ID (plus season and episode numbers) of the title you are watching to look up intro and credits timestamps. No account or personal information is sent. You can turn this off in Settings. See [TheIntroDB](https://theintrodb.org) for its terms.
- **YouTube** (Google). Trailer links open on YouTube in your browser or the YouTube app. YouTube's handling of data is governed by [Google's Privacy Policy](https://policies.google.com/privacy).

Artwork and metadata (such as posters and cast photos) are provided by your own server, which may source them from TMDB.

The app also connects to whatever media server you configure (self-hosted or third-party). That server's own privacy practices are controlled by whoever operates it, not by the developer of this app.

## Data Retention and Control

Server credentials and Trakt tokens stored on your device can be removed at any time by logging out or disconnecting within the app, or by uninstalling it. Removing the app deletes all locally stored data. Data held on your own server (such as watch history, registered devices, and uploaded logs) is controlled by that server's administrator and can be deleted there.

## Children's Privacy

The app is not directed at children under 13 and does not knowingly collect personal information from children.

## Changes to This Policy

This policy may be updated from time to time. Changes will be reflected by the "Last updated" date above.

## Contact

Questions about this policy can be sent to **hello@sparkison.dev**.
