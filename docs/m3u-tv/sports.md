---
sidebar_position: 2.5
title: Sports
description: Browse each day's games in M3U TV, start a game from the channel showing it, and follow your teams.
tags:
  - M3U TV
  - Sports
---

# Sports

*(v1.2.5+)* The Sports screen lists each day's games with live scores. Press a game and M3U TV plays the channel showing it, so you don't have to hunt through your channel list first.

It's switched on in M3U Editor v0.14.1 or later, under [**Settings → Integrations → Sports API**](/docs/integrations/sports). Until then, the screen doesn't appear in the app. The games come from M3U Editor, and the app never contacts a sports provider itself.

## Browse the games

Open **Sports** from the sidebar. Across the top, the date bar moves between days, up to 7 days back and 14 days ahead, and can jump back to today. Games under way are grouped at the top under **Live Now**, and the rest follow by league.

The strip on the left narrows the list:

| Option | Shows |
|---|---|
| **All Leagues** | Every game on the day, from the leagues you've chosen |
| **My Teams** | Only the teams you follow |
| A league | That league's games |

**Search teams** finds a team in the day's games. Scores update on their own while a game is on or about to start.

**Leagues** chooses which leagues this device shows, grouped by sport. It starts with the ones your server suggests, usually the biggest leagues, or all the ones your admin has limited Sports to.

## Watch a game

Each game shows how many of your channels have it. Press it to start watching:

- **One channel:** it starts playing.
- **Several channels:** you pick one, with the best match first.
- **No channel, or a finished game:** its details open instead.

Hold OK on a game (or long-press on a touchscreen) for more: **Watch**, **Game details**, **Add to Multiview**, and following either team.

If a game you expected shows **No channel**, your playlist may not carry it, or its guide may not list it. See [How channels are found](/docs/integrations/sports#how-channels-are-found).

## Game details

**Game details** shows the score by period, key moments, team stats, top performers, and game info such as the venue and broadcast, as far as the provider has them. **On Your Channels** lists the channels showing it, so you can start one from here too. Live games keep updating while the page is open.

## Follow your teams

Follow a team from a game's menu, from its details page, or with **Teams**, which lists every team in a league. Your teams appear under **My Teams** and move up in Home's Sports row.

Follows belong to the active [viewer](settings#account), so on servers that support it they carry over to your other devices. League choices stay on each device.

## On Home

When Sports is on, Home gets a Sports row with today's games that have a channel, live games and your teams first. On **Spotlight**, a focused game shows both team crests, the score, and details in the hero. **View All** opens the Sports screen.

You can move the row, turn it off, or hide Sports from the nav under [**Navigation & Home**](settings#navigation--home). To open the app on Sports, set **Settings → Appearance → Default start page** to **Sports**.

## Related

- [Setting up Sports in M3U Editor](/docs/integrations/sports)
- [Multiview](guide-and-playback#multiview)
- [Settings](settings)
