---
sidebar_position: 5
description: Full reference for the plugin.json manifest — every field, its type, whether it is required, and what it does.
tags:
  - Plugins
  - Reference
title: Manifest Reference
---

# Manifest Reference

Every plugin must include a `plugin.json` file at the root of its directory. This is the manifest — the host reads it to understand what the plugin is, what it needs, and what it declares ownership of.

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
      "id": "enabled",
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
    "directories": ["plugin-data/my-plugin", "plugin-reports/my-plugin"],
    "tables": ["plugin_my_plugin_events"]
  }
}
```

---

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

---

## Capabilities

Declare the capabilities your plugin provides. The validator checks that your PHP class implements the corresponding interface.

| Capability | Required interface |
|---|---|
| `channel_processor` | `ChannelProcessorPluginInterface` |
| `epg_processor` | `EpgProcessorPluginInterface` |
| `stream_analysis` | `StreamAnalysisPluginInterface` |
| `scheduled` | `ScheduledPluginInterface` |

---

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

---

## Permissions

Declare every permission your plugin needs. These are informational — the host does not enforce them at runtime — but the validator will warn if declared permissions do not match declared capabilities.

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

---

## Settings fields

Each entry in the `settings` array defines one setting field.

| Property | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Setting key. Used to access the value in code as `$context->settings['id']`. |
| `type` | string | Yes | Field type. See field types below. |
| `label` | string | Yes | Label shown in the admin UI. |
| `default` | mixed | No | Default value used before the admin saves anything. |
| `required` | boolean | No | Whether the field is required. Defaults to `false`. |
| `helper_text` | string | No | Helper text shown below the field in the UI. |
| `placeholder` | string | No | Placeholder text shown inside select-type inputs when nothing is selected. |
| `options` | object | If `type=select` | `{ "value_key": "Display Label" }` map of options. |
| `options_provider` | string | If `type=select` | Provider name for dynamic options via `PluginSelectOptionsProviderInterface`. Makes the field reactive. |
| `depends_on` | array | No | Field IDs whose current values are forwarded to `options_provider` as context. Causes the dependent field to reset when the source changes. |
| `multiple` | boolean | No | Allow multiple selections for `select`, `model_select`, and `table_select` fields. Stored as an array. |
| `model` | string | If `type=model_select` | Fully-qualified Eloquent model class (e.g. `App\Models\Playlist`). |
| `label_attribute` | string | No | Model attribute to display in `model_select` options (default: `name`). |
| `scope` | string | No | `owned` limits `model_select` and `table_select` choices to the current user's records. |
| `secret` | boolean | No | On `text` fields only: mask the value and show a reveal toggle. Use for API keys and passwords. |
| `is_regex` | boolean | No | On `text` fields: shows a live **Regex tester** button in the UI. |
| `is_cron` | boolean | No | On `text` fields: shows a **CRON tester** button. Also activated automatically when the field `id` is `schedule_cron`. |
| `table` | string | If `type=table_select` | Plugin-owned table ID or name to populate options from. |
| `value_column` | string | No | Column to use as the stored value in `table_select` (default: `id`). |
| `enabled_only` | boolean | No | In `table_select`, filter options to rows where `enabled = true` (default: `true`). |
| `scope_plugin` | boolean | No | In `table_select`, filter options to rows where `extension_plugin_id` matches this plugin. |

**Field types:**

| Type | Description |
|---|---|
| `boolean` | Toggle switch. Stored as `true` / `false`. |
| `number` | Numeric input. Stored as integer or float. |
| `text` | Single-line text input. Add `"secret": true` to mask the value. |
| `textarea` | Multi-line text input. |
| `tags` | Tag/chip input for entering multiple string values. Stored as an array. Users press Tab or Enter to confirm each value. |
| `select` | Drop-down from a static list defined in `options` (or dynamically via `options_provider`). |
| `model_select` | Drop-down populated from an Eloquent model query. Supports `multiple`. |
| `table_select` | Drop-down populated from a plugin-owned table. Supports `multiple`. |
| `section` | Groups nested fields under a labelled, optionally collapsible panel. See [Section fields](#section-fields). |

### Section fields

A `section` entry groups nested fields visually. It uses `type: section` and contains a `fields` array instead of a value.

| Property | Description |
|---|---|
| `id` | Identifier for the section (optional — not used for settings access). |
| `type` | Must be `"section"`. |
| `label` | Section heading. |
| `description` / `helper_text` | Optional subheading below the label. |
| `icon` | Optional heroicon name (e.g. `heroicon-o-cog`). |
| `collapsible` | `true` to allow the section to be collapsed/expanded. |
| `collapsed` | `true` to start collapsed. Requires `collapsible: true`. |
| `columns` | Number of grid columns for the nested fields (default: `1`). |
| `compact` | Reduce visual padding inside the section (default: `true`). |
| `fields` | Array of nested field definitions — same structure as top-level settings. Sections may be nested. |

```json
{
  "id": "connection",
  "type": "section",
  "label": "Connection",
  "collapsible": true,
  "collapsed": false,
  "fields": [
    { "id": "host", "type": "text", "label": "Host", "required": true },
    { "id": "port", "type": "number", "label": "Port", "default": 8080 }
  ]
}
```

---

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
        "id": "playlist_id",
        "type": "model_select",
        "label": "Playlist",
        "model": "App\\Models\\Playlist",
        "scope": "owned",
        "required": true
      }
    ]
  }
]
```

