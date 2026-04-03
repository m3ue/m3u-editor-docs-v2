---
sidebar_position: 12
title: Transcoding & Stream Profiles
description: FFmpeg transcoding via Stream Profiles: configure in the Editor UI or directly via API
tags:
  - Proxy
  - Transcoding
  - FFmpeg
  - Profiles
---

# Transcoding & Stream Profiles

The proxy can transcode streams using FFmpeg before delivering them to clients. Transcoding is configured through **Stream Profiles**: reusable FFmpeg argument templates with variable placeholders you can customise per use case.

:::info
Transcoding requires FFmpeg and is more resource-intensive than pass-through streaming. For live TV without re-encoding, pass-through is recommended. See [Hardware Acceleration](./hardware-acceleration.md) to GPU-accelerate encoding.
:::

There are two ways to use transcoding:

1. **Via the M3U Editor UI**: create profiles in the editor and assign them to playlists (most users)
2. **Via the proxy API**: call the `/transcode` endpoint directly


## Configuring via the M3U Editor

### Step 1: Create a Stream Profile

Navigate to **Proxy → Stream Profiles** in the editor sidebar and click **New profile**.

| Field | Description |
|-------|-------------|
| **Profile Name** | A descriptive label (e.g. "720p Standard", "1080p High Quality") |
| **Description** | Optional notes |
| **FFmpeg Template** | The FFmpeg argument string with `{variable}` placeholders |
| **Stream Format** | Output container format: MP4, MPEG-TS, HLS, MKV, WebM, etc. |

The default template is a good starting point for most setups:

```
-i {input_url} -c:v libx264 -preset faster -crf {crf|23} -maxrate {maxrate|2500k} -bufsize {bufsize|5000k} -c:a aac -b:a {audio_bitrate|192k} -f mpegts {output_args|pipe:1}
```

Hardware acceleration (NVENC, VAAPI) is applied **automatically** by the proxy based on detected GPU. You do not need to hardcode encoder names in your template.

### Step 2: Assign to a Playlist

Open the playlist you want to apply transcoding to, go to the **Proxy Settings** section, and choose a profile:

| Field | Description |
|-------|-------------|
| **Live Streaming Profile** | Applied to live TV channels from this playlist. Leave empty for direct pass-through |
| **VOD and Series Streaming Profile** | Applied to VOD and series content. Leave empty for direct pass-through |

:::note
Time seeking (scrubbing) is not supported for VOD content when transcoding is active, because the output is a live-transcoded stream rather than a pre-encoded file.
:::

### Global Default Profiles

If you want a profile to apply across all playlists by default, set it under **Settings → Preferences → Proxy**:

- **Default Live Transcoding Profile**: used by the in-app player for live content
- **VOD and Series Transcoding Profile**: used by the in-app player for VOD/Series

Per-playlist profile assignments override the global defaults.


## FFmpeg Template Syntax

Templates use `{variable}` for required values and `{variable|default}` for optional values with fallbacks.

### Built-in variables

| Variable | Default | Description |
|----------|---------|-------------|
| `input_url` | (auto-set) | Source stream URL: always required in the template |
| `output_args` | `pipe:1` | Output destination (stdout for streaming) |
| `video_bitrate` | `2M` | Target video bitrate |
| `audio_bitrate` | `128k` | Target audio bitrate |
| `format` | `mp4` | Output container format |
| `crf` | `23` | Constant Rate Factor: lower = higher quality |
| `maxrate` | `2500k` | Maximum bitrate cap |
| `bufsize` | `5000k` | Buffer size for rate control |

### Quality examples

```
# High quality (for large screens / good connections)
-crf {crf|18} -maxrate {maxrate|5000k} -bufsize {bufsize|10000k}

# Medium quality (recommended default)
-crf {crf|23} -maxrate {maxrate|2500k} -bufsize {bufsize|5000k}

# Low quality (mobile / slow connections)
-crf {crf|28} -maxrate {maxrate|1000k} -bufsize {bufsize|2000k}
```

### Bitrate suffix reference

| Suffix | Meaning |
|--------|---------|
| `k` | kilobits/s (e.g. `2500k`) |
| `M` | megabits/s (e.g. `2M`) |
| _(none)_ | bits/s |


## Proxy API Usage

If you are calling the proxy directly (bypassing the editor), use the `/transcode` endpoint:

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

### Built-in proxy profiles

These profiles are built into the proxy itself (not created via the editor):

| Profile | Description | Key variables |
|---------|-------------|--------------|
| `default` | Standard H.264 with bitrate control | `video_bitrate`, `audio_bitrate`, `format` |
| `hq` | High quality with CRF and maxrate | `crf`, `maxrate`, `bufsize`, `audio_bitrate` |
| `lowlatency` | Low latency with zero-latency tuning | `video_bitrate`, `audio_bitrate` |
| `720p` | Downscale to 1280×720 | `video_bitrate`, `audio_bitrate` |
| `1080p` | Downscale/upscale to 1920×1080 | `video_bitrate`, `audio_bitrate` |
| `hevc` | H.265/HEVC encoding | `video_bitrate`, `audio_bitrate` |
| `audio` | Audio-only output | `audio_bitrate`, `format` |

### Custom profile templates via API

You can also pass a raw FFmpeg argument string as the `profile` field. Custom profiles must start with `-`:

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


## Combining with Redis Pooling

When [Redis pooling](./redis-pooling.md) is enabled, clients using the same URL + profile combination share one FFmpeg process. The `STREAM_SHARING_STRATEGY` variable controls how the key is computed:

- `url_profile`: same URL **and** same profile → shared (default)
- `url_only`: same URL regardless of profile → shared
- `disabled`: always individual processes


## Troubleshooting

**Variables not substituted in output**
- Check the variable name spelling matches the placeholder exactly
- Ensure the variable is included in `profile_variables`

**FFmpeg fails with invalid arguments**
- Verify bitrate strings include the correct suffix (`k` or `M`)
- Check that `{input_url}` is present in any custom template

**Poor quality output**
- Lower the `crf` value (lower = better quality, more bits)
- Increase `video_bitrate` and `audio_bitrate`
- Confirm hardware acceleration is active (see [Hardware Acceleration](./hardware-acceleration.md))

**Profile not applying to streams**
- Confirm the profile is assigned to the playlist under **Proxy Settings** in the playlist edit form
- Check that `enable_proxy` is enabled for the playlist
