---
slug: security-release-m3u-editor-0-14-5
title: "Security release: NGINX and PHP fixes in M3U Editor 0.14.5"
description: M3U Editor 0.14.5 updates the bundled NGINX to 1.30.7, which fixes ten vulnerabilities upstream, and moves to PHP 8.4.28. Most of the NGINX fixes are in features M3U Editor never turns on, but one does apply, so please update.
authors: [sparkison]
tags: [release, editor]
image: /img/blog/security-release-0-14-5/featured.jpg
---

M3U Editor 0.14.5 picks up two upstream security releases: NGINX, which serves the web interface and passes stream requests to M3U Proxy, and PHP, which M3U Editor runs on. Please update when you can, especially if your M3U Editor is reachable from the internet.

![Security release. NGINX + PHP patched.](/img/blog/security-release-0-14-5/featured.jpg)

<!-- truncate -->

## Update now

Pull the new image and recreate the container. Your data is kept.

```bash
docker compose pull
docker compose up -d
```

To check, open **Tools → System Health**. It now shows the bundled NGINX version next to FFmpeg, and it should read 1.30.7 or later. The PHP version should read 8.4.28 or later.

## NGINX 1.30.7

On November 18, the NGINX team released [nginx 1.30.7 (stable) and 1.31.9 (mainline)](https://nginx.org/2026.html) with fixes for ten vulnerabilities. M3U Editor uses the stable branch, so 0.14.5 ships 1.30.7.

That's a long list, and three of them are rated "major," so here's what each one means for an M3U Editor install.

:::warning[1 of 10 affects M3U Editor]

**Use-after-free in the resolver (CVE-2026-123634, medium).** The bundled NGINX uses its resolver to find M3U Proxy. The risk is low, but this is the reason to update. See [the resolver](#the-one-that-does-the-resolver) below.

:::

:::tip[9 of 10 don't affect M3U Editor]

These are all in parts of NGINX that M3U Editor's configuration never turns on.

:::

| Vulnerability | Severity | Why it doesn't apply |
| --- | --- | --- |
| Memory corruption in HTTP/2 flow control (CVE-2026-123007) | Major | HTTP/2 isn't enabled. |
| Use-after-free in HTTP/2 (CVE-2026-123633) | Medium | HTTP/2 isn't enabled. |
| Use-after-free in HTTP/3 (CVE-2026-121810) | Medium | HTTP/3 isn't enabled. |
| Infinite loop reading a request body over TLS 1.3 (CVE-2026-118899) | Major | The bundled NGINX doesn't handle TLS. |
| Use-after-free in the mail proxy module (CVE-2026-113425) | Major | The mail proxy isn't used. |
| NULL pointer dereference with PROXY protocol v2 (CVE-2026-120993) | Minor | Mainline only, and PROXY protocol isn't used. |
| Buffer overflow with `alias` and `try_files` (CVE-2026-125283) | Medium | We use `try_files`, but never with `alias`. |
| SNI bypass in stream client certificate checks (CVE-2026-120967) | Medium | The stream module isn't used. |
| Insufficient validation in stream `ssl_preread` (CVE-2026-123640) | Medium | The stream module isn't used. |

Severity ratings are from the [NGINX security advisories](https://nginx.org/en/security_advisories.html).

### Why HTTP/2 and HTTP/3 don't apply

The headline fixes in this release are in HTTP/2 and HTTP/3. NGINX only speaks those protocols when its configuration asks for them (`http2 on`, or a `quic` listener for HTTP/3), and M3U Editor's doesn't. The bundled NGINX listens on plain HTTP/1.1 on `APP_PORT` and `XTREAM_PORT`, with no TLS. Players, M3U TV, and the web interface all talk to it that way. If a client offers HTTP/2, NGINX simply doesn't accept it, so the vulnerable code never runs.

The same goes for the TLS 1.3 fix: the bundled NGINX never handles TLS, so there's no TLS 1.3 connection for it to get stuck on.

### The one that does: the resolver

M3U Editor passes requests under `/m3u-proxy/` to M3U Proxy. So that it still starts when the proxy container isn't running yet, NGINX looks up the proxy's address at request time with its built-in DNS resolver, using Docker's internal DNS server. That's the code with the use-after-free.

The exposure is small. NGINX only asks Docker's DNS, inside your Docker network, for the address of your proxy container. If you set `M3U_PROXY_NGINX_TARGET` to an IP address (common for VPN setups), NGINX skips the lookup entirely. But the resolver is in use on most installs, so this is the fix that makes 0.14.5 worth installing for the NGINX side alone.

### Your own reverse proxy

If you run your own reverse proxy in front of M3U Editor for HTTPS, such as NGINX, Nginx Proxy Manager, or SWAG, that's where HTTPS, HTTP/2, and often HTTP/3 are turned on, so those fixes matter there. Updating M3U Editor doesn't update it. Check for an update to whatever you run in front and install it too.

## PHP 8.4.28

On November 19, the PHP team released [PHP 8.4.28 and 8.5.13](https://www.php.net/ChangeLog-8.php#8.4.28), a security release with more than a dozen advisories. M3U Editor 0.14.5 ships PHP 8.4.28.

### phpAfterShell

The one you may have already read about is [phpAfterShell](https://depthfirst.com/research/phpaftershell) (CVE-2026-126714, rated critical). PHP's file-based sessions can be left half-written if a PHP worker is killed in the middle of saving one, and a crafted half-written session can lead to remote code execution. It needs no login: PHP's upload progress tracking writes to the session while it's still reading an upload, before the app's own code runs. 8.4.28 fixes it, along with two related session bugs (CVE-2026-115560 and CVE-2026-129481).

The writeup's table of affected versions lists 8.4.28 as vulnerable. That table reflects PHP's source as of November 17, before the release. The final 8.4.28 changelog lists the fix for CVE-2026-126714.

M3U Editor is less exposed than a typical PHP app. Laravel keeps its sessions in the database and never uses PHP's own file-based sessions, so nothing in M3U Editor reads PHP session files back. But PHP's upload progress tracking is on by default and runs before Laravel does, so we're treating it as applying and updating.

### The rest

The fixes that matter most for M3U Editor, which runs PHP-FPM behind NGINX:

- **PHP-FPM request smuggling** through an unread request body (CVE-2026-129289).
- **Timezone cache use-after-free** that can lead to remote code execution (CVE-2026-129496). M3U Editor works with dates and time zones throughout.
- **PHP-FPM use-after-free** that can lead to local privilege escalation inside the container (CVE-2026-129291).

The release also fixes bugs in PHP-CGI, the PHP-FPM status page, Phar, SOAP, DOM, and the HTTP and FTP stream wrappers. M3U Editor doesn't use PHP-CGI or the FPM status page, but the update covers everything either way.

## Also in M3U Editor 0.14.5

<!-- TODO: non-security highlights for this release, if any. -->

As always, the full list is in the [M3U Editor release notes](https://github.com/m3ue/m3u-editor/releases).
