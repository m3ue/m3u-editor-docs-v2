---
sidebar_position: 1
description: Introduction to the AI Copilot — an in-app chat assistant for M3U Editor
tags:
  - AI Copilot
  - Assistant
  - Overview
title: Overview
---

# AI Copilot

The AI Copilot is an in-app chat assistant built into M3U Editor. It lives in the top navigation bar as a chat icon and lets admins interact with the application using plain English — searching records, creating or editing data, navigating pages, and looking up documentation — without ever leaving the UI.

:::info
The AI Copilot is only accessible to **admin users** and users who have the **Use AI Copilot** permission added.
:::

---

## How It Works

When enabled, the Copilot opens a chat panel where you type requests in natural language. Behind the scenes the assistant can call **tools** to take real actions:

- **Search & list** channels, playlists, EPG sources, and other resources
- **Create, edit, or delete** records directly from the chat
- **Navigate** to any page in the admin panel
- **Look up documentation** from the M3U Editor docs site
- **Remember facts** across sessions so you don't have to repeat context

Tools are discrete PHP classes with typed inputs. The AI receives their descriptions and decides autonomously which ones to call during a conversation.

---

## Enabling the Copilot

1. Go to **Preferences → AI Copilot** (admin only).
2. Toggle **Enable AI Copilot** to **ON**.
3. Choose an **AI Provider** and enter your **API Key** (see [Configuration](./configuration) for all options).
4. Click **Save**.

The chat icon will appear in the top navigation bar immediately — no server restart required.

:::tip
Settings are stored in the database, so changes take effect instantly for all admin users.
:::

---

## What You Can Ask

Here are some example prompts to get you started:

| Prompt | What happens |
|---|---|
| `Find the channel called BBC One` | Searches channels and returns a matching record |
| `Show me all playlists that have proxy enabled` | Lists filtered playlist records |
| `Create a new EPG source for...` | Opens a creation form pre-filled from your message |
| `How do I set up provider profiles?` | Searches the docs and returns an excerpt |
| `Remember that my main playlist is called "Home"` | Stores the note in the assistant's memory |

---

## Next Steps

- [Configuration](./configuration) — Set up your AI provider and fine-tune behaviour
- [Tools](./tools) — See every built-in tool the assistant can use
- [Quick Actions](./quick-actions) — Add one-click shortcut buttons to the chat
- [Management](./management) — Browse conversation history, audit logs, and rate limits
