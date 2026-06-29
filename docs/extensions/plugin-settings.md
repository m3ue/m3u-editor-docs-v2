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
| `text` | Single-line text input. Add `"secret": true` to mask the value (for API keys, tokens, passwords). Not encrypted at rest beyond normal DB security. |
| `textarea` | Multi-line text input. |
| `tags` | Tag/chip input for entering multiple values. Stored as an array of strings. Users press Enter or Tab to add each value. |
| `select` | Drop-down with a static list of options. Options are declared as a `{ "value_key": "Display Label" }` map. Supports `options_provider` for dynamic options. |
| `model_select` | Drop-down populated from an Eloquent model (e.g. select a Playlist). Supports `scope: "owned"` to limit choices to the current user's records, `label_attribute` to control which model attribute is displayed, and `multiple: true` to allow multiple selections. |
| `table_select` | Drop-down populated from a plugin-owned table. Specify `table` (the UI table ID or physical table name), `value_column` (stored value, default `id`), `label_column` (display label, default `name`), and optionally `enabled_only: true` to filter to enabled rows. Supports `multiple: true`. |
| `section` | Groups nested fields under a labelled, optionally collapsible panel. Uses `fields` instead of a value — see [Grouping Settings into Sections](#grouping-settings-into-sections). |

## Example settings block in `plugin.json`

```json
"settings": [
  {
    "id": "dvr_host",
    "type": "text",
    "label": "DVR Host",
    "default": "localhost",
    "required": true,
    "helper_text": "Hostname or IP address of your DVR server."
  },
  {
    "id": "dvr_port",
    "type": "number",
    "label": "DVR Port",
    "default": 8089
  },
  {
    "id": "api_key",
    "type": "text",
    "secret": true,
    "label": "API Key",
    "required": true,
    "helper_text": "Your provider API key. Value is masked once saved."
  },
  {
    "id": "ignored_tags",
    "type": "tags",
    "label": "Ignored Tags",
    "default": [],
    "helper_text": "Press Enter or Tab to add each tag. Stored as an array."
  },
  {
    "id": "default_playlist_id",
    "type": "model_select",
    "label": "Default Playlist",
    "model": "App\\Models\\Playlist",
    "label_attribute": "name",
    "scope": "owned",
    "helper_text": "Playlist to sync stations into by default."
  },
  {
    "id": "overwrite_existing",
    "type": "boolean",
    "label": "Overwrite Existing Channels",
    "default": false
  },
  {
    "id": "log_level",
    "type": "select",
    "label": "Log Level",
    "default": "info",
    "options": {
      "info": "Info",
      "debug": "Debug",
      "warning": "Warning"
    }
  }
]
```

## Grouping Settings into Sections

For plugins with many settings, you can organise them into collapsible **sections** using `"type": "section"` entries in the `settings` array. Each section contains a `fields` array with its nested settings.

```json
"settings": [
  {
    "id": "connection",
    "type": "section",
    "label": "Connection",
    "collapsible": true,
    "collapsed": false,
    "fields": [
      {
        "id": "server_host",
        "type": "text",
        "label": "Server Host"
      },
      {
        "id": "server_port",
        "type": "number",
        "label": "Server Port",
        "default": 8080
      }
    ]
  },
  {
    "id": "authentication",
    "type": "section",
    "label": "Authentication",
    "collapsible": true,
    "fields": [
      {
        "id": "api_key",
        "type": "text",
        "secret": true,
        "label": "API Key"
      }
    ]
  },
  {
    "id": "advanced",
    "type": "section",
    "label": "Advanced",
    "collapsible": true,
    "collapsed": true,
    "fields": [
      {
        "id": "log_level",
        "type": "select",
        "label": "Log Level",
        "options": {
          "info": "Info",
          "debug": "Debug"
        }
      }
    ]
  }
]
```

Settings declared at the top level (outside any section) are rendered above the sections. Sections can be nested by placing another `section` entry inside a `fields` array.

## Scheduled plugin settings

Plugins with the `scheduled` capability typically include settings for the schedule itself:

```json
{
  "id": "schedule_enabled",
  "type": "boolean",
  "label": "Enable Schedule",
  "default": false
},
{
  "id": "schedule_cron",
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
