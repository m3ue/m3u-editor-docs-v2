---
sidebar_position: 3
description: How plugin settings work in M3U Editor — field types, sections, how defaults are applied, and how settings reach plugin code.
tags:
  - Plugins
title: Plugin Settings
---

# Plugin Settings

Plugins can declare a **settings schema** in their manifest. M3U Editor renders this schema as a form on the plugin edit page, validates input, and passes the saved values to the plugin at runtime through the execution context.

## How settings work

Settings are declared in `plugin.json` under the `settings` key. Each setting has a `type`, a `key`, a `label`, and optionally a `default` value, `required` flag, and helper text.

When a plugin runs — whether triggered by a hook, a schedule, or a manual action — the current saved settings are passed in as `$context->settings`, a plain associative array.

```php
public function runAction(string $action, array $payload, PluginExecutionContext $context): PluginActionResult
{
    $host = $context->settings['dvr_host'] ?? 'localhost';
    $port = (int) ($context->settings['dvr_port'] ?? 8089);

    // use $host and $port...
}
```

## Setting field types

| Type | Description |
|---|---|
| `boolean` | Renders as a toggle. Stored as `true` or `false`. |
| `number` | Renders as a number input. Stored as an integer or float. |
| `text` | Single-line text input. |
| `textarea` | Multi-line text input. |
| `secret` | Password-style input — value is masked in the UI. Use for API keys, tokens, or passwords. Stored as a plain string (not encrypted at rest beyond normal DB security). |
| `tags` | Tag/chip input for entering multiple values. Stored as an array of strings. Users press Enter, comma, or Tab to add each value. |
| `select` | Drop-down with a static list of options defined in the manifest. |
| `model_select` | Drop-down populated from an Eloquent model (e.g. select a Playlist). Supports `scope: owned` to limit choices to the current user's records. |

## Example settings block in `plugin.json`

```json
"settings": [
  {
    "key": "dvr_host",
    "type": "text",
    "label": "DVR Host",
    "default": "localhost",
    "required": true,
    "helper_text": "Hostname or IP address of your DVR server."
  },
  {
    "key": "dvr_port",
    "type": "number",
    "label": "DVR Port",
    "default": 8089
  },
  {
    "key": "api_key",
    "type": "secret",
    "label": "API Key",
    "required": true,
    "helper_text": "Your provider API key. Value is masked once saved."
  },
  {
    "key": "ignored_tags",
    "type": "tags",
    "label": "Ignored Tags",
    "default": [],
    "helper_text": "Press Enter or comma to add each tag. Stored as an array."
  },
  {
    "key": "default_playlist_id",
    "type": "model_select",
    "label": "Default Playlist",
    "model": "Playlist",
    "scope": "owned",
    "helper_text": "Playlist to sync stations into by default."
  },
  {
    "key": "overwrite_existing",
    "type": "boolean",
    "label": "Overwrite Existing Channels",
    "default": false
  },
  {
    "key": "log_level",
    "type": "select",
    "label": "Log Level",
    "default": "info",
    "options": [
      { "value": "info", "label": "Info" },
      { "value": "debug", "label": "Debug" },
      { "value": "warning", "label": "Warning" }
    ]
  }
]
```

## Grouping Settings into Sections

For plugins with many settings, you can organise them into collapsible **sections** using the `section` key. Each setting that shares the same `section` value is grouped together under a labelled collapsible panel.

```json
"settings": [
  {
    "key": "server_host",
    "type": "text",
    "label": "Server Host",
    "section": "Connection"
  },
  {
    "key": "server_port",
    "type": "number",
    "label": "Server Port",
    "default": 8080,
    "section": "Connection"
  },
  {
    "key": "api_key",
    "type": "secret",
    "label": "API Key",
    "section": "Authentication"
  },
  {
    "key": "log_level",
    "type": "select",
    "label": "Log Level",
    "section": "Advanced",
    "options": [
      { "value": "info", "label": "Info" },
      { "value": "debug", "label": "Debug" }
    ]
  }
]
```

Settings without a `section` key are rendered at the top level before any sections.

## Manifest-Driven Table UI

Plugins can declare a **table UI** directly in the manifest to display tabular data on their admin page — without writing any custom Filament code.

Declare the table schema under the `table` key in `plugin.json`:

```json
"table": {
  "columns": [
    { "key": "name", "label": "Name", "sortable": true },
    { "key": "status", "label": "Status" },
    { "key": "last_run", "label": "Last Run", "type": "datetime" }
  ]
}
```

The plugin's data method populates the rows. See the [Developing Plugins](developing-plugins.md) guide for how to implement the data provider.

## Scheduled plugin settings

Plugins with the `scheduled` capability typically include settings for the schedule itself:

```json
{
  "key": "schedule_enabled",
  "type": "boolean",
  "label": "Enable Schedule",
  "default": false
},
{
  "key": "schedule_cron",
  "type": "text",
  "label": "Cron Expression",
  "default": "0 * * * *",
  "helper_text": "Standard 5-part cron expression. Example: '0 * * * *' runs every hour."
}
```

The plugin's `scheduledActions()` method reads these at runtime and decides whether to return actions for the current tick.

:::tip CRON Helper
Any `text` field containing a cron expression automatically shows a **CRON tester** button in the UI. Click it to validate the expression and preview the next scheduled run times.
:::

## Where settings are stored

Settings are stored in the `extension_plugins` table as a JSON column. They are **preserved** across reinstalls and plugin updates unless you explicitly purge them. This means you can update a plugin's version without losing user-configured values.
