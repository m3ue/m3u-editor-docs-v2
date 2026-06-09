---
sidebar_position: 10
title: Discord & Slack Alerts
description: Send error notifications to Discord or Slack when syncs fail or provider connections have issues
tags:
  - Integrations
  - Notifications
  - Discord
  - Slack
---

# Discord & Slack Alerts

M3U Editor can send error-level notifications to a Discord channel or Slack workspace via incoming webhooks. This lets you catch sync failures, provider connection errors, and other issues without actively monitoring the app.

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

### What triggers an alert

Discord alerts fire on **error-level events**, including:

- Playlist sync failures (provider unreachable, bad credentials, parse errors)
- Provider connection errors during sync
- Job failures that exceed the retry limit
- Database backup failures

Routine events (sync completed successfully, probe finished) do not trigger Discord alerts.

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

### What triggers an alert

Slack alerts fire on the same error-level events as Discord alerts (see above).

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

---

## Routing Alerts to Multiple Channels

You can configure one Discord webhook and one Slack webhook simultaneously — both will receive alerts. To route different alert types to different channels, use Discord or Slack's webhook routing capabilities (e.g. multiple webhooks in Discord, channel routing in Slack).

---

## Related Resources

- [Settings Reference](../advanced/settings-reference.md) — Full settings page reference
- [Job Monitoring](../advanced/job-monitoring.md) — In-app job status and failure tracking
- [Environment Variables](../advanced/environment-variables.md) — Environment-level configuration
