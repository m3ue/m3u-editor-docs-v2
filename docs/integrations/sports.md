---
sidebar_position: 2.5
description: See each day's games with live scores, find the channels in your playlist showing them, and build guide entries for event channels from real schedules.
tags:
  - Sports
  - Integrations
  - EPG
title: Sports
---

import { Steps, Step } from '@site/src/components/Steps';

# Sports

*(v0.14.1+)* Finding a game usually means scrolling through hundreds of channels and hoping one has the right name. With Sports turned on, M3U Editor reads the day's games from a sports data provider and checks them against your channels and guide. You pick a game and it shows you which of your channels has it.

You can use it in three places:

| Where | What you get |
|---|---|
| [The Sports page](#the-sports-page) in M3U Editor | A day's games with live scores and stats, and the channels showing each one, ready to play. |
| [M3U TV](/docs/m3u-tv/sports) *(v1.2.5+)* | A Sports screen and a Home row, where pressing a game starts it. You can also follow your teams. |
| [Guide entries](#better-guide-entries-for-event-channels) | Channels like `NHL 04: Rangers at Bruins` get proper guide entries, at the game's real time. |

Sports doesn't add any streams. You can only watch a game if your provider carries it.

## Turn it on

<Steps>
<Step title="Open the Sports API settings">

Go to **Settings → Integrations → Sports API**.

</Step>
<Step title="Choose a provider">

Turn on **Use ESPN API (Unofficial)**. It's free and needs no account. **Test Connection** checks that M3U Editor can reach it.

You can add [TheSportsDB](#choosing-a-provider) as well, or use it instead.

</Step>
<Step title="Limit it to your leagues (recommended)">

Under **Leagues**, pick the ones you watch in **Limit to Leagues**. M3U Editor then only fetches those leagues, so everything loads faster and your provider gets fewer requests. Leave it empty to use every league.

</Step>
<Step title="Save">

The **Sports** page appears under **Playlist** in the sidebar, and the Sports screen appears in M3U TV the next time it signs in.

</Step>
</Steps>

Only M3U Editor contacts the sports provider. It caches what it gets, and your players and TV apps get everything from M3U Editor.

## Choosing a provider

| | ESPN | TheSportsDB |
|---|---|---|
| **Cost** | Free | Needs a [paid API key](https://www.thesportsdb.com/pricing). The free key is limited to 3 games a day and 10 teams a league, so it isn't accepted. |
| **Coverage** | Major leagues in football, basketball, baseball, hockey, soccer, and more | Hundreds of leagues ESPN doesn't carry, including many minor and regional ones |
| **Reliability** | An unofficial, undocumented API that could change or stop working without notice | A supported API. Schedule and score data is provided by TheSportsDB. |

Most people should start with ESPN. Add TheSportsDB if a league you watch is missing.

With both on, a league they both carry comes from ESPN, so a game never appears twice. If you later turn a provider off, leagues you've already picked keep working wherever the other one carries them.

**API URL**, under ESPN, is for pointing at a mirror or a new address if ESPN moves its API. Leave it empty otherwise.

## The Sports page

Open **Sports** from the sidebar, the dashboard, or the trophy button on a playlist's row. Choose a **Playlist**, a **Date** (up to 7 days back and 14 days ahead), and your **Leagues**.

Games show first, then the channels load in, so a large playlist doesn't keep you waiting on the scores. Games under way sit at the top in **Live Now**, and the rest are grouped by league. Scores update on their own while a game is on.

Select a game for its details: score by period, key moments, team stats, top performers, and game info, as far as the provider has them. Games you can still watch list the channels showing them, and selecting one plays it in the floating player.

**Rematch channels** looks again, which is handy if you've just changed channels or refreshed your guide.

:::note Which playlists it covers
The page works with regular playlists, and you can pick up to 30 leagues at a time. In M3U TV, Sports works with any login, including Custom Playlists, Merged Playlists, and Aliases.
:::

## How channels are found

M3U Editor looks through the playlist's enabled live channels for a game's teams in two places:

- **The guide:** the title and subtitle of whatever is on a channel just after kickoff, so pre-game shows don't count.
- **The channel's name:** for event channels, such as `NHL 04: Rangers at Bruins`.

The strongest matches come first in the list, starting with channels whose guide title names the game. Matching runs when someone asks for a day's games, not in the background, and the result is kept for a few minutes so several TVs can share it. If you don't use Sports, it costs nothing.

So the better your [guide data](/docs/resources/epg-setup), the more games get a channel. A channel with no guide mapped can only be found by its name.

## Better guide entries for event channels

Providers often put the event in the channel's name and leave the guide empty. An [AED profile](/docs/advanced/advanced-epg-dummies) turns those names into guide entries, and with **Match real games** on, it recognizes the game from the team names, in any title format, and uses the real start time and teams. See [Match real games](/docs/advanced/advanced-epg-dummies#match-real-games).

The **Generate EPG data for your channels** note at the top of the settings tab links straight to your AED profiles.

## Troubleshooting

| Problem | What to check |
|---|---|
| No Sports screen in M3U TV | Sports needs M3U TV v1.2.5 or later and M3U Editor v0.14.1 or later, with a provider turned on. Sign out and in, or restart the app, to pick up the change. |
| **No channel** on a game | Your playlist may not carry it. Check that the channel is enabled and has guide data mapped, and that the guide lists the game while it's on. |
| A league is missing | Check **Limit to Leagues**. In M3U TV, each device also picks its own leagues with **Leagues**. If neither provider carries it, try adding TheSportsDB. |
| **Connection Failed** on ESPN | The unofficial API may be down or have moved. Check again later, or set **API URL** if you know its new address. |
| TheSportsDB refuses the key | The free key (`123`) isn't accepted. It needs a paid key. |
| The first load is slow | The first request for a day fetches it from the provider. After that it comes from the cache. **Limit to Leagues** helps the most. |

## Related

- [Sports in M3U TV](/docs/m3u-tv/sports)
- [Advanced EPG Dummies](/docs/advanced/advanced-epg-dummies)
- [EPG Setup](/docs/resources/epg-setup)
