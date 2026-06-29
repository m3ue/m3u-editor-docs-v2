---
sidebar_position: 9
title: Job Monitoring
description: Track background job progress, status, and errors in real time from the M3U Editor UI
tags:
  - Advanced
  - Jobs
  - Monitoring
---

# Job Monitoring

M3U Editor runs many operations in the background — playlist syncs, EPG updates, stream probing, backups, and more. The **Jobs Monitor** page gives you real-time visibility into all of these background processes without needing to access the queue manager directly.

**Access**: Sidebar → **Jobs Monitor**

:::info
The Jobs Monitor replaces the older Horizon queue manager link in Settings. Horizon is still available at `/horizon` for advanced users, but the Jobs Monitor is the recommended way to track job progress.
:::

---

## Overview

The Jobs Monitor shows a live dashboard with:

- **Queue statistics** — pending, processing, failed, and completed job counts
- **Active batches** — in-progress batch operations (e.g. a sync processing 500 channels)
- **Job list** — individual job records with status, timing, and progress
- **Failed jobs** — jobs that errored, with failure details for debugging

---

## Queue Stats Overview

The top of the page shows aggregate stats across all queues:

| Stat | Description |
|---|---|
| **Pending** | Jobs waiting to be picked up by a worker |
| **Processing** | Jobs currently running |
| **Completed** | Jobs that finished successfully |
| **Failed** | Jobs that failed and were not retried successfully |

These counts refresh automatically on the page's poll interval.

---

## Active Batches

When a large operation runs as a **batch** (e.g. a sync that processes channels in chunks), a batch card appears showing:

- **Batch name** — the operation type (e.g. "Playlist Sync", "Stream Probe")
- **Progress** — percentage complete with a progress bar
- **Pending / Processed / Failed** job counts within the batch
- **Started at** timestamp

Batches disappear from this section once they complete or are cancelled.

---

## Job List

The job list shows individual job records. Each row includes:

| Column | Description |
|---|---|
| **Job** | The job class name (e.g. `ProcessM3uImport`, `ProbeChannelStreams`) |
| **Queue** | Which queue the job ran on |
| **Status** | `pending`, `running`, `completed`, `failed` |
| **Progress** | Percentage complete (for jobs that report progress) |
| **Started / Finished** | Timestamps |
| **Duration** | How long the job took |

Click any job row to open the **detail view** with full progress notes, log output, and — for failed jobs — the error message and stack trace.

---

## Failed Jobs

Failed jobs are highlighted in the list with a red status badge. Open the detail view to see:

- **Error message** — what went wrong
- **Stack trace** — for debugging
- **Retry** — manually retry a failed job
- **Delete** — remove the failed job record

### Common failure causes

| Symptom | Likely cause |
|---|---|
| Sync fails immediately | Provider URL unreachable or credentials incorrect |
| Sync fails partway through | Network timeout; provider returned an error mid-stream |
| Probe job fails | ffprobe not installed, or all channels timed out |
| Backup fails | No disk space, or concurrent backup already running |

---

## Stale File Cleanup

A background **stale file cleanup** job runs periodically to remove orphaned files from the storage layer — for example, uploaded M3U files that were replaced or deleted but whose files were not removed at the time.

This job runs automatically on a schedule and does not remove files that are currently in use by active playlists. You can see it in the job list when it runs.

---

## Refreshing and Polling

The Jobs Monitor polls for updates automatically. To change the polling interval or stop polling:

1. Use the **Refresh interval** dropdown in the toolbar
2. Select your preferred interval, or select **Manual** to disable auto-refresh

For long-running syncs, keep the page open to watch progress update in real time.

---

## Related Resources

- [Playlists](../resources/playlists.md) - Triggering syncs
- [Stream Probing](./stream-probing.md) - Probe jobs
- [Stream Monitor](../proxy/stream-monitor.md) - Live stream visibility
