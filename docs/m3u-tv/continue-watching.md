---
sidebar_position: 5
title: Continue Watching
description: Stop a movie or episode on one device and resume it on another - progress is kept on your M3U Editor, per login.
tags:
  - M3U TV
---

# Continue Watching

Stop a movie or episode on your phone, and pick it up on the TV at the same second. M3U TV saves where you are to M3U Editor as you watch, so every device signed in with the same login shares one Continue Watching list. There's nothing to set up.

- **Movies and episodes** save their position as they play, and drop off the list once you've watched about 90%.
- **Live channels** record when you last watched them, for a recently watched list.
- **[AIOStreams](/docs/integrations/aiostreams_integration)** titles are included too.

Progress belongs to the viewer, not the device. Each login has at least one viewer, and you can add more for the people sharing it, like profiles on a streaming service: in M3U TV, go to **Settings → Account → Active Viewer** and choose **Add New Viewer**, or switch between them there. Each viewer has its own Continue Watching and favorites. Giving each person their own [Playlist Auth](/docs/resources/playlist-auth) works too. Viewers are listed in M3U Editor under **Playlist → Playlist Viewers**.

## Add or edit progress by hand

*(v0.13.4+)* Open a viewer on **Playlist Viewers** to see their **Watch History**, one tab per type.

- **Add Progress** (on the **VOD** and **Series** tabs) searches TMDB for a movie or episode and records a position for it. Useful when someone watched it elsewhere. It needs a [TMDB API key](/docs/integrations/tmdb_integration).
- **Edit** on a row changes its position, duration, or completed state. Positions take `h:mm:ss`, `m:ss`, or a number of minutes.
- **Mark as watched** and **Mark as unwatched** work on selected rows.

A title that isn't in the playlist yet is added as **Not in playlist**. Once the title is in the library, it's linked the next time M3U TV loads that viewer's progress, or when you run **Relink Watch Progress**. Until then, the relink tools below keep it instead of removing it.

## After a re-sync or provider change

Entries remember each title's TMDB ID. When a title's ID changes, for example after you flush and re-sync a media server or [migrate to a new provider](/docs/resources/playlists#moving-to-a-new-provider), entries are relinked to the new copy instead of disappearing.

To tidy up by hand, use **Relink Watch Progress** on **Playlist Viewers**, or **Preview Relink** to see what it would change first. It relinks what it can and removes entries whose title is gone. **Scope** limits it to one playlist. From the command line:

```bash
php artisan progress:prune-orphaned --dry-run
php artisan progress:prune-orphaned --playlist-type=playlist --playlist-id=3
```
