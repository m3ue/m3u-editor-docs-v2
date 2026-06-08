---
sidebar_position: 12
title: Transcoding & Stream Profiles
description: FFmpeg transcoding via Stream Profiles — configure in the Editor UI or directly via API
tags:
  - Proxy
  - Transcoding
  - FFmpeg
  - Profiles
  - Adaptive
---

# Transcoding & Stream Profiles

The proxy can transcode streams using FFmpeg before delivering them to clients. Transcoding is configured through **Stream Profiles** — reusable FFmpeg argument templates with variable placeholders you can customise per use case.

:::info
Transcoding requires FFmpeg and is more resource-intensive than pass-through streaming. For live TV without re-encoding, pass-through is recommended. See [Hardware Acceleration](./hardware-acceleration.md) to GPU-accelerate encoding.
:::

There are two ways to use transcoding:

1. **Via the M3U Editor UI** — create profiles in the editor and assign them to playlists (most users)
2. **Via the proxy API** — call the `/transcode` endpoint directly

---

## Configuring via the M3U Editor

### Step 1 — Create a Stream Profile

Navigate to **Proxy → Stream Profiles** in the editor sidebar and click **New profile**.

| Field | Description |
|-------|-------------|
| **Profile Name** | A descriptive label (e.g. "720p Standard", "1080p High Quality") |
| **Description** | Optional notes |
| **Stream Backend** | `FFmpeg`, `Streamlink`, `yt-dlp`, or `Adaptive (rule-based)` — see [Adaptive Profiles](#adaptive-rule-based-profiles) for the rule-based option |
| **FFmpeg Template** | The FFmpeg argument string with `{variable}` placeholders (FFmpeg backend only) |
| **Stream Format** | Output container format: MP4, MPEG-TS, HLS, MKV, WebM, etc. |

The default template is a good starting point for most setups:

```
-i {input_url} -c:v libx264 -preset faster -crf {crf|23} -maxrate {maxrate|2500k} -bufsize {bufsize|5000k} -c:a aac -b:a {audio_bitrate|192k} -f mpegts {output_args|pipe:1}
```

Hardware acceleration (NVENC, VAAPI) is applied **automatically** by the proxy based on detected GPU. You do not need to hardcode encoder names in your template.

### Step 2 — Assign to a Playlist

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

- **Default Live Transcoding Profile** — used by the in-app player for live content
- **VOD and Series Transcoding Profile** — used by the in-app player for VOD/Series

Per-playlist profile assignments override the global defaults.

---

## Adaptive (Rule-Based) Profiles

An **Adaptive** profile doesn't carry its own FFmpeg / Streamlink / yt-dlp arguments. Instead, it picks one of your existing transcoding profiles at stream-start time based on the channel's probed metadata (codec, resolution, audio layout, etc.).

This is most useful when you want to assign a single profile to many channels — for example via the channels bulk action — and let the system route each one to the right transcoder rather than maintaining separate playlist or per-channel assignments.

:::info
Adaptive profiles depend on **probed channel metadata**. Channels without `stream_stats` always fall through to the else fallback. See [Stream Probing](../advanced/stream-probing.md) for how to populate that data.
:::

### How rules are evaluated

Each adaptive profile holds an ordered list of rules plus a mandatory **else** fallback. Evaluation walks the list top to bottom and the first match wins:

```
if (all conditions match) → use Profile X
if (all conditions match) → use Profile Y
…
else → use Profile Z   (also used when probe data is missing)
```

- Conditions inside a rule are **ANDed** — every condition must match for the rule to fire.
- To express **OR**, add another rule pointing at the same target profile.
- The else fallback is required and also catches the "no probe data yet" case.
- Adaptive profiles cannot point at other adaptive profiles, and a profile cannot reference itself — a stream always resolves in one hop.

### Creating an Adaptive profile

1. Go to **Proxy → Stream Profiles** and click **New profile**.
2. Set **Stream Backend** to **Adaptive (rule-based)**. The FFmpeg / Streamlink / yt-dlp args, format, and cookies fields disappear and a **Rules** editor appears.
3. Add one or more rules. For each rule:
   - Add one or more **conditions** (field, operator, value). All conditions must match.
   - Pick the **target profile** to use when the rule matches.
4. Pick the **Otherwise (fallback)** profile.
5. Save.

The new profile appears in the table with a green **Adaptive** badge and shows under the **Adaptive** tab on the list page (alongside **All** and **Transcoding** tabs).

Once created, an adaptive profile is assigned to playlists (or individual channels, or as a global default) just like any other stream profile.

### Available condition fields

| Group | Field | Type | Example value |
|-------|-------|------|---------------|
| Video | Codec | string | `hevc`, `h264`, `mpeg2video` |
| Video | Height (px) | numeric | `1080` |
| Video | Width (px) | numeric | `1920` |
| Video | Bitrate (bps) | numeric | `5000000` |
| Video | Frame rate (fps) | numeric | `60` |
| Video | Profile | string | `High`, `Main` |
| Video | Aspect ratio | string | `16:9` |
| Audio | Codec | string | `aac`, `ac3`, `eac3` |
| Audio | Channels | numeric | `2`, `6` |
| Audio | Sample rate (Hz) | numeric | `48000` |
| Format | Format name | string | `hls`, `mpegts` |

### Operators

The operator dropdown is filtered to the field type:

| Type | Available operators |
|------|--------------------|
| Numeric (height, width, bitrate, frame rate, audio channels, sample rate) | `=`, `≠`, `>`, `≥`, `<`, `≤` |
| String (codec, profile, aspect ratio, format name) | `=`, `≠`, `is one of`, `is not one of` |

`is one of` / `is not one of` accept multiple values — press Enter, comma, or Tab to add each one. String comparisons are case-insensitive.

### Worked example

Suppose you want HEVC 1080p+ to use a high-quality NVENC profile, regular H.264 1080p+ to use a standard CBR profile, surround audio to use a passthrough profile, and everything else to use a default live profile:

| Order | Conditions (ANDed) | Target |
|-------|---------------------|--------|
| 1 | `video.codec_name = hevc` AND `video.height ≥ 1080` | HEVC HQ |
| 2 | `video.codec_name = h264` AND `video.height ≥ 1080` | H.264 HQ |
| 3 | `audio.channels ≥ 6` | Surround Passthrough |
| **else** | — | Default Live |

A 4K HEVC channel matches rule 1. A 1080p H.264 channel matches rule 2. A 720p H.264 channel with 5.1 audio matches rule 3 (rule 2 fails the height check). An unprobed channel goes straight to the else fallback.

### Deletion safety

You cannot delete a transcoding profile that's referenced by an adaptive profile — either as a rule target or as the else fallback. The editor surfaces a notification listing the adaptive profiles that reference it; clear those references first, then delete.

If a referenced target profile is removed by some other means (e.g. a foreign-key cascade), the channel falls back to raw bytes / no transcoding rather than erroring.

---

## FFmpeg Template Syntax

Templates use `{variable}` for required values and `{variable|default}` for optional values with fallbacks.

### Built-in variables

| Variable | Default | Description |
|----------|---------|-------------|
| `input_url` | (auto-set) | Source stream URL — always required in the template |
| `output_args` | `pipe:1` | Output destination (stdout for streaming) |
| `video_bitrate` | `2M` | Target video bitrate |
| `audio_bitrate` | `128k` | Target audio bitrate |
| `format` | `mp4` | Output container format |
| `crf` | `23` | Constant Rate Factor — lower = higher quality |
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

---

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

---

## Combining with Redis Pooling

When [Redis pooling](./redis-pooling.md) is enabled, clients using the same URL + profile combination share one FFmpeg process. The `STREAM_SHARING_STRATEGY` variable controls how the key is computed:

- `url_profile` — same URL **and** same profile → shared (default)
- `url_only` — same URL regardless of profile → shared
- `disabled` — always individual processes

---

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
