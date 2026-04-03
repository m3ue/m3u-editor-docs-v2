---
sidebar_position: 5
description: Full reference for the plugin.json manifest: every field, its type, whether it is required, and what it does.
tags:
  - Plugins
  - Reference
title: Manifest Reference
---

# Manifest Reference

Every plugin must include a `plugin.json` file at the root of its directory. This is the manifest: the host reads it to understand what the plugin is, what it needs, and what it declares ownership of.

## Full example

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "api_version": "1.0.0",
  "description": "A short description of what this plugin does.",
  "entrypoint": "Plugin.php",
  "class": "MyPlugin\\Plugin",
  "capabilities": ["channel_processor"],
  "hooks": ["playlist.synced"],
  "permissions": ["db_read", "db_write", "hook_subscriptions"],
  "cleanup": "preserve",
  "settings": [
    {
      "key": "enabled",
      "type": "boolean",
      "label": "Enable Processing",
      "default": true
    }
  ],
  "actions": [
    {
      "id": "health_check",
      "label": "Health Check",
      "icon": "heroicon-o-heart",
      "dry_run": true,
      "requires_confirmation": false
    }
  ],
  "schema": {
    "tables": [
      {
        "name": "plugin_my_plugin_events",
        "columns": [
          { "name": "id",         "type": "id" },
          { "name": "event_type", "type": "string" },
          { "name": "payload",    "type": "json" },
          { "name": "created_at", "type": "timestamp", "nullable": true },
          { "name": "updated_at", "type": "timestamp", "nullable": true }
        ],
        "indexes": [
          { "type": "index", "columns": ["event_type"] }
        ]
      }
    ]
  },
  "data_ownership": {
    "storage_roots": ["plugin-data/my-plugin", "plugin-reports/my-plugin"],
    "tables": ["plugin_my_plugin_events"]
  }
}
```


## Top-level fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique plugin identifier. Lowercase, hyphens only. Must match the directory name. |
| `name` | string | Yes | Human-friendly display name shown in the admin UI. |
| `version` | string | Yes | Semver version string (e.g. `1.0.0`). |
| `api_version` | string | Yes | Must match the host's supported API version (`1.0.0`). |
| `description` | string | No | Short description shown in the admin UI. |
| `entrypoint` | string | Yes | Relative path to the PHP entrypoint file (e.g. `Plugin.php`). |
| `class` | string | Yes | Fully-qualified class name of the plugin entrypoint (e.g. `MyPlugin\\Plugin`). |
| `capabilities` | array | No | Capability IDs the plugin implements. See [Capabilities](#capabilities). |
| `hooks` | array | No | Hook names the plugin subscribes to. See [Hooks](#hooks). |
| `permissions` | array | No | Permissions the plugin requires. See [Permissions](#permissions). |
| `cleanup` | string | No | Default uninstall cleanup mode: `preserve` or `purge`. Defaults to `preserve`. |
| `settings` | array | No | Settings schema. See [Settings fields](#settings-fields). |
| `actions` | array | No | Actions exposed in the admin UI. See [Action fields](#action-fields). |
| `schema` | object | No | Database tables the plugin owns. See [Schema](#schema). |
| `data_ownership` | object | No | Declares which tables and storage paths belong to this plugin. See [Data ownership](#data-ownership). |


## Capabilities

Declare the capabilities your plugin provides. The validator checks that your PHP class implements the corresponding interface.

| Capability | Required interface |
|---|---|
| `channel_processor` | `ChannelProcessorPluginInterface` |
| `epg_processor` | `EpgProcessorPluginInterface` |
| `stream_analysis` | `StreamAnalysisPluginInterface` |
| `scheduled` | `ScheduledPluginInterface` |


## Hooks

Hooks your plugin subscribes to. If any hooks are declared, your class must implement `HookablePluginInterface`.

| Hook | Fires when |
|---|---|
| `playlist.synced` | A playlist finishes syncing |
| `epg.synced` | An EPG source finishes syncing |
| `epg.cache.generated` | The EPG cache has been rebuilt |
| `before.epg.map` | Just before an EPG map is applied |
| `after.epg.map` | Just after an EPG map is applied |
| `before.epg.output.generate` | Just before EPG output is generated |
| `after.epg.output.generate` | Just after EPG output is generated |


## Permissions

Declare every permission your plugin needs. These are informational: the host does not enforce them at runtime: but the validator will warn if declared permissions do not match declared capabilities.

| Permission | Risk | What it allows |
|---|---|---|
| `db_read` | Low | Read from host Eloquent models and tables |
| `db_write` | Medium | Write to host tables |
| `schema_manage` | High | Create or migrate plugin-owned schema tables |
| `filesystem_read` | Low | Read files from storage |
| `filesystem_write` | Medium | Write files to storage |
| `network_egress` | Medium | Make outbound HTTP requests |
| `queue_jobs` | Medium | Dispatch Laravel queue jobs |
| `hook_subscriptions` | Low | Required if any hooks are declared |
| `scheduled_runs` | Low | Required if the `scheduled` capability is declared |


## Settings fields

Each entry in the `settings` array defines one setting field.

| Property | Type | Required | Description |
|---|---|---|---|
| `key` | string | Yes | Setting key. Used to access the value in code as `$context->settings['key']`. |
| `type` | string | Yes | Field type. See field types below. |
| `label` | string | Yes | Label shown in the admin UI. |
| `default` | mixed | No | Default value used before the admin saves anything. |
| `required` | boolean | No | Whether the field is required. Defaults to `false`. |
| `helper_text` | string | No | Helper text shown below the field in the UI. |
| `options` | array | If `type=select` | Array of `{ "value": "...", "label": "..." }` objects. |
| `model` | string | If `type=model_select` | Eloquent model name (e.g. `Playlist`). |
| `scope` | string | No | `owned` limits `model_select` choices to the current user's records. |

**Field types:**

| Type | Description |
|---|---|
| `boolean` | Toggle switch. Stored as `true` / `false`. |
| `number` | Numeric input. Stored as integer or float. |
| `text` | Single-line text input. |
| `textarea` | Multi-line text input. |
| `select` | Drop-down from a static list defined in `options`. |
| `model_select` | Drop-down populated from an Eloquent model relationship. |


## Action fields

Each entry in the `actions` array exposes a button in the plugin edit page header.

| Property | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Action identifier. Passed as the `$action` argument to `runAction()`. |
| `label` | string | No | Button label. Defaults to a capitalised version of `id`. |
| `icon` | string | No | Heroicon name (e.g. `heroicon-o-play`). |
| `dry_run` | boolean | No | If `true`, `$context->dryRun` is set and the action should make no persistent changes. |
| `requires_confirmation` | boolean | No | If `true`, the user must confirm in a modal before the action runs. |
| `destructive` | boolean | No | If `true`, the button renders in danger (red) colour. |
| `hidden` | boolean | No | If `true`, the action is not shown in the UI. |

Action fields (form inputs shown in the confirmation modal):

```json
"actions": [
  {
    "id": "sync",
    "label": "Sync Now",
    "requires_confirmation": true,
    "fields": [
      {
        "key": "playlist_id",
        "type": "model_select",
        "label": "Playlist",
        "model": "Playlist",
        "scope": "owned",
        "required": true
      }
    ]
  }
]
```

The values the user fills in are passed as `$payload` to `runAction()`.


## Schema

If your plugin needs its own database tables, declare them here. The host creates and migrates these tables when the plugin is trusted.

```json
"schema": {
  "tables": [
    {
      "name": "plugin_my_plugin_events",
      "columns": [
        { "name": "id",         "type": "id" },
        { "name": "event_type", "type": "string",    "length": 64 },
        { "name": "payload",    "type": "json" },
        { "name": "user_id",    "type": "foreignId",  "nullable": true },
        { "name": "created_at", "type": "timestamp",  "nullable": true },
        { "name": "updated_at", "type": "timestamp",  "nullable": true }
      ],
      "indexes": [
        { "type": "index",  "columns": ["event_type"] },
        { "type": "unique", "columns": ["event_type", "user_id"] }
      ]
    }
  ]
}
```

**Table naming rule:** all plugin-owned tables must be prefixed with `plugin_<plugin_id_underscored>_`. For a plugin with ID `my-plugin`, all tables must start with `plugin_my_plugin_`.

**Supported column types:**

| Type | Blueprint equivalent |
|---|---|
| `id` | `$table->id()` |
| `foreignId` | `$table->foreignId('col')` |
| `string` | `$table->string('col', length?)` |
| `text` | `$table->text('col')` |
| `boolean` | `$table->boolean('col')` |
| `integer` | `$table->integer('col')` |
| `bigInteger` | `$table->bigInteger('col')` |
| `decimal` | `$table->decimal('col', precision?, scale?)` |
| `json` | `$table->json('col')` |
| `timestamp` | `$table->timestamp('col')` |
| `timestamps` | `$table->timestamps()` |

All column definitions accept `nullable: true` to make the column nullable.

**Supported index types:** `index`, `unique`.


## Data ownership

The `data_ownership` block tells the host what this plugin owns. When uninstalled with `purge` mode, everything listed here is deleted.

```json
"data_ownership": {
  "storage_roots": [
    "plugin-data/my-plugin",
    "plugin-reports/my-plugin"
  ],
  "tables": [
    "plugin_my_plugin_events"
  ]
}
```

| Property | Description |
|---|---|
| `storage_roots` | Paths relative to `storage/app/` that belong to this plugin. Only `plugin-data/<id>/` and `plugin-reports/<id>/` prefixes are allowed. |
| `tables` | Database table names owned by this plugin. Must follow the `plugin_<id>_` prefix rule. |
