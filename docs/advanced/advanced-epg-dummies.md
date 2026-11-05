---
sidebar_position: 12
description: Build guide entries for event channels (sports, PPV) from the event name and time in the channel's title.
tags:
  - Advanced
  - EPG
  - AED
title: Advanced EPG Dummies (AED)
---

# Advanced EPG Dummies (AED)

Event channels, like sports and pay-per-view, rarely have guide data. Instead, providers often put the event in the channel's name:

```
PPV 1: Tommy Fury vs. Eddie Hall [DAZN] (06.13 13:00 ET / 18:00 BST)
```

An **AED profile** reads names like that, pulls out the event, its start time, and its date, and builds a proper guide entry: the event at the right time, with "starting soon" and "signing off" slots around it. Channels it can't read fall back to the regular [placeholder guide](/docs/resources/epg-setup#placeholder-guides).

## Create a profile

Go to **EPG → AED Profiles** and choose **New AED Profile**.

### Read the channel name

Regular expressions pick each part out of the name:

| Field | Picks out |
|---|---|
| **Title Regex** | The event, like `Tommy Fury vs. Eddie Hall`. Leave it empty to use the whole name. |
| **Team Delimiter** | Optional. Splits the event into `{team1}` and `{team2}`, for example on ` vs. `. |
| **Time Regex**, **Time Format** | The start time, and its format (PHP date format, like `H:i` or `g:i A`; separate several with a pipe). |
| **Date Regex**, **Date Format** | The date, if the name has one, like `m.d`. Without it, today is assumed. *(v0.13.4+)* Separate several formats with a pipe, like the time format. |
| **Timezone of Source** | The timezone the time is written in, like `America/New_York`. |
| **Logo URL** | Optional artwork for the entries. |

**Test Extraction** tries the patterns on a sample name, so you can check them before saving.

:::tip Let AI write the patterns
With the [AI Copilot](/docs/ai-copilot/overview) set up, **AI Regex** writes the patterns for you. Paste a few channel names into **Sample Titles**, choose **Generate Regex**, and apply the suggestions.
:::

### Build the guide entry

| Field | Default | What it does |
|---|---|---|
| **Title Output Format** | `{title}` | The program title. Use `{title}`, `{team1}`, `{team2}`, `{channel}`, `{date}`, and `{time}`. |
| **Description Output Format** | The title | The description, with the same placeholders. |
| **Event Duration (minutes)** | 180 | How long the event lasts in the guide. |
| **Pre-Event Format** | `Live in {time_until}: {title}` | Fills the time before the event. Empty leaves it blank. |
| **Post-Event Format** | `Signing Off` | Fills the time after it. Empty leaves it blank. |
| **No Event Format** | `{channel}` | The title when the name can't be read. Empty adds no entry at all. |
| **EPG Category** | None | A category for the entries, like `Sports`. |
| **Output Timezone** | UTC | The timezone written into the guide. |
| **Dummy EPG Length (days)** | The playlist's | How many days of entries to make. |

**Override** uses the profile even on channels that already have guide data mapped. Turn it on when the channel names are more accurate than your guide.

## Match real games

*(v0.14.1+)* Writing patterns works well when a provider's names all follow one format, but sports channels often don't. With [Sports](/docs/integrations/sports) turned on, a profile can recognize the game from the team names instead, however the name is written, and take the real start time, teams, and league from the schedule.

Open the profile's **Sports API** section and turn on **Match real games**:

| Field | Default | What it does |
|---|---|---|
| **Leagues** | All leagues | The leagues these channels carry. Choosing them is recommended: there are fewer wrong matches, and guides build faster. |
| **Game Title Format** | `{away} at {home}` (`{home} vs {away}` for soccer) | The program title. Use `{home}`, `{away}`, `{league}`, `{venue}`, `{event}`, `{channel}`, `{date}`, and `{time}`. |
| **Game Duration (minutes)** | By sport | How long the game lasts in the guide, from 15 to 720. Empty uses a typical length for the sport. |

Channels that don't match a game fall back to your patterns, then to the **No Event Format**. If a name includes a time or date, your time and date patterns also help pick the right game when teams play more than once in the window. Timezone, pre- and post-event entries, category, and guide length apply to every channel. **Test Extraction** marks a channel that found a game with **Game match**.

M3U Editor checks each profile's games every 15 minutes in the background, and rebuilds the guide only if something changed. For a schedule change you need right away, use **Refresh Games** from the profile's row in the list. Right after you first turn on matching, channels can use your patterns until the games have been fetched.

## Use a profile

- **For a group:** set **AED Profile (Advanced EPG Dummy)** on the group in **Live Channels → Groups**. Every channel in it uses the profile, unless it has its own.
- **For channels:** set **AED Profile** when editing a channel, or select channels and use **Set AED Profile** from the bulk actions.

## Troubleshooting

| Problem | What to check |
|---|---|
| No entries appear | The channel or its group has a profile. If the channel has guide data mapped, turn on **Override**. |
| Times are off by hours | **Timezone of Source** matches the time in the name, and **Time Format** matches how it's written. |
| The date is wrong | Add a **Date Regex** and **Date Format**. |
| Only the channel name shows | The patterns don't match this name. Check them with **Test Extraction**. The provider may not have put the next event in the name yet. |
| **Match real games** finds nothing | [Sports](/docs/integrations/sports) needs to be on, and the game's league must be in the profile's **Leagues**. A name has to mention the teams. College teams are recognized by school, not nickname alone. |
