---
sidebar_position: 2.5
description: Publish movie groups and series categories from M3U Editor to existing or new Emby libraries with automatic managed setup.
title: Managed Emby Library Publishing
tags:
  - Integrations
  - Emby
  - Advanced
---

# Managed Emby Library Publishing

Managed publishing sends movies and series **from M3U Editor to Emby**. M3U Editor owns the source selection and library mappings; the [m3u-editor for Emby companion](https://github.com/Serph91P/m3u-editor-for-emby) writes the managed streaming files on the Emby server and reports the result. M3U Editor does not write directly to Emby's filesystem.

For installation, compatible versions, both sets of credentials, and Docker networking, start with the [complete Emby Integration guide](./emby_integration.md). Importing existing Emby or Jellyfin media into M3U Editor is a separate workflow; managed publishing is Emby-only.

## Quick start

After connecting both sides:

1. In M3U Editor, open **Integrations → Servers**, edit the Emby integration, and open **Managed Libraries → Publish to Emby**.
2. Choose movies or series, then select **Movie groups** or **Series categories**. Use **Publish all eligible items as one source** only when you want an aggregate source instead of one mapping per selected group/category.
3. Choose an **Emby library** of the matching type, or choose **Create a new library** and enter its name.
4. Confirm with **Publish to Emby**, then verify **Status**, **Applied revision**, and **Last success** in the mappings table and the resulting library in Emby.

:::info Automatic setup
The integration binding and managed root are negotiated automatically. Normal setup does not require a database integration ID, a manually typed output path, or a separate manual root approval in the plugin's Managed Publishing tab. Selecting a destination does not bypass the companion's authorization and path-safety checks.
:::

:::tip Only "Create a new library" is shown?
Close the mapping panel. On the Emby integration's edit page, open the **page-header action menu → Refresh Libraries**, wait for **Libraries Refreshed**, and reload the page before reopening the panel. The dropdown search does not rediscover libraries. **Test Connection & Discover Libraries** updates only the form and needs **Save changes** afterwards. See [Refresh the saved library list](./emby_integration.md#refresh-the-saved-library-list).
:::

## How it works

1. You select the content and destination in M3U Editor.
2. M3U Editor and the companion negotiate managed setup and validate the destination. A new library is created when requested; an existing destination must remain compatible.
3. The companion reads the publishing catalog, applies a managed generation, and reports the revision and outcome back to M3U Editor.
4. The mapping status is updated. If enabled, a successful sync triggers an Emby library refresh.

The filesystem location is interpreted on the **Emby server**. In Docker, check it inside the Emby container and preserve its persistent mount. Do not grant broad filesystem access or run a second STRM writer over the same destination to work around a setup failure.

## Granting access to Playlist Auth credentials

Normal Xtream authentication is not sufficient authorization for publishing. To let a **Playlist Auth** credential read publishing catalogs and report results, edit that credential and enable **Library Publishing Access → Enable Library Publishing**, then save. The setting is off by default and requires the M3U Editor `use_integrations` permission. Use those credentials in the companion's **m3u-editor Connection** settings.

The Emby API key stored in M3U Editor is a separate credential and must have the administrator authorization needed for managed library setup.

## Managing mappings

Use the **Managed Libraries** table to check:

- **Source**, **Emby library**, and **Type**: the intended source and destination.
- **Enabled**: whether the mapping is active.
- **Status**: `pending` or `planned` is not a successful publish. Check for `synced`; investigate `failed` or `drifted` rather than creating a duplicate mapping.
- **Applied revision** and **Last success**: evidence that a catalog generation was applied.
- **Last error**: the reported reason for a failed or drifted mapping.

The row actions include:

- **Preview**: inspect the catalog plan and revision. For large catalogs the UI displays at most 50 items; publishing still uses the full catalog.
- **Reconcile**: retry/re-plan the current mapping after correcting the underlying issue.
- **Edit**: adjust the existing mapping and its publishing options. These advanced settings are not extra fields you need to fill in for the normal quick-start workflow.

The plugin's **Managed Publishing** tab provides **Overview**, **Movies**, and **Series** views, plus **Reconcile Now** and **Rollback Previous Generation** recovery controls. Rollback restores a previous plugin-owned generation for a selected mapping; it is not part of initial setup.

## Publishing options

When editing an existing mapping, the publishing options include:

- **Naming**: title and year, or title only.
- **Cleanup**: how to handle previously published managed files that are no longer in the catalog. Review the consequences before changing this setting.
- **Publish local NFO**: include metadata sidecar files.
- **Publish visible versions**: include available quality/version variants.
- **Refresh Emby after successful sync**: request an Emby library refresh after the companion applies the generation.

A successful generation and Emby's media scan are different steps. **Refresh Libraries** in M3U Editor only updates the list of available destinations; it is not an Emby content scan or a publishing retry.

## Related documentation

- [Emby Integration](./emby_integration.md): installation, credentials, first publish, Live TV, and troubleshooting.
- [Media Server Integration Settings](./emby_integration_settings.md): exact refresh/discovery behavior and import actions.
- [Media Server Integrations](./overview.md): integrations overview.
