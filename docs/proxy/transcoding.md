---
sidebar_position: 12
title: Transcoding & Profiles
description: FFmpeg transcoding with configurable profiles and dynamic variable substitution
tags:
  - Proxy
  - Transcoding
  - FFmpeg
  - Profiles
---

# Transcoding & Profiles

The proxy can optionally transcode streams using FFmpeg before delivering them to clients. Transcoding is applied via named **profiles** — pre-built FFmpeg argument templates with configurable variables you can override at request time.

:::info
Transcoding requires FFmpeg to be available in the container and is more resource-intensive than pass-through streaming. For live TV without re-encoding, pass-through is recommended. See [Hardware Acceleration](./hardware-acceleration.md) to GPU-accelerate transcoding.
:::

## Creating a Transcoded Stream

```bash
curl -X POST "http://localhost:8085/transcode" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://source.example.com/stream.m3u8",
    "profile": "hq",
    "profile_variables": {
      "video_bitrate": "3500k",
      "audio_bitrate": "192k",
      "crf": "20"
    }
  }'
```

## Built-in Profiles

| Profile | Description | Key variables |
|---------|-------------|--------------|
| `default` | Standard H.264 with bitrate control | `video_bitrate`, `audio_bitrate`, `format` |
| `hq` | High quality with CRF and maxrate | `crf`, `maxrate`, `bufsize`, `audio_bitrate` |
| `lowlatency` | Low latency with zero-latency tuning | `video_bitrate`, `audio_bitrate` |
| `720p` | Downscale to 1280×720 | `video_bitrate`, `audio_bitrate` |
| `1080p` | Downscale/upscale to 1920×1080 | `video_bitrate`, `audio_bitrate` |
| `hevc` | H.265/HEVC encoding | `video_bitrate`, `audio_bitrate` |
| `audio` | Audio-only output | `audio_bitrate`, `format` |

Profiles automatically use hardware acceleration when available (NVENC for NVIDIA, VAAPI for Intel/AMD) and fall back to software encoders (`libx264`, `libx265`) otherwise.

## Profile Variables

Profile templates use `{variable}` and `{variable|default}` placeholders. You override any variable in `profile_variables` at request time.

### Built-in default variables

| Variable | Default | Description |
|----------|---------|-------------|
| `input_url` | (auto-set) | Source stream URL |
| `output_args` | `pipe:1` | Output destination |
| `video_bitrate` | `2M` | Target video bitrate |
| `audio_bitrate` | `128k` | Target audio bitrate |
| `format` | `mp4` | Output container format |
| `crf` | `23` | Constant Rate Factor (quality) |

### Examples

**Lower bitrate for mobile:**
```json
{
  "profile": "default",
  "profile_variables": {
    "video_bitrate": "800k",
    "audio_bitrate": "64k"
  }
}
```

**High quality archival:**
```json
{
  "profile": "hq",
  "profile_variables": {
    "crf": "18",
    "maxrate": "5000k",
    "bufsize": "10000k",
    "audio_bitrate": "256k"
  }
}
```

**720p downscale:**
```json
{
  "profile": "720p",
  "profile_variables": {
    "video_bitrate": "3000k",
    "audio_bitrate": "192k"
  }
}
```

## Custom Profile Templates

You can pass a raw FFmpeg argument string as the `profile` value. Custom profiles must start with `-`:

```json
{
  "url": "http://example.com/stream.m3u8",
  "profile": "-i {input_url} -c:v libx264 -preset {preset|faster} -crf {crf|23} -maxrate {maxrate|2500k} -bufsize {bufsize|5000k} -c:a aac -b:a {audio_bitrate|192k} -f mpegts {output_args}",
  "profile_variables": {
    "preset": "medium",
    "crf": "20",
    "maxrate": "4000k"
  }
}
```

:::caution
Custom templates are validated before use. Dangerous command patterns (shell operators, `wget`, `curl`, `rm`, etc.) are rejected.
:::

## Profile Variable Rules

- **Keys**: strings only
- **Values**: strings only
- Pass invalid types and the request is rejected with a `422` error
- `{input_url}` must be present in any custom template
- Braces must be balanced

## Quality Presets Quick Reference

```json
// Low quality (mobile / slow connection)
{ "video_bitrate": "800k", "audio_bitrate": "64k" }

// Medium quality (default)
{ "video_bitrate": "2500k", "audio_bitrate": "128k" }

// High quality
{ "crf": "18", "video_bitrate": "5000k", "audio_bitrate": "256k" }
```

## Bitrate Suffix Reference

| Suffix | Meaning |
|--------|---------|
| `k` | kilobits/s (e.g. `2500k`) |
| `M` | megabits/s (e.g. `2M`) |
| _(none)_ | bits/s |

## Combining with Redis Pooling

When [Redis pooling](./redis-pooling.md) is enabled, clients requesting the same URL + profile combination share one FFmpeg process. The `STREAM_SHARING_STRATEGY` variable controls how the sharing key is computed:

- `url_profile` — same URL **and** same profile → shared (default)
- `url_only` — same URL regardless of profile → shared
- `disabled` — always individual processes

## Troubleshooting

**"Variables not being substituted"**
- Check the variable name spelling exactly matches the placeholder in the template
- Ensure the variable is in the `profile_variables` object

**FFmpeg fails with invalid arguments**
- Check the variable value is valid for the given FFmpeg flag
- Verify bitrate strings include the correct suffix (`k` or `M`)

**"profile_variables must be a dictionary"**
- You're passing an array or string instead of an object — wrap it in `{}`

**Poor quality output**
- Lower the `crf` value (lower = better quality, more bits)
- Increase `video_bitrate` and `audio_bitrate`
- Check hardware acceleration is being used (see [Hardware Acceleration](./hardware-acceleration.md))
