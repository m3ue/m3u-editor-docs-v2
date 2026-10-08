---
sidebar_position: 4
title: Alerts
description: Get errors and failed syncs sent to Discord, Slack, or Telegram, so you hear about problems without watching the app.
tags:
  - Notifications
  - Discord
  - Slack
  - Telegram
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Alerts

M3U Editor can send its errors to Discord, Slack, or Telegram, so you find out a sync failed before someone tells you a channel is missing. Set them up in **Settings → Alerts**. You can turn on more than one; every alert goes to all of them.

<Tabs groupId="alert-channel" queryString>
<TabItem value="discord" label="Discord" default>

1. In Discord, open **Server Settings → Integrations → Webhooks**, choose **New Webhook**, and pick the channel.
2. Copy the webhook URL.
3. In M3U Editor, open the **Discord** tab, turn on **Enable Discord alerts**, and paste it into **Discord Webhook URL**.

</TabItem>
<TabItem value="slack" label="Slack">

1. At [api.slack.com/apps](https://api.slack.com/apps), choose **Create New App → From scratch**.
2. Turn on **Incoming Webhooks**, choose **Add New Webhook to Workspace**, and pick the channel.
3. Copy the webhook URL.
4. In M3U Editor, open the **Slack** tab, turn on **Enable Slack alerts**, and paste it into **Slack Webhook URL**.

</TabItem>
<TabItem value="telegram" label="Telegram">

1. In Telegram, message [@BotFather](https://t.me/BotFather), send `/newbot`, and follow the prompts. Copy the bot token it gives you.
2. Send your new bot a message. For a group, add the bot to the group and post a message there.
3. Open `https://api.telegram.org/bot<your-bot-token>/getUpdates` in a browser, and find `"chat":{"id":...}`. That number is the chat ID (groups have negative IDs).
4. In M3U Editor, open the **Telegram** tab, turn on **Enable Telegram alerts**, and enter the **Telegram Bot Token** and **Telegram Chat ID**.

</TabItem>
</Tabs>

Save, then choose **Send test alert** to check it arrives.

## What's sent

Every error M3U Editor logs is sent, such as a provider that can't be reached or a sync that crashed. Routine events, like a sync finishing, aren't. If sending an alert fails, that failure isn't alerted again, so a broken webhook can't cause a loop.

**Additional Notifications** adds a few more:

| Setting | Sends an alert when |
|---|---|
| **Notify on queued job failures** | A background job (a sync, probe, download, and so on) fails for good, after its retries. |
| **Notify on playlist import failures** | A playlist sync fails completely, for example because every provider address was unreachable. |
| **Notify on invalidated playlist syncs** *(v0.13.1+)* | A sync is cancelled because it would have [removed too much](/docs/resources/playlists#protect-against-bad-syncs). |

M3U TV users can also get notifications on their phones. See [Push Notifications](/docs/m3u-tv/push-notifications).
