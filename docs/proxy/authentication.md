---
sidebar_position: 3
title: Authentication
description: Securing the M3U Proxy management API with token-based authentication
tags:
  - Proxy
  - Authentication
  - Security
---

# Authentication

The proxy supports optional API token authentication. When enabled, all management and monitoring endpoints require a valid token. Streaming endpoints are always public: your media player never needs a token.

## Enabling Authentication

Set the `API_TOKEN` environment variable:

```bash
# .env or docker-compose environment
API_TOKEN=your_secret_token_here
```

Generate a strong token:

```bash
openssl rand -hex 32
```

To disable authentication, leave `API_TOKEN` unset or empty.

## Protected vs Unprotected Endpoints

### Requires token

| Category | Endpoints |
|----------|-----------|
| Stream management | `POST /streams`, `GET /streams`, `GET /streams/{id}`, `DELETE /streams/{id}`, `POST /streams/{id}/failover`, `GET /streams/by-metadata` |
| Statistics | `GET /stats`, `GET /stats/detailed`, `GET /stats/performance`, `GET /stats/streams`, `GET /stats/clients` |
| Health & monitoring | `GET /health`, `GET /clients`, `GET /clients/{id}` |
| Webhooks | `POST /webhooks`, `GET /webhooks`, `DELETE /webhooks`, `POST /webhooks/test` |
| Client management | `DELETE /hls/{id}/clients/{client_id}` |

### Always public (no token required)

These endpoints are used by media players and must remain accessible without a token:

| Endpoint | Description |
|----------|-------------|
| `GET /stream/{stream_id}` | Direct stream content |
| `GET /hls/{stream_id}/playlist.m3u8` | HLS playlist |
| `GET /hls/{stream_id}/segment` | HLS segment |
| `GET /hls/{stream_id}/segment.ts` | HLS segment (alternative) |

The `stream_id` itself acts as a security token for streaming: only callers who know it can access the stream.

## Providing the Token

### Method 1: HTTP Header (recommended)

```bash
curl -H "X-API-Token: your_token" http://localhost:8085/stats
```

Use this method for all API-to-API communication and automated scripts. The token does not appear in server logs.

### Method 2: Query Parameter

```bash
curl "http://localhost:8085/stats?api_token=your_token"
```

Convenient for browser access and quick manual testing, but the token will appear in URL access logs and browser history. Avoid in production.

## Usage Examples

### cURL

```bash
export API_TOKEN="my_secret_token"

# Create a stream
curl -X POST "http://localhost:8085/streams" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: ${API_TOKEN}" \
  -d '{"url": "https://example.com/stream.m3u8"}'

# Get statistics
curl "http://localhost:8085/stats" \
  -H "X-API-Token: ${API_TOKEN}"

# List all streams
curl "http://localhost:8085/streams" \
  -H "X-API-Token: ${API_TOKEN}"

# Delete a stream
curl -X DELETE "http://localhost:8085/streams/abc123" \
  -H "X-API-Token: ${API_TOKEN}"
```

### Browser

```
http://localhost:8085/health?api_token=my_secret_token
http://localhost:8085/stats?api_token=my_secret_token
```

## Error Responses

**401 Unauthorized**: token missing:
```json
{
  "detail": "API token required. Provide token via X-API-Token header."
}
```

**403 Forbidden**: token invalid:
```json
{
  "detail": "Invalid API token"
}
```

## Docker Configuration

```yaml
services:
  m3u-proxy:
    image: sparkison/m3u-proxy:latest
    environment:
      - API_TOKEN=your_secret_token_here
    ports:
      - "8085:8085"
```

## Security Best Practices

1. **Use a strong token**: generate with `openssl rand -hex 32`
2. **Use HTTPS**: always put the proxy behind a TLS-terminating reverse proxy in production
3. **Prefer the header** over query parameters to keep the token out of logs
4. **Rotate tokens** periodically
5. **Store secrets securely**: use Docker secrets or an environment secrets manager; never hard-code tokens in source

## Troubleshooting

**"API token required" error**
- Confirm the `X-API-Token` header is present and spelled correctly
- Verify the token value is not empty

**"Invalid API token" error**
- Check the token matches `API_TOKEN` exactly (no extra spaces or newlines)
- Restart the proxy after changing the environment variable

**Stream playback requires a token**
- Streaming endpoints (`/hls/*` and `/stream/*`) should never require auth
- If they do, check your reverse proxy configuration: it may be stripping or adding headers
