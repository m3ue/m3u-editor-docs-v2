---
sidebar_position: 6
description: Generate smart, context-aware dummy EPG from IPTV stream titles using regex extraction
tags:
  - Advanced
  - EPG
  - AED
title: Advanced EPG Dummies (AED)
---

# Advanced EPG Dummies (AED)

Generate smart, context-aware EPG entries for channels that have no EPG source — by extracting event information directly from the provider's stream title.

## Overview

Many IPTV providers dynamically update the stream title to reflect the currently airing event. For example, a PPV channel might show:

```
PPV 1: Tommy Fury vs. Eddie Hall [DAZN] (06.13 13:00 ET / 18:00 BST)
```

Standard dummy EPG creates a generic repeating block titled with the channel name. AED reads the stream title, extracts the event title, start time, and date using configurable regex patterns, and generates a meaningful single-event EPG entry instead.

**What AED provides:**

- ✅ Event-aware EPG entries derived from live stream titles
- ✅ Correct start times extracted and converted between timezones
- ✅ Configurable title and description templates
- ✅ AI-assisted regex generation
- ✅ Group-level and per-channel profile assignment
- ✅ Override mode to force AED even when an EPG channel is mapped

## How It Works

1. **Profile** — define regex patterns that extract the event title, start time, and optionally the date from a channel's stream title
2. **Assignment** — attach the profile to a group (all channels inherit it) or override it on individual channels
3. **Generation** — when the EPG XML is generated, channels with an AED profile use the extractor instead of the standard repeating dummy slots

If extraction fails (the stream title doesn't match the patterns), the channel falls back to the standard dummy EPG behaviour automatically.

## Creating an AED Profile

Navigate to **AED Profiles** in the sidebar and click **New profile**.

### Source Extraction

These fields control how information is pulled from the raw stream title.

| Field | Description |
|---|---|
| **Title Regex** | Captures the event name. Use a named group `(?P<title>...)` or the first capture group. |
| **Time Regex** | Captures the start time string. First capture group is used. |
| **Time Format** | PHP `date()` format string matching what Time Regex captures — e.g. `H:i`, `h:i A`. |
| **Source Timezone** | The timezone of the extracted time (e.g. `America/New_York`, `Europe/London`). |
| **Date Regex** | *(Optional)* Captures a date string from the title. If absent, today's date is assumed. |
| **Date Format** | *(Optional)* PHP `date()` format for the captured date — e.g. `m.d`, `d/m/Y`. |

#### AI Regex Builder

:::note
The AI Regex Builder requires **AI Copilot** to be enabled in Settings. See [AI Copilot](/docs/ai-copilot/overview) for setup instructions.
:::

The **AI Regex** action (accessible from the profile form) generates pattern suggestions automatically:

1. Open or create an AED Profile
2. Click **AI Regex** in the top-right of the form header
3. Select the channel group whose titles should be sampled
4. Click **Generate** — the AI analyses the titles and suggests regex patterns
5. Review the **Suggested Patterns** section and click **Apply Suggestions** to populate the form fields

:::tip
The AI works best with structured titles that follow a consistent format (e.g. `Channel: Event Title (HH:MM TZ)`). Channels with generic placeholder titles like `EVENT 1` are automatically excluded from the sample set.
:::

### Output Format

These fields control what the generated EPG entry looks like.

| Field | Description |
|---|---|
| **Event Duration (minutes)** | Length of the dummy programme block. Default: `180`. |
| **Output Timezone** | Timezone for the `start`/`stop` attributes in the XMLTV output. Default: `UTC`. |
| **Title Format** | Template for the `<title>` element. Supports `{title}`, `{channel}`, `{date}`, `{time}`. |
| **Description Format** | *(Optional)* Template for the `<desc>` element. Same variables available. |
| **No Event Format** | Fallback title when extraction fails. Default: `{channel}`. |
| **Category** | *(Optional)* `<category>` value written into the EPG entry. |

#### Override Mode

When **Override** is enabled on a profile, channels assigned that profile will always use AED — even if they already have an EPG channel mapped. This is useful when provider titles are more accurate than the EPG source.

When disabled, AED only activates for channels without any EPG match (the standard fallback behaviour).

## Assigning Profiles

### To a Group

Assigning a profile to a group sets it as the default for every channel in that group.

1. Navigate to **Groups**
2. Open a group
3. Set **AED Profile** in the EPG section
4. Save

All channels in the group without an individual profile will use this one.

### To Individual Channels

Per-channel assignment overrides the group's profile.

1. Navigate to a playlist's **Channels**
2. Open a channel
3. Set **AED Profile** in the EPG section
4. Save

Leave the field blank to inherit from the group.

### Bulk Assignment

To assign (or remove) a profile across many channels at once:

1. Navigate to a playlist's **Channels**
2. Select channels using the checkboxes
3. Click **Actions** → expand the **EPG** section
4. Choose **Set AED Profile** or **Remove AED Profile**

## Programme Title Source

The **Dummy EPG Title Source** setting on each playlist controls which channel field is used as the programme title in dummy EPG entries (including AED-generated ones when the title template uses `{channel}`).

Configure it under **Playlist Settings → EPG → Dummy EPG Title Source**.

Fields are tried in the order you define — first non-empty value wins:

| Field | Description |
|---|---|
| **Channel Title** | The stream's `tvg-name` or custom title |
| **Channel Name** | The display name field |
| **Stream ID** | The provider's stream/TVG ID |
| **Channel Number** | The assigned channel number |

If left empty, the channel title is used by default.

## Troubleshooting

### No AED entry generated

- Confirm the channel has an AED profile assigned (directly or via its group)
- Check that **Dummy EPG** is enabled on the playlist
- Verify the regex patterns match against sample titles using the **Regex Tester** inside the profile form
- If **Override** is off, a mapped EPG channel takes precedence — enable Override or unmap the EPG channel

### Wrong start time or timezone

- Verify **Source Timezone** matches the timezone in the provider's title string
- Check that **Time Format** matches the exact format of the extracted time
- If the date is wrong, add a **Date Regex** + **Date Format** to extract an explicit date rather than defaulting to today

### AI Regex generates empty patterns

The AI requires structured titles to work with. Check that the selected group contains channels whose titles follow a consistent format with a recognisable time component (e.g. `18:00`, `6:00 PM`). Channels with generic titles like `EVENT 1` are excluded from the sample automatically.

### Extraction falls back to standard dummy

When the regex doesn't match the current title, AED falls back gracefully to the standard repeating dummy EPG. This is expected if the provider hasn't updated the title yet for the current event.

## Next Steps

- [EPG Setup](/docs/resources/epg-setup) — configure EPG sources and channel mapping
- [EPG Cache Overview](/docs/advanced/epg-optimization) — caching and performance for large EPG files
