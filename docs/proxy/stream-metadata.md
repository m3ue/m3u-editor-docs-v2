---
sidebar_position: 9
title: Stream Metadata
description: Attach custom key/value data to streams for identification and filtering
tags:
  - Proxy
  - Metadata
  - API
---

# Stream Metadata

You can attach arbitrary key/value pairs to any stream when it is created. Metadata is preserved and returned in all stream queries, making it easy to identify, organize, and filter streams using your own identifiers.

## Use Cases

**Channel identification** — associate your local channel IDs with proxy streams:
```json
{
  "metadata": {
    "local_id": "channel_123",
    "channel_name": "HBO HD",
    "channel_number": "201"
  }
}
```

**Content classification** — tag streams with categories:
```json
{
  "metadata": {
    "category": "sports",
    "league": "premier_league",
    "quality": "1080p",
    "language": "en"
  }
}
```

**Provider tracking** — record which source provided a stream:
```json
{
  "metadata": {
    "provider": "provider_a",
    "provider_stream_id": "ext_12345"
  }
}
```

## Creating a Stream with Metadata

```bash
curl -X POST "http://localhost:8085/streams" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://example.com/hbo.m3u8",
    "metadata": {
      "local_id": "hbo_hd",
      "channel_name": "HBO HD",
      "channel_number": "201",
      "category": "movies",
      "quality": "1080p"
    }
  }'
```

Metadata is returned in the response and in all subsequent stream queries.

## Filtering Streams by Metadata

### Server-side filtering (recommended)

Use the dedicated endpoint for efficient server-side filtering:

```bash
# Find a stream by your local ID
curl "http://localhost:8085/streams/by-metadata?field=local_id&value=hbo_hd" \
  -H "X-API-Token: your-token"

# Get all active sports streams
curl "http://localhost:8085/streams/by-metadata?field=category&value=sports&active_only=true" \
  -H "X-API-Token: your-token"

# Include inactive streams
curl "http://localhost:8085/streams/by-metadata?field=provider&value=provider_a&active_only=false" \
  -H "X-API-Token: your-token"
```

**Query parameters:**
- `field` (required) — metadata key to filter on
- `value` (required) — value to match
- `active_only` (optional, default `true`) — only return streams with active clients

**Response:**
```json
{
  "filter": { "field": "category", "value": "sports" },
  "active_only": true,
  "matching_streams": [
    {
      "stream_id": "a1b2c3...",
      "client_count": 2,
      "metadata": { "local_id": "espn_hd", "category": "sports" },
      "last_access": "2025-10-05T14:35:00.000000",
      "is_active": true,
      "url": "https://example.com/espn.m3u8",
      "stream_type": "HLS"
    }
  ],
  "total_matching": 1,
  "total_clients": 2
}
```

### Client-side filtering with `jq`

```bash
# Find by local_id
curl -s "http://localhost:8085/streams" -H "X-API-Token: your-token" | \
  jq '.streams[] | select(.metadata.local_id == "hbo_hd")'

# Count clients on all sports streams
curl -s "http://localhost:8085/streams/by-metadata?field=category&value=sports" \
  -H "X-API-Token: your-token" | jq '.total_clients'
```

## Metadata Rules

- **Keys**: strings only
- **Values**: strings, integers, floats, or booleans (all stored as strings)
- **Nesting**: flat key/value pairs only — arrays and nested objects are not supported
- **Size**: keep under 1 KB per stream
- **Persistence**: stored in memory; lost on proxy restart (same as all stream data)

```json
// Valid
{ "count": 42, "active": true, "quality": "1080p", "rating": 4.5 }

// Invalid — arrays and nested objects are rejected
{ "tags": ["sports", "hd"], "info": { "nested": "not allowed" } }
```

## Python Example

```python
import requests

class IPTVProxy:
    def __init__(self, base_url, token):
        self.base = base_url
        self.headers = {"X-API-Token": token, "Content-Type": "application/json"}

    def add_channel(self, local_id, name, url, number=None):
        meta = {"local_id": local_id, "channel_name": name}
        if number:
            meta["channel_number"] = str(number)

        resp = requests.post(f"{self.base}/streams",
                             headers=self.headers,
                             json={"url": url, "metadata": meta})
        resp.raise_for_status()
        return resp.json()["stream_endpoint"]

    def get_by_local_id(self, local_id):
        resp = requests.get(f"{self.base}/streams/by-metadata",
                            headers=self.headers,
                            params={"field": "local_id", "value": local_id,
                                    "active_only": False})
        data = resp.json()
        streams = data.get("matching_streams", [])
        return streams[0] if streams else None

proxy = IPTVProxy("http://localhost:8085", "your-token")
endpoint = proxy.add_channel("ch_hbo", "HBO HD", "https://provider.com/hbo.m3u8", 201)
info = proxy.get_by_local_id("ch_hbo")
print(f"HBO has {info['client_count']} viewers")
```

## Best Practices

1. **Use server-side filtering** — the `/streams/by-metadata` endpoint is more efficient than fetching all streams
2. **Define a consistent schema** — agree on standard key names across your application (`local_id`, `category`, etc.)
3. **Always include a unique identifier** — a `local_id` field lets you look up streams without storing proxy stream IDs
4. **Use `active_only=true`** when you only need streams with connected clients
5. **Keep it flat and small** — metadata is not indexed; avoid large blobs
