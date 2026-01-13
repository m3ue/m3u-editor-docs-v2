---
sidebar_position: 6
description: Environment variable reference for M3U Editor
tags:
  - Advanced
  - Configuration
  - Environment
title: Environment Variables
---

# Environment Variables

M3U Editor uses environment variables for configuration. These are typically set in the `.env` file in the root directory of your installation.

## Application Settings

### APP_KEY
- **Default**: Empty (automatically generated during installation)
- **Description**: Application encryption key. Generated automatically during installation with `php artisan key:generate`
- **Important**: Never share this key publicly

### APP_DEBUG
- **Default**: `false`
- **Description**: Enable debug mode for development
- **Options**: `true`, `false`
- **Warning**: Never set to `true` in production environments

### APP_URL
- **Default**: `http://localhost`
- **Description**: The base URL where your application is accessible
- **Example**: `https://m3u.example.com`

### APP_PORT
- **Default**: `36400`
- **Description**: Port number for the application (Docker environments)

### XTREAM_PORT
- **Default**: `36401`
- **Description**: Port number for the Xtream API only endpoint (separate Nginx instance)
- **Note**: Only used when `XTREAM_ONLY_ENABLED=true`

### XTREAM_ONLY_ENABLED
- **Default**: `false`
- **Description**: Enable a separate Nginx instance that only serves the Xtream API endpoint
- **Options**: `true`, `false`
- **Use Case**: Provides isolated Xtream API access on a different port, proxying requests to the main application

### TZ
- **Default**: `UTC`
- **Description**: Default timezone for the application
- **Example**: `America/New_York`, `Europe/London`

## Database Configuration

### DB_CONNECTION
- **Default**: `sqlite`
- **Description**: Database driver to use
- **Options**: `sqlite`, `pgsql`, `mysql`

### SQLite (Default)
SQLite requires no additional configuration and stores data in a local file.

### PostgreSQL Configuration

Enable PostgreSQL by uncommenting and setting these variables:

```env
ENABLE_POSTGRES=true
DB_CONNECTION=pgsql
PG_DATABASE=your_database_name
PG_USER=your_username
PG_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=5433
```

#### PG_DATABASE
- **Description**: PostgreSQL database name

#### PG_USER
- **Description**: PostgreSQL username

#### PG_PASSWORD
- **Description**: PostgreSQL password

#### DB_HOST
- **Default**: `127.0.0.1`
- **Description**: PostgreSQL server host

#### DB_PORT
- **Default**: `5433`
- **Description**: PostgreSQL server port

## M3U Proxy Configuration

### M3U_PROXY_ENABLED
- **Default**: Commented out (uses embedded proxy)
- **Description**: Controls proxy mode
  - `true`: Use embedded proxy (runs in the same container)
  - `false` or `null`: Use external proxy service (separate container)
- **Note**: For most users, leaving this commented (default) is recommended

### M3U_PROXY_HOST
- **Default**: `127.0.0.1`
- **Description**: Host for embedded proxy
- **Note**: Only applies when `M3U_PROXY_ENABLED=true`

### M3U_PROXY_PORT
- **Default**: `8085`
- **Description**: Internal port for embedded proxy
- **Note**: Only applies when `M3U_PROXY_ENABLED=true`
### M3U_PROXY_TOKEN
- **Default**: Auto-generated
- **Description**: API authentication token for m3u-proxy service
- **Note**: Must match `API_TOKEN` on external proxy if using external m3u-proxy container

### M3U_PROXY_LOG_LEVEL
- **Default**: `null` (disabled)
- **Description**: Enable logging for m3u-proxy
- **Options**: `DEBUG`, `INFO`, `WARN`, `ERROR`
- **Note**: Logs written to `/var/www/html/storage/logs/m3u-proxy.log`

## Authentication & Access Control

### AUTO_LOGIN
- **Default**: `false`
- **Description**: Enable auto-login functionality for development/testing
- **Options**: `true`, `false`
- **Warning**: Only use in secure, private environments

### LOGIN_PATH
- **Default**: `login`
- **Description**: The path used to login to the application
- **Example**: Change to `admin` for URL `/admin`

