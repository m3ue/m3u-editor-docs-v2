---
slug: m3u-editor-0-14-m3u-proxy-0-5
title: "M3U Editor 0.14 and M3U Proxy 0.5: switch off what you don't use"
description: M3U Editor 0.14 lets you switch off plugins, Schedules Direct, AIOStreams, and cached downloads to save memory, syncs Schedules Direct incrementally, and makes Reset status stop a stuck sync. M3U Proxy 0.5 ties signed URLs to their stream and fixes a batch of streaming edge cases.
authors: [sparkison]
tags: [release, editor, proxy]
---

M3U Editor has grown a lot of features this year, and every one of them costs a little memory even when you never use it. 0.14 lets you switch off the ones you don't need, and asks less of the services it talks to: Schedules Direct syncs download only what changed, and resetting a stuck sync no longer leaves it running beside the next one. M3U Proxy 0.5 comes with it, with tighter signed URLs and fixes from a community security audit.

If you use the embedded PostgreSQL database, there's also a heads-up below: PostgreSQL 18 becomes the default in a later 0.14 release, and now is the time to choose.

<!-- truncate -->

## Update

Pull the new images and recreate the containers. Your data is kept.

```bash
docker compose pull
docker compose up -d
```

The all-in-one setup includes M3U Proxy 0.5. If you run the proxy as its own container, the commands above update it too; if it runs somewhere else, update it there.

## Heads up: PostgreSQL 18 is coming

This is for installs using the embedded PostgreSQL database (`ENABLE_POSTGRES=true`, as in the shipped compose files). SQLite and your own PostgreSQL server aren't affected.

Since 0.13.7, the embedded database can be upgraded from PostgreSQL 17 to 18, but only when you ask for it. In a later 0.14 release, 18 becomes the default, and installs that haven't chosen a version will be upgraded the next time they start.

To decide for yourself, set `POSTGRES_VERSION` in the `m3u-editor` service's `environment:` now. If your compose file already has a `POSTGRES_VERSION` line, change that one.

- **Stay on 17** until you're ready:

  ```yaml
  - POSTGRES_VERSION=17
  ```

- **Move to 18 now**, on your own schedule instead of with a future update:

  ```yaml
  - POSTGRES_VERSION=18
  ```

Then restart with `docker compose up -d`. Before upgrading, the container checks there's enough free disk space (roughly the size of your database). It keeps your version 17 data so you can roll back, and shows the result on **Tools → System Health**. Take a [backup](/docs/advanced/admin-tools#backups) first all the same. See [Upgrading Embedded PostgreSQL](/docs/advanced/postgres-upgrade).

## Switch off what you don't use

Most of M3U Editor's memory goes to PHP processes that each load the whole app, including ones that sit waiting for work you may never give them. Two changes cut that down.

**PHP-FPM starts its workers on demand.** Instead of keeping several warm, it starts them as pages are loaded and stops each one after 20 seconds of quiet. Nothing to set.

**Optional features can be switched off.** Each of these keeps its own background worker running, even if you never use the feature. Set one to `false` to save that memory: the feature is hidden in the app, its syncs and schedules stop, and its worker never starts:

| Variable | Switches off |
|---|---|
| `PLUGINS_ENABLED` | Plugins: their pages, hooks, and scheduled runs |
| `SCHEDULES_DIRECT_ENABLED` | Schedules Direct guides. Guide data they already imported is still served. |
| `AIOSTREAMS_ENABLED` | AIOStreams integrations, catalogs, and stream finding. Titles already in your library keep their streams. |
| `CACHED_CONTENT_ENABLED` | Cached downloads, whatever **Enable cache** says. Titles play from the provider instead. |

Add them to the `m3u-editor` service's `environment:`:

```yaml
- PLUGINS_ENABLED=false
- AIOSTREAMS_ENABLED=false
```

