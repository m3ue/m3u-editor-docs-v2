---
sidebar_position: 1
description: The AI Copilot is a chat assistant inside M3U Editor that can find, change, and explain things for you in plain language.
tags:
  - AI Copilot
  - Assistant
title: AI Copilot
---

# AI Copilot

The AI Copilot is a chat assistant inside M3U Editor. Ask it something in plain language, and it can look things up, make changes, map guide data, schedule recordings, and answer questions from these docs, without you hunting through menus.

It uses an AI provider you choose, like OpenAI, Anthropic, or a model running on your own machine with Ollama. The Copilot is only available to admin users.

## Turn it on

1. Go to **Settings → AI Copilot**.
2. Turn on **Enable AI Copilot**.
3. Choose a **Provider** and enter its **API Key**. Local providers like Ollama don't need one. See [Configuration](configuration).
4. Save, and refresh the page.

The Copilot's icon appears in the top bar. Select it to open the chat.

## What to ask

| Ask | What happens |
|---|---|
| "How many channels in my Sports group are disabled?" | It looks it up and answers. |
| "Map guide data for the unmapped channels in my main playlist." | It finds likely matches and, once you approve, applies them. |
| "What's on ESPN tonight?" | It checks the guide for your mapped channels. |
| "Record every new episode of Jeopardy." | It creates a DVR series rule. |
| "How do I set up Provider Profiles?" | It searches these docs and explains. |
| "Remember that my main playlist is called Home." | It saves the note for later conversations. |

Some of these need their tool turned on under **Enabled Tools** in [Configuration](configuration#tools), like guide mapping and the DVR. Changes that are hard to undo, like database writes and applying guide mappings, ask for your approval in the chat first. See [Tools](tools).
