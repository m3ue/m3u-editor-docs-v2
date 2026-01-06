---
sidebar_position: 5
description: EPG caching and performance optimization
tags:
  - Advanced
  - EPG
  - Performance
title: EPG Optimization
---

# EPG Optimization

M3U Editor includes comprehensive EPG caching for dramatically improved performance with large EPG files.

## Overview

The EPG optimization system provides:

- ✅ **Instant data retrieval** instead of slow XML parsing
- ✅ **Date-chunked storage** for efficient access
- ✅ **Memory-efficient pagination** support
- ✅ **Automatic cache validation** based on file modification times

## How It Works

### EPG Cache Service

The `EpgCacheService` provides high-performance caching:

**Features:**
- JSON-based cache files for fast access
- Programmes organized by date for efficient queries
- Automatic validation against source EPG changes
- Support for large EPG files (100,000+ programmes)

### Automatic Cache Generation

Caches are automatically generated:
- After EPG import completes
- When EPG is refreshed
- On EPG file modification detection

**Manual generation:**
```bash
php artisan epg:cache-generate {uuid}
```

## API Endpoints

### Get EPG Data for Specific EPG

**Endpoint:** `GET /api/epg/{uuid}/data`

**Parameters:**
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 50)
- `start_date` - Filter start date (YYYY-MM-DD)
- `end_date` - Filter end date (YYYY-MM-DD)

**Example:**
```javascript
fetch('/api/epg/9f21e8bd-921c-452f-bec7-14fc0144c51b/data?page=1&per_page=50&start_date=2025-07-23')
  .then(response => response.json())
  .then(data => {
    console.log('Channels:', data.channels);
    console.log('Programmes:', data.programmes);
    console.log('Pagination:', data.pagination);
  });
```

### Get EPG Data for Playlist Channels

**Endpoint:** `GET /api/epg/playlist/{uuid}/data`

Returns EPG data for all enabled channels in a playlist.

**Parameters:**
- Same as above

**Example:**
```javascript
fetch('/api/epg/playlist/playlist-uuid-here/data?page=1&per_page=50&start_date=2025-07-23')
  .then(response => response.json())
  .then(data => {
    console.log('Playlist:', data.playlist);
    console.log('Channels:', data.channels);
    console.log('Programmes:', data.programmes);
    console.log('Cache Info:', data.cache_info);
  });
```

## Response Format

```json
{
  "epg": {
    "id": 1,
    "name": "EPG Name",
    "uuid": "uuid-here"
  },
  "date_range": {
    "start": "2025-07-23",
    "end": "2025-07-23"
  },
  "pagination": {
    "current_page": 1,
    "per_page": 50,
    "total_channels": 23588,
    "returned_channels": 50,
    "has_more": true
  },
  "channels": [
    {
      "id": "channel-id",
      "display_name": "Channel Name",
      "icon": "https://example.com/logo.png"
    }
  ],
  "programmes": {
    "channel-id": [
      {
        "start": "20250723120000 +0000",
        "stop": "20250723130000 +0000",
        "title": "Programme Title",
        "desc": "Programme description",
        "category": "Entertainment"
      }
    ]
  },
  "cache_info": {
    "cached": true,
    "source": "cache"
  }
}
```

## Performance Benefits

### Before Optimization

**Large EPG files (100,000+ programmes):**
- Initial load: 30+ seconds
- XML parsing on every request
- High memory usage
- Timeouts on very large files

### After Optimization

**With caching:**
- Initial load: < 1 second
- No XML parsing needed
- Minimal memory usage
- Handles any EPG size

## Cache Management

### Cache Location

Caches are stored in:
```
storage/app/epg-cache/{uuid}/
├── channels.json
└── programmes/
    ├── 2025-07-23.json
    ├── 2025-07-24.json
    └── ...
```

### Cache Validation

Caches automatically invalidate when:
- Source EPG file is modified
- EPG is re-imported
- Manual cache clear requested

### Manual Cache Management

**Generate cache:**
```bash
php artisan epg:cache-generate {uuid}
```

**Clear cache:**
```bash
php artisan epg:cache-clear {uuid}
```

**Clear all caches:**
```bash
php artisan epg:cache-clear --all
```

## Integration

### EPG Generate Controller

The EPG generation controller automatically uses cached data:

```php
// Automatically uses cache when available
$xml = app(EpgGenerateController::class)->generate($playlist);
```

**Benefits:**
- Dramatically faster EPG XML generation
- Reduced server load
- Better user experience

### API Controllers

Both EPG API endpoints leverage the cache service:

- `EpgApiController::getData()` - Single EPG data
- `EpgApiController::getDataForPlaylist()` - Playlist EPG data

**Fallback behavior:**
If cache is unavailable, falls back to XML parsing automatically.

## Pagination Support

Efficient pagination for large EPG files:

**Example pagination:**
```javascript
// Load first 50 channels
let page = 1;
const perPage = 50;

async function loadEPG() {
  const response = await fetch(
    `/api/epg/playlist/${playlistUuid}/data?page=${page}&per_page=${perPage}&start_date=2025-07-23`
  );
  const data = await response.json();
  
  // Process channels and programmes
  displayEPG(data.channels, data.programmes);
  
  // Check if more pages available
  if (data.pagination.has_more) {
    page++;
    // Load more as needed
  }
}
```

## Troubleshooting

### Cache Not Generating

**Check:**
- ✅ EPG import completed successfully
- ✅ Storage directory is writable
- ✅ Sufficient disk space

**Solution:**
```bash
# Manually generate cache
php artisan epg:cache-generate {uuid}

# Check logs for errors
tail -f storage/logs/laravel.log
```

### Slow EPG Loading

**If EPG is still slow:**
1. Verify cache exists:
   ```bash
   ls storage/app/epg-cache/{uuid}/
   ```

2. Check cache is being used:
   - Look for `"cached": true` in API response

3. Regenerate cache:
   ```bash
   php artisan epg:cache-clear {uuid}
   php artisan epg:cache-generate {uuid}
   ```

### Cache Out of Date

**If EPG data seems old:**
- Cache automatically updates on EPG refresh
- Manually refresh EPG from the UI
- Or force regenerate:
  ```bash
  php artisan epg:cache-generate {uuid} --force
  ```

## Best Practices

### For Large EPG Files

**✅ Recommended:**
- Enable automatic caching (default)
- Use pagination in API calls
- Limit date ranges when possible
- Filter to only needed channels

### For API Integration

**✅ Recommended:**
- Use `per_page` parameter to limit results
- Implement progressive loading
- Cache API responses client-side
- Use date ranges to reduce data

### For Playlist Output

**✅ Recommended:**
- Cache handles generation automatically
- Use time-limited outputs (7-14 days)
- Filter to only mapped channels
- Regenerate periodically

## Next Steps

- [EPG Setup](/docs/resources/epg-setup) - Initial EPG configuration
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel management
- [M3U Proxy Integration](/docs/deployment/m3u-proxy-integration) - External proxy setup
