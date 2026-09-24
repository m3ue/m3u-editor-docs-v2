---
sidebar_position: 2
description: Connect Emby, import existing media, and publish managed movie and series libraries from M3U Editor.
title: Emby Integration
hide_title: true
tags:
  - Integrations
  - Emby
  - Jellyfin
---

# Emby Integration

M3U Editor supports two different library workflows:

- **Import: Emby or Jellyfin → M3U Editor.** Read movies, series, metadata, and artwork from selected server libraries into an M3U Editor playlist. This does not require the Emby companion plugin.
- **Managed publishing: M3U Editor → Emby.** Choose movie groups or series categories in M3U Editor and publish them to an existing or new Emby library. The **m3u-editor for Emby** companion writes the managed streaming entries on the Emby server. This workflow is Emby-only, not Jellyfin.

The companion also supports **Live TV and EPG** from M3U Editor's Xtream output. Live TV configuration is separate from movie and series library publishing.

:::info Menu names
The steps below use the English interface labels. In M3U Editor, start at **Integrations → Servers** in the sidebar. Older versions and screenshots may call this **Media Servers**.
:::

## Prerequisites

For importing, you need a working Emby or Jellyfin server, its address, and an API key.

For managed publishing, also prepare:

- **Emby Server 4.8 or newer** and the **m3u-editor for Emby v1.5.0** companion release, or a newer compatible release. See the [plugin releases](https://github.com/Serph91P/m3u-editor-for-emby/releases).
- An M3U Editor build that includes the simplified **Managed Libraries → Publish to Emby** workflow, introduced by [m3u-editor PR #1446](https://github.com/m3ue/m3u-editor/pull/1446). Updating only the companion does not add this interface to an older editor.
- An M3U Editor account allowed to use integrations, with access to the Emby integration and the content to publish.
- Emby administrator authorization for managed library setup. Being able to read a library is not proof that the credentials can create or manage one.
- A writable, persistent location accessible to the Emby process for managed files. In Docker, the path must exist **inside the Emby container**, not only on the host or in the M3U Editor container.

### Network addresses and Docker

There are two connections: M3U Editor contacts Emby for discovery and setup, and the companion contacts M3U Editor for its catalog and streams. Check reachability from the process or container making each request. `localhost` inside one container does not refer to the other container.

On a **trusted private Docker network**, a direct address such as `http://emby:8096` or `http://m3u-editor:36400` can be used when that is the service's actual internal address and port. Public or externally routed endpoints require **HTTPS**. Do not expose plain HTTP publicly to work around a connection error.

Managed paths are Emby-side paths. You do not need to mount Emby's library directory into M3U Editor merely for discovery or publishing. Do not remove or remap an active managed storage location without checking the existing mappings first.

## 1. Connect the server in M3U Editor

### Obtain an Emby API key

1. Open the Emby management dashboard using the gear icon.

   ![Emby management dashboard](/img/doc_imgs/emby_settings.png)

2. Open **Advanced → API Keys**.

   ![Emby API Keys settings](/img/doc_imgs/emby_settings_advanced_api.png)

3. Create an API key with a descriptive application name, or use an existing appropriate key.

   ![Create an Emby API key](/img/doc_imgs/emby_api_new.png)

Keep the key private. The **Emby API key** entered in M3U Editor is different from the **Playlist Auth username and password** entered in the companion.

### Create or edit the integration

1. In M3U Editor, open **Integrations → Servers**.
2. Create a server integration, or edit the existing Emby entry. Do not create a duplicate just because its library picker is empty.
3. Enter:
   - **Display Name**: a friendly name for this server.
   - **Server Type**: **Emby**. Choose **Jellyfin** only for the import workflow.
   - **Host / IP Address**: the server hostname or IP, without the `http://` or `https://` prefix shown by the field.
   - **Port**: the port reachable from M3U Editor, commonly `8096` for direct Emby HTTP.
   - **Use HTTPS**: enable for an HTTPS endpoint and use its corresponding port.
   - **API Key/Token**: the Emby API key.
4. In **Library Selection**, click **Test Connection & Discover Libraries**.
5. If importing, enable **Import Movies** and/or **Import Series** and select the appropriate **Libraries to Import**. If you only want to publish to Emby, disable those import toggles; the import selection is not the publishing destination.
6. Click **Create** for a new integration or **Save changes** when editing. Then reload the page before opening **Managed Libraries**.

:::warning Discovery is not the same as saving
**Test Connection & Discover Libraries** updates the edit form. Its success message does not mean the new library inventory has already been saved for the mapping dialog. Save the integration before using those results.

For an existing integration, **Refresh Libraries** in the page-header action menu saves the inventory directly. The [refresh instructions below](#refresh-the-saved-library-list) explain exactly where to find it.
:::

## 2. Install and connect the Emby companion

Skip this section if you only import from Emby or Jellyfin.

1. Download `Emby.M3uEditor.Plugin.dll` from the [latest stable plugin release](https://github.com/Serph91P/m3u-editor-for-emby/releases/latest). Extract the versioned ZIP first if you downloaded an archive.
2. Stop Emby before changing the plugin DLL. Preserve the previous DLL as a backup when upgrading.
3. Place the DLL in the `plugins` directory under the [Emby Server Data Folder](https://emby.media/support/articles/Server-Data-Folder.html). In Docker, this is commonly `/config/plugins/`. Match the ownership and permissions of the other plugins.
4. Start Emby and open **Server Dashboard → Plugins → My Plugins → m3u-editor for Emby → Settings**.
5. In M3U Editor, create or select a **Playlist Auth** assigned to the playlist you want to expose. For managed publishing, enable **Library Publishing Access → Enable Library Publishing** on that credential and save it. This permission is separate from normal Xtream access. Then open the playlist's Xtream API information.
6. Under the plugin's **m3u-editor Connection**, enter the Xtream base URL and the Playlist Auth username and password. Use the base URL without `/player_api.php` or a trailing slash.
7. Click **Test Connection**, confirm authentication succeeds, and save the plugin settings.

For update-channel options and platform-specific installation details, see the [companion documentation](https://github.com/Serph91P/m3u-editor-for-emby#installation).

## 3. Publish movies or series to Emby

Normal setup takes place in **M3U Editor**, not in an advanced plugin setup form.

1. Open **Integrations → Servers**, edit your Emby integration, and open **Managed Libraries**.
2. Click **Publish to Emby**. The panel is titled **Create Emby Library Mapping**.
3. Under **What do you want to publish?**, choose movies or series.
4. Select the desired **Movie groups** or **Series categories**. Alternatively, enable **Publish all eligible items as one source** to use a single aggregate source. Without that toggle, each selected group or category gets its own managed mapping and subfolder.
5. In **Emby library**, choose an existing library of the matching type, or select **Create a new library** and enter a **Library name**. Movie sources require a movie library; series sources require a TV-show library.
6. Confirm with **Publish to Emby**.
7. Review the resulting mapping rows, then check the destination library in Emby after publishing and its library refresh have completed.

The integration binding and managed filesystem root are negotiated automatically during publishing. You should **not** need to look up an M3U Editor database integration ID, type an arbitrary output path, or manually approve roots in the plugin's **Managed Publishing** tab for normal setup. A visible existing library is a candidate destination; publishing still checks whether the companion can safely use it.

:::tip Import selection and publishing selection are different
**Libraries to Import** chooses what M3U Editor reads from Emby. **Emby library** in the publishing panel chooses where M3U Editor content is written by the companion. Selecting an import library does not create a publishing mapping.
:::

### Check the result

In **Managed Libraries**, inspect:

- **Source**, **Emby library**, and **Type** to confirm the intended mapping.
- **Enabled** to see whether the mapping is active.
- **Status**, **Applied revision**, and **Last success** to verify that a generation was actually applied. A created mapping or a `pending`/`planned` status is not proof of a successful publish; look for `synced` and a recorded success.
- **Last error** if the mapping is `failed` or `drifted`.

The row actions include **Preview** for the catalog plan and **Reconcile** to retry/apply the current state after resolving a problem. Do not repeatedly create duplicate mappings to retry a failed publish. The plugin's **Managed Publishing** page provides additional status and recovery controls; **Rollback Previous Generation** is a recovery action, not a setup step.

For advanced mapping options and recovery controls, see [Managed Emby Library Publishing](./emby_library_publishing.md).

## Optional: import existing Emby or Jellyfin media

With import enabled and libraries selected, use **Sync Now** from the server's action menu, or configure automatic synchronization. This imports media **into M3U Editor**; it is not the command for publishing a managed library back to Emby.

Imported data includes movies, series with seasons and episodes, metadata, and artwork. Artwork is proxied through M3U Editor to protect the server token. Library selection and genre handling control what is imported and how it is grouped. Large initial imports may take several minutes.

See [Media Server Integration Settings](./emby_integration_settings.md) for genre handling, scheduling, and the other server actions.

## Optional: Live TV and EPG

In the Emby companion's **Live TV** tab:

1. Enable Live TV and choose MPEG-TS or HLS output.
2. Configure the EPG source, guide window, and cache durations.
3. Refresh categories and select the channel groups to include. An empty category selection includes all categories.
4. Save, then verify the automatically registered **m3u-editor for Emby** tuner in Emby's Live TV settings. Do not add a second M3U tuner for the same output.

Use **Refresh Channel & EPG Cache** after upstream channel or guide changes. That cache action does **not** refresh the movie/series library dropdown in M3U Editor.

## Troubleshooting

### Refresh the saved library list

Use this after adding or renaming Emby libraries, or when **Emby library** only offers **Create a new library**, even after searching.

1. Close **Create Emby Library Mapping**.
2. In **M3U Editor → Integrations → Servers**, edit the existing Emby integration.
3. Open the **action menu in the page header**, above the integration form. On a narrow/mobile screen, look in the page-header dropdown, not inside the mapping panel or the Emby plugin.
4. Select **Refresh Libraries**.
5. Wait for **Libraries Refreshed** and the number of libraries found.
6. **Reload the page**, then reopen **Managed Libraries → Publish to Emby** and select the appropriate content type.

This refresh reads the library inventory from Emby and saves it in M3U Editor. It preserves existing import selections that still exist. It does not create an Emby library, start a full content sync, or delete media files. Reload after the refresh rather than saving an older form that may still contain the previous inventory.

After an upgrade, the cached library inventory can still use an older format without the path list required by managed publishing. Refreshing replaces it with the current format. Typing into the dropdown only searches the available options; it does not rediscover libraries from Emby.

**Do not confuse these actions:**

- **Test Connection**: checks connectivity, but the edit-page header action does not discover libraries.
- **Test Connection & Discover Libraries**: discovers libraries into the form; follow it with **Save changes** and reload.
- **Refresh Libraries**: discovers and directly saves the library inventory; reload before reopening the mapping panel.
- **Sync Now**: imports media content into M3U Editor.

If the refresh reports **No Libraries Found**, verify that the server contains movie or TV-show libraries and that the integration can read them. If it reports libraries but your destination is absent, check the chosen movie/series type and that Emby has a filesystem location for the library. For write failures after selection, see the mount and authorization checks below.

### Managed Libraries or setup is unavailable

Confirm the integration type is **Emby**, your M3U Editor account can use that integration, and both M3U Editor and the companion support the simplified publishing workflow. Check the plugin's installed version after restarting Emby, not only the version of the DLL you downloaded. Upgrade both sides to compatible versions rather than manually entering internal IDs to bypass a setup error.

### Connection works, but publishing is unauthorized

Reading libraries and managing libraries require different permissions. Check Emby administrator authorization for the integration's API credentials and verify the companion's Playlist Auth against M3U Editor. Do not post either credential in logs, screenshots, or support requests.

### Destination is not writable or a Docker mount is inaccessible

Check the path and permissions from **inside the Emby container**, using the Emby process's user. The host path or a path accessible only in M3U Editor is not sufficient. Confirm the mount is writable and persistent, then retry **Reconcile** after correcting the underlying problem. Do not weaken path confinement or approve a broad filesystem root as a shortcut.

### Legacy writer conflict or drift

Do not let a legacy STRM writer and managed publishing own the same destination. Investigate the reported conflict, stop the overlapping writer, and preserve its files before deliberately migrating to a non-conflicting destination. Do not delete existing libraries or files merely to clear the warning.

### Publishing succeeded, but Emby has not updated

Check **Status**, **Applied revision**, **Last success**, and **Last error** first. Confirm that **Refresh Emby after successful sync** is enabled in the mapping's edit settings if you expect an automatic library refresh. A successful file generation and an Emby library scan are separate steps. Refresh the relevant library in Emby if needed; use **Refresh Libraries** in M3U Editor only to update the destination inventory.
