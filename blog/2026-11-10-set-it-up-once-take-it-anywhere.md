---
slug: m3u-editor-0-14-2-m3u-tv-1-3-0
title: "M3U Editor 0.14.2 and M3U TV 1.3.0: set it up once, take it anywhere"
description: Set up every M3U TV from M3U Editor with Settings Profiles and Home Screens, send watch history to Trakt and SIMKL from the server, and take your channels into the car with CarPlay and Android Auto.
authors: [sparkison]
tags: [release, editor, tv]
image: /img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/featured.jpg
---

If you look after more than one TV, you've probably walked through the same Settings screens on every one of them. And once it's all set up, it stays on the TV: step away from the couch and the stream stops.

This release fixes both. M3U Editor 0.14.2 can now set up every M3U TV for you, from its Settings to its Home screen, and send everyone's watch history to Trakt and SIMKL. M3U TV 1.3.0 keeps playing when you leave the room: in the background on your phone, in **Picture in Picture**, and in the car with **CarPlay** and **Android Auto**.

![M3U Editor 0.14.2 and M3U TV 1.3.0](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/featured.jpg)

<!-- truncate -->

## Update

Pull the new images and recreate the containers. Your data is kept.

```bash
docker compose pull
docker compose up -d
```

M3U TV updates through your app store, or from the [download page](/tv#download). Settings Profiles, Home Screens, and the server's Trakt and SIMKL accounts need both updates.

## Set up every TV from M3U Editor

### Settings Profiles

A **Settings Profile** sets up M3U TV from M3U Editor, so you don't have to walk through **Settings** on every TV. Make one for the living room and another for the kids, then give each [Playlist Auth](/docs/resources/playlist-auth) the one it should use. Every device signed in with that login picks it up.

You choose how each setting is handled. **Default** replaces the app's default but leaves anyone free to change it, and **Enforced** locks it, with a lock in the app's Settings. Find them under **Administration → Devices → Settings Profiles**. Changes reach an open app within a few seconds. See [Settings Profiles](/docs/m3u-tv/tv-profiles).

![A Settings Profile in M3U Editor](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/settings-profile.jpg)

![A locked setting in M3U TV](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/settings-profile-tv.jpg)

### Home Screens

A **Home Screen** lays out a playlist's nav and Home: which sections show, in what order, and extra rows inside them. Add a **Christmas Movies** row that only shows in December, or a **Game Day** row with just your league's games. Rows can have dates, and they come back every year on their own.

Like profiles, a Home Screen can be a default people can rearrange, or locked. It lives under **Administration → Devices → Home Screens**. See [Home Screens](/docs/m3u-tv/tv-home-screens).

![A Home Screen in M3U Editor](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/home-screen-editor.jpg)

### Pair once, add several playlists

When you pair a TV, **Add credential** now grants more than one login at once. Drag them into order and the TV saves each one as a playlist, ready to switch between. See [Device pairing](/docs/m3u-tv/device-pairing).

## Watch history, from the server

### Trakt and SIMKL for everyone

Connect a [Trakt](https://trakt.tv) or [SIMKL](https://simkl.com) account in M3U Editor, under **Integrations → Trakt & SIMKL**, and attach it to one or more Playlist Auths. M3U Editor then sends that login's progress to the account: finished movies and episodes are marked watched, and ones stopped part way keep their place. Nobody has to sign in on each TV. You can import an account's existing history too, or export what's already been watched. See [Trakt and SIMKL](/docs/integrations/trakt_simkl_integration).

![Trakt and SIMKL in M3U Editor](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/trakt-simkl.jpg)

M3U TV 1.3.0 also adds SIMKL on the device, next to Trakt. If someone connects their own account on a TV, that TV's viewing goes to their account, and M3U Editor skips that service for the device so nothing is counted twice.

### Watch History for the proxy

**Proxy → Watch History** keeps a record of everything streamed through M3U Proxy: which login watched what, on which player, for how long, and whether it was transcoded or failed over. It works for every player, not just M3U TV, since it comes from the proxy itself. Turn it on under **Settings → Proxy → Watch History**. See [Watch History](/docs/proxy/watch-history).

![Watch History in M3U Editor](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/watch-history.jpg)

## Take it with you

### Background audio and Picture in Picture

On phones and tablets, leaving the app no longer stops what you're watching. Press Home and the video shrinks into Picture in Picture, which is new on iPhone and iPad. Close that or lock the screen and the sound keeps going, with controls on the lock screen and in your notifications. On live TV, next and previous change channel.

![M3U TV's controls on the lock screen](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/phone-lock-screen.jpg)

Pause live TV for a while and **Play** picks up at the live point rather than where you left off. After five minutes paused, M3U TV stops the stream, so it doesn't hold one of your provider's connections while you're away. See [Picture-in-picture and background audio](/docs/m3u-tv/guide-and-playback#picture-in-picture-and-background-audio).

### CarPlay and Android Auto

M3U TV now shows up on your car's screen, with your **Favorites** and your **Live TV** categories. Pick a channel and it plays as audio with its logo and what's on, even with your phone locked in your pocket. Morning news on the commute, or the game when you can't be in front of a TV.

The car and the phone share one player. Get home, open M3U TV on your phone, and the channel carries on in the full-screen player. Start something on the phone, and the car's screen shows it and its controls work. See [In the car](/docs/m3u-tv/guide-and-playback#in-the-car).

![Live TV in CarPlay](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/carplay-live.jpg)

![Now Playing in CarPlay](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/carplay-now-playing.jpg)

![Favorites in Android Auto](/img/blog/m3u-editor-0-14-2-m3u-tv-1-3-0/android-auto.jpg)

## More in M3U TV 1.3.0

- **Audio and subtitle sync.** When the sound or subtitles are out of step, fix it from the player while the video keeps playing. The offset is saved for that channel, movie, or series.
- **Online subtitles.** **Search online** in the subtitle menu finds subtitles for movies and episodes, with no account.
- **The whole DVR library.** The Recordings tab now loads every recording, not just the newest 50, with status filters and sorting.
- **Request from the service you choose.** If your server has more than one Radarr or Sonarr, you can pick which one handles a request.
- **Continue Watching keeps up.** Finish an episode and its card moves to the next one straight away, and an Up Next episode can be skipped.
- **Remote buttons.** Play, Pause, Stop, Next, and Previous all work in the player.
- **Movies and series on mpv.** On Android, you can start movies and series with mpv instead of ExoPlayer, and M3U TV switches to mpv by itself when ExoPlayer struggles.
- **Smaller.** Two smaller display sizes, for TVs that make everything look huge.
- **Update notices.** M3U TV tells you when a new version is out.

## More in M3U Editor 0.14.2

- **Emby and Jellyfin without an API key.** If you aren't an admin on the server, sign in with a user's name and password instead. See [Sign in as a user](/docs/integrations/emby_integration#sign-in-as-a-user).
- **Requests list every Arr.** Search results show every Radarr or Sonarr that returned a title, so M3U TV can offer the choice above.
- **IMDb IDs for players.** Movie and series info now includes the IMDb ID, which is what M3U TV's online subtitle search looks up.
- **Fixes.** EPG exports keep the artwork roles you picked, Group Auto Sort now works on M3U playlists, DVR paging no longer skips recordings that start at the same time, Easy Editor saves custom channels with all their data, alias logins can open related series, and stream file syncs are faster on big libraries.
- **Security.** Webhook requests now check the address they actually connect to, closing a DNS rebinding hole.

As always, the full lists are in the [M3U Editor](https://github.com/m3ue/m3u-editor/releases) and [M3U TV](https://github.com/m3ue/m3u-tv/releases) release notes.
