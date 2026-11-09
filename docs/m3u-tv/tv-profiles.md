---
sidebar_position: 3.5
title: Settings Profiles
description: Set up M3U TV's settings from M3U Editor, as defaults people can change or as locked settings, for each login.
tags:
  - M3U TV
  - Settings
---

# Settings Profiles

*(M3U Editor v0.14.2+ with M3U TV v1.3.0+)* A Settings Profile sets up the app from M3U Editor, so you don't have to walk through **Settings** on every TV. Make one profile for the living room, another for the kids, and give each [Playlist Auth](/docs/resources/playlist-auth) the one it should use. Every device signed in with that login picks it up.

## Create a profile

Go to **Administration → Devices → Settings Profiles** and choose **New Profile**. Give it a name, then choose how M3U TV should treat each setting:

| Mode | On the TV |
|---|---|
| **Not managed** | The app's own setting, exactly as before. This is where every setting starts. |
| **Default (user can change)** | Replaces the app's default. Anyone who already changed the setting on the TV keeps their choice, and anyone can still change it. |
| **Enforced (locked)** | Always uses your value. The setting shows a lock in the app and can't be changed there. |

Each setting shows the app's own default under it, so you can see what **Not managed** means.

## Use a profile

- **For a Playlist Auth**: open the login, and pick the profile under **M3U TV → Settings Profile**.
- **For everyone else**: turn on **Default profile** on one profile. It applies to your own [default login](/docs/resources/playlist-auth#default-login), to Alias logins, and to every Playlist Auth without a profile of its own. Only one profile can be the default, and nothing changes until you pick one.

A Playlist Auth's own profile always wins over the default.

## What a profile can set

The settings use the same names as in the app. See [Settings](settings) for what each one does.

| Group | Settings |
|---|---|
| **Start and Home** | **Default start page**, **Home screen** |
| **Live TV and Guide** | **Live TV layout**, **Live TV channels column**, **EPG starts at**, **Guide preview playback**, **Preview delay** |
| **Sorting** | **Filter Persistence**, the sort for Movies, Series, and Live TV, and **Favorites First** for each |
| **Playback** | **Movies and series player**, **Match display refresh rate**, **HDR mode**, **Deinterlace video**, **Buffer live streams before playing**, **Show playback diagnostics** |
| **Interface** | **Navigation sound** |

Settings that depend on the device itself, like **Display size** and **Optimize for**, stay on each device. To lay out **Navigation & Home**, use a [Home Screen](tv-home-screens).

A setting only takes effect where the app shows it. For example, **HDR mode** does nothing on an Apple TV, and **Movies and series player** only applies on Android.

## When changes reach the TV

- **While the app is open**, it picks up a saved profile within a few seconds. A device that's off or offline picks it up the next time it connects.
- **When the app starts**, it uses the last profile it received, so the start page and Home are right straight away, even offline.
- **When a TV switches [playlists](settings#playlists)**, each playlist keeps its own profile.

Removing a login's profile, or deleting the profile, puts its devices back on the default profile, or on their own settings if there's no default.

## Requirements

- **Enhanced output enabled**, under **Settings → General**, like the rest of M3U TV. Without it, the **Settings Profiles** page and the profile picker on Playlist Auths are hidden.
- M3U TV v1.3.0 or later. Older versions ignore profiles and keep their own settings.
