---
sidebar_position: 1
description: Getting up and running quickly
tags:
  - Getting Started
title: Quick Start
---

<div style={{ textAlign: 'center', padding: '0 0 2rem 0' }}>
  <img src="/img/logo.png" alt="M3U Editor logo" style={{ width: '220px', maxWidth: '10%' }} />
</div>

# Getting Started with m3u-editor

:::tip Server Access
M3U Editor Defaults to **Port 36400**. -- **This can be changed in the docker-compose file.**

**Default Username:** admin

**Default Password:** admin
:::

## 🤔 Pick Your Deployment

**M3U-Proxy with External Setup (Recommended)**

Multiple concurrent users. Stream pooling: one provider subscription serves multiple viewers via shared connection. Separate containers for app, proxy, and Redis cache.

**[Jump to example](#deployment-recommended "M3U-Proxy with External Setup")**

**M3U-Proxy Embedded**

Single container. Same pooling concept, no Redis. Good for light to moderate use.

**[Jump to example](#deployment-proxy_embedded "M3U-Proxy with Embedded Proxy Setup")**

**Internal PostgreSQL**

Better reliability than SQLite. PostgreSQL container managed by Docker Compose. Better for concurrent access and crash resilience.

**[Jump to example](#deployment-internal_postgres "Internal PostgreSQL")**

**External PostgreSQL**

Point m3u-editor to your existing Postgres instance elsewhere.

**[Jump to example](#deployment-external_postgres "External PostgreSQL")**

## 🏷️ Image Versions

M3U Editor is available in the following versions:

|                                               Version                                              |                     Description                     |                  Docker Image                 |
| :------------------------------------------------------------------------------------------------: | :-------------------------------------------------: | :-------------------------------------------: |
|       **[sparkison/m3u-editor:latest](https://github.com/sparkison/m3u-editor/tree/master)**       |              Recommended Stable Branch              |    docker pull sparkison/m3u-editor:latest    |
|          **[sparkison/m3u-editor:dev](https://github.com/sparkison/m3u-editor/tree/dev)**          |             Stable-ish, quick bug fixes             |      docker pull sparkison/m3u-editor:dev     |
| **[sparkison/m3u-editor:experimental](https://github.com/sparkison/m3u-editor/tree/experimental)** | Bleeding edge features -- **There be dragons here** | docker pull sparkison/m3u-editor:experimental |

## 🐳 Deployment Examples

### M3U-Proxy with External Setup (Recommended){#deployment-recommended}

```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:${IMAGE_TAG:-latest}
    container_name: m3u-editor
    environment:
      # Timezone
      - TZ=Etc/UTC
      
      # Application URL (change to your domain or IP)
      - APP_URL=${APP_URL:-http://localhost}
      - APP_PORT=${APP_PORT:-36400}

      # Postgres Configuration
      - ENABLE_POSTGRES=true # Use embedded Postgres, disable to use your own Postgres service
      - PG_DATABASE=${PG_DATABASE:-m3ue}
      - PG_USER=${PG_USER:-m3ue}
      - PG_PASSWORD=${PG_PASSWORD:-changeme}
      - PG_PORT=${PG_PORT:-5432}

      # Database Connection (m3u-editor)
      - DB_CONNECTION=pgsql
      - DB_HOST=localhost
      - DB_PORT=${PG_PORT:-5432}
      - DB_DATABASE=${PG_DATABASE:-m3ue}
      - DB_USERNAME=${PG_USER:-m3ue}
      - DB_PASSWORD=${PG_PASSWORD:-changeme}

      # Redis configuration
      - REDIS_ENABLED=true # Use embedded Redis
      - REDIS_SERVER_PORT=${REDIS_PORT:-6379}
      # -REDIS_PASSWORD=${M3U_PROXY_TOKEN:-changeme} # Automatically set to API_TOKEN
      
      # M3U Proxy Configuration (External)
      - M3U_PROXY_ENABLED=false # Disable embedded and use external m3u-proxy
      - M3U_PROXY_PORT=${M3U_PROXY_PORT:-38085}
      - M3U_PROXY_HOST=${M3U_PROXY_HOST:-m3u-proxy} # Internal network hostname of m3u-proxy container
      - M3U_PROXY_TOKEN=${M3U_PROXY_TOKEN:-changeme}
    volumes:
      # Persistent configuration data
      - ./data:/var/www/config
      
      # PostgreSQL data persistence
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    ports:
      - "${APP_PORT:-36400}:${APP_PORT:-36400}"  # Main application port
      # - "${PG_PORT:-5432}:${PG_PORT:-5432}"  # Uncomment to expose PostgreSQL
    networks:
      - m3u-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:${APP_PORT:-36400}/up"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  m3u-proxy:
    image: sparkison/m3u-proxy:${IMAGE_TAG:-latest}
    container_name: m3u-proxy
    environment:
      # API Authentication Token (must match M3U_PROXY_TOKEN above)
      - API_TOKEN=${M3U_PROXY_TOKEN:-changeme}
      - PORT=${M3U_PROXY_PORT:-38085}

      # Redis Configuration (for stream pooling)
      - REDIS_ENABLED=true
      - REDIS_PORT=${REDIS_PORT:-6379}
      - REDIS_HOST=m3u-editor # Connect to m3u-editor's embedded Redis instance
      - REDIS_DB=6 # 1-5 used by m3u-editor, so use 6 for m3u-proxy
      # -REDIS_PASSWORD=${M3U_PROXY_TOKEN:-changeme} # Automatically set to API_TOKEN
      - ENABLE_REDIS_POOLING=true
      
      # Logging
      - LOG_LEVEL=INFO
    restart: unless-stopped
    # Don't expose port externally - only accessible via internal network
    # ports:
    #   - "${PROXY_PORT:-38085}:${PROXY_PORT:-38085}"  # Uncomment only if you need direct external access
    networks:
      - m3u-network
    depends_on:
      m3u-editor:
        condition: service_healthy
    #devices:
    #  - /dev/dri:/dev/dri
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:${PROXY_PORT:-38085}/health?api_token=${M3U_PROXY_TOKEN:-changeme}"]
      interval: 30s
      timeout: 2s
      retries: 12
      start_period: 10s

networks:
  m3u-network:
    driver: bridge

volumes:
  pgdata:
    driver: local

```

### M3U-Proxy Embedded (Simple Alternative){#deployment-proxy\_embedded}

```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:latest
    container_name: m3u-editor
    environment:
      - TZ=Etc/UTC
      - APP_URL=http://localhost
      - M3U_PROXY_ENABLED=true
    volumes:
      - ./data:/var/www/config
    restart: unless-stopped
    ports:
      - 36400:36400

networks: {}
```

### Internal PostgreSQL {#deployment-internal\_postgres}

```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:latest
    container_name: m3u-editor
    environment:
      - TZ=Etc/UTC
      - APP_URL=http://localhost
      - ENABLE_POSTGRES=true
      - PG_DATABASE=m3ue
      - PG_USER=m3ue
      - PG_PASSWORD=changeme
      - DB_CONNECTION=pgsql
      - DB_HOST=localhost
      - DB_PORT=5432
      - DB_DATABASE=m3ue
      - DB_USERNAME=m3ue
      - DB_PASSWORD=changeme
    volumes:
      - ./data:/var/www/config
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    ports:
      - 36400:36400

networks: {}
volumes:
  pgdata:
```

### External PostgreSQL {#deployment-external\_postgres}

```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:latest
    container_name: m3u-editor
    environment:
      - TZ=Etc/UTC
      - APP_URL=http://localhost
      - DB_CONNECTION=pgsql
      - DB_HOST=your-postgres-hostname  # localhost, 192.168.1.50, db.example.com, etc.
      - DB_PORT=5432
      - DB_DATABASE=m3ue
      - DB_USERNAME=m3ue
      - DB_PASSWORD=changeme
    volumes:
      - ./data:/var/www/config
    restart: unless-stopped
    ports:
      - 36400:36400

networks: {}
```

:::tip
Change **DB\_HOST** to wherever your PostgreSQL instance is running. Make sure the database and user already exist on that instance.
:::

### 💾 Data Persistence

Link a volume to **/var/www/config** to persist configurations, database, as well as logs accross container restarts

```yaml
volumes:
  - ./data:/var/www/config              # Current directory (common)
  - /mnt/storage/m3u:/var/www/config    # Absolute path
  - ~/m3u-editor:/var/www/config        # Home directory
```

### 🩺 Health Checks

Add to m3u-editor service to monitor status:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:36400/up"]
  interval: 10s
  timeout: 10s
  retries: 10
  start_period: 60s
```

Other containers can wait for m3u-editor to be healthy before starting:

```yaml
depends_on:
  m3u-editor:
    condition: service_healthy
```

***

:::danger Disclaimer
M3U Editor is an independent, open‑source playlist manager — not an IPTV provider. We don’t host channels or partner with streaming services; please only use content you’re authorized to access.
:::
