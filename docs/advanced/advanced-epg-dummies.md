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
| **Date Regex**, **Date Format** | The date, if the name has one, like `m.d`. Without it, today is assumed. |
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

## Use a profile

- **For a group:** set **AED Profile (Advanced EPG Dummy)** on the group in **Live Channels → Groups**. Every channel in it uses the profile, unless it has its own.
- **For channels:** set **AED Profile** when editing a channel, or select channels and use **Set AED Profile** from the bulk actions.

The playlist also needs **Enable dummy EPG** on, under **Output → EPG Output**.

## Troubleshooting

| Problem | What to check |
|---|---|
| No entries appear | The channel or its group has a profile, and the playlist has **Enable dummy EPG** on. If the channel has guide data mapped, turn on **Override**. |
| Times are off by hours | **Timezone of Source** matches the time in the name, and **Time Format** matches how it's written. |
| The date is wrong | Add a **Date Regex** and **Date Format**. |
| Only the channel name shows | The patterns don't match this name. Check them with **Test Extraction**. The provider may not have put the next event in the name yet. |
