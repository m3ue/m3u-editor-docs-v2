---
sidebar_position: 3
description: How plugin settings work in M3U Editor: field types, how defaults are applied, and how settings reach plugin code.
tags:
  - Plugins
title: Plugin Settings
---

# Plugin Settings

Plugins can declare a **settings schema** in their manifest. M3U Editor renders this schema as a form on the plugin edit page, validates input, and passes the saved values to the plugin at runtime through the execution context.

## How settings work

Settings are declared in `plugin.json` under the `settings` key. Each setting has a `type`, a `key`, a `label`, and optionally a `default` value, `required` flag, and helper text.

When a plugin runs: whether triggered by a hook, a schedule, or a manual action: the current saved settings are passed in as `$context->settings`, a plain associative array.

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

## Where settings are stored

Settings are stored in the `extension_plugins` table as a JSON column. They are **preserved** across reinstalls and plugin updates unless you explicitly purge them. This means you can update a plugin's version without losing user-configured values.
