---
sidebar_position: 6
description: Set up Electronic Program Guide (EPG) data
tags:
  - Getting Started
  - EPG
  - XMLTV
title: EPGs
---

# EPGs

Electronic Program Guide (EPG) data provides TV listings for your channels. M3U Editor supports multiple EPG sources.

## Supported EPG Sources

- **XMLTV Files** - Local or remote XML files
- **XMLTV URLs** - Direct links to EPG data
- **Schedules Direct** - Full integration with SD service

## Adding EPG Data

### Via XMLTV URL

1. Navigate to **EPG** in the sidebar
2. Click **Add EPG Source**
3. Select **XMLTV URL**
4. Enter the EPG URL
5. (Optional) Set refresh interval
6. Click **Save & Import**

### Via File Upload

1. Navigate to **EPG** in the sidebar
2. Click **Add EPG Source**
3. Select **Upload File**
4. Choose your XMLTV file
5. Click **Save & Import**

### Via Schedules Direct

1. Navigate to **EPG** in the sidebar
2. Click **Add EPG Source**
3. Select **Schedules Direct**
4. Enter your SD credentials
5. Select lineups and channels
6. Click **Save & Import**

## Mapping EPG to Channels

After importing EPG data, you need to map it to your channels:

### Automatic Mapping

M3U Editor tries to automatically match channels based on:
- Channel ID
- Channel name
- TVG ID

### Manual Mapping

For channels that didn't auto-map:

1. Go to your playlist's **Channels**
2. Click on a channel
3. Scroll to **EPG Mapping**
4. Search for the correct EPG channel
5. Click **Map**

## EPG Preview

View the program guide:

1. Navigate to **EPG Preview**
2. Select your playlist
3. Browse the TV guide
4. Click on any program to see details
5. (Optional) Click play to test the stream

## EPG Optimization

For large EPG files, M3U Editor includes caching:

- **Automatic Caching** - Generated after EPG import
- **Date-Chunked Storage** - Efficient data retrieval
- **Fast API Access** - Instant program guide loading

The cache is automatically updated when EPG data is refreshed.

## EPG Output

M3U Editor can generate EPG for your output playlists:

1. Go to your playlist settings
2. Enable **Include EPG in Output**
3. Choose EPG format:
   - Full XMLTV (all programs)
   - Filtered (only mapped channels)
   - Time-limited (e.g., 7 days)

## Troubleshooting

### EPG Not Showing

1. Verify EPG import completed successfully
2. Check channel mappings
3. Ensure time zones are correct
4. Refresh EPG cache

### Slow EPG Loading

For very large EPG files:
1. Enable EPG caching (automatic)
2. Use time-limited outputs
3. Filter to only needed channels

## Next Steps

- [EPG Optimization](/docs/advanced/epg-optimization) - Performance tuning for large EPG files
- [Auto-Merge Channels](/docs/advanced/auto-merge-channels) - Automatic channel management
- [Docker Compose Deployments](/docs/deployment/docker-compose) - Deploy to production
