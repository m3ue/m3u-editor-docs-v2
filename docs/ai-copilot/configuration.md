---
sidebar_position: 2
description: Choose the Copilot's AI provider and model, and set its instructions, tools, quick actions, history, and usage limits.
tags:
  - AI Copilot
  - Configuration
  - Providers
title: Configuration
---

# Configuration

All Copilot settings are in **Settings → AI Copilot**. Save and refresh the page after changing them.

## Provider and model

| Setting | What it does |
|---|---|
| **Provider** | The AI service the Copilot uses (below). |
| **Model** | The model to use. Leave it empty for the provider's default. |
| **API Key** | Your key for the provider. Not needed for Ollama, and optional for Unsloth Studio. |
| **Base URL** | A different address for the provider's API, for self-hosted or OpenAI-compatible servers. Available for OpenAI, OpenCode, MiniMax, Ollama, and Unsloth Studio. |

| Provider | Default model | Environment variable for the key |
|---|---|---|
| OpenAI | `gpt-5.4-mini` | `OPENAI_API_KEY` |
| Anthropic | `claude-sonnet-4-6` | `ANTHROPIC_API_KEY` |
| Google Gemini | `gemini-2.5-flash` | `GEMINI_API_KEY` |
| Mistral | `mistral-large-latest` | `MISTRAL_API_KEY` |
| Groq | `llama-3.3-70b-versatile` | `GROQ_API_KEY` |
| DeepSeek | `deepseek-v4-flash` | `DEEPSEEK_API_KEY` |
| xAI (Grok) | `grok-3` | `XAI_API_KEY` |
| MiniMax | `MiniMax-M2.7` | `MINIMAX_API_KEY` |
| OpenRouter | `openai/gpt-5.4` | `OPENROUTER_API_KEY` |
| OpenCode Zen, OpenCode Go | `gpt-5.4-mini`, `deepseek-v4-flash` | `OPENCODE_ZEN_API_KEY`, `OPENCODE_GO_API_KEY` |
| Ollama (Local) | `llama3` | None. Set the address with `OLLAMA_BASE_URL` (default `http://localhost:11434`). |
| Unsloth Studio (Local) | Whichever model is loaded | Optional `UNSLOTH_STUDIO_API_KEY`. Set the address with `UNSLOTH_STUDIO_URL` (default `http://localhost:8888/v1`). |

You can set the key in the settings page or as an environment variable on the editor container. A key entered in the settings page is used when both are set. `COPILOT_PROVIDER` and `COPILOT_MODEL` preselect a provider and model.

:::tip Running Ollama on the same machine
Inside the container, `localhost` is the container itself. Point **Base URL** at your machine's LAN IP, like `http://192.168.1.50:11434`, or at the Ollama container's name if it's on the same Docker network.
:::

## System prompt

**System Prompt** replaces the Copilot's built-in instructions. Leave it empty to keep the default, which already knows M3U Editor's features and tools. If you write your own, keep the tool guidance from the default, or the Copilot may stop using some tools well.

## Tools

**Enabled Tools** chooses the extra tools the Copilot can use, such as database queries, the EPG mapper, and DVR scheduling. Looking up records, navigation, and memory are always available. See [Tools](tools).

## Quick actions

Quick actions are buttons in the chat that send a prompt you've written, for things you ask often. Add them under **Quick Actions**, each with a **Label** (the button text) and a **Prompt**:

| Label | Prompt |
|---|---|
| Unmapped channels | Which enabled live channels have no guide data? |
| Tonight | What's on my favorite channels tonight? |
| Failed syncs | Did any playlist or EPG syncs fail today? |

Buttons appear in the order you list them.

## History and limits

Turn on **Enable AI Copilot Management** to keep a record of how the Copilot is used. It adds:

- **Conversations:** every chat, by every admin, including the tools it used.
- **Audit logs:** each tool call, record access, and message, with who and when.
- **Rate limits:** caps on messages and tokens per user, per hour and per day, to control what your provider charges.

They appear in a **Copilot** group in the sidebar, with a usage dashboard. History is only kept while management is on, so turn it on before you need it.
