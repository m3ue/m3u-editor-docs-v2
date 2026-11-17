---
slug: read-the-code
title: "Read the code: how we build with AI, and what to ask before you self-host anything"
description: New self-hosted media apps are arriving fast, many of them built with AI. Here's how we use AI on M3U Editor, M3U TV, and M3U Proxy, why performance gets as much attention as features, what our apps send off your server, and what to ask before you trust any app with your playlists and logins.
authors: [sparkison]
tags: [editor, tv, proxy]
image: /img/blog/read-the-code/featured.jpg
---

A lot of new self-hosted media apps have shown up this year, and some of you are trying them, instead of M3U Editor or alongside it. That's good. More choice keeps all of us sharp. But a server you install at home has access to a lot, so it's worth knowing what you're trusting it with, and what you can check for yourself.

![Read the code. Then trust it.](/img/blog/read-the-code/featured.jpg)

<!-- truncate -->

## Why this project exists

M3U Editor started because I had two problems. I wanted an open project to contribute to, since almost everything I write for work is under NDA. And I wanted a self-hosted way to manage my own playlists. [m3u4u](https://m3u4u.com) was the only real option at the time, and it's great, but I wanted it running on my own hardware.

Nothing existing fit, so I built it, and that solved both problems. M3U Proxy came next, and it's what made the rest possible: DVR is built on top of it. Then came M3U TV, until everything I watch ran through one server and one client. It started for selfish reasons, but they were about building something useful in the open, not about making money from it or from you.

## Yes, we use AI

A large share of the changes to M3U Editor, M3U Proxy, and M3U TV start out written by AI coding agents. That isn't a problem in itself. What matters is what happens before that code reaches you:

- **A person reads it.** Every change is reviewed before it's merged, and I'm accountable for it, not a tool.
- **It's tested,** with automated tests, and on real devices for anything like TV playback.
- **It's scanned, twice.** Each project's dependencies are checked for known vulnerabilities before every release, and the build pipeline checks again and refuses to build if anything fails. That second check has earned its place: a vulnerability was once announced in a dependency between a release passing the scan and reaching the build. The build stopped, and the release shipped with the fix instead.
- **It's public.** Every change lands in a public repository with its full history, so anyone can see what was written and what we did about it.

AI makes it possible to build a lot very quickly. That's exactly why review and openness matter more, not less.

## Built to run well, not just to run

The other thing AI doesn't do on its own is care how well something runs. Agents write code that works on a small test library. Give that same code a provider with a hundred thousand channels, a two-week guide, a small NAS, or a cheap Android TV box, and it's a different story. A lot of my time on these projects goes into making sure the fast, lean version is the one that ships, and often that means laying down the foundation first so the agents build on the right thing. A few examples:

- **Syncs stream instead of loading everything at once.** Big playlists and guides are processed in chunks, so memory stays flat however large your provider is. Every change is reviewed for this specifically, because a sync that loads everything into memory works fine in testing and then falls over on a real playlist.
- **Guide matching has its own benchmark.** One change once passed every test and still turned minutes of EPG mapping into hours. Now any change to the matcher is benchmarked against the previous version before it's merged.
- **Nothing runs that you aren't using.** Queue workers and scheduled checks are tuned so that, for example, DVR's workers don't run when DVR is off, and routine checks don't start a new process every minute.
- **M3U TV is built for low-end hardware.** I use it every day on real TV boxes, not just a fast development machine. Images are decoded at the size they're shown rather than at full resolution. Big catalogs live in an on-device database and load as you scroll, rather than all sitting in memory, and the app scales its caches to the device it's running on.

> Anyone can claim their app is fast. The difference shows up on modest hardware, months into daily use.

## Questions worth asking any app

A media server on your network holds your provider logins, your playlists and watch history, and a foothold on your local network, often with a way to reach it from outside. When the code is closed, you can't check what happens to any of that. A closed app isn't automatically malicious, but you're taking it on trust, and the more it asks of you (an account, a subscription, remote access through their servers), the more trust you're giving.

These questions apply to every app, including ours:

1. **Can I read the code that actually runs?** Not just the install scripts or a bug tracker.
2. **Does it work without an account on someone else's service?** If their servers go away, does yours keep working?
3. **What does it send off my server?** Is it written down, on by default, and can you turn it off? Can you check, or only take their word for it?
4. **How do I report a security problem?** Is there a clear way, and a history of fixes being announced?
5. **Who reviews the code, and how does it hold up?** Fast-moving projects are exciting. Fast-moving projects nobody outside can review, and that haven't been tried on hardware like yours, need much more trust.

## What our apps send

Everything below is in the code, you can check it. You never need an account with us, and none of our apps send usage analytics.

- **M3U Editor** checks GitHub for new releases of itself, M3U TV, and your plugins. It contacts metadata and guide services (TMDB, Schedules Direct, TheSportsDB, Trakt, SIMKL, and any AI provider) only when you set them up, and your providers and media servers, because that's its job.
- **M3U TV** checks GitHub for app updates and release notes. When you play a movie or episode, it looks up skip intro and credits times on TheIntroDB using the title's TMDB or IMDb ID (turn it off in **Settings**). It contacts an OpenSubtitles service only when you search for subtitles, Trakt and SIMKL only if you sign in to them, and YouTube when you open a trailer.
- **Push notifications** are the one thing that goes through a service we run. When the push relay is on, M3U Editor sends a notification's device token, title, and text to our relay at `push-relay.sparkison.dev`, which passes it to Google's Firebase to reach your phone. It's on by default, and its code is [on GitHub](https://github.com/m3ue/m3u-push-relay). Turn it off under **Settings** with **Enable push relay**, or point `PUSH_RELAY_URL` at your own copy. M3U TV only uses Firebase on phones and tablets, after you allow notifications.

## Security reports

If you find a security problem, please report it privately, not in a public issue or on Discord. Open the **Security** tab of the [M3U Editor](https://github.com/m3ue/m3u-editor/security), [M3U Proxy](https://github.com/m3ue/m3u-proxy/security), [M3U TV](https://github.com/m3ue/m3u-tv/security), or [push relay](https://github.com/m3ue/m3u-push-relay/security) repository and choose **Report a vulnerability**, or send me a direct message on [Discord](https://discord.gg/rS3abJ5dz7) (I'm **shparkison**). We'll acknowledge it within three days, fix it, and say so publicly, like October's [security release](/blog/security-release-m3u-editor-0-13-6-m3u-proxy-0-4-35).

## Use what works for you

Every line of M3U Editor, M3U Proxy, M3U TV, and the push relay is public, and so is every change. None of this is about telling you which app to use. Run more than one if you like; many of you already do. Just favor software you can check.

Questions, or something here looks wrong? Come and tell us on [Discord](https://discord.gg/rS3abJ5dz7) or [GitHub](https://github.com/m3ue).
