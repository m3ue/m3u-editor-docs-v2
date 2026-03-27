---
sidebar_position: 7
description: Configure Single Sign-On (SSO) using OpenID Connect
tags:
  - Advanced
  - Authentication
  - SSO
  - OIDC
title: OIDC Authentication (SSO)
---

# OIDC Authentication (SSO)

M3U Editor supports optional Single Sign-On (SSO) via **OpenID Connect (OIDC)**. This allows users to authenticate using an external identity provider such as [Keycloak](https://www.keycloak.org/), [Authelia](https://www.authelia.com/), [Authentik](https://goauthentik.io/), or any other OIDC-compliant provider.

When enabled, a **"Login with SSO"** button appears on the login page alongside the standard username/password form. Local authentication continues to work as normal.

## Prerequisites

- A working OIDC provider with a configured application/client
- The following from your OIDC provider:
  - **Issuer URL** (base URL, excluding `/.well-known/openid-configuration`)
  - **Client ID**
  - **Client Secret**

## Configuration

Add the following environment variables to your Docker Compose configuration or `.env` file:

```yaml
services:
  m3u-editor:
    environment:
      - OIDC_ENABLED=true
      - OIDC_ISSUER_URL=https://auth.example.com/realms/myrealm
      - OIDC_CLIENT_ID=m3u-editor
      - OIDC_CLIENT_SECRET=your-client-secret
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `OIDC_ENABLED` | Set to `true` to enable OIDC login |
| `OIDC_ISSUER_URL` | Base URL of your OIDC provider (see [Provider Examples](#provider-examples) below) |
| `OIDC_CLIENT_ID` | OAuth2 client ID from your provider |
| `OIDC_CLIENT_SECRET` | OAuth2 client secret from your provider |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OIDC_SCOPES` | `openid,profile,email` | Comma-separated list of scopes to request |
| `OIDC_AUTO_REDIRECT` | `false` | Skip the login form and redirect straight to the OIDC provider |
| `OIDC_AUTO_CREATE_USERS` | `true` | Automatically create a user account on first OIDC login |
| `OIDC_BUTTON_LABEL` | `Login with SSO` | Text shown on the SSO login button |
| `OIDC_HIDE_LOGIN_FORM` | `false` | Hide the username/password form and show only the SSO button |

### Callback URL

When configuring your OIDC provider, set the **redirect/callback URL** to:

```
https://your-m3u-editor-url/auth/oidc/callback
```

Replace `https://your-m3u-editor-url` with your actual M3U Editor URL.

## User Account Linking

When a user logs in via OIDC for the first time, M3U Editor attempts to link them to an existing account using the following order:

1. **OIDC ID** — matches if the user has logged in via OIDC before
2. **Email** — matches if a local account has the same email
3. **Username** — matches if a local account has the same name

If no existing account is found and `OIDC_AUTO_CREATE_USERS=true`, a new account is created automatically. If `OIDC_AUTO_CREATE_USERS=false`, the user will see an error and must have a pre-existing account.

On each OIDC login, the user's **name**, **email**, and **avatar** are synced from the identity provider.

## Admin Access

Admin status is stored as a flag on the user record (`is_admin` column), not derived from the user's email address. This means:

- The first user created during setup is automatically an admin
- Admin status is **preserved** when an OIDC login syncs a different email from the identity provider
- Admins can freely change their email from the profile page without losing admin access
- There is no need for a separate admin email environment variable

## Hiding the Login Form

Set `OIDC_HIDE_LOGIN_FORM=true` to hide the username/password fields and show only the SSO button on the login page. This is useful when OIDC is the sole authentication method.

## Auto-Redirect Mode

Set `OIDC_AUTO_REDIRECT=true` to skip the login page entirely and redirect unauthenticated users straight to your OIDC provider.

## Local Login Bypass

If your OIDC provider is down or you need to access the local login form, append `?local` to the login URL:

```
https://your-m3u-editor-url/login?local
```

This bypasses both auto-redirect and the hidden login form, showing the full username/password form as a fallback.

## Provider Examples

### Keycloak

```yaml
environment:
  - OIDC_ENABLED=true
  - OIDC_ISSUER_URL=https://keycloak.example.com/realms/myrealm
  - OIDC_CLIENT_ID=m3u-editor
  - OIDC_CLIENT_SECRET=your-client-secret
```

In Keycloak, create a new client with:
- **Client type**: OpenID Connect
- **Valid redirect URIs**: `https://your-m3u-editor-url/auth/oidc/callback`
- **Client authentication**: On (to generate a client secret)

### Authentik

```yaml
environment:
  - OIDC_ENABLED=true
  - OIDC_ISSUER_URL=https://auth.example.com/application/o/m3u-editor/
  - OIDC_CLIENT_ID=your-client-id
  - OIDC_CLIENT_SECRET=your-client-secret
```

In Authentik, create a new OAuth2/OpenID Provider and Application with:
- **Redirect URIs**: `https://your-m3u-editor-url/auth/oidc/callback`
- **Scopes**: `openid`, `profile`, `email`

### Authelia

```yaml
environment:
  - OIDC_ENABLED=true
  - OIDC_ISSUER_URL=https://auth.example.com
  - OIDC_CLIENT_ID=m3u-editor
  - OIDC_CLIENT_SECRET=your-client-secret
```

In your Authelia configuration, add an OIDC client:

```yaml
identity_providers:
  oidc:
    clients:
      - client_id: m3u-editor
        client_secret: 'your-hashed-secret'
        redirect_uris:
          - https://your-m3u-editor-url/auth/oidc/callback
        scopes:
          - openid
          - profile
          - email
```

## OIDC Users and Passwords

OIDC users do not have a local password. They authenticate exclusively through their identity provider. The password fields are hidden on the profile page for OIDC users.

:::info
OIDC users cannot log in using the standard username/password form. They must always use the SSO button (or auto-redirect if enabled).
:::

## Troubleshooting

### "Authentication failed" error
- Verify your `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET` are correct
- Ensure the callback URL in your OIDC provider matches exactly: `https://your-m3u-editor-url/auth/oidc/callback`
- Check that your OIDC provider is accessible from the M3U Editor container

### "No account found" error
- This appears when `OIDC_AUTO_CREATE_USERS=false` and no matching user exists
- Create the user account locally first, or set `OIDC_AUTO_CREATE_USERS=true`

### "Your SSO account does not have an email address" error
- Ensure the `email` scope is included in `OIDC_SCOPES`
- Verify the user has an email address configured in your OIDC provider

### Lost admin access after OIDC login
- Admin status is stored on the user record and should be preserved through OIDC login
- Access the local login form via `?local` if needed to log in with the original admin credentials

### SSO button not showing on login page
- Verify `OIDC_ENABLED=true` is set
- Restart the container after changing environment variables
