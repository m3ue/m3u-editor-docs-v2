---
sidebar_position: 2
description: Complete M3U Proxy integration and configuration guide
tags:
  - Deployment
  - M3U Proxy
  - Streaming
title: M3U Proxy Integration
---

# M3U Proxy Integration

The M3U Proxy handles stream restreaming, transcoding, and hardware acceleration for M3U Editor.

## Why Use External M3U Proxy?

Running m3u-proxy as a separate container provides:

- ✅ **Hardware acceleration** support for transcoding
- ✅ **Better performance** with independent scaling
- ✅ **Redis-based pooling** for efficient stream management
- ✅ **Independent updates** and configuration
- ✅ **Resource isolation** from main application

## Quick Start

### Download Configuration

```bash
# Download docker-compose and example env
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml
curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/.env.proxy.example

# Setup environment
cp .env.proxy.example .env
```

### Generate Secure Tokens

```bash
# Generate M3U Proxy token
echo "M3U_PROXY_TOKEN=$(openssl rand -hex 32)" >> .env

# Generate database password
echo "PG_PASSWORD=$(openssl rand -base64 32)" >> .env

# Set your application URL
echo "APP_URL=http://localhost" >> .env
```

### Deploy

```bash
# Start all services
docker-compose -f docker-compose.proxy.yml up -d

# Wait for services to start (about 30 seconds)
docker-compose -f docker-compose.proxy.yml ps

# Verify m3u-proxy is healthy
docker exec -it m3u-editor php artisan m3u-proxy:status
```

## Configuration

### M3U Editor Environment

```bash
# Disable embedded proxy
M3U_PROXY_ENABLED=false

# Connect to external proxy
M3U_PROXY_HOST=m3u-proxy
M3U_PROXY_PORT=38085
M3U_PROXY_TOKEN=your-secure-token-here
```

### M3U Proxy Environment

```bash
# API Authentication (must match M3U_PROXY_TOKEN)
API_TOKEN=your-secure-token-here
PORT=38085

# Redis Configuration
REDIS_ENABLED=true
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=6
ENABLE_REDIS_POOLING=true

# Logging
LOG_LEVEL=INFO

# Optional: Adjust pool settings
REDIS_POOL_MAX_CONNECTIONS=50
STREAM_TIMEOUT=300
CLEANUP_INTERVAL=60
```

## Hardware Acceleration

### Enable GPU Access

Add GPU device mapping to your docker-compose.yml:

```yaml
m3u-proxy:
  devices:
    - /dev/dri:/dev/dri  # Intel/AMD GPU
    # - /dev/nvidia0:/dev/nvidia0  # NVIDIA GPU
```

### Verify GPU Access

```bash
# Check if GPU is accessible
docker exec -it m3u-proxy ls -la /dev/dri
```

### Supported Hardware

- Intel Quick Sync (QSV)
- AMD VCE/AMF
- NVIDIA NVENC (requires nvidia-docker)

## Redis Pooling

Redis pooling efficiently manages active streams.

### Benefits

- Reuses existing connections for the same stream
- Reduces load on IPTV providers
- Improves stream startup time
- Prevents duplicate streams

### Configuration

```bash
# Enable pooling
ENABLE_REDIS_POOLING=true

# Max connections per stream
REDIS_POOL_MAX_CONNECTIONS=50

# Stream timeout (seconds)
STREAM_TIMEOUT=300

# Cleanup interval (seconds)
CLEANUP_INTERVAL=60
```

## Monitoring

### Check Proxy Status

```bash
# Via artisan command
docker exec -it m3u-editor php artisan m3u-proxy:status

# Via API
curl -H "X-API-Token: your-token" http://localhost:38085/health
```

### View Statistics

```bash
# Get current stats
curl -H "X-API-Token: your-token" http://localhost:38085/stats
```

### Logs

```bash
# View real-time logs
docker logs m3u-proxy -f

# Last 100 lines
docker logs m3u-proxy --tail 100
```

## Troubleshooting

### Proxy Not Connecting

**Check token configuration:**
```bash
# Tokens must match
docker exec -it m3u-editor env | grep M3U_PROXY_TOKEN
docker exec -it m3u-proxy env | grep API_TOKEN
```

**Verify network connectivity:**
```bash
# Ping from m3u-editor
docker exec -it m3u-editor ping m3u-proxy

# Check proxy health
docker exec -it m3u-proxy curl http://localhost:38085/health?api_token=your-token
```

### Streams Not Playing

**Check proxy logs:**
```bash
docker logs m3u-proxy --tail 50
```

**Verify stream URL:**
```bash
# Test direct access
curl -H "X-API-Token: your-token" "http://localhost:38085/stream/channel-url-here"
```

**Check Redis connection:**
```bash
# Ping Redis
docker exec -it m3u-proxy redis-cli -h redis ping
```

### High CPU/Memory Usage

**Limit resources in docker-compose.yml:**
```yaml
m3u-proxy:
  deploy:
    resources:
      limits:
        cpus: '2.0'
        memory: 2G
      reservations:
        cpus: '0.5'
        memory: 512M
```

## Performance Tuning

### For High Concurrent Streams

```bash
# Increase max connections
REDIS_POOL_MAX_CONNECTIONS=100

# Adjust timeout
STREAM_TIMEOUT=600

# More frequent cleanup
CLEANUP_INTERVAL=30
```

### For Low-Resource Systems

```bash
# Reduce max connections
REDIS_POOL_MAX_CONNECTIONS=25

# Shorter timeout
STREAM_TIMEOUT=180

# Less frequent cleanup
CLEANUP_INTERVAL=120
```

## Migration Guide

### From Embedded to External

1. **Stop current deployment:**
   ```bash
   docker-compose down
   ```

2. **Update configuration:**
   ```bash
   # Edit .env
   M3U_PROXY_ENABLED=false
   M3U_PROXY_HOST=m3u-proxy
   ```

3. **Deploy with external proxy:**
   ```bash
   docker-compose -f docker-compose.proxy.yml up -d
   ```

4. **Verify migration:**
   ```bash
   docker exec -it m3u-editor php artisan m3u-proxy:status
   ```

## Next Steps

- [Docker Compose Deployments](/docs/deployment/docker-compose) - Other deployment options
- [Caddy vs Nginx](/docs/deployment/caddy-vs-nginx) - Reverse proxy options
- [EPG Cache Overview](/docs/advanced/epg-optimization) - Performance tuning
