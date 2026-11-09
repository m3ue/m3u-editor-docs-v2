---
sidebar_position: 12
description: Send what your guests watch to Trakt or SIMKL from the server, and import or export existing watch history.
title: Trakt and SIMKL
tags:
  - Integrations
  - Trakt
  - SIMKL
  - Watch History
  - Playlist Auth
---

import { Steps, Step } from '@site/src/components/Steps';

# Trakt and SIMKL

*(v0.14.2+)* Connect a [SIMKL](https://simkl.com) or [Trakt](https://trakt.tv) account and attach it to one or more [Playlist Auths](/docs/resources/playlist-auth). M3U Editor then sends that login's watch progress to the account: finished movies and episodes are marked watched, and ones stopped part-way keep their place for resuming. You can also import an account's existing history, or export what's already been watched in M3U Editor.

Because the server does the sending, it works for every device signed in with the Playlist Auth, without signing in to SIMKL or Trakt on each one.

## Prerequisites

- A SIMKL or Trakt account
- A [Playlist Auth](/docs/resources/playlist-auth) for the people whose viewing should be sent
- The **Use Integrations** permission on your user account (admins have it)
- Watch progress comes from the players that report it to M3U Editor: [M3U TV](/docs/m3u-tv/overview) and the in-app player. Other IPTV players don't report progress, so their viewing isn't sent.

## Add an account

<Steps>
<Step title="Open Trakt & SIMKL">

In M3U Editor, go to **Integrations → Trakt & SIMKL** and click **Add Trakt / SIMKL**.

</Step>
<Step title="Fill in the account">

| Field | Description |
|---|---|
| **Service** | **SIMKL** or **Trakt** *(cannot be changed after creation)* |
| **Display Name** | A friendly label, e.g. `SIMKL - Living Room` |
| **Playlist Auths** | The logins whose watch progress goes to this account. It covers every viewer signed in with them. |
| **Enabled** | Turn off to pause the account without disconnecting it. |
| **Send watch progress** | Send progress as it's recorded. Turn off to use the account only for import and export. |

</Step>
<Step title="Sign in">

Saving opens **Sign in to SIMKL** (or Trakt) with a code and a link. Open the link on any device, sign in, and enter the code, then come back and select **I've approved it**. If you select it before approving, the window stays open so you can try again.

The **Account** column then shows the account's name.

</Step>
</Steps>

You can add as many accounts as you need, for example one per household member, each attached to that person's Playlist Auth. One Playlist Auth can also send to both a SIMKL and a Trakt account.

## What gets sent

About a minute after playback stops, M3U Editor sends one update per title:

- **Finished** (90% watched, or marked watched): the title is marked watched, once. Watching it again marks it watched again.
- **Stopped part-way**: the position is saved, so the title can be resumed in other apps.

Players save progress every few seconds, but nothing is sent until a title has had no saves for about a minute. This follows SIMKL's rules for apps, which don't allow sending updates on a timer.

Only movies and episodes with a TMDB, IMDb, or TVDB ID are sent, since that's how SIMKL and Trakt identify titles. [TMDB](tmdb_integration) fills these in for most of your library. Live TV isn't sent.

## Row actions

| Action | What it does |
|---|---|
| **Connect** / **Reconnect** | Sign in again, for example after the account was signed out. |
| **Test Connection** | Checks the saved sign-in still works. If SIMKL or Trakt rejects it (for example, access was removed on their site), the account is marked **Not connected** and you're asked to sign in again. If the service just can't be reached, the sign-in is kept. |
| **Import / Export** | Copy watch history between the account and a Playlist Auth. See below. |
| **Disconnect** | Signs out and stops sending. The Playlist Auths stay attached, so **Connect** picks up where it left off. |
| **Delete** | Signs out and removes the account. |

## Import and export

**Import / Export** works on one of the account's Playlist Auths at a time and runs in the background. You get a notification with what changed when it finishes.

| Option | What it does |
|---|---|
| **Import from the account** | Adds the account's watched titles and resume points. Local progress that's newer is kept. |
| **Export to the account** | Marks titles watched in M3U Editor as watched on the account. Titles the account already has are skipped, so nothing is counted twice. Resume points aren't exported. |
| **Import, then export** | Both, so each side ends up with the other's watched titles. |
| **Replace local progress with the account's** | Deletes the Playlist Auth's movie and episode progress, then imports. Live TV history is kept. This can't be undone. |

Titles are matched on their TMDB, IMDb, or TVDB ID. Anything that isn't in your library is counted as **not found in the library** and left alone. A resume point is imported only when the title's runtime is known.

:::tip
Before a Playlist Auth's first use, **Import from the account** sets it up so a new device starts with the account's history in **Continue Watching**.
:::

## With M3U TV

*(M3U TV v1.3.0+)* The **Simkl** and **Trakt** cards under **Settings → Integrations** show when M3U Editor is already sending this login's progress to that service, and the account it uses.

Signing in to SIMKL or Trakt on the TV takes over for that device: the TV sends its own playback to the account signed in there, and M3U Editor skips that service for that device's progress. Other devices on the same login, and any other service attached on the server, aren't affected. Disconnect on the TV to go back to the server account. See [M3U TV settings](/docs/m3u-tv/settings#integrations).

## Using your own app keys

M3U Editor signs in with the same public app IDs as M3U TV. To use your own instead, register an app ([Trakt](https://trakt.tv/oauth/applications), or [SIMKL](https://simkl.com/settings/developer/) with the "TV, devices & command line" type) and set its ID in your environment:

```bash
TRAKT_CLIENT_ID=your-trakt-client-id
SIMKL_CLIENT_ID=your-simkl-client-id
```

Neither needs a client secret. Changing an ID signs existing accounts out the next time they refresh, so reconnect them afterwards.

## Troubleshooting

| Problem | Fix |
|---|---|
| Nothing shows up on SIMKL or Trakt | Check the account is **Enabled**, **Send watch progress** is on, and the viewer's Playlist Auth is attached. Updates arrive about a minute after playback stops. |
| A title is never sent | It needs a TMDB, IMDb, or TVDB ID. Run [TMDB](tmdb_integration) lookups for the group or series. |
| The account shows **Not connected** | SIMKL or Trakt rejected the sign-in. Hover the warning icon for the reason, then **Reconnect**. |
| One TV doesn't send through the server | That TV is signed in to the same service itself, under **Settings → Integrations**. Disconnect it there to use the server account. |
