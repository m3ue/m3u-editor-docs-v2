---
sidebar_position: 8
title: Event System & Webhooks
description: Real-time webhook notifications for stream lifecycle events
tags:
  - Proxy
  - Webhooks
  - Monitoring
  - Events
---

# Event System & Webhooks

The proxy fires events for key points in a stream's lifecycle. You can register webhook URLs to receive HTTP POST notifications for any combination of these events: useful for monitoring, alerting, analytics, and dashboard updates.

The event system runs asynchronously and never blocks stream operations, even if a webhook endpoint is slow or unavailable.

## Event Types

| Event | When it fires |
|-------|--------------|
| `STREAM_STARTED` | A new stream is created |
| `STREAM_STOPPED` | A stream is cleaned up / deleted |
| `STREAM_FAILED` | A stream fails to start or encounters a fatal error |
| `CLIENT_CONNECTED` | A media player connects to a stream |
| `CLIENT_DISCONNECTED` | A media player disconnects |
| `FAILOVER_TRIGGERED` | The proxy switches to a backup URL |

## Registering a Webhook

```bash
curl -X POST "http://localhost:8085/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://your-server.com/webhook",
    "events": ["stream_started", "client_connected", "failover_triggered"],
    "timeout": 10,
    "retry_attempts": 3
  }'
```

You can subscribe to any combination of events. Omit `events` to receive all event types.

## Managing Webhooks

```bash
# List all registered webhooks
curl "http://localhost:8085/webhooks" \
  -H "X-API-Token: your-token"

# Remove a webhook
curl -X DELETE "http://localhost:8085/webhooks?webhook_url=https://your-server.com/webhook" \
  -H "X-API-Token: your-token"

# Test a webhook (sends a test payload)
curl -X POST "http://localhost:8085/webhooks/test?webhook_url=https://your-server.com/webhook" \
  -H "X-API-Token: your-token"
```

## Webhook Payload Format

All events share the same envelope structure:

```json
{
  "event_id": "uuid-string",
  "event_type": "stream_started",
  "stream_id": "abc123def456",
  "timestamp": "2025-09-25T22:38:34.392830",
  "data": { ... }
}
```

### stream_started

```json
{
  "event_type": "stream_started",
  "stream_id": "abc123",
  "data": {
    "primary_url": "http://example.com/stream.m3u8",
    "failover_urls": ["http://backup.com/stream.m3u8"],
    "user_agent": "CustomApp/1.0",
    "stream_type": "hls"
  }
}
```

### client_connected

```json
{
  "event_type": "client_connected",
  "stream_id": "abc123",
  "data": {
    "client_id": "client_456",
    "user_agent": "VLC media player",
    "ip_address": "192.168.1.100"
  }
}
```

### client_disconnected

```json
{
  "event_type": "client_disconnected",
  "stream_id": "abc123",
  "data": {
    "client_id": "client_456",
    "bytes_served": 1048576,
    "segments_served": 42
  }
}
```

### failover_triggered

```json
{
  "event_type": "failover_triggered",
  "stream_id": "abc123",
  "data": {
    "old_url": "http://primary.com/stream.m3u8",
    "new_url": "http://backup.com/stream.m3u8",
    "failover_index": 1
  }
}
```

## Common Use Cases

### Health monitoring

Receive alerts only when things go wrong:

```bash
curl -X POST "http://localhost:8085/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://monitor.yoursite.com/iptv-alerts",
    "events": ["stream_failed", "failover_triggered"],
    "timeout": 5,
    "retry_attempts": 2
  }'
```

### Analytics

Track full stream lifecycle:

```bash
curl -X POST "http://localhost:8085/webhooks" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://analytics.yoursite.com/iptv-events",
    "events": [
      "stream_started",
      "stream_stopped",
      "client_connected",
      "client_disconnected"
    ]
  }'
```

## Server-Side Handler Examples

### Node.js / Express

```javascript
app.post('/iptv-webhook', (req, res) => {
  const { event_type, stream_id, data } = req.body;

  switch (event_type) {
    case 'stream_started':
      console.log(`New stream: ${data.primary_url}`);
      break;
    case 'failover_triggered':
      console.log(`Failover on ${stream_id}: ${data.old_url} → ${data.new_url}`);
      sendAdminAlert(stream_id);
      break;
    case 'client_connected':
      console.log(`Client ${data.client_id} connected from ${data.ip_address}`);
      break;
  }

  res.json({ received: true });
});
```

### Python / Flask

```python
@app.route('/iptv-webhook', methods=['POST'])
def handle_webhook():
    event = request.json
    event_type = event['event_type']
    stream_id = event['stream_id']
    data = event['data']

    if event_type == 'stream_failed':
        send_alert(f"Stream {stream_id} failed!")
    elif event_type == 'client_disconnected':
        log_session(data['client_id'], data['bytes_served'])

    return jsonify({"status": "received"})
```

## Built-in Logging

Even without external webhooks, the proxy logs all events at `INFO` level:

```
INFO: Event: stream_started for stream abc123def456 at 2025-09-25 22:38:34
INFO: Event: client_connected for stream abc123def456 at 2025-09-25 22:38:35
```

## Security Considerations

- **Use HTTPS** for all webhook endpoints in production
- **Validate payloads** on your server: verify the `event_type` is one you expect
- **Set reasonable timeouts**: the default is 10 seconds; lower is better for high-traffic setups
- **Monitor webhook failures**: failed deliveries are logged but not retried indefinitely
- **Add auth** to your webhook handler if needed (e.g. check a secret header)
