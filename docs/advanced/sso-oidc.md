---
sidebar_position: 6
description: Configure Single Sign-On (SSO) via OpenID Connect for M3U Editor
tags:
  - Advanced
  - Authentication
  - SSO
  - OIDC
title: SSO / OpenID Connect
---

# SSO / OpenID Connect

M3U Editor supports Single Sign-On (SSO) via the OpenID Connect (OIDC) protocol. This allows users to authenticate using an external identity provider such as Keycloak, Authentik, Authelia, or any other standards-compliant OIDC provider.

:::info
OIDC authentication is **disabled by default**. The standard username/password login continues to work alongside SSO once enabled.
:::

## How It Works

When OIDC is enabled, a login button (labelled "Login with SSO" by default) appears on the login page. Clicking it redirects the user to your identity provider. After successful authentication, the user is redirected back to M3U Editor.

On first login, M3U Editor will:
1. Search for an existing account by OIDC subject ID, then email, then username.
2. If a match is found, link the OIDC identity to that account and sync the user's name, email, and avatar.
3. If no match is found and **auto-create** is enabled, a new account is created automatically.
4. If no match is found and auto-create is disabled, login is denied and the user is shown an error.

On subsequent logins the account is updated with the latest profile data from the identity provider.

## Prerequisites

- A configured OIDC client/application on your identity provider.
- The **redirect URI** must be set to: `https://your-m3u-editor-url/auth/oidc/callback`
- Your provider must expose an OIDC discovery endpoint (`.well-known/openid-configuration`) — all major providers support this.

## Configuration

All OIDC settings are controlled via environment variables. Add them to the `environment` section of your `docker-compose.yml`:

### Required Variables

```yaml
services:
  m3u-editor:
    environment:
      - OIDC_ENABLED=true
      - OIDC_ISSUER_URL=https://auth.example.com/realms/myrealm
      - OIDC_CLIENT_ID=m3u-editor
      - OIDC_CLIENT_SECRET=your-client-secret
```

### Optional Variables

```yaml
services:
  m3u-editor:
    environment:
      # Scopes to request (default: openid,profile,email)
      - OIDC_SCOPES=openid,profile,email
      # Automatically redirect to the IdP instead of showing the login form
      - OIDC_AUTO_REDIRECT=false
      # Automatically create a new local account if no match is found
      - OIDC_AUTO_CREATE_USERS=true
      # Label for the SSO button on the login page
      - OIDC_BUTTON_LABEL=Login with SSO
      # Hide the standard username/password login form entirely
      - OIDC_HIDE_LOGIN_FORM=false
```

### Variable Reference

| Variable | Default | Description |
|---|---|---|
| `OIDC_ENABLED` | `false` | Enable or disable OIDC authentication |
| `OIDC_ISSUER_URL` | — | Base URL of your OIDC provider (issuer) |
| `OIDC_CLIENT_ID` | — | OAuth 2.0 client ID registered with your provider |
| `OIDC_CLIENT_SECRET` | — | OAuth 2.0 client secret |
| `OIDC_SCOPES` | `openid,profile,email` | Scopes requested from the identity provider |
| `OIDC_AUTO_REDIRECT` | `false` | Skip the login form and go straight to the IdP |
| `OIDC_AUTO_CREATE_USERS` | `true` | Create a local account on first OIDC login |
| `OIDC_BUTTON_LABEL` | `Login with SSO` | Text displayed on the SSO button |
| `OIDC_HIDE_LOGIN_FORM` | `false` | Hide the password-based login form |

## Provider Setup Examples

### Keycloak

1. Create a new **Client** in your realm.
2. Set **Client ID** to match `OIDC_CLIENT_ID`.
3. Set **Valid Redirect URIs** to `https://your-m3u-editor-url/auth/oidc/callback`.
4. Enable **Client authentication** and copy the secret.
5. Set `OIDC_ISSUER_URL` to `https://keycloak.example.com/realms/your-realm`.

### Authentik

