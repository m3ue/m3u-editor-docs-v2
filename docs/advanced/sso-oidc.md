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
