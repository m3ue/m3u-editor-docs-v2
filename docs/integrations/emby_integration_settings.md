---
sidebar_position: 1
description: Configuration options for media server integrations in M3U Editor
title: Media Server Integration Settings
hide_title: true
tags:
  - Integrations
  - Emby
  - Jellyfin
  - Plex
---

# Media Server Integration Settings

This document describes the configuration options available for media server integrations.

## Media Server Action Menu

The media server integration contains various actionable items depicted below.

![Media Server Integrations Action Menu](/img/doc_imgs/media_server_integration_action_menu.png)

## Sync Now

Manually triggers a full sync of content from the media server. For large libraries, this may take several minutes. A notification confirms when the sync starts and again when it completes or fails.

## Test Connection

Tests the connection to the media server and shows a success notification with the server name and version if the connection is successful, or an error notification if it fails.

## View Playlist

Navigates to the associated playlist's edit page.

## Cleanup Duplicates

Removes duplicate series entries created during sync format changes. Duplicate series without episodes are removed and their seasons are merged into the series that has episodes. A notification is shown if no duplicates are found, or a success notification with merge/delete counts if duplicates were cleaned up.

## Delete

Removes the media server integration.

## Media Server Integration (Import Settings)

Within a configured media server integration you can control how Groups (VOD) and Categories (Series) are processed.

There are **two options** when it comes to genre handling:

1. **Primary**: Use only the first genre. Prevents duplication by placing an item in a single group/category. Recommended for most situations.
2. **All**: Use all genres. Items store all genres and may appear in multiple groups/categories, which increases duplicates, storage, and sync time.

![Media server integration genre settings](/img/doc_imgs/media_server_integration_genre_options.png)

## Sync Schedule

Configures the synchronization schedule with the integrated media server. The following sync intervals are supported:

- 1 hour
- 3 hours
- 6 hours
- 12 hours
- Daily (Midnight)
- Weekly (Sunday)

![Media server integration sync schedule](/img/doc_imgs/media_server_integration_sync_schedule.png)
