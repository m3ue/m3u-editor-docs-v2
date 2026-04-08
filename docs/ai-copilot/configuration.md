---
sidebar_position: 2
description: Configure the AI Copilot — providers, models, API keys, and settings
tags:
  - AI Copilot
  - Configuration
  - Providers
title: Configuration
---

# Configuration

All Copilot settings are managed through **Preferences → AI Copilot**. Changes are saved to the database and take effect immediately — no restart required.

---

## Settings Reference

| Setting | Description |
|---|---|
| **Enable AI Copilot** | Master toggle. Shows or hides the chat icon in the navbar. |
| **Enable AI Copilot Management** | Enables conversation history, audit log, and rate-limit management pages. |
| **AI Provider** | Which AI backend to use (OpenAI, Anthropic, Gemini, etc.). |
| **Model** | Model name. Leave blank to use the provider default (see table below). |
| **API Key** | Your provider API key. Not required for Ollama. |
| **System Prompt** | Custom instructions prepended to every conversation. Useful for setting tone or restricting scope. |
| **Global Tools** | Which built-in tools the assistant can use on any page. |
| **Quick Actions** | Pre-defined prompts shown as clickable buttons in the chat window. |

---

## Supported AI Providers

| Provider | Key | Notes |
|---|---|---|
| **OpenAI** | `openai` | Default. Enter your `OPENAI_API_KEY`. |
| **Anthropic** | `anthropic` | Enter your `ANTHROPIC_API_KEY`. |
| **Google Gemini** | `gemini` | Enter your `GEMINI_API_KEY`. |
| **Mistral** | `mistral` | Enter your `MISTRAL_API_KEY`. |
| **Ollama** | `ollama` | Self-hosted. Set `OLLAMA_BASE_URL` (default: `http://localhost:11434`). No API key needed. |
| **Azure OpenAI** | `azure` | Requires `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_URL`, and `AZURE_OPENAI_DEPLOYMENT`. |
| **Groq** | `groq` | Enter your `GROQ_API_KEY`. |
| **OpenRouter** | `openrouter` | Enter your `OPENROUTER_API_KEY`. |
| **DeepSeek** | `deepseek` | Enter your `DEEPSEEK_API_KEY`. |
| **xAI (Grok)** | `xai` | Enter your `XAI_API_KEY`. |

### Default Models

If you leave the **Model** field blank, the following defaults are used:

| Provider | Default model |
|---|---|
| OpenAI | `gpt-4o` |
| Anthropic | `claude-sonnet-4` |
| Gemini | `gemini-2.0-flash` |
| Mistral | `mistral-large-latest` |
| Ollama | `llama3` |

You can override the model at any time by entering a model name in the **Model** field (e.g. `gpt-4o-mini`, `claude-3-5-haiku-latest`).

---

## API Keys

API keys can be supplied in two ways:

1. **Via Preferences UI** — Enter the key directly in the **API Key** field. It is stored encrypted in the database and injected at runtime.
2. **Via environment variables** — Set the appropriate variable in your `docker-compose.yml` (e.g. `OPENAI_API_KEY`). This is useful for self-hosted deployments where you prefer not to store secrets in the database.

:::note
Environment variable keys and UI keys can coexist. The UI key takes precedence if both are set.
:::

---

## System Prompt

The system prompt is prepended to every conversation as a hidden instruction. Use it to:

- Set the assistant's tone or persona
- Restrict the assistant to specific topics
- Provide context about your setup (e.g. your server name or preferred language)

**Example:**
```
You are a helpful assistant for managing an IPTV playlist server.
Only answer questions related to M3U Editor and IPTV management.
Always respond in English.
```

Leave blank to use the default behaviour.

---

## Environment Variables (Optional)

These variables can be set in your `docker-compose.yml` instead of using the Preferences UI:

| Variable | Provider |
|---|---|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic |
| `GEMINI_API_KEY` | Google Gemini |
| `MISTRAL_API_KEY` | Mistral |
| `GROQ_API_KEY` | Groq |
| `OPENROUTER_API_KEY` | OpenRouter |
| `DEEPSEEK_API_KEY` | DeepSeek |
| `XAI_API_KEY` | xAI |
| `OLLAMA_BASE_URL` | Ollama (default: `http://localhost:11434`) |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI |
| `AZURE_OPENAI_URL` | Azure OpenAI |
| `AZURE_OPENAI_DEPLOYMENT` | Azure OpenAI |
| `COPILOT_PROVIDER` | Pre-select the default provider |
| `COPILOT_MODEL` | Pre-select the default model |