The values the user fills in are passed as `$payload` to `runAction()`.

---

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

### UI tables (`schema.ui_tables`)

Alongside physical table declarations, you can declare admin CRUD interfaces for those tables. The host renders these on a **Data** tab on the plugin edit page — no PHP required.

```json
"schema": {
  "tables": [ ... ],
  "ui_tables": [
    {
      "id": "profiles",
      "label": "Profiles",
      "model_label": "Profile",
      "table": "plugin_my_plugin_profiles",
      "description": "Reusable configuration profiles.",
      "export_formats": ["csv", "json"],
      "columns": [
        { "name": "name",    "label": "Name",    "searchable": true, "sortable": true },
        { "name": "enabled", "label": "Enabled", "type": "boolean",  "editable": true }
      ],
      "fields": [
        { "id": "name",    "label": "Name",    "type": "text",    "required": true },
        { "id": "enabled", "label": "Enabled", "type": "boolean", "default": true  }
      ]
    }
  ]
}
```

**UI table fields:**

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique identifier within this plugin (used in the URL) |
| `label` | Yes | Page heading |
| `table` | Yes | Physical table name — must be declared in `schema.tables` |
| `model_label` | No | Singular noun for the "New …" button (defaults to singular of `label`) |
| `description` | No | Subheading shown on the table page |
| `create` | No | Set `false` to hide the create action (default: `true`) |
| `edit` | No | Set `false` to hide per-row edit action (default: `true`) |
| `delete` | No | Set `false` to hide per-row delete action (default: `true`) |
| `delete_behavior` | No | `"clear"` updates the row with `delete_payload` instead of deleting it |
| `delete_payload` | No | Values to write when `delete_behavior` is `"clear"`; dot-notation keys write into `json` columns |
| `delete_label` | No | Label for the clear action button |
| `delete_icon` | No | Icon for the clear action (default: `heroicon-o-x-mark`) |
| `delete_color` | No | Button color for the clear action (default: `gray`) |
| `delete_description` | No | Modal body text for the clear action |
| `delete_submit_label` | No | Modal submit label (default: `Clear`) |
| `delete_success_message` | No | Success notification title after a clear action |
| `export_formats` | No | On-demand download formats. `["csv"]`, `["json"]`, `["csv", "json"]`, or `[]` to disable. Defaults to both. |
| `columns` | No | Column definitions for the list view (see below) |
| `fields` | No | Field definitions for the create/edit form — same field types as `settings` |
| `prefill` | No | Auto-populate rows from a source table on page mount |

**Column definition fields:**