1. Create a new **OAuth2/OpenID Provider**.
2. Set the **Redirect URI** to `https://your-m3u-editor-url/auth/oidc/callback`.
3. Copy the **Client ID** and **Client Secret**.
4. Set `OIDC_ISSUER_URL` to `https://authentik.example.com/application/o/your-app/`.

### Authelia

1. Create an OIDC client entry in your Authelia configuration.
2. Set `redirect_uris` to `https://your-m3u-editor-url/auth/oidc/callback`.
3. Set `OIDC_ISSUER_URL` to `https://authelia.example.com`.

## Bypass SSO Login

If `OIDC_AUTO_REDIRECT=true` or `OIDC_HIDE_LOGIN_FORM=true` is set, you can still access the standard login form by appending `?local` to the login URL:

```
https://your-m3u-editor-url/login?local
```

This is useful for admin recovery if the identity provider is unavailable.

## External Reverse-Proxy SSO (Forward Auth)

Some users put a forward-auth proxy (Authelia, Authentik, oauth2-proxy, etc.) **in front of** M3U Editor at the reverse-proxy layer to protect the entire site with SSO. This is independent of the built-in OIDC above, which only protects the admin panel login.

:::warning
If you protect everything at the domain root with forward auth, **Xtream API, m3u export, EPG, and HDHR clients will break.** They don't carry browser sessions or SSO cookies — they authenticate using credentials embedded in the URL or query string, or via Bearer tokens.
:::

### Recommended: Allowlist admin paths only

The only browser-session UI in M3U Editor is the Filament admin panel. Everything else is designed to be publicly reachable, with its own credential check (path/query string for Xtream and m3u, Sanctum or JWT Bearer tokens for the API).

Configure your forward-auth proxy to **require SSO only on these paths**, and let everything else through:

| Path pattern | Notes |
|---|---|
| `/login` | Filament login (or whatever you set `app.login_path` to) |
| `/livewire/*`, `/filament/*` | Livewire / Filament SPA endpoints |
| `/horizon/*` | Queue dashboard |
| `/profile`, `/notifications` | User profile and notifications |
| `/playlists*`, `/custom-playlists*`, `/merged-playlists*`, `/playlist-aliases*`, `/playlist-viewers*`, `/playlist-auths*` | Playlist resources |
| `/channels*`, `/groups*`, `/series*`, `/categories*`, `/vods*`, `/vod-groups*` | Content resources |
| `/epgs*`, `/merged-epgs*`, `/epg-channels*`, `/epg-maps*` | EPG resources (note: this overlaps with the public `/epgs/<uuid>/epg.xml` — see below) |
| `/networks*`, `/media-server-integrations*` | Integrations |
| `/users*`, `/personal-access-tokens*`, `/assets*`, `/post-processes*`, `/plugins*`, `/plugin-install-reviews*` | Admin/tools |
| `/preferences`, `/log-viewer`, `/release-logs`, `/backups`, `/m3u-proxy-stream-monitor`, `/plugins-dashboard`, `/create-plugin`, `/stream-file-settings*`, `/channel-scrubbers*`, `/stream-profiles*` | Admin pages |
| `/admin/*` | Internal admin endpoints |

This approach is forward-compatible: when M3U Editor adds new public routes in future releases, your SSO config keeps working without updates.

:::tip
There's an awkward overlap: the **public** EPG file route `/epgs/<uuid>/epg.xml` and the **admin** EPG resource pages both start with `/epgs`. If your proxy can't distinguish, allowlist only `/epgs/<uuid>/epg.xml` (matching the UUID shape) for public access, or restrict the admin match to exact paths like `/epgs`, `/epgs/create`, `/epgs/{id}/edit`.
:::

### Alternative: Block-by-default with exclusions

If your proxy can only run in "protect everything, exclude these paths" mode, here's the full list of public routes that need to bypass SSO.

#### Xtream API endpoints

- `/player_api.php`
- `/get.php`
- `/xmltv.php`

#### Xtream stream endpoints

- `/live/<user>/<pass>/<id>.<ext>`
- `/movie/<user>/<pass>/<id>.<ext>`
- `/series/<user>/<pass>/<id>.<ext>`
- `/timeshift/<user>/<pass>/<duration>/<date>/<id>.<ext>`
- `/<user>/<pass>/<id>.<ext>` ⚠️ root-level fallback for legacy clients — matches **any** 3-segment URL with an extension

