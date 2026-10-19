---
slug: how-m3u-editor-started
title: "From alpha to 0.6: how M3U Editor started"
description: The first six months of M3U Editor, from an alpha playlist editor to Xtream API output, a built-in proxy, HDHomeRun, and Postgres.
authors: [sparkison]
tags: [release, editor]
image: /img/blog/origin-post-processing.jpg
---

M3U Editor started in January 2025 as a simple idea: take an IPTV playlist, let me turn off the channels I didn't want, fix the names and logos, and hand my players a clean playlist. Version 0.1.0 went out on January 13 with a warning that it had only been tested on a handful of playlists. Six months and close to a hundred releases later, it had become something much bigger.

<!-- truncate -->

## Making big playlists work

The first problem was size. Provider playlists can have tens of thousands of channels, and public lists like iptv-org are huge. Most of the 0.1 releases went into importing them without running out of memory: streaming the file instead of loading it whole, moving the work onto a Redis queue, and switching to database upserts in 0.2.0 so a re-sync only writes what changed.

## Guides, custom playlists, and the Xtream API

Once importing was solid, 0.2 filled in what a playlist editor needs:

- **EPG support (0.2.1).** Add XMLTV guides and map them to your channels. Mappings became **Recurring** in 0.2.19, so new channels get mapped on every sync.
- **Custom and Merged Playlists (0.2.1).** Build your own lineup from the channels you already have, or combine several playlists into one.
- **Xtream API output (0.2.15).** Serve your edited lineup to Xtream players with a username and password, not just as an M3U file.
- Auto-numbered channels, custom user agents, playlists from a file instead of a URL, and an in-app version check.

## Backups, the API, and a proxy

0.3.0 added backups, two-factor authentication, and an API for scripting. 0.4.0 in March was the next big one:

- **A built-in proxy**, so players could stream through M3U Editor instead of straight from the provider.
- **HDHomeRun output**, so Plex, Emby, and Jellyfin could add M3U Editor as a tuner.
- **Similarity matching** for EPG mapping, so channels with slightly different names in the guide still match.
- The first documentation site.

0.4.5 added **Playlist Auths** for giving each person their own login, and placeholder guides for channels without guide data.

## Under the hood

In 0.5.0 the container switched from Swoole to NGINX. It fixed a long list of problems with the proxy and with custom domains behind SSL. 0.5 also brought short playlist URLs, custom groups on Custom Playlists, sync logs showing what each sync added and removed, catch-up tags, and **post processing**: run a script, call a URL, or (later) send an email when a playlist or guide syncs.

![The post processing editor](/img/blog/origin-post-processing.jpg)

## 0.6: Postgres, VOD, and series

0.6.0 in June made Postgres the recommended database. SQLite stayed supported, but large libraries run much better on Postgres, and it opened the door to everything that came after. It was also the first release with a real batch of community contributions, including transcoding for proxied streams and an option to use jellyfin-ffmpeg. Thank you to everyone who sent a pull request in those early months.

The rest of 0.6 added custom channels, EPG shift and Gracenote IDs, regex filters for EPG mapping, and in 0.6.14, **VOD and series**: Xtream playlists now brought in movies and series with their metadata, seasons, and episodes, and served them back out through the Xtream API.

## Where to start

If you're new, the [installation guide](/docs/installation) gets you running, and [Playlists](/docs/resources/playlists) covers adding your first provider. The full history of every release is on [GitHub](https://github.com/m3ue/m3u-editor/releases).
