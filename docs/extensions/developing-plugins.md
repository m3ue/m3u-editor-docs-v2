---
sidebar_position: 4
description: How to build a plugin for M3U Editor: scaffolding, manifest, contracts, execution context, and the install/trust flow.
tags:
  - Plugins
  - Development
title: Developing Plugins
---

# Developing Plugins

A plugin is a directory containing two required files:

- **`plugin.json`**: the manifest that declares the plugin's ID, capabilities, hooks, permissions, settings, and actions.
- **`Plugin.php`** (or whichever entrypoint you declare in the manifest): the PHP class that implements the plugin logic.

Everything else in the directory is optional: scripts, stubs, a README, CI configuration, and any support classes your plugin needs.

## Prerequisites

- Access to the M3U Editor host (SSH or the admin UI for uploads).
- PHP 8.4 available locally if you want to validate or test before installing.
- No Composer dependencies are available to plugin code beyond what the host application provides.

## Scaffold a new plugin

Use the `make:plugin` Artisan command to generate a ready-to-run plugin scaffold:

```bash
php artisan make:plugin "My Plugin Name"
```

You can declare capabilities and hooks inline:

```bash
php artisan make:plugin "EPG Logger" \
  --capability=epg_processor \
  --hook=epg.synced \
  --hook=epg.cache.generated \
  --lifecycle
```

**Available options**

| Option | Description |
|---|---|
| `--capability=` | Capability IDs to declare (repeatable). Valid values: `channel_processor`, `epg_processor`, `stream_analysis`, `scheduled` |
| `--hook=` | Hook names to subscribe to (repeatable) |
| `--cleanup=` | Default uninstall cleanup mode: `preserve` (default) or `purge` |
| `--lifecycle` | Include a stub `uninstall()` method |
| `--bare` | Generate only `plugin.json` and `Plugin.php`, no starter kit files |
| `--force` | Overwrite an existing plugin directory |

The scaffold is written to `plugins/<plugin-id>/` inside the Laravel application root.

## Generated file structure

Running `make:plugin "EPG Logger" --capability=epg_processor --hook=epg.synced --lifecycle` produces:

```
plugins/epg-logger/
├── plugin.json              # Manifest
├── Plugin.php               # Entrypoint class
├── README.md                # Usage and release notes
├── scripts/
│   ├── validate-plugin.php  # Pre-release validation script
│   └── package-plugin.sh    # Archive builder for releases
├── .github/
│   └── workflows/
│       └── ci.yml           # CI workflow stub
├── CLAUDE.md                # AI assistant context for this plugin
└── AGENTS.md                # Architecture rules for AI tools
```

## The manifest (`plugin.json`)

The manifest is the source of truth for everything the host needs to know about your plugin before running it.

```json
{
  "id": "epg-logger",
  "name": "EPG Logger",
  "version": "1.0.0",
  "api_version": "1.0.0",
  "description": "Logs EPG sync events for debugging.",
  "entrypoint": "Plugin.php",
  "class": "EpgLogger\\Plugin",
  "capabilities": ["epg_processor"],
  "hooks": ["epg.synced", "epg.cache.generated"],
  "permissions": ["db_read", "filesystem_write"],
  "cleanup": "preserve",
  "settings": [
    {
      "key": "log_level",
      "type": "select",
      "label": "Log Level",
      "default": "info",
      "options": [
        { "value": "info",    "label": "Info" },
        { "value": "debug",   "label": "Debug" },
        { "value": "warning", "label": "Warning" }
      ]
    }
  ],
  "actions": [
    {
      "id": "health_check",
      "label": "Health Check",
      "icon": "heroicon-o-heart",
      "dry_run": true
    }
  ],
  "data_ownership": {
    "storage_roots": ["plugin-data/epg-logger"],
    "tables": []
  }
}
```

See the [Manifest Reference](./manifest-reference) for a full description of every field.

## The entrypoint (`Plugin.php`)

Your plugin class must implement `PluginInterface`. Depending on what you declared in the manifest, you will also implement additional interfaces.

```php
<?php

namespace EpgLogger;

use App\Plugins\Contracts\HookablePluginInterface;
use App\Plugins\Contracts\LifecyclePluginInterface;
use App\Plugins\Contracts\PluginInterface;
use App\Plugins\Support\PluginActionResult;
use App\Plugins\Support\PluginExecutionContext;
use App\Plugins\Support\PluginUninstallContext;

class Plugin implements PluginInterface, HookablePluginInterface, LifecyclePluginInterface
{
    public function runAction(string $action, array $payload, PluginExecutionContext $context): PluginActionResult
    {
        return match ($action) {
            'health_check' => PluginActionResult::success('EPG Logger is healthy.', [
                'plugin_id' => 'epg-logger',
                'timestamp' => now()->toIso8601String(),
            ]),
            default => PluginActionResult::failure("Unsupported action [{$action}]"),
        };
    }

    public function runHook(string $hook, array $payload, PluginExecutionContext $context): PluginActionResult
    {
        $level = $context->settings['log_level'] ?? 'info';

        $context->log("Hook [{$hook}] received.", $level, ['payload_keys' => array_keys($payload)]);

        return PluginActionResult::success("Hook [{$hook}] logged.", [
            'hook' => $hook,
            'log_level' => $level,
        ]);
    }

    public function uninstall(PluginUninstallContext $context): void
    {
        if (! $context->shouldPurge()) {
            return;
        }

        // Clean up anything not covered by data_ownership declarations.
    }
}
```