#### M3U / EPG / HDHR exports

- `/<uuid>/playlist.m3u`
- `/<uuid>/epg.xml`, `/<uuid>/epg.xml.gz`
- `/<uuid>/hdhr` and any path under it (HDHomeRun emulator — both query-auth and path-auth variants)
- `/epgs/<uuid>/epg.xml`

#### Network endpoints

- `/network/<network>/playlist.m3u`
- `/network/<network>/epg.xml`, `/network/<network>/epg.xml.gz`
- `/network/<network>/stream.<ts|mp4|mkv|avi|webm|mov>`
- `/network/<network>/now-playing`
- `/network/<network>/live.m3u8`, `/network/<network>/live*.ts`
- `/networks/<user>/playlist.m3u`, `/networks/<user>/epg.xml`
- `/media-integration/<id>/networks/playlist.m3u`, `/media-integration/<id>/networks/epg.xml`

#### Media proxies

- `/media-server/<id>/image/<itemId>/<type?>`
- `/media-server/<id>/stream/<itemId>.<container>`
- `/local-media/<id>/stream/<item>`
- `/webdav-media/<id>/stream/<item>`

#### Logos and images

- `/logo-proxy/<encodedUrl>/<filename?>`
- `/logo-repository`, `/logo-repository/index.json`, `/logo-repository/logos/<filename>`
- `/schedules-direct/<epg>/image/<hash>`

#### API and Bearer-token endpoints

These use Sanctum or JWT Bearer tokens, not browser sessions — they need to be reachable for clients that present a token:

- `/api/*` (in-app watch-progress, m3u-proxy webhooks, EPG API, JWT login)
- `/user/*`, `/channel/*`, `/group/*`, `/playlist/<uuid>/stats`, `/playlist/<uuid>/merge-channels`, `/proxy/status`, `/proxy/streams/active` (Sanctum-protected, **at the root, not under `/api/`**)
- `/accounts/token`, `/accounts/token/refresh`, `/channels/*`, `/vod/*` (Dispatcharr-compatible JWT routes used by the emby-xtream plugin)

#### Other public

- `/up` (health check)
- `/s/<shortKey>/<path?>` (short-URL forwarder, used for things like device.xml)
- `/proxy/ts/stream/<uuid>` (Dispatcharr-compatible stream proxy)
- `/auth/oidc/redirect`, `/auth/oidc/callback` (the SSO endpoints themselves)
- `/playlist/<uuid>/sync`, `/epg/<uuid>/sync` (rate-limited refresh triggers)
- `/app`, `/apps` (Reverb websocket, if proxied through the same hostname)

:::danger Watch out for the Xtream fallback route
`/<user>/<pass>/<id>.<ext>` matches **any** 3-segment URL ending in an extension. It's hard to express as a clean bypass rule, and is one of the main reasons the **allowlist-admin** approach above is preferred.
:::

:::tip Preserve query strings and Authorization headers
If your forward-auth proxy strips query strings or the `Authorization` header before forwarding upstream, M3U Editor's Xtream credentials (in the query string) and Sanctum/JWT tokens (in the header) will be lost. Make sure your proxy preserves both.
:::

## Troubleshooting

### "Authentication failed. Please try again."

- Verify `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` are correct.
- Ensure the redirect URI registered with your provider exactly matches `/auth/oidc/callback`.
- Check that `OIDC_ISSUER_URL` points to the correct issuer and the discovery endpoint is reachable.

### "Your SSO account does not have an email address."

The identity provider did not return an email claim. Ensure the `email` scope is included in `OIDC_SCOPES` and that your provider is configured to share the user's email address.

### "No account found for this email."

`OIDC_AUTO_CREATE_USERS` is set to `false` and no existing local account matches the email returned by the provider. Either enable auto-create or manually create a local account with the matching email address first.

### Changes Not Applied

After modifying environment variables in `docker-compose.yml`, recreate the container to apply them:

```bash
docker-compose up -d
```