### REDIRECT_GUEST_TO_LOGIN
- **Default**: `true`
- **Description**: Redirect unauthenticated users to the login page
- **Options**: `true`, `false`

## User & Group IDs (Docker)

### PUID
- **Default**: `1000`
- **Description**: User ID to run the application under
- **Note**: Not currently implemented, reserved for future use

### PGID
- **Default**: `1000`
- **Description**: Group ID to run the application under
- **Note**: Not currently implemented, reserved for future use

## WebSocket Configuration

### REVERB_PORT
- **Default**: `36800`
- **Description**: Port used for WebSocket server
- **Note**: No longer needs to be exposed externally (uses reverse proxy internally as of v0.8.0)

### REVERB_VERIFY
- **Default**: `true`
- **Description**: Enable SSL verification for WebSocket connections
- **Options**: `true`, `false`
- **Note**: Set to `false` to disable SSL verification

## Redis Configuration

### REDIS_HOST
- **Default**: `localhost`
- **Description**: Redis server hostname
- **Note**: Use container name for external Redis instance

### REDIS_SERVER_PORT
- **Default**: `36790`
- **Description**: Redis server port
- **Note**: Default uses embedded container instance

### REDIS_ENABLED
- **Default**: `true`
- **Description**: Enable/disable embedded Redis instance
- **Options**: `true`, `false`
- **Note**: Set to `false` when using external Redis server

## Playlist Configuration

### MAX_CHANNELS
- **Default**: `50000`
- **Description**: Maximum number of channels to import for M3U playlists
- **Note**: Does not apply to Xtream API playlists (no limit)

### DISABLE_SYNC_LOGS
- **Default**: `false`
- **Description**: Disable creation of sync logs for playlists
- **Options**: `true`, `false`
- **Use Case**: Can improve performance with large playlists using SQLite database

### INVALIDATE_IMPORT
- **Default**: `false`
- **Description**: Enable automatic invalidation of playlist sync based on threshold
- **Options**: `true`, `false`
- **See Also**: `INVALIDATE_IMPORT_THRESHOLD`

### INVALIDATE_IMPORT_THRESHOLD
- **Default**: `100`
- **Description**: If current sync will have fewer channels than current count minus this value, sync will be canceled
- **Note**: Only applies when `INVALIDATE_IMPORT=true`
- **Example**: If you have 1000 channels and threshold is 100, sync will fail if new import has less than 900 channels

### DISABLE_M3U_XTREAM_FORMAT
- **Default**: `false`
- **Description**: By default, all URLs use Xtream API format for stream analysis and limit checking
- **Options**: `true`, `false`
- **Note**: Set to `true` to return provider URL (or proxied URL) instead for M3U playlists

## Proxy URL Override

### PROXY_URL_OVERRIDE
- **Default**: `null`
- **Description**: Override URL for proxied streams
- **Format**: Fully qualified domain name including `http://` or `https://`
- **Note**: If null or not set, will use `APP_URL`
- **Use Case**: Use when proxy service is accessed via different domain than main application

## HLS Storage Configuration

### HLS_TEMP_DIR
- **Default**: `/tmp/hls`
- **Description**: Directory for storing HLS segments
- **Note**: Ensure sufficient disk space for concurrent streams

### HLS_GC_ENABLED
- **Default**: `true`
- **Description**: Enable garbage collection for old HLS segments
- **Options**: `true`, `false`
- **Note**: Recommended to keep enabled to prevent disk space issues

### HLS_GC_INTERVAL
- **Default**: `60`
- **Description**: How often to run garbage collection (in seconds)
- **Range**: Any positive integer

### HLS_GC_AGE_THRESHOLD
- **Default**: `300`
- **Description**: Delete HLS segments older than this value (in seconds)
- **Recommendation**: Adjust based on your stream buffering needs

## Web Server Configuration

### NGINX_ENABLED
- **Default**: `true`
- **Description**: Enable/disable embedded Nginx web server
- **Options**: `true`, `false`
- **Note**: Set to `false` when using external web server (e.g., Apache, Caddy)

### FPMPORT
- **Default**: `9000`
- **Description**: PHP-FPM port for external web server integration
- **Use Case**: Required when `NGINX_ENABLED=false` and using external web server

