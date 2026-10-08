---
sidebar_position: 3
description: Every tool the AI Copilot can use - records, the guide and DVR, EPG mapping, network content, the database, docs search, and memory - and which ones ask for approval.
tags:
  - AI Copilot
  - Tools
title: Tools
---

# Tools

Tools are how the Copilot acts. When you ask for something, it decides which tools to use, runs them, and tells you what it found or did. Ask "What tools do you have?" in the chat to see what it can use right now.

## Always available

| Tool | Lets the Copilot |
|---|---|
| **Records** | List, search, view, create, edit, and delete records like channels, playlists, EPGs, and groups. It can only do what your account is allowed to. |
| **Navigation** | Open pages in M3U Editor for you. |
| **Memory** | Remember notes you give it ("Remember that my main playlist is called Home"), across conversations. Ask "What do you remember?" to see them. |

## Optional tools

Turn these on under **Enabled Tools** in **Settings → AI Copilot**:

| Tool | Lets the Copilot |
|---|---|
| **Search Documentation** | Answer questions from these docs. |
| **EPG Mapper: Mapping State** | Show how many channels in each playlist and group have guide data. Turning it on also adds a **Map EPG Channels** quick action. |
| **EPG Mapper: Channel Matcher** | Find guide channels for unmapped channels, cleaning up prefixes like `US:` and labels like `HD` first. It uses the same settings as your [EPG maps](/docs/resources/epg-setup#improve-the-matches). |
| **EPG Mapper: Apply Mappings** | Apply the matches you've agreed to. |
| **DVR: Overview** | Report what's recording, what's coming up, your rules, recent failures, and disk use. |
| **DVR: Schedule** | Look up what's on (now, tonight, this week, or around a show) and schedule [recordings](/docs/integrations/dvr_integration). |
| **Content: VOD Search** | Find movies by genre, year, rating, or keyword. |
| **Content: Network Bulk Add** | Add movies it found to a [Network](/docs/integrations/media_networks_integration). |
| **Content: Pin to Timeslot** | Schedule something on a Network at a set time, like "every Friday at 8pm". |
| **Database: Get Schema** | See the database's tables and columns. |
| **Database: Execute Query** | Read, update, or delete database records directly. |

:::warning Database tools
**Database: Execute Query** can change anything in your database. Turn it on only if you're comfortable reviewing the queries it proposes.
:::

## Approvals

*(v0.13.1+)* Tools that make bulk changes stop and show **Approve** and **Reject** buttons in the chat. Nothing runs, and you can't type, until you choose:

- database queries other than `SELECT`
- applying EPG mappings
- adding content to a Network, or pinning it to a time

Creating, editing, and deleting single records doesn't ask, but always follows your account's permissions.

## Rating replies

*(v0.13.1+)* Each reply has thumbs up and thumbs down buttons. The rating is saved with the message, and shows in the conversation history when [management](configuration#history-and-limits) is on.
