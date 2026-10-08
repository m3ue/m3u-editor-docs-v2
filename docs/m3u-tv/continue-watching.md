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

Progress belongs to the login, not the device. If each person has their own [Playlist Auth](/docs/resources/playlist-auth), each gets their own list. They're listed under **Playlist → Playlist Viewers**.

## After a re-sync or provider change

Entries remember each title's TMDB ID. When a title's ID changes, for example after you flush and re-sync a media server or [migrate to a new provider](/docs/resources/playlists#moving-to-a-new-provider), entries are relinked to the new copy instead of disappearing.

To tidy up by hand, use **Relink Watch Progress** on **Playlist Viewers**, or **Preview Relink** to see what it would change first. It relinks what it can and removes entries whose title is gone. **Scope** limits it to one playlist. From the command line:

```bash
php artisan progress:prune-orphaned --dry-run
php artisan progress:prune-orphaned --playlist-type=playlist --playlist-id=3
```
