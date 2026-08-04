---
sidebar_position: 10
title: Alert Channels
description: Send error notifications to Discord, Slack, or Telegram when syncs fail or provider connections have issues
tags:
  - Integrations
  - Notifications
  - Discord
  - Slack
  - Telegram
---

# Alert Channels

M3U Editor can send error-level notifications to a Discord channel, Slack workspace, and/or Telegram chat via webhooks/bot. This lets you catch sync failures, provider connection errors, and other issues without actively monitoring the app. All three channels can be enabled at once — alerts are sent to every enabled channel.

**Access**: Sidebar → **Settings** → **Integrations** → **Alerts** tab

---

## Discord

### Setup

1. In Discord, open **Server Settings** → **Integrations** → **Webhooks**
2. Click **New Webhook**, give it a name, and choose the target channel
3. Copy the **Webhook URL**
4. In M3U Editor: **Settings → Integrations → Alerts → Discord**
5. Enable **Discord alerts**
6. Paste the webhook URL into **Discord Webhook URL**
7. Save

### Testing

Click **Send test alert** (visible when enabled + webhook URL is filled) to send a test message to your Discord channel and confirm the integration works.

---

## Slack

### Setup

1. In Slack, go to **api.slack.com/apps** → **Create New App** → **From scratch**
2. Add the **Incoming Webhooks** feature and activate it
3. Click **Add New Webhook to Workspace**, choose your channel, and authorize
4. Copy the **Webhook URL**
5. In M3U Editor: **Settings → Integrations → Alerts → Slack**
6. Enable **Slack alerts**
7. Paste the webhook URL into **Slack Webhook URL**
8. Save

### Testing

Click **Send test alert** to verify the Slack integration is working before relying on it for real alerts.

---

## Telegram

Send alerts to a Telegram chat, group, or channel via a bot.

### Setup

1. Open Telegram and start a chat with [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow the prompts to name your bot
3. Copy the **bot token** BotFather gives you
4. Start a chat with your new bot and send it any message (for group alerts, add the bot to the group and post a message there)
5. Open `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` in your browser
6. Find `"chat":{"id":...}` in the response — that's your **Chat ID** (group IDs are negative numbers)
7. In M3U Editor: **Settings → Integrations → Alerts → Telegram**
8. Enable **Telegram alerts**
9. Paste the **Bot Token** and **Chat ID**
10. Save

### Testing

Click **Send test alert** (visible when enabled + bot token and chat ID are filled) to confirm the bot can reach your chat.

:::note Security
The bot token is encrypted before it's queued for delivery, so it's never stored or transmitted in plain text as part of a job payload.
:::

---

## What Triggers an Alert

All three channels fire on the same **error-level events**, including:

- Playlist sync failures (provider unreachable, bad credentials, parse errors)
- Provider connection errors during sync
- Job failures that exceed the retry limit
- Database backup failures

Routine events (sync completed successfully, probe finished) do not trigger alerts.

A failed alert delivery itself is never re-alerted — this prevents a misconfigured channel (e.g. a broken webhook or expired bot token) from looping forever.

---

## Additional Notifications

Beyond the default error-log forwarding, you can opt in to two targeted notifications once at least one alert channel is enabled. **Access**: **Settings → Integrations → Alerts → Additional Notifications**

| Setting | Description |
|---|---|
| **Notify on queued job failures** | Sends an alert whenever a queued job (import, sync, probe, etc.) fails permanently after all retry attempts. |
| **Notify on playlist import failures** | Sends an alert when a playlist sync fails entirely, e.g. all provider URLs were unreachable. |

---

## Alert Format

Alerts are plain-text messages containing:

- The error type / event name
- A brief description of what failed
- The affected resource (playlist name, job type, etc.)
- Timestamp

Example Discord message:
```
[m3u-editor] Sync failed for playlist "Home IPTV"
Error: Connection refused to provider (https://provider.example.com)
Time: 2026-06-08 14:32:11 UTC
```

Telegram messages are sent as plain text (no Markdown parsing), so forwarded log content can never break message formatting.

---

## Routing Alerts to Multiple Channels

You can configure Discord, Slack, and Telegram simultaneously — all enabled channels receive every alert. To route different alert types to different destinations, use each platform's own routing capabilities (e.g. multiple webhooks in Discord, channel routing in Slack, a dedicated bot/chat in Telegram).

---

## Related Resources

- [Settings Reference](../advanced/settings-reference.md) — Full settings page reference
- [Job Monitoring](../advanced/job-monitoring.md) — In-app job status and failure tracking
- [Environment Variables](../advanced/environment-variables.md) — Environment-level configuration
