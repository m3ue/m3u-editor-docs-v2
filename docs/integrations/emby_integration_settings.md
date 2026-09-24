---
sidebar_position: 1
description: Import VOD and Series data into M3U-Editor
title: Media Server Integration Settings 
hide_title: true
tags:
  - Integrations
  - Emby
  - Jellyfin
  - Plex
 
---

# Media Server Integration Settings
  This document describes several configuration options that exist for media server integrations.

### Media Server Action Menu

In M3U Editor, open **Integrations → Servers**, edit your server integration, and open the **action menu in the page header**. On mobile, this is a page-header dropdown; it is not inside **Create Emby Library Mapping** or the Emby plugin settings. Older screenshots may use the name **Media Servers**.

![Media server integration action menu (older interface)](/img/doc_imgs/media_server_integration_action_menu.png)

For the complete Emby setup and the separate publishing workflow, see [Emby Integration](./emby_integration.md).

### Sync Now

**Purpose:** Manually triggers a full sync of content from the media server

**Behavior:**
* Will sync all content from the media server. For large libraries, this may take several minutes.
* Dispatches a SyncMediaServer job to the queue
* Shows success notification that sync has started
* User will receive notifications when sync completes/fails

---

### Test Connection

**Purpose:** Tests the connection to the media server

**Behavior:**
* Calls the MediaServerService to test connectivity
* Shows success notification with server name and version if successful
* Shows error notification with failure message if unsuccessful

---

### Refresh Libraries

**Purpose:** Rediscover the server's movie and TV-show libraries and save the current inventory in M3U Editor.

1. Open **Integrations → Servers**, edit the server, and open the page-header action menu.
2. Select **Refresh Libraries** and wait for **Libraries Refreshed**.
3. Reload the page before reopening **Managed Libraries → Publish to Emby** or making further edits.

**Behavior:**

- Saves the discovered library list directly, including the current filesystem locations needed for Emby publishing destinations.
- Preserves existing import selections that are still valid and reports selections removed because their libraries no longer exist.
- Does not start a full content import, create an Emby library, or remove media files.
- Reports **No Libraries Found** if no movie or TV-show libraries are returned.

:::tip Empty Emby destination picker after an update
If **Emby library** only offers **Create a new library**, use this action and reload. Searching inside the dropdown does not fetch a fresh library list. See [the detailed recovery steps](./emby_integration.md#refresh-the-saved-library-list).
:::

### Test Connection & Discover Libraries

This button is in the form's **Library Selection** section, not the page-header action menu. It checks the connection and updates the **form state** with the discovered libraries.

Click **Create** or **Save changes** afterwards, then reload before opening the managed publishing panel. Its success notification alone does not mean the mapping dialog can already use the new inventory. Use **Refresh Libraries** when you want to refresh an existing integration's inventory directly.

---

### View Playlist

Navigates to the associated playlist’s edit page

---

### Cleanup Duplicates

**Purpose:** Removes duplicate series entries created during sync format changes

**Behavior:**
* Will find and merge duplicate series entries that were created due to sync format changes. Duplicate series without episodes will be removed, and their seasons will be merged into the series that has episodes.
* Calls cleanupDuplicateSeries() method
* Shows info notification if no duplicates found
* Shows success notification with counts of merged/deleted items if duplicates were found
---

### Delete

Removes the media server integration

---

## 🧩 Media Server Integration (Import Settings)

Within a configured media server integration you can control how Groups (VOD) and Categories (Series) are processed.

There are **two options** when it comes to genre handling:

1. Primary **Use only the first genre**. Prevents duplication by placing an item in a single group/category. **Recommended for most situations**.
2. All **Use all genres**. Items store all genres and **may appear in multiple groups/categories, which increases duplicates, storage, and sync time**.

  ![Media server integration genre settings](/img/doc_imgs/media_server_integration_genre_options.png)

## 🗓️ Sync Schedule

Configures synchronization schedule with the integrated media server. The following are the support sync intervals:

* 1 hour
* 3 hours
* 6 hours
* 12 hours
* Dailly (Midnight)
* Weekly (Sunday)

![Media server integration sync schedule](/img/doc_imgs/media_server_integration_sync_schedule.png)
