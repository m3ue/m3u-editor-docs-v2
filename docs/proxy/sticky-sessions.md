---
sidebar_position: 7
title: Sticky Sessions
description: Stop playback loops with providers that spread HLS streams across several servers, by keeping each stream on one server.
tags:
  - Proxy
  - HLS
  - Reliability
---

# Sticky Sessions

Some providers send each request to whichever of their servers is least busy. For HLS streams, those servers aren't always in step, so the player can get a playlist from one server that's behind another. The stream seems to jump backwards, and the player reloads over and over.

Sticky sessions fix this. After the provider redirects a stream to one of its servers, the proxy keeps using that server for the rest of the stream.

## Turn it on

Turn on **Enable Sticky Session Handler** in a playlist's **Output** tab, under **Streaming Output**. To use it for every stream, set `USE_STICKY_SESSION=true` on the proxy.

Turn it on if:

- streams loop or rebuffer every few seconds
- your provider uses several servers or a load balancer

Leave it off if your provider has one server, or if you rely on it to route you to the nearest server.

## If the server fails

If the server a stream is stuck to stops working, the proxy [retries](failover#what-happens-when-a-stream-fails) it, then goes back to the provider's original address, so the provider can pick a working server. If that fails too, the proxy fails over to the channel's backup as usual, and sticks to the backup's server instead.
