---
slug: m3u-editor-0-14-1-m3u-tv-1-2-5
title: "M3U Editor 0.14.1 and M3U TV 1.2.5: find the game, press play"
description: M3U Editor and M3U TV now know what's on. See each day's games with live scores, find the channels showing them, and build proper guide entries for event channels. M3U TV also adds multiple playlists and a customizable nav and Home.
authors: [sparkison]
tags: [release, editor, tv]
image: /img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/featured.jpg
---

If you've ever searched your channel list ten minutes before kickoff, trying to work out which of forty channels has the game, this release is for you. M3U Editor and M3U TV now know what's being played today, and which of your channels is showing it.

M3U TV 1.2.5 also lets you keep several playlists on one device, and rearrange the app so it only shows what you use.

![Sports in M3U Editor and M3U TV](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/featured.jpg)

<!-- truncate -->

## Update

Pull the new images and recreate the containers. Your data is kept.

```bash
docker compose pull
docker compose up -d
```

M3U TV updates through your app store, or from the [download page](/tv#download). Sports needs both updates.

## Sports

Sports is off until you turn it on, so nothing changes if you don't watch any. To try it, go to **Settings → Integrations → Sports API** and turn on **Use ESPN API (Unofficial)**. It's free and doesn't need an account. While you're there, pick the leagues you actually watch under **Limit to Leagues**, which makes everything faster.

ESPN's API is unofficial and could change without notice, so TheSportsDB is supported too, with a paid key. It carries hundreds of leagues ESPN doesn't, and you can use either one or both. The [Sports guide](/docs/integrations/sports) compares them. Either way, only M3U Editor talks to the provider, and your TVs get everything from M3U Editor.

M3U Editor checks each day's games against your enabled channels: what the guide says is on just after kickoff, and the channel's own name. It only runs when someone opens a day's games, so if you never open Sports, it costs you nothing. Sports doesn't add any streams, so you can only watch what your provider carries.

### On your TV

M3U TV gets a **Sports** screen with a date bar, live scores, and a channel count on every game. Press a game and it plays. If several channels have it, you pick one, with the best match first.

![The Sports screen in M3U TV](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/sports-tv.jpg)

Hold OK on a game for **Game details**, which has the score by period, key moments, team stats, and top performers, along with the channels showing it. You can also add a game to Multiview from there, which is handy on a busy Saturday.

![Game details in M3U TV](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/sports-details-tv.jpg)

Follow your teams and they get their own **My Teams** tab and move up in a new Sports row on Home. Follows belong to your viewer profile, so they carry over to your other devices. See [Sports in M3U TV](/docs/m3u-tv/sports).

### In M3U Editor

There's a **Sports** page in M3U Editor too, under **Playlist** in the sidebar, for checking a day's games and playing a channel right from your browser.

![The Sports page in M3U Editor](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/sports-page.jpg)

![A game's details on the Sports page](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/sports-details-editor.jpg)

### A better guide for event channels

This one helps every player, not just M3U TV. Event channels with names like `NHL 04: Rangers at Bruins` usually have nothing in the guide. [AED profiles](/docs/advanced/advanced-epg-dummies) could already turn those names into guide entries, but you had to write regex patterns for each provider's format.

Now you can turn on **Match real games** instead. M3U Editor recognizes the game from the team names, however they're written, and fills in the real start time and teams. Anything it can't match falls back to your patterns, and schedule changes are picked up on their own. See [Match real games](/docs/advanced/advanced-epg-dummies#match-real-games).

![An AED profile matching channel names to games](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/sports-aed.jpg)

## More in M3U TV 1.2.5

### Several playlists on one device

M3U TV can now keep more than one playlist, whether they're on the same server or different ones. Go to **Settings → Account → Playlists** to add one or switch. A playlist with its content stored on the device opens right away and refreshes in the background, and each one keeps its own favorites, viewer, proxy choices, and guide. See [Playlists](/docs/m3u-tv/settings#playlists).

![Saved playlists in M3U TV](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/playlists.jpg)

The new **Settings → Storage** page goes with it. It shows what each playlist takes up, and clears each part on its own.

### Make the nav and Home yours

Not using Requests or the DVR? **Settings → Appearance → Navigation & Home** lets you reorder your sections and choose where each one shows, with separate switches for the nav and for Home. Take something out of the nav and you can still reach it from its Home row. See [Navigation & Home](/docs/m3u-tv/settings#navigation--home).

![Navigation & Home in M3U TV](/img/blog/m3u-editor-0-14-1-m3u-tv-1-2-5/nav-home.jpg)

### Also new

- **Guide previews carry over.** Going from a guide preview to full screen no longer restarts the stream.
- **Title sort.** Movies and series can sort by **Title (A-Z)** or **Title (Z-A)**.
- **Smoother on big libraries.** Sorting, guide updates, and image work moved off the UI thread, and channel and guide memory use is better contained, which helps most on smaller TV boxes.
- **Clearer request errors.** The Requests screens now say things like "already requested" instead of showing a raw server error.
- **Fixes for older hardware.** The OK button works properly on remotes like the Mi Box 3's, and Android phones and tablets without Vulkan 1.1 no longer crash at launch on older graphics drivers.

## More in M3U Editor 0.14.1

- **Recordings no longer overwrite each other.** Two recordings with the same name on the same day could end up sharing one file, so deleting one deleted both. Each recording now gets its own file, and files already shared are protected.
- **The DVR quota counts what's on disk.** Each file counts once, and if half or more of your recordings are missing, M3U Editor assumes the storage isn't mounted and deletes nothing.
- **Series syncs are steadier.** Overlapping metadata fetches could delete live episodes, and series could be skipped partway through a sync. Expired provider covers now refresh on sync too.
- **Rate limits are separate per route.** Limits were shared across unrelated routes, so a busy client could get blocked somewhere it had barely touched.
- **Renamed groups are easier to manage.** Clearing a group's or category's name goes back to the provider's, and pick lists show both names.
- **Smaller fixes.** Duplicated playlists keep their merged groups, widescreen films like 1920x800 count as 1080p, a channel named `0` can be merged, provider dates use your timezone, and AI Copilot no longer mixes up conversations when you switch between them.

As always, the full lists are in the [M3U Editor](https://github.com/m3ue/m3u-editor/releases) and [M3U TV](https://github.com/m3ue/m3u-tv/releases) release notes.
