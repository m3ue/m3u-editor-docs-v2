---
sidebar_position: 5
title: Job Monitor
description: Follow syncs, probes, downloads, and other background jobs as they run, and retry the ones that failed.
tags:
  - Advanced
  - Jobs
  - Monitoring
---

# Job Monitor

Syncs, guide imports, stream probes, downloads, recordings, and backups all run in the background as jobs. **Tools → Job Monitor** shows them as they run, and keeps a record of what finished and what failed.

The top of the page shows how many jobs are running, how many succeeded and failed in the last 7 days, and the average time a job takes. Large operations that run as many jobs at once, like a sync, also show a progress card while they run. The page updates every 10 seconds.

The list below has each job with its status, queue, attempt number, progress, how long it took, and, for failed jobs, the error. Filter it by **Status** or **Queue** to narrow it down.

| Action | What it does |
|---|---|
| **Retry** | Run a failed job again. |
| **Retry Failed** | Run every failed job again. |
| **Delete** | Remove a job from the list. |

The queue indicator in the top bar shows the same activity at a glance, and links here. Turn it on or off with **Show queue indicator** in **Settings → General**.

## When jobs are stuck

If jobs stay queued and nothing runs, the background workers may have stopped. **Reset Queue** in **Settings → Sync Options** restarts them, but it also removes every pending job, so use it only when things are really stuck. To check a single stuck playlist instead, use **Reset Processing State** on the playlist.

The number of workers for each kind of job can be tuned with [environment variables](environment-variables#background-workers). To be told when jobs fail, turn on **Notify on queued job failures** in [Alerts](alerts).
