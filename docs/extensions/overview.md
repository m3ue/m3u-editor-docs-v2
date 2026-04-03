---
sidebar_position: 1
description: An overview of the M3U Editor plugin system: what plugins can do, the security model, and where to find them in the UI.
tags:
  - Plugins
title: Plugin Overview
---

# Plugin Overview

:::info Experimental Feature
Available in the **experimental** branch (`sparkison/m3u-editor:experimental`).
:::

Plugins let you add custom automation to M3U Editor without modifying the core application. A plugin can react to events, process channels or EPG data, run on a schedule, or expose actions you can trigger manually from the admin UI.

## What plugins can do

Each plugin declares one or more **capabilities** that describe what kind of work it performs:

| Capability | What it does |
|---|---|
| `channel_processor` | Process or transform channel data after a playlist syncs |
| `epg_processor` | Process or transform EPG programme data |
| `stream_analysis` | Analyse stream health or metadata |
| `scheduled` | Run actions on a cron schedule defined in plugin settings |

Plugins can also **subscribe to hooks**: events that M3U Editor fires at key points in its workflow:

| Hook | Fires when… |
|---|---|
| `playlist.synced` | A playlist finishes syncing |
| `epg.synced` | An EPG source finishes syncing |
| `epg.cache.generated` | The EPG cache has been rebuilt |
| `before.epg.map` | Just before an EPG map is applied |
| `after.epg.map` | Just after an EPG map is applied |
| `before.epg.output.generate` | Just before EPG output is generated |
| `after.epg.output.generate` | Just after EPG output is generated |

## Security model

M3U Editor does not sandbox plugin PHP code. Instead it puts a **review and trust boundary around installation**:

1. **Validation**: the manifest and entrypoint are inspected statically (without executing the plugin) before any trust decision is made.
2. **Malware scanning**: optional ClamAV scanning can run before the plugin is approved.
3. **Explicit trust**: an administrator must explicitly trust a plugin. Trusting pins a SHA-256 snapshot of every file in the plugin directory.
4. **Integrity checks**: after trust, the system can verify at any time that no files have changed since trust was granted.
5. **Execution gate**: a plugin must be installed, enabled, validated, trusted, and have verified integrity before any of its code runs.

:::warning
Trusting a plugin gives it the same runtime permissions as the Laravel application. Only install plugins from sources you control or fully trust.
:::

## Where to find plugins in the UI

All plugin management lives under **Plugins** in the admin navigation. There are two sections:

- **Plugins**: your installed and registered plugins. Use this to view run history, tune settings, enable/disable, trust, verify integrity, or uninstall a plugin.
- **Plugins → Installs**: the install review queue. Staged plugins (from an upload, local directory, or GitHub release) appear here waiting for scan, approval, and trust.

The **Plugins Dashboard** shows a health summary across all installed plugins: validation status, trust state, integrity status, and recent run activity.
