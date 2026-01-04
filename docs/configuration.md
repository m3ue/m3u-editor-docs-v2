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

#### Embedded Redis (Default)

```bash
REDIS_ENABLED=true
REDIS_SERVER_PORT=6379
REDIS_HOST=localhost
```

#### External Redis

```bash
REDIS_ENABLED=false
REDIS_HOST=your-redis-host
REDIS_SERVER_PORT=6379
```

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

### Queue Configuration

```bash
# Queue driver (sync, database, redis)
QUEUE_CONNECTION=database

# Number of queue workers
QUEUE_WORKERS=4
```

### Logging

```bash
# Log level (debug, info, warning, error)
LOG_LEVEL=info

# Log channel
LOG_CHANNEL=stack
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

- [Adding Playlists](/docs/resources/adding-playlists) - Import your first M3U playlist
- [Deployment Guides](/docs/deployment/docker-compose) - Advanced deployment options
- [M3U Proxy Integration](/docs/deployment/m3u-proxy-integration) - Setup external proxy
