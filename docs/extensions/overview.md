---
sidebar_position: 1
description: What plugins can do in M3U Editor, how installing and trusting them works, and where to find them.
tags:
  - Plugins
title: Plugin Overview
---

import LinkCards from '@site/src/components/LinkCards';

# Plugins

Plugins add your own automation to M3U Editor without changing the app itself. A plugin can react when a playlist or guide syncs, clean up channels or guide data, check streams, run on a schedule, or add buttons you trigger by hand. Each plugin has its own settings page, and keeps a history of its runs.

Plugins are optional, and run with the same access as M3U Editor itself, so only install ones you trust.

## Where to find them

Everything is under **Plugins** in the sidebar:

| Page | What it's for |
|---|---|
| **Overview** | The health of every plugin: whether it's valid, trusted, unchanged, and what it ran recently. |
| **Plugins** | Your installed plugins. Change their settings, run their actions, see their run history, enable or disable them, check their files, and uninstall them. |
| **Installs** | Plugins waiting to be installed: upload one here, then scan, approve, and trust it. |
| **Create Plugin** | Generate the files for a new plugin of your own. |

## What a plugin can do

A plugin declares the kinds of work it does:

| Capability | Does |
|---|---|
| `channel_processor` | Changes or cleans up channels after a sync |
| `epg_processor` | Changes or enriches guide data |
| `epg_cache_enrichment` | Adds to guide data in the [EPG cache](/docs/advanced/epg-optimization) |
| `stream_analysis` | Checks streams' health or quality |
| `scheduled` | Runs on a schedule you set in its settings |

It can also run when something happens in M3U Editor:

| Hook | Runs |
|---|---|
| `playlist.synced` | After a playlist syncs |
| `epg.synced` | After a guide syncs |
| `epg.cache.generated` | After a guide's cache is rebuilt |

`before.epg.map`, `after.epg.map`, `before.epg.output.generate`, and `after.epg.output.generate` are also accepted in manifests, but reserved: M3U Editor doesn't run them yet.

## How plugins are kept safe

Plugin code isn't sandboxed, so M3U Editor checks it carefully before it can run:

1. **Validation.** The plugin's files are inspected, without running them.
2. **Scanning.** Optionally, the files are scanned for malware with ClamAV.
3. **Trust.** An admin explicitly trusts the plugin, which records a fingerprint of every file.
4. **Integrity.** Before running, the files are checked against that fingerprint. A changed file stops the plugin until it's trusted again.

A plugin only runs when it's installed, enabled, valid, trusted, and unchanged.

<LinkCards
  items={[
    { to: '/docs/extensions/installing-plugins', icon: 'download', title: 'Install a plugin', text: 'Upload, scan, approve, trust, and enable.' },
    { to: '/docs/extensions/plugin-settings', icon: 'tune', title: 'Plugin settings', text: 'How plugin settings and schedules work.' },
    { to: '/docs/extensions/developing-plugins', icon: 'code', title: 'Build a plugin', text: 'Create, test, and package your own.' },
    { to: '/docs/extensions/manifest-reference', icon: 'description', title: 'Manifest reference', text: 'Every field in plugin.json.' },
  ]}
/>
