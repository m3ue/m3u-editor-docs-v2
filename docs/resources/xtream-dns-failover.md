---
sidebar_position: 7
description: Give an Xtream playlist backup server addresses, so it switches to a working one when your provider's main address goes down.
tags:
  - Playlists
  - Xtream
  - Reliability
title: Xtream DNS Failover
---

# Xtream DNS Failover

Many providers give you more than one server address for the same account. Add the extras to an Xtream playlist, and when the main address stops answering, M3U Editor switches to one that works, with no changes needed on your players.

## Add backup addresses

1. Edit an Xtream playlist and open its **Type** tab.
2. Expand **DNS failover URLs** and add each address under **Alternative URLs**, up to 10. Use the same `http://host:port` form as the main URL, with no path or login; the playlist's username and password are used for all of them.
3. **Test** next to an address checks it with your login. Drag them into the order you want them tried.
4. Save.

## How it switches

Whenever M3U Editor talks to your provider (syncing, fetching metadata, and so on) and the main address fails, it tries the alternatives in order. The first one that answers becomes the new main address, and the old one moves to the list of alternatives. The change is saved, so later requests and new stream URLs use the working address straight away.

When it switches, it also updates:

- the playlist's [provider EPG](epg-setup), if the EPG is tied to the playlist
- [Aliases](playlist-alias) with **Inherit DNS failover from source playlist** turned on, which keep their own credentials

## Check the addresses

On the playlist's page, the **Xtream API** tab shows **Server DNS Status**: whether each address is reachable, how fast it answered, and which one is currently the main address. It refreshes every few seconds, and **Check All** tests them all now.

If every address shows as offline, check that the server can reach the internet, then try one of the addresses in a browser. If your provider uses a self-signed certificate, turn on **Disable SSL verification** for the playlist.
