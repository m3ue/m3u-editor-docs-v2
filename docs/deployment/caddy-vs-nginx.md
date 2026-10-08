---
sidebar_position: 3
description: Serve M3U Editor at your own domain with HTTPS, using Nginx Proxy Manager, Caddy, Nginx, or Traefik.
tags:
  - Deployment
  - Nginx
  - Caddy
  - Reverse Proxy
title: Reverse Proxy and HTTPS
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Reverse Proxy and HTTPS

To reach M3U Editor at your own domain, like `https://m3u.example.com`, put a reverse proxy in front of it. The reverse proxy handles the HTTPS certificate and forwards requests to the editor's port.

If you already run one (Nginx Proxy Manager, Caddy, Traefik, SWAG), add M3U Editor to it like any other app. The editor container serves everything on its one port, including proxied streams (`/m3u-proxy/`) and the live updates in the web interface (websockets at `/app`), so there's only one address to forward.

## What the reverse proxy needs

- **Forward every path** to the editor, at `http://<server-ip>:36400`, or `http://m3u-editor:36400` if the reverse proxy is on the same Docker network.
- **Allow websockets.** The web interface uses them for live progress and notifications.
- **Don't buffer or time out streams.** Streams and large playlist downloads stay open for a long time.
- **Send `X-Forwarded-Proto`.** Most reverse proxies do this by default. It tells the editor the request arrived over HTTPS, so it builds `https://` links.

Then set `APP_URL` to your domain, with no port, and recreate the container:

```bash
APP_URL=https://m3u.example.com
```

For an `https://` address, the editor leaves the port off the links it builds, since the reverse proxy listens on 443.

## Examples

<Tabs groupId="reverse-proxy" queryString>
<TabItem value="npm" label="Nginx Proxy Manager" default>

Add a **Proxy Host**:

1. **Details:** enter your domain, set the scheme to `http`, the forward hostname to your server's IP (or `m3u-editor`), and the port to `36400`. Turn on **Websockets Support**.
2. **SSL:** request a Let's Encrypt certificate, and turn on **Force SSL**.
3. **Advanced:** paste the following, so long streams aren't cut off or buffered:

```nginx
proxy_buffering off;
proxy_read_timeout 3600s;
proxy_send_timeout 3600s;
```

</TabItem>
<TabItem value="caddy" label="Caddy">

Caddy gets and renews the certificate on its own, and passes websockets and forwarded headers by default.

```caddyfile
m3u.example.com {
    reverse_proxy 192.168.1.50:36400 {
        flush_interval -1
    }
}
```

`flush_interval -1` sends stream data on immediately instead of buffering it.

</TabItem>
<TabItem value="nginx" label="Nginx">

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name m3u.example.com;

    ssl_certificate     /etc/letsencrypt/live/m3u.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/m3u.example.com/privkey.pem;

    client_max_body_size 1024M;

    location / {
        proxy_pass http://192.168.1.50:36400;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Websockets
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Long-running streams
        proxy_buffering off;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

`client_max_body_size` allows large uploads, like M3U and EPG files or backups.

</TabItem>
<TabItem value="traefik" label="Traefik">

Add labels to the `m3u-editor` service, and attach it to Traefik's network. Traefik passes websockets and forwarded headers by default.

```yaml
services:
  m3u-editor:
    labels:
      - traefik.enable=true
      - traefik.http.routers.m3u.rule=Host(`m3u.example.com`)
      - traefik.http.routers.m3u.entrypoints=websecure
      - traefik.http.routers.m3u.tls.certresolver=letsencrypt
      - traefik.http.services.m3u.loadbalancer.server.port=36400
```

Use the entry point and certificate resolver names from your own Traefik setup.

</TabItem>
</Tabs>

## Exposing it to the internet

A reverse proxy makes M3U Editor reachable from anywhere, so:

- Always use HTTPS, and change the default `admin` password (you're asked to on first sign-in).
- Consider exposing only what remote players need. With `XTREAM_ONLY_ENABLED=true`, the editor also serves just the Xtream API on port `36401`, which you can forward instead of the whole app. See [Editor Configuration](/docs/configuration#application).
- Give each person their own login with [Playlist Auths](/docs/resources/playlist-auth), and use [Single Sign-On](/docs/advanced/sso-oidc) if you already have an identity provider.
- To keep players on your LAN using a local address while `APP_URL` is your domain, set the proxy's **Override URL** or turn on **Resolve proxy public URL dynamically**. See [M3U Proxy Setup](/docs/deployment/m3u-proxy-integration#settings-that-affect-the-connection).

## The bundled Nginx and Caddy

The [fully external](/docs/deployment/docker-compose#fully-external) compose files include their own web server instead of the one inside the editor container. Their config files, `nginx.conf` and `Caddyfile`, already route the app, the proxy, and websockets, and serve plain HTTP on port `36400`.

If another reverse proxy sits in front, leave them as they are and point it at port `36400`, as above. To have them serve HTTPS themselves:

<Tabs groupId="bundled-web-server" queryString>
<TabItem value="caddy" label="Caddy" default>

1. In the `Caddyfile`, delete the `auto_https off` line and replace `:80` with your domain, for example `m3u.example.com`.
2. In the compose file, publish ports `80` and `443` on the `caddy` service.
3. Set `APP_URL=https://m3u.example.com`.

Caddy then gets and renews a Let's Encrypt certificate. Your domain must point at the server, and ports 80 and 443 must be reachable from the internet.

</TabItem>
<TabItem value="nginx" label="Nginx">

1. Get a certificate for your domain, for example with Certbot.
2. Mount it into the `nginx` service, for example `./ssl:/etc/nginx/ssl:ro`.
3. In `nginx.conf`, change `listen 80;` to `listen 443 ssl;`, and add `ssl_certificate` and `ssl_certificate_key` lines pointing at the mounted files.
4. In the compose file, publish port `443` (the line is there, commented out).
5. Set `APP_URL=https://m3u.example.com`.

Nginx doesn't renew certificates itself, so renew them on the host and restart the container.

</TabItem>
</Tabs>