## Plugin contracts (interfaces)

| Interface | Required | When to implement |
|---|---|---|
| `PluginInterface` | Yes | All plugins: provides `runAction()` |
| `HookablePluginInterface` | If hooks declared | Provides `runHook()` |
| `ScheduledPluginInterface` | If `scheduled` capability | Provides `scheduledActions()` |
| `LifecyclePluginInterface` | Optional | Provides `uninstall()` for custom cleanup |

The validator checks that the interfaces you implement match the capabilities and hooks you declared in the manifest.

## The execution context

Every method receives a `PluginExecutionContext` that gives your plugin access to logging, progress tracking, settings, and cancellation signals.

```php
// Read a setting
$host = $context->settings['dvr_host'] ?? 'localhost';

// Logging
$context->info('Starting sync.');
$context->warning('Rate limit hit, backing off.');
$context->error('Connection refused.', ['host' => $host]);

// Progress (0–100)
$context->checkpoint(50, 'Halfway through stations.');

// Heartbeat — call this inside long loops to prevent stale-run detection
$context->heartbeat('Processing station 42 of 100.', progress: 42);

// Cancellation — check this inside long loops
if ($context->cancellationRequested()) {
    return PluginActionResult::cancelled('Run was cancelled by operator.');
}

// Dry run — make no persistent changes
if ($context->dryRun) {
    return PluginActionResult::success('Dry run — no changes written.');
}
```

## Returning results

Every action and hook must return a `PluginActionResult`:

```php
// Success
return PluginActionResult::success('Done.', ['rows_updated' => 42]);

// Failure
return PluginActionResult::failure('Could not connect to host.', ['host' => $host]);

// Cancelled (after checking $context->cancellationRequested())
return PluginActionResult::cancelled('Run cancelled.', ['processed' => $count]);
```

The `$data` array (second argument) is stored with the run record and shown in the run detail view in the admin UI.

## Scheduled plugins

Plugins with the `scheduled` capability must implement `ScheduledPluginInterface`:

```php
use Carbon\CarbonInterface;
use Dragonmantank\Cron\CronExpression;

public function scheduledActions(CarbonInterface $now, array $settings): array
{
    if (! ($settings['schedule_enabled'] ?? false)) {
        return [];
    }

    $cron = (string) ($settings['schedule_cron'] ?? '');
    if ($cron === '' || ! CronExpression::isValidExpression($cron)) {
        return [];
    }

    if (! (new CronExpression($cron))->isDue($now)) {
        return [];
    }

    return [
        [
            'type'    => 'action',
            'name'    => 'run_sync',
            'payload' => ['source' => 'schedule'],
            'dry_run' => false,
        ],
    ];
}
```

The host calls `scheduledActions()` on every scheduler tick. Return an array of action descriptors to fire, or an empty array to skip.

## Accessing host data

Plugin code runs inside the full Laravel application. You have access to all Eloquent models the host defines:

```php
use App\Models\Playlist;
use App\Models\Channel;
use Illuminate\Support\Facades\DB;

// Read channels for a playlist (declare db_read permission)
$channels = Channel::where('playlist_id', $playlistId)->get();

// Write to a plugin-owned table (declare db_write permission)
DB::table('plugin_epg_logger_events')->insert([...]);
```

Declare the permissions your plugin needs in `plugin.json`. The validator will warn if your declared permissions don't match your declared capabilities.

## File storage

Plugin-owned files must be stored under declared `storage_roots` in the manifest:

```php
use Illuminate\Support\Facades\Storage;

// Write to plugin-data/epg-logger/report.json
Storage::disk('local')->put('plugin-data/epg-logger/report.json', json_encode($data));
```

Any path outside the declared `storage_roots` is not guaranteed to be preserved across uninstalls or purges.

## Validating your plugin locally

The scaffold includes a `scripts/validate-plugin.php` script that checks the manifest without running the class:

```bash
php scripts/validate-plugin.php
```

You can also validate through the admin UI using the **Validate** button on the plugin edit page, or via Artisan:

```bash
php artisan plugins:validate
```

## Packaging for distribution

To share or install a plugin via archive upload or GitHub releases, use the bundled packaging script:

```bash
bash scripts/package-plugin.sh
```

This creates `<plugin-id>.zip` and a corresponding `<plugin-id>.zip.sha256` checksum file. Publish both as GitHub release assets. Users install via:

```bash
php artisan plugins:stage-github-release \
  https://github.com/<owner>/<repo>/releases/download/<tag>/<plugin-id>.zip \
  --sha256=<checksum>
```

Or they can upload the `.zip` directly from the admin UI.

## Development tips

- Set `PLUGIN_SCAN_DRIVER=fake` in `.env` to skip ClamAV scanning during local development.
- Use `--bare` with `make:plugin` if you just want the two core files without the starter kit.
- Plugin settings are preserved across reinstalls: you do not need to re-configure after updating.
- Use `$context->heartbeat()` inside any loop that might run for more than a few seconds to prevent the run from being marked stale.
- Always check `$context->cancellationRequested()` inside long-running loops so operators can stop a run cleanly from the UI.
