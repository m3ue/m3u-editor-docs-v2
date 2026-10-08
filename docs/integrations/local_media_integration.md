---
sidebar_position: 6
description: Serve movies and TV shows from folders on your server, with no media server needed.
title: Local Media
tags:
  - Integrations
  - Local Media
  - Docker
---

import { Steps, Step } from '@site/src/components/Steps';

# Local Media

Local Media serves video files from folders on your server, without a separate media server. M3U Editor scans the folders, works out titles, years, seasons, and episodes from the file and folder names, and can fill in artwork and details from [TMDB](tmdb_integration).

## Set it up

<Steps>
<Step title="Mount your folders into the container">

M3U Editor can only see folders mounted into its container. Add them to the `m3u-editor` service in your compose file, then run `docker compose up -d`:

```yaml
volumes:
  - /mnt/nas/movies:/media/movies
  - /mnt/nas/tv:/media/tv
```

</Step>
<Step title="Add the integration">

Go to **Integrations → Media Servers**, choose **Add Media Server**, and set **Server Type** to **Local Media**. Under **Media Library Paths**, add a library for each folder:

- **Library Name**, like `Movies`
- **Container Path**, the path inside the container, like `/media/movies`
- **Content Type**: **Movies only**, **TV Shows only**, or **Both (auto-detect)** for a folder that mixes them

</Step>
<Step title="Choose the scan options and save">

| Option | Default | What it does |
|---|---|---|
| **Scan Recursively** | On | Look in subfolders too. |
| **Auto-Fetch Metadata** | On | Look up details on TMDB after each sync. Needs a TMDB API key. |
| **Metadata Source** | TMDB | **Filename Only** skips online lookups. |
| **Torrent/NZB Title Parsing** | Off | Understand release-style names like `Show.S01E01.1080p.WEB.mkv`. |
| **Video File Extensions** | `mp4`, `mkv`, `avi`, `mov`, `wmv`, `ts`, `m4v` | Which files count as videos. |

**Scan & Discover Libraries** checks the paths. Save, and the first scan starts.

</Step>
</Steps>

New items are first grouped under their **Library Name**. Once TMDB details arrive, they move into their genre (Action, Drama, and so on), following the integration's **Genre Handling**.

## Name your files

### Movies

| Pattern | Example |
|---|---|
| `Title (Year).ext` | `The Dark Knight (2008).mkv` |
| `Title.Year.Quality.ext` | `The.Dark.Knight.2008.1080p.BluRay.mkv` |
| `Title Year.ext` | `The Dark Knight 2008.mkv` |
| `Title.ext` | `The Dark Knight.mkv` (no year, so matching is less certain) |

### TV shows

Put each show in its own folder, with a folder per season:

```
/media/tv/
  Breaking Bad/
    Season 1/
      Breaking Bad S01E01 - Pilot.mkv
      Breaking Bad S01E02 - Cat's in the Bag.mkv
    Season 2/
      Breaking Bad S02E01.mkv
```

Episode files can be named any of these ways:

| Pattern | Example |
|---|---|
| `Show S01E02 - Title.ext` | `Breaking Bad S01E01 - Pilot.mkv` |
| `Show.S01E02.Title.ext` | `Breaking.Bad.S01E01.Pilot.mkv` |
| `Show 1x02 - Title.ext` | `Breaking Bad 1x02 - Cat's in the Bag.mkv` |
| `S01E02 - Title.ext` | `S01E01 - Pilot.mkv` (the show's name comes from its folder) |

## Troubleshooting

| Problem | What to check |
|---|---|
| The path isn't found | The **Container Path** matches the right-hand side of the volume mount, and you recreated the container after adding it. |
| Nothing is found | The **Content Type** is right, **Scan Recursively** is on for nested folders, and the file extensions are in the list. |
| Episodes land in the wrong show | Each show has its own folder with season folders, and episodes use `S01E02` or `1x02`. |
| No artwork or details | A TMDB API key is set in **Settings → Integrations**, and **Metadata Source** is **TMDB**. |