## Xtream & STRM Configuration

### XTREAM_SERIES_FOLDER
- **Default**: `Series`
- **Description**: Folder name for series content in STRM file generation
- **Note**: Customize to match your media server organization

### XTREAM_MOVIE_FOLDER
- **Default**: `Movies`
- **Description**: Folder name for movie content in STRM file generation
- **Note**: Customize to match your media server organization

### XTREAM_STRM_FOLDER
- **Default**: `strm`
- **Description**: Output folder for generated STRM files
- **Note**: Files are created relative to data directory

## Logo & Cache Configuration

### LOGO_CACHE_EXPIRY_DAYS
- **Default**: `30`
- **Description**: Number of days to cache channel logos before refreshing
- **Recommendation**: Higher values reduce bandwidth, lower values ensure logos stay current

## Debug Configuration

### SHARED_STREAMING_DEBUG
- **Default**: `false`
- **Description**: Enable debug logging for shared streaming/pooling features
- **Options**: `true`, `false`
- **Use Case**: Troubleshooting stream sharing and connection pooling issues

## Docker Compose Usage

Environment variables can be set in your `docker-compose.yml` file:

```yaml
services:
  m3u-editor:
    image: sparkison/m3u-editor:latest
    container_name: m3u-editor
    environment:
      - APP_URL=https://m3u.example.com
      - APP_PORT=36400
      - TZ=America/New_York
      - ENABLE_POSTGRES=true
      - PG_DATABASE=m3ue
      - PG_USER=m3ue
      - PG_PASSWORD=secure_password
      - M3U_PROXY_ENABLED=true
    volumes:
      - ./data:/config
    ports:
      - "36400:36400"
    restart: unless-stopped
```

Or via CLI:

```bash
docker run -d \
  --name m3u-editor \
  -e APP_URL=https://m3u.example.com \
  -e APP_PORT=36400 \
  -e TZ=America/New_York \
  -p 36400:36400 \
  -v ./data:/config \
  sparkison/m3u-editor:latest
```

## Best Practices

1. **Never commit `.env` files** to version control
2. **Use `.env.example`** as a template for new installations
3. **Regenerate APP_KEY** for each installation
4. **Keep sensitive values secure** (passwords, API keys, tokens)
5. **Use strong passwords** for database connections
6. **Set APP_DEBUG=false** in production
7. **Use environment-specific values** for different deployments
8. **Configure timezone** to match your location for accurate logging
9. **Enable PostgreSQL** for better performance with large playlists
10. **Monitor HLS storage** if using proxy features extensively

## Updating Environment Variables

After modifying environment variables in `.env` file:

```bash
# Clear configuration cache
php artisan config:clear

# Clear application cache
php artisan cache:clear

# Restart queue workers if running
php artisan queue:restart
```

For Docker installations, restart the container:

```bash
docker-compose restart
```

Or for specific containers:

```bash
docker restart m3u-editor
```

## Troubleshooting

### Changes Not Taking Effect

If environment variable changes aren't being applied:
1. Clear configuration cache: `php artisan config:clear`
2. Restart the application/container
3. Verify `.env` file syntax (no quotes around values usually)
4. Check for typos in variable names

### Database Connection Issues

If you're having database problems:
1. Verify `DB_CONNECTION` matches your database type
2. Check `DB_HOST`, `DB_PORT`, `DB_DATABASE` are correct
3. Ensure `ENABLE_POSTGRES=true` if using embedded PostgreSQL
4. Test database credentials independently

### WebSocket/Real-time Updates Not Working

If notifications aren't appearing:
1. Check `REVERB_PORT` is accessible
2. Verify `REVERB_VERIFY` matches your SSL setup
3. Check browser console for WebSocket errors
4. Ensure ports are properly mapped in Docker

### Proxy Not Working

If stream proxying isn't functioning:
1. Verify `M3U_PROXY_ENABLED` is set correctly
2. Check `M3U_PROXY_HOST` and `M3U_PROXY_PORT` are correct
3. Ensure `M3U_PROXY_TOKEN` matches between services
4. Review proxy logs with `M3U_PROXY_LOG_LEVEL=DEBUG`