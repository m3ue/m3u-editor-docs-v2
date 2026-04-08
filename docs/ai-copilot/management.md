---
sidebar_position: 5
description: Manage AI Copilot conversations, audit logs, and rate limits
tags:
  - AI Copilot
  - Management
  - Audit
  - Rate Limits
title: Management
---

# Management

Management mode gives admins visibility and control over how the Copilot is being used — who is talking to it, what actions were taken, and how much AI budget has been consumed.

---

## Enabling Management Mode

1. Go to **Preferences → AI Copilot**.
2. Toggle **Enable AI Copilot Management** to **ON**.
3. Click **Save**.

Once enabled, a **Copilot** section appears in the admin sidebar with sub-pages for conversations, audit logs, and rate limits.

---

## Conversation History

The conversation history browser shows all past Copilot sessions across all admin users.

**What you can see:**
- Conversation title (auto-generated from the first message)
- The user who started the conversation
- Date and time
- Full message thread — including tool calls and their results

This is useful for reviewing what actions were taken via the Copilot and troubleshooting unexpected changes.

---

## Audit Log

The audit log records every tool call the assistant makes, including:

- Which tool was called
- The inputs passed to the tool
- The result returned
- The user and timestamp

| Log type | What is captured |
|---|---|
| **Tool calls** | Every tool invocation with its arguments and response |
| **Record access** | When the assistant reads or lists records |
| **Messages** | Full conversation message history |

Audit logging is enabled by default and can be configured per-category if needed.

---

## Rate Limits

Rate limits prevent excessive AI usage and help control API costs. They can be configured under **Preferences → AI Copilot** or in the management pages.

| Limit | Description |
|---|---|
| **Max messages per hour** | Maximum number of chat messages a user can send per hour |
| **Max messages per day** | Maximum number of chat messages per day |
| **Max tokens per hour** | Token budget per hour across all conversations |
| **Max tokens per day** | Token budget per day across all conversations |

:::note
Rate limits apply **per user**. Admin users can view current usage and reset limits from the management pages.
:::

When a user hits a rate limit, the Copilot displays a friendly message and resumes automatically once the limit window resets.

---

## Token Budget

In addition to rate limits, you can set soft spending budgets:

| Setting | Description |
|---|---|
| **Daily budget** | Warn when daily token usage reaches a set threshold |
| **Monthly budget** | Warn when monthly token usage reaches a set threshold |
| **Warn at percentage** | Show a warning banner when usage reaches this % of the budget (default: 80%) |

Budgets are informational — they trigger warnings but do not hard-stop the Copilot. Use rate limits if you need hard enforcement.

---

## Tips

- **Enable management before you need it** — audit logs are only captured while management mode is on. Turn it on early so you have a history to reference.
- **Use rate limits in shared deployments** — if multiple admins have Copilot access, rate limits prevent any one user from exhausting your API quota.
- **Review audit logs after bulk operations** — if something in your data looks unexpected, the audit log will show exactly what the Copilot created, edited, or deleted and when.
