---
sidebar_position: 2
description: How to install, activate, and manage plugins in M3U Editor, covering the UI workflow and all install sources.
tags:
  - Plugins
  - Installation
title: Installing Plugins
---

# Installing Plugins

Every plugin goes through the same review flow regardless of where it comes from: **stage → scan → approve → trust → enable**. This ensures no plugin code runs before an administrator has explicitly reviewed and trusted it.

## Install sources

| Source | Best for |
|---|---|
| **Browser upload** | Most users: upload a `.zip` or `.tar.gz` directly from the admin UI. Works in all Docker setups. |
| **Local directory** | Plugin developers staging a plugin folder already on the server. |
| **Local archive** | Staging a `.zip` or `.tar.gz` already on the server filesystem. |
| **GitHub release asset** | Installing plugins distributed as GitHub release assets, verified by checksum. |


## Installing via browser upload (recommended)

This is the recommended path for most users.

1. Go to **Plugins → Installs** in the admin navigation.
2. Click **Upload Extension Archive**.
3. Select your `.zip` or `.tar.gz` plugin archive.
4. The system extracts the archive, validates the manifest, and creates an install review record.

The new install review appears in the **Plugins → Installs** list with status `staged`.

:::tip Private plugins don't need GitHub
If your plugin is private, the browser upload path is all you need. There is no requirement to publish it to GitHub.
:::


## The install review flow

After staging, every install goes through the same steps in **Plugins → Installs**:

### 1. Scan

Click **Scan** on the install review to run a malware scan.

:::info ClamAV is not included in the default image
ClamAV is intentionally excluded from the default Docker image to keep the build size small. To use real malware scanning you must build the image yourself with the `INSTALL_CLAMAV=true` build argument:

```bash
docker build --build-arg INSTALL_CLAMAV=true -t my-m3u-editor .
```

You can also set `CLAMAV_UPDATE_DEFINITIONS=true` to refresh signatures at build time. In development, set `PLUGIN_SCAN_DRIVER=fake` in your `.env` to skip scanning.
:::

A clean scan moves the review to `scanned`. An infected result automatically rejects it.

### 2. Approve

Click **Approve** on the install review. This marks the review as approved and makes the plugin available for trust.

### 3. Trust

Click **Trust** (either on the install review or on the plugin edit page after it has been registered). Trusting pins a SHA-256 snapshot of every file in the plugin directory. These hashes are stored and used for future integrity checks.

### 4. Enable

After trust, the plugin appears in the **Plugins** list. Open the plugin and click **Enable**. The plugin will now run when its hooks fire or when you trigger actions manually.

:::note Enable prerequisites
The Enable button is only active when the plugin is installed, validated, trusted, and has verified integrity. If any check is failing, use the **Validate** or **Verify Integrity** buttons to diagnose the issue.
:::


## Managing installed plugins

### Enable and disable

Use the **Enable** / **Disable** buttons on the plugin edit page to toggle execution without changing the trust state or settings.

### Verify integrity

Click **Verify Integrity** to re-hash all plugin files and compare against the stored trusted hashes. If any files have changed since trust was granted the integrity status becomes `changed` and the plugin is automatically disabled. Review the changes, then re-trust the plugin to re-enable it.

### Plugin settings

Each plugin may expose a settings form on its edit page. Fill in the settings and save: they take effect on the next plugin run. Settings are preserved across updates and reinstalls.

### Update a plugin

To update a plugin to a new version:

1. Go to **Plugins → Installs** and upload the new archive (or use the **Stage Current Files For Review** button on the plugin edit page for locally-managed plugins).
2. The system detects the matching plugin ID and treats the staged install as an **update** rather than a fresh install.
3. Scan, approve, and trust the new version. The old files are replaced, settings are preserved, and trust is re-established with the new file hashes.

### Reinstall

If a plugin has been uninstalled but its registry record still exists, click **Reinstall** on the plugin edit page to mark it as installed again. Saved settings are preserved.

### Uninstall

Click **Uninstall Plugin** (in the **Manage** dropdown on the plugin edit page). You will be asked to choose a cleanup mode:

| Mode | What happens |
|---|---|
| **Preserve** | The plugin is disabled and marked uninstalled, but any plugin-owned database tables and storage files are kept. Use this if you plan to reinstall later. |
| **Purge** | The plugin is disabled and all plugin-owned tables, files, and report directories declared in the manifest are deleted permanently. |

:::warning Active runs
If the plugin has an active run in progress, you must wait for it to finish (or request cancellation) before uninstalling with the purge mode.
:::

### Forget registry record

**Forget Registry Record** (in the **Manage** dropdown) removes the database row, all saved settings, and all run history. It does **not** delete the plugin files from disk and does **not** clean plugin-owned data. If the plugin folder still exists on disk, the next discovery pass will re-register it.


## Bundled plugins

Some plugins ship as **bundled** plugins inside the application installation. These are trusted by default and do not go through the install review flow: they are discovered and registered automatically on startup.


## Docker and persistence

The `plugins/` directory is symlinked to the persistent config volume, so **custom plugins survive image rebuilds and container restarts** automatically.

- **Plugin files**: persisted via the config volume symlink.
- **Plugin settings and run history**: stored in the database, persisted via your database volume.
- **Staged upload archives**: stored in `storage/app/plugin-staging/`, persisted via the storage volume.

If you are self-hosting outside of the standard Docker Compose setup and managing volumes manually, ensure that the path the `plugins/` symlink resolves to is on a persistent volume.


## Advanced: Artisan commands

For plugin developers and advanced users, the install review flow can also be driven from the command line:

```bash
# Stage from a local directory
php artisan plugins:stage-directory /path/to/my-plugin

# Stage from a local archive
php artisan plugins:stage-archive /path/to/my-plugin.zip

# Stage from a GitHub release (requires published SHA-256 checksum)
php artisan plugins:stage-github-release \
  https://github.com/<owner>/<repo>/releases/download/<tag>/my-plugin.zip \
  --sha256=<checksum>

# Scan a staged install
php artisan plugins:scan-install <review-id>

# Approve and trust in one step
php artisan plugins:approve-install <review-id> --trust
```
