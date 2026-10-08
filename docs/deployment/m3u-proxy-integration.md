---
sidebar_position: 2
description: How M3U Editor and M3U Proxy connect, how to check the connection, and how to move from the embedded proxy to its own container.
tags:
  - Deployment
  - M3U Proxy
  - Streaming
title: M3U Proxy Setup
---

import { Steps, Step } from '@site/src/components/Steps';

# M3U Proxy Setup

[M3U Proxy](/docs/proxy/overview) is the streaming half of M3U Editor. When a player asks for a proxied channel, the editor hands the stream to the proxy, which fetches it from your provider, shares that one connection with every viewer of the channel, fails over when it drops, and transcodes when asked.

This page covers connecting the two. What the proxy does, and how to tune it, is in the [M3U Proxy](/docs/proxy/overview) section.

:::note The proxy is opt-in per playlist
Installing the proxy doesn't send anything through it yet. Turn on **Enable Stream Proxy** in a playlist's **Output** tab, under **Streaming Output**, or add `?proxy=true` to one playlist URL. See [Proxy per URL](/docs/client_configuration#pick-an-output).
:::

## Embedded or separate

| | Embedded | Separate container |
|---|---|---|
| Runs | Inside the editor container | In its own `m3u-proxy` container |
| Used by | The all-in-one setup | The modular, VPN, and fully external setups |
| Hardware acceleration | Not supported | Supported |
| Turned on with | `M3U_PROXY_ENABLED=true` (the default) | `M3U_PROXY_ENABLED=false`, plus where to find it |

The separate container is recommended. It can use your GPU, and it keeps streaming work out of the editor's container.

## How they connect

Players never talk to the proxy directly. Proxied stream URLs point at the editor, as `http://your-server:36400/m3u-proxy/...`, and the editor's web server forwards them to the proxy. So only the editor's port needs to be reachable, and the proxy can stay on the Docker network.

The editor and proxy authenticate each other with a shared token. With the separate container, these settings must line up:

| On the editor | On the proxy | Notes |
|---|---|---|
| `M3U_PROXY_ENABLED=false` | | Use the separate container instead of the embedded one |
| `M3U_PROXY_HOST=m3u-proxy` | | The proxy's container name |
| `M3U_PROXY_PORT=38085` | `PORT=38085` | The same port on both |
| `M3U_PROXY_TOKEN` | `API_TOKEN` | The same token on both. Generate it with `openssl rand -hex 32`. |

The proxy also connects to Redis to share streams between viewers (`REDIS_ENABLED`, `REDIS_HOST`, `REDIS_SERVER_PORT`, `REDIS_PASSWORD`, and `REDIS_DB=6`).

The shipped compose files fill all of this in from your `.env`, so you only set `M3U_PROXY_TOKEN` once.

## Check the connection

In the editor, open **Settings → Proxy** and choose **Test connection** at the top of the page. A working connection shows:

- the proxy's version, and whether it's running embedded or as a separate container
- whether hardware acceleration was detected, and which device
- the FFmpeg, Streamlink, and yt-dlp versions it has
- whether Redis stream sharing is on

From the command line, `docker exec m3u-editor php artisan m3u-proxy:status` runs the same check, and `docker compose logs -f m3u-proxy` shows the proxy's own log.

## Settings that affect the connection

Most of **Settings → Proxy** tunes streaming behavior (see the [Settings Reference](/docs/advanced/settings-reference#proxy)). A few settings change how players and the proxy reach the editor:

| Setting | Use it when |
|---|---|
| **Override URL** | Players should use a different address for proxied streams than `APP_URL`, for example your LAN IP while `APP_URL` is your domain. Also settable with `PROXY_URL_OVERRIDE`. |
| **Resolve proxy public URL dynamically at request time** | Players reach the editor at more than one address (LAN, VPN, Tailscale). Each player gets stream URLs on the address it used. |
| **Resolver URL** | The address the proxy uses to call back to the editor, for [advanced failover](/docs/proxy/failover), [pooled providers](/docs/advanced/playlist-pooled_providers), and [network broadcasts](/docs/integrations/media_networks_integration). Use the editor's LAN or Docker address, like `http://m3u-editor:36400`. |

## Move to a separate proxy container

To move an all-in-one install to the modular setup, keeping your data:

<Steps>
<Step title="Back up">

Copy your `./data` folder, and run `docker compose down`.

</Step>
<Step title="Switch compose files">

Download [`docker-compose.proxy.yml`](https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml) as your new `docker-compose.yml`. It uses the same `./data`, `pgdata`, and `./storage` volumes, so it picks up your existing database.

Keep the `pgdata` volume name the same as before. Docker prefixes volume names with the folder name, so run the new file from the same folder.

</Step>
<Step title="Set the new variables">

Add `REDIS_PASSWORD` to your `.env`, and make sure `M3U_PROXY_TOKEN` is set. The all-in-one setup generates a token if you didn't set one; the separate proxy needs it in `.env`.

</Step>
<Step title="Start it and test">

Run `docker compose up -d`, then use **Test connection** in **Settings → Proxy**. It should show the proxy running as an external service.

</Step>
</Steps>

## Troubleshooting

| Problem | What to check |
|---|---|
| **Test connection** fails | `M3U_PROXY_TOKEN` on the editor and `API_TOKEN` on the proxy must match, and `M3U_PROXY_HOST` must be the proxy's container name. Check `docker compose ps` shows the proxy as `healthy`. |
| The proxy container stays `unhealthy` | Its health check uses `M3U_PROXY_TOKEN` from `.env`. If you set the token directly in the compose file instead, the check can't authenticate. |
| Stream URLs show `localhost` | Set `APP_URL` to your server's address, or set the **Override URL**. See [Editor Configuration](/docs/configuration#application). |
| Channels play directly but not through the proxy | Read the proxy log while starting the channel. Setting `LOG_LEVEL=DEBUG` on the proxy shows more detail. |
| Failover or network broadcasts don't work | Set the **Resolver URL** to an address the proxy can reach, and use **Test resolver connection** next to it. |

More stream problems are covered in [Troubleshooting](/docs/troubleshooting).
