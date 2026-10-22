---
slug: security-release-m3u-editor-0-13-6-m3u-proxy-0-4-35
title: "Security release: M3U Editor 0.13.6 and M3U Proxy 0.4.35"
description: M3U Editor 0.13.6 moves to PHP 8.4.27, which fixes two critical PHP vulnerabilities, and M3U Proxy 0.4.35 stops its segment routes from fetching any URL or file they're handed. Please update both.
authors: [sparkison]
tags: [release, editor, proxy]
---

This release fixes two security problems: one in PHP, which M3U Editor runs on, and one in M3U Proxy itself. Please update as soon as you can, especially if your M3U Editor is reachable from the internet.

<!-- truncate -->

## Update now

Pull the new images and recreate the containers. Your data is kept.

```bash
docker compose pull
docker compose up -d
```

- **All-in-one setup** (embedded proxy): updating M3U Editor is enough, since 0.13.6 includes M3U Proxy 0.4.35.
- **Separate proxy container** (modular, VPN, and external setups): the commands above update both images. If your proxy runs somewhere else, update it to 0.4.35 there too.

To check, open the new **Tools → System Health** page. It shows the M3U Editor version, the PHP version (8.4.27 or later), and the m3u-proxy version (0.4.35 or later).

## PHP 8.4.27

On October 21, the PHP team released [PHP 8.5.12, 8.4.27, 8.3.36, and 8.2.35](https://www.php.net/archive/2026.php#2026-10-21-5) to fix two critical vulnerabilities that can allow remote code execution without logging in (CVE-2026-109618 and CVE-2026-109619). PHP rates the risk highest for Apache with mod_php, which M3U Editor doesn't use, but PHP-FPM, which it does use, is affected too.

M3U Editor 0.13.6 ships PHP 8.4.27. To get it, the image moves from Alpine Linux 3.22 to 3.24. Alpine only keeps PHP current on its newest release, so the 0.13.5 image was still on PHP 8.4.16. This update brings in every PHP security fix since then, along with current versions of nginx and the rest of the system packages.

The bundled PostgreSQL stays on version 17, so there's no database upgrade to run. (Alpine 3.24's default is PostgreSQL 18, which can't open a version 17 database, so the image keeps 17.)

## M3U Proxy: signed segment URLs

Players can't send an API token, so the routes that serve stream segments to them (HLS segments, and DASH segments and files) don't ask for one. Before 0.4.35, they also didn't check what they were asked to fetch. Anyone who could reach the proxy could use them to:

- read files inside the proxy's container (for the embedded proxy, that's the M3U Editor container), and
- fetch addresses on your network, such as other devices on your LAN or services listening only on localhost, and see the response.

M3U Editor passes requests to the proxy at `/m3u-proxy/`, so if M3U Editor was reachable from the internet, so were these routes. Setting `API_TOKEN` didn't block them. Every M3U Proxy before 0.4.35 is affected, embedded or separate.

What changed in 0.4.35:

- The proxy signs every URL it writes into a playlist or manifest, and the segment routes refuse any URL without a valid signature before fetching anything.
- Local files are only served from the proxy's own transcoding folders.
- The `?url=` parameter, which starts a stream from a URL you pass in, now needs a signed URL or the API token.

Players don't need any changes. The signatures are part of the URLs the proxy already gives them.

## Check your proxy token

The signing key comes from your proxy token (`M3U_PROXY_TOKEN` on M3U Editor, `API_TOKEN` on the proxy). Signed URLs are visible to anyone who can load one of your playlists, so a short or guessable token could be worked out from them.

- **You never set a token** (all-in-one setup): M3U Editor generates a new random one every time it starts. Nothing to do.
- **You set one yourself**: make sure it's long and random. If it's `changeme` (the compose files' fallback), a word, or a short password, replace it with the output of `openssl rand -hex 32`, and use the same value on M3U Editor and the proxy.
- **Your proxy has no `API_TOKEN`**: set one. Without it, anyone who can reach the proxy can use its management API.

If your M3U Editor has been reachable from the internet, change your token after updating, even if it was already strong. See [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration#how-they-connect) for where it's set.

## Also in M3U Editor 0.13.6

- **System Health** under **Tools** shows versions, container services, PHP, the database, cache and queues, and m3u-proxy status on one page.
- **Schedules Direct**: an expired or disabled account gets one notification and a **Retry SchedulesDirect Login** action, instead of retrying the login all day. Errors from SD's servers now back off, and a sync that fails partway, or whose login expires mid-sync, no longer saves an empty guide.
- **Xtream channels follow their category** when your provider moves them. New groups now show in the sync log, and Custom Playlists set to **New Groups Only** pick them up.
- **Merged EPGs** keep their guide when one of their source files is unavailable.
- **Less idle CPU and memory**: the scheduler's every-minute checks no longer start their own PHP processes, DVR workers don't run when DVR is off, and admin pages stop piling up background refresh timers.

M3U Proxy 0.4.35 also moves to Python 3.14.

As always, the full lists are in the [M3U Editor](https://github.com/m3ue/m3u-editor/releases) and [M3U Proxy](https://github.com/m3ue/m3u-proxy/releases) release notes.
