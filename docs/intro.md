---
sidebar_position: 0
description: Start here. What M3U Editor is, how the M3U Suite fits together, how to get running, and where to find everything in the docs.
tags:
  - Getting Started
title: Welcome
---

import ScreenshotsCarousel from '@site/src/components/ScreenshotsCarousel';
import { SuiteOverview, StartSteps, DocsSections, HelpLinks } from '@site/src/components/DocsIntro';

# Welcome to M3U Editor

M3U Editor is a self-hosted IPTV manager in the spirit of xTeVe and Threadfin. It brings your IPTV playlists, guide data, and media libraries into one place, lets you clean them up, and serves one consistent lineup to every player you use, as M3U, Xtream Codes API, HDHomeRun, or XMLTV.

These docs walk you through installing it, adding your sources, connecting your players, and every feature along the way.

## How it fits together

Your players only ever talk to M3U Editor. Swap providers, fix channel names, or fill in missing guide data, and every device picks up the change without being reconfigured. M3U Proxy handles the streams themselves, and M3U TV is a player built for the editor.

<SuiteOverview />

## Start here

<StartSteps />

You need Docker and at least one source: an Xtream login, or an M3U URL or file. Guide data is optional. To try it right away with the recommended setup:

```bash
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml
docker compose -f docker-compose.proxy.yml up -d
```

Then open `http://localhost:36400`. The [Quick Start](/docs/quick_start) covers the other setups, image versions, and keeping your data between updates.

## Explore the docs

<DocsSections />

## See it in action

<ScreenshotsCarousel slidesPerView={1.08} breakpoints={{ 768: { slidesPerView: 1.12, spaceBetween: 16 } }} />

## Help and updates

<HelpLinks />

## License

M3U Editor is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You can share and adapt it with credit to the original author, for non-commercial use, as long as you share your changes under the same license.

:::info Not an IPTV provider
M3U Editor is an independent playlist manager. It doesn't host channels or partner with streaming services. Only use content you're authorized to access.
:::