| Field | Description |
|---|---|
| `name` | DB column name; dot-notation supported for `json` columns (e.g. `settings.mode`) |
| `label` | Column header (also used as the CSV export header) |
| `type` | `boolean` renders a check/cross icon; `datetime` formats by the user's date setting; omit for plain text |
| `editable` | `true` makes the column inline-editable as a toggle (boolean) or select (all other types) |
| `required` | For editable columns: marks the inline select as required and disables the empty placeholder option |
| `placeholder` | For editable select columns: override the placeholder text (default: `"None"` or `"Select an option"` when required) |
| `searchable` | Enable full-text search (plain columns only, not supported on dot-notation or lookup columns) |
| `sortable` | Enable column sort (plain columns only, not supported on dot-notation or lookup columns) |
| `options` | Static `{ "value_key": "Display Label" }` map — displayed for plain text columns and available as choices for editable columns |
| `options_provider` | Provider name for dynamic options via `PluginSelectOptionsProviderInterface` |
| `depends_on` | Column names whose current row values are passed to `options_provider` as context |
| `lookup` | Resolve a stored FK value to a display label from another table. See [`lookup` fields](#lookup-fields) below. |
| `limit` | Character truncation limit for plain text columns (default: `80`) |

### `lookup` fields

The `lookup` object on a column resolves a stored ID to a human-readable label from another table, without making the column editable. The source table may be a plugin-owned table or a host table (e.g. `playlists`).

| Property | Default | Description |
|---|---|---|
| `table` | — | Table ID (declared in `schema.ui_tables`) or physical table name. Host tables are allowed for read-only lookups. |
| `key_column` | `"id"` | Column in the lookup table to match against the stored value. |
| `label_column` | `"name"` | Column in the lookup table to use as the display label. |
| `source_column` | column `name` | Column on the current row that holds the FK value (if different from `name`). |
| `scope_plugin` | `false` | Restrict lookup options to rows owned by this plugin (rows where `extension_plugin_id` matches). |
| `enabled_only` | `false` | Restrict lookup options to rows where `enabled = true`. |
| `limit` | `500` | Maximum number of options loaded for populating an editable select. Capped at `500`. |

```json
{
  "name": "profile_id",
  "label": "Profile",
  "lookup": {
    "table": "profiles",
    "key_column": "id",
    "label_column": "name",
    "scope_plugin": true,
    "enabled_only": true
  }
}
```

### Automatic table filters

The host automatically adds filters to a UI table based on column presence in the physical table. No declaration is required:

| Column present in DB table | Filter added |
|---|---|
| `extension_plugin_run_id` | **Run** — filter rows by the plugin run that wrote them. On the plugin run detail page the table is pre-scoped to the current run. |
| `playlist_id` | **Playlist** — filter rows by the associated playlist. |
| `result_type` | **Type** — filter by distinct `result_type` values. |
| `decision` | **Decision** — filter by distinct `decision` values. |

These filters appear automatically in the embedded inline table view (on the plugin edit page and run detail page) but not on the standalone full-page table view.

**Exports** are generated on demand from the current DB rows. The downloaded file includes all physical table columns: declared `columns` appear first (in declaration order, using `label` as the CSV header), followed by any remaining database columns not covered by a declaration (using the raw column name as the header).

### `prefill` — auto-populate rows from a source table

When `prefill` is declared on a UI table, the host inserts one row per record in the source table on page mount (if that row does not already exist). This is useful for per-playlist or per-source configuration tables where you want every source to have a row ready to configure.

```json
{
  "id": "playlist_settings",
  "label": "Playlist Settings",
  "table": "plugin_my_plugin_playlist_settings",
  "prefill": {
    "source": {
      "table": "playlists",
      "key_column": "id",
      "user_column": "user_id",
      "scope": "owned",
      "order_column": "name"
    },
    "target_column": "playlist_id",
    "defaults": {
      "enabled": true
    }
  },
  "columns": [...],
  "fields": [...]
}
```

| Property | Default | Description |
|---|---|---|
| `source.table` | — | Source table ID (plugin-owned) or host table name (e.g. `playlists`). |
| `source.key_column` | `"id"` | Primary key column in the source table; its value is written into `target_column`. |
| `source.user_column` | `"user_id"` | User ownership column on the source table; used when `scope: "owned"`. |
| `source.scope` | — | `"owned"` limits source rows to those belonging to the current user. |
| `source.order_column` | `key_column` | Column to order the source rows by before inserting. |
| `target_column` | — | Column in the plugin table to write the source key value into. |
| `defaults` | `{}` | Additional column values to set on each new row (supports dot-notation for `json` columns). |

### Run result tables

When a `ui_table`'s physical table includes an `extension_plugin_run_id` column, the host automatically surfaces it on the plugin run detail page scoped to that run. If the run payload contains `playlist_id`, the table is also scoped to that playlist. Filters for run and playlist appear automatically.

This makes it easy for plugins to write per-run audit or result rows and let operators review them in context without any additional declaration:

```json
{ "type": "foreignId", "name": "extension_plugin_run_id", "references": "extension_plugin_runs", "on_delete": "cascade" }
```

Typical read-only result table:

```json
{
  "id": "run_results",
  "label": "Run Results",
  "table": "plugin_my_plugin_run_results",
  "create": false, "edit": false, "delete": false,
  "export_formats": ["csv"],
  "columns": [
    { "name": "created_at",  "label": "Created",  "type": "datetime", "sortable": true },
    { "name": "result_type", "label": "Type",      "sortable": true },
    { "name": "decision",    "label": "Decision",  "sortable": true },
    { "name": "title",       "label": "Title",     "searchable": true }
  ],
  "fields": []
}
```

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

---

## Data ownership

The `data_ownership` block tells the host what this plugin owns. When uninstalled with `purge` mode, everything listed here is deleted.

```json
"data_ownership": {
  "directories": [
    "plugin-data/my-plugin",
    "plugin-reports/my-plugin"
  ],
  "files": [
    "plugin-data/my-plugin/config.json"
  ],
  "tables": [
    "plugin_my_plugin_events"
  ]
}
```

| Property | Description |
|---|---|
| `directories` | Directory paths relative to `storage/app/` that belong to this plugin. Purged recursively on uninstall. |
| `files` | Individual file paths relative to `storage/app/` that belong to this plugin. |
| `tables` | Database table names owned by this plugin. Must follow the `plugin_<id>_` prefix rule. |