Nothing is deleted, so turning a feature back on picks up where it left off. Only the value `false` switches one off; a blank line or anything else leaves it on. `DVR_ENABLED` already worked this way for the DVR. See [Optional features](/docs/advanced/environment-variables#optional-features).

## Schedules Direct downloads only what changed

Until now, every Schedules Direct sync downloaded your whole guide again: every station, every day, every program, even though most of it hadn't changed since the last sync.

0.14 keeps what it downloaded in a small file in the EPG's folder (`schedules-direct.sqlite`) and checks it against the change markers Schedules Direct publishes. After the first sync, only lineups, station days, and programs that actually changed are downloaded. Syncs finish much faster, and use far less of a service that a lot of you rely on.

Program images are kept fresh too. Each one is checked for updates every 7 days (daily for programs that had none yet), and an image is downloaded again when Schedules Direct updates it.

Schedules Direct's guidelines ask apps not to sync more than once an hour, so scheduled syncs now never run more often than that, whatever the schedule says. **Process** still syncs right away when you need it. See [Schedules Direct](/docs/resources/epg-setup#add-guide-data).

## Reset status stops the sync

When a playlist sync looked stuck, **Reset status** cleared its status so you could start another one. But the old sync kept going in the background, so the new one ran beside it and your provider got every request twice, which is a good way to hit a connection limit.

Now **Reset status** and **Reset Processing State** stop the old sync too. Its remaining steps are skipped, and the sync you start next is the only one running. A step that's already underway, like a playlist download, finishes first. The same goes for **Reset status** on an EPG, and **Restart Now** on an EPG map.

## M3U Proxy 0.5

The 0.4.35 [security release](/blog/security-release-m3u-editor-0-13-6-m3u-proxy-0-4-35) made the proxy sign every URL it hands to players. 0.5 goes a step further, and adds fixes from a community audit of the proxy:

- **Signed URLs belong to their stream.** A URL signed in one stream's playlist can't be replayed through another stream, which might send different headers or credentials to its provider. Players need no changes.
- **No more doubled segments.** If a segment download failed partway through, the proxy retried it and could send the start of the segment twice, which players show as a glitch. Now the response ends and the player asks again.
- **Authenticated HLS works on every quality level.** Variant playlists now get the same headers as their master playlist.
- **Segment URLs are fetched exactly as written.** Encoded characters like `%2F` are no longer decoded twice, and DASH segment templates with a query (`?token=$Number$`) now work.
- **Sticky sessions** no longer make a variant stream swap in its master playlist as if a failover had happened.
- **Redis passwords** with characters like `@`, `/`, or `#` now work.
- **`/health/live`** answers container health checks without a token. The shipped compose files still use `/health` with the token, which keeps working; see [Health checks](/docs/installation#health-checks) if you'd like to switch.
- Logs hide more secrets, including API tokens, Redis addresses, and anything inside error tracebacks, and `/info` no longer shows the Redis password.
- Viewers of a shared transcoded stream are told when it ends, even if they've fallen behind.
- A yt-dlp lookup that times out no longer leaves the process running, and a webhook test now reports a failed delivery instead of claiming success.

## Also in M3U Editor 0.14

- **Post processing scripts** are judged by their exit status. A script that writes warnings to stderr but exits with `0` now succeeds, with the warnings kept in its log, and one that fails without printing anything is reported as an error. **Sync time** is always filled in, and webhooks send the status as a plain value like `completed`.
- **Migrate Provider** refreshes the replacement playlist's guide as soon as it finishes, so copied EPG mappings show right away. Its confirmation now says plainly that players need the replacement playlist's URLs.
- **Disabled series** lose their `.strm` files on the next stream file sync, even when their episodes are still enabled.
- **AIOStreams** catalogs you picked by hand are no longer cleared when the integration syncs, and turning **Enable All Catalogs** off now starts with every catalog selected, instead of one per type.
- **Changing an AED profile** on a channel or group updates the guide output right away.
- **Caching through Radarr or Sonarr**: titles still waiting on the arr are no longer removed by the nightly cleanup.
- **Alerts**: failed-job alerts are sent once instead of twice, and a Telegram alert that fails to send no longer sets off another alert about itself.
- **Bug reports and feature requests** on GitHub now use short forms, so we get the details we need the first time.

## Missed 0.13.7?

0.13.7 came out last week without a post of its own. The highlights:

- **Live normalization** re-encodes live streams so players don't freeze when a stream fails over to a backup. It's off by default. See [When the player freezes after a failover](/docs/proxy/failover#when-the-player-freezes-after-a-failover).
- **PostgreSQL 18**: the opt-in upgrade for the embedded database, with rollback (see the [heads-up](#heads-up-postgresql-18-is-coming) above).
- **Allow and Block bouquets**, plus your own custom groups and categories, in [Playlist Aliases](/docs/resources/playlist-alias#bouquets).

As always, the full lists are in the [M3U Editor](https://github.com/m3ue/m3u-editor/releases) and [M3U Proxy](https://github.com/m3ue/m3u-proxy/releases) release notes.
