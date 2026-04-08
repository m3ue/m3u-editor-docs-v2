---
sidebar_position: 3
description: Reference for all built-in AI Copilot tools available in M3U Editor
tags:
  - AI Copilot
  - Tools
  - Reference
title: Tools
---

# Tools

Tools give the AI Copilot the ability to take real actions — not just answer questions. Each tool is a discrete capability that the assistant can invoke autonomously during a conversation based on what you ask.

---

## Global Tools

Global tools are available on **every page** regardless of which resource you are viewing. You can toggle individual tools on or off under **Preferences → AI Copilot → Global Tools**.

| Tool | Description |
|---|---|
| **Get Available Tools** | Lists all tools currently available to the assistant in the current context. Useful for asking the AI what it can do. |
| **Run Tool** | Allows the AI to execute another tool by name. Enables multi-step tool chaining. |
| **List Resources** | Lists all registered admin resources (channels, playlists, EPG sources, etc.). |
| **List Pages** | Lists all registered admin pages the assistant can navigate to. |
| **List Widgets** | Lists all registered dashboard widgets. |
| **Remember** | Stores a piece of information in the assistant's memory for your user account, persisted across sessions. |
| **Recall Memories** | Retrieves all stored memories for your user account. |
| **Search Documentation** | Searches the M3U Editor documentation site and returns relevant excerpts. |

---

## Resource Tools

When you are on a resource page (e.g. the Channels list), the assistant automatically gains access to tools for that resource:

| Tool | Description |
|---|---|
| **List Records** | Returns a paginated list of records for the resource. |
| **Search Records** | Searches records by name or other searchable fields. |
| **View Record** | Returns the full details of a single record by ID. |
| **Create Record** | Creates a new record using data you describe in the chat. |
| **Edit Record** | Updates an existing record. |
| **Delete Record** | Deletes a record after confirmation. |

Resource tools are context-aware — they are scoped to the resource you are currently viewing and respect your user permissions.

---

## Memory

The **Remember** and **Recall Memories** tools give the assistant a persistent memory scoped to your user account.

**What you can store:**
- Your preferred playlist name or server details
- Reminders or notes about your setup
- Context that helps the assistant give better answers over time

**Examples:**
```
Remember that my main playlist is called "Home IPTV"
Remember that I prefer UK English spellings
```

```
What do you remember about me?
```

Memory entries persist across browser sessions and are only visible to your user account.

---

## Documentation Search

The **Search Documentation** tool lets the assistant look up information from the M3U Editor docs in real time. Ask questions like:

- `How do I set up provider profiles?`
- `What environment variables are available for the proxy?`
- `Explain how stream probing works`

The assistant will search the docs, retrieve the most relevant sections, and summarise the answer for you — without you leaving the app.

---

## Tips

- **Ask the AI what it can do** — type `What tools do you have available?` and it will list everything in the current context.
- **Tools respect permissions** — the AI cannot create or delete records if your account does not have permission to do so.
- **Tools are always confirmed** — destructive actions (delete, bulk update) will be clearly described by the AI before execution. You can always say "no" or ask it to stop.
