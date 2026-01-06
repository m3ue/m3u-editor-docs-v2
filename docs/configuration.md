---
sidebar_position: 3
description: Configure M3U Editor environment variables and settings
tags:
  - Getting Started
  - Configuration
title: Editor Configuration
hide_title: true
---
<div style={{ textAlign: 'center', padding: '0 0 2rem 0' }}>
  <img src="/img/logo.png" alt="M3U Editor logo" style={{ width: '220px', maxWidth: '10%' }} />
</div>

# Editor Configuration

M3U Editor uses environment variables for configuration. This guide covers the most important settings.

## Basic Configuration

### Application Settings

```bash
# Application URL - Change to your domain or IP
APP_URL=http://localhost
APP_PORT=36400

# Timezone
TZ=Etc/UTC
```

### Database Configuration

M3U Editor supports PostgreSQL (recommended), MySQL, and SQLite.

#### PostgreSQL (Embedded - Default)

```bash
# Enable embedded PostgreSQL
ENABLE_POSTGRES=true
PG_DATABASE=m3ue
PG_USER=m3ue
PG_PASSWORD=changeme
PG_PORT=5432

# Database connection
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=m3ue
DB_USERNAME=m3ue
DB_PASSWORD=changeme
```

#### External PostgreSQL

```bash
# Disable embedded PostgreSQL
ENABLE_POSTGRES=false

# Connect to external database
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=m3ue
DB_USERNAME=m3ue
DB_PASSWORD=your-secure-password
```

### Redis Configuration

M3U Editor uses Redis for caching and queue management. Both embedded and external Redis are supported.

#### Embedded Redis (Default)

```bash
REDIS_ENABLED=true
REDIS_HOST=localhost
REDIS_SERVER_PORT=6379
REDIS_PASSWORD=changeme  # Automatically set to M3U_PROXY_TOKEN if not provided
```

:::info Automatic Configuration
**Embedded Redis**: If `REDIS_PASSWORD` is not set, it's automatically configured to match `M3U_PROXY_TOKEN`. This ensures the proxy and Redis credentials stay synchronized.

**Custom Password** (optional):
```bash
# Set a custom password (must match across all services)
REDIS_PASSWORD=$(openssl rand -hex 32)
```
:::

#### External Redis

```bash
REDIS_ENABLED=false
REDIS_HOST=your-redis-host
REDIS_SERVER_PORT=6379
REDIS_PASSWORD=your-redis-password  # REQUIRED: Must match your Redis requirepass
```

:::danger External Redis Password Required
When using external Redis, you **MUST** explicitly set `REDIS_PASSWORD` to match your Redis instance's `requirepass` configuration.

**Important**: The automatic password setting only works with embedded Redis. External Redis connections will fail if passwords don't match.
:::

#### Testing Redis Connection

```bash
# From m3u-editor container
docker exec -it m3u-editor php artisan tinker
>>> Redis::ping();
# Should return: "+PONG"

# Direct Redis connection
docker exec -it redis redis-cli -a your-password ping
# Should return: PONG
```

#### Common Redis Issues

**Error: "NOAUTH Authentication required"**
- **Cause**: Redis requires password but `REDIS_PASSWORD` not set
- **Solution**: Set `REDIS_PASSWORD` environment variable matching your Redis password

**Error: "ERR invalid password"**
- **Cause**: Mismatch between Redis `requirepass` and `REDIS_PASSWORD`
- **Solution**: Ensure passwords match in both Redis and m3u-editor configuration

## M3U Proxy Configuration

The M3U Proxy handles stream restreaming and transcoding.

### Embedded Proxy

```bash
M3U_PROXY_ENABLED=true
M3U_PROXY_PORT=38085
M3U_PROXY_HOST=localhost
M3U_PROXY_TOKEN=changeme
```

### External Proxy (Recommended for Production)

```bash
# Disable embedded proxy
M3U_PROXY_ENABLED=false

# Connect to external m3u-proxy container
M3U_PROXY_PORT=38085
M3U_PROXY_HOST=m3u-proxy
M3U_PROXY_TOKEN=your-secure-token
```

:::tip Generate Secure Tokens
Always use secure, randomly generated tokens:
```bash
openssl rand -hex 32
```
:::

## Web Server Configuration

### Embedded NGINX (Default)

```bash
NGINX_ENABLED=true
```

### External NGINX or Caddy

```bash
# Disable embedded NGINX
NGINX_ENABLED=false

# Configure FPM port if needed
FPMPORT=9000
```

## Advanced Settings

### HLS Storage

Configure where HLS segments are stored:

```bash
# Use host /dev/shm (recommended for performance)
HLS_TEMP_DIR=/hls-segments

# Enable garbage collection
HLS_GC_ENABLED=true
HLS_GC_INTERVAL=600        # 10 minutes
HLS_GC_AGE_THRESHOLD=3600  # 1 hour
```

## Environment File Examples

M3U Editor provides example environment files for different setups:

- `.env.proxy.example` - External proxy setup
- `.env.example` - Basic setup

Copy and customize these files for your deployment:

```bash
cp .env.proxy.example .env
# Edit .env with your settings
```

## Next Steps

- [Adding Playlists](/docs/resources/playlists) - Import your first M3U playlist
- [Deployment Guides](/docs/deployment/docker-compose) - Advanced deployment options
- [M3U Proxy Integration](/docs/deployment/m3u-proxy-integration) - Setup external proxy
- [Environment Variables](/docs/advanced/environment-variables) - List of available variables
