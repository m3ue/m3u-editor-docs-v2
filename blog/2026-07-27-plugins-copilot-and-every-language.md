---
slug: m3u-editor-0-11-plugins-copilot-and-every-language
title: "M3U Editor 0.11: plugins, Copilot, and every language"
description: The 0.11 series adds a plugin system, grows the AI Copilot, translates the app, and fills in alerts, sync protection, Advanced EPG Dummies, MediaFlow Proxy, and the groundwork for M3U TV.
authors: [sparkison]
tags: [release, editor]
---

The 0.11 series ran from May to the end of July 2026, across more than thirty releases. Its theme was opening M3U Editor up: to code that isn't part of it, to an assistant that can work in it for you, and to people who don't read English.

<!-- truncate -->

## Plugins

M3U Editor now has a **plugin system**. Plugins can add actions, settings, scheduled tasks, and their own tables to the app, and react to events like a playlist or EPG sync. There's a scaffold generator and a step-by-step wizard for creating one, an official plugin repository to install from, and a review step before any plugin's code runs. See [Plugins](/docs/extensions/overview).

## The AI Copilot

The **AI Copilot** is an assistant built into M3U Editor. Ask it something in plain language, and it can look things up, make changes, and map guide data without you hunting through menus. 0.11 gave it tools to query your data directly and a smart EPG mapper, and added more AI providers through the series. It works with hosted providers like OpenAI and Anthropic, or a model you run yourself with Ollama. See [AI Copilot](/docs/ai-copilot/overview).

## Every language

The whole interface can now be translated, and ships with complete Chinese (Simplified) and German translations alongside English, with more following. Switch language from the language menu in the top bar.

## Protecting your lineup

A provider having a bad day shouldn't wipe out your setup:

- **Sync invalidation** cancels a sync that would remove more channels, series, or groups than you allow. See [Playlists](/docs/resources/playlists#protect-against-bad-syncs).
- Failed EPG syncs **retry automatically**.
- **Alerts** send errors to Discord, Slack, or Telegram. See [Alerts](/docs/advanced/alerts).
- An in-app **Job Monitor** shows what's running in the background. See [Job Monitor](/docs/advanced/job-monitoring).

## Better guides for event channels

Sports and pay-per-view channels often have no guide data, just an event name and time in the channel title. **Advanced EPG Dummies** read those titles and build a real guide from them, with an AI helper to write the pattern. See [Advanced EPG Dummies](/docs/advanced/advanced-epg-dummies). EPG mapping also gained a **review table** for matches it isn't sure about.

## More control over streaming

- **Adaptive stream profiles** pick a transcoding profile for each channel by rules, based on what stream probing found, for example sending HEVC channels one way and everything else another. See [Transcoding](/docs/proxy/transcoding#adaptive-profiles).
- **Stream limits per login**, with an option to stop someone's oldest stream when they start a new one.
- **Xtream DNS failover** URLs can be tested, and work for Playlist Aliases too. See [Xtream DNS Failover](/docs/resources/xtream-dns-failover).
- **MediaFlow Proxy**, an alternative to M3U Proxy, now covers guides and the Xtream API too, and can rewrite stream URLs automatically. See [Settings](/docs/advanced/settings-reference#mediaflow-proxy).
- **Stream probing** detects HDR and records each channel's codecs. See [Stream Probing](/docs/advanced/stream-probing).

## Also in 0.11

- A **migration path from SQLite to Postgres**. See [SQLite to Postgres](/docs/advanced/sqlite-to-postgres).
- Rules that **enable or disable channels** by name on every sync.
- An API endpoint to **update a playlist's URL and credentials**, for rotating logins from a script.
- Merged EPGs can be used for EPG mapping, and Merged Playlists became full playlists in their own right.
- TRaSH Guides naming for `.strm` files, picture-in-picture in the in-app player, and a regex tester on every pattern field.
- **Device management and a push notification relay**, the editor side of the new M3U TV app.

That last item is the bridge to what came next: a player app of our own.
