---
sidebar_position: 2
title: Transcoding and Stream Profiles
description: Convert streams for devices that can't play the original, with stream profiles assigned to playlists, channels, or the in-app player.
tags:
  - Proxy
  - Transcoding
  - FFmpeg
  - Profiles
---

# Transcoding and Stream Profiles

Transcoding converts a stream as it plays, for example to H.264 for a device that can't play HEVC, to a lower bitrate for a slow connection, or to deinterlace antenna TV. M3U Proxy does it with FFmpeg, using **stream profiles** you set up in M3U Editor.

Most people don't need it: by default, streams pass through untouched, which is lighter and keeps the original quality. Transcoding uses a lot of CPU, so if you need it often, use a [GPU](hardware-acceleration).

## Start with the default profiles

Go to **Proxy → Stream Profiles** and choose **Generate Default Profiles**. It adds a set of ready-made profiles:

| Profile | Use it for |
|---|---|
| **Default Live Profile** | General live TV, as H.264 with a steady bitrate, in MPEG-TS |
| **Default HLS Profile** | The same, delivered as HLS, which buffers better on some players |
| **Default HLS fMP4 Profile** | HLS with fMP4 segments, which Apple TV needs to play HEVC |
| **HDHomeRun / OTA Live** | Antenna channels: deinterlaces MPEG-2 and converts audio to stereo AAC |
| **Default Streamlink Profile** | Twitch, YouTube, and other sites Streamlink supports, without re-encoding |
| **Default yt-dlp Profile** | Sites yt-dlp supports, without re-encoding |

## Use a profile

A profile does nothing until it's assigned. From most to least specific:

| Where | Applies to |
|---|---|
| A channel's **Stream Profile** (edit the channel) | That channel, everywhere. It wins over everything below. |
| **Live Streaming Profile** and **VOD and Series Streaming Profile**, in a playlist's **Output → Streaming Output** | That playlist's streams, in your players. |
| **Default Live Transcoding Profile** and **VOD and Series Transcoding Profile**, in **Settings → Proxy → In-App Player Transcoding** | The in-app player only. |

To set a profile on many channels at once, select them and use **Set Stream Profile** from the bulk actions, or set it on a whole group.

People using [M3U TV](/docs/m3u-tv/overview) can choose a profile per device when their login allows it. Pick which profiles they may use under **Proxy Access** on their [Playlist Auth](/docs/resources/playlist-auth#what-a-login-can-use).

:::note Things to know
- The playlist must have **Enable Stream Proxy** on, or the channel must be proxied, for a profile to apply.
- Seeking within a movie or episode isn't possible while it's being transcoded, since the output is created live.
- DASH (`.mpd`) sources are always passed through as they are, and can't be transcoded.
:::

## Create your own profile

Choose **New Profile** and pick a **Stream Backend**:

| Backend | What it does |
|---|---|
| **FFmpeg (transcoding)** | Re-encodes the stream with the FFmpeg arguments you give it. |
| **Streamlink**, **yt-dlp** | Pull streams from sites like Twitch and YouTube, without re-encoding. A **Cookies File Path** lets them use a logged-in session; mount the cookies file into the proxy container. |
| **Adaptive (rule-based)** | Picks one of your other profiles for each channel ([below](#adaptive-profiles)). |

**Stream Format** is the output container, like MPEG-TS, HLS, or MP4. For Streamlink and yt-dlp profiles, **Connection Limit** caps how many streams can use the profile at once; at the limit, the oldest one is stopped.

### FFmpeg arguments

The arguments are an FFmpeg command with placeholders. `{input_url}` is replaced with the stream's address, and `{name|default}` uses the value after the bar:

```
-fflags +genpts -i {input_url} -c:v libx264 -preset faster -b:v {bitrate|2000k} -maxrate {maxrate|2500k} -bufsize {bufsize|2500k} -c:a aac -b:a {audio_bitrate|128k} -f mpegts {output_args|pipe:1}
```

Write the arguments for software encoding (`libx264`). When the proxy finds a GPU, it switches to hardware encoding on its own. Arguments are checked before they're used, and anything that looks like a shell command is rejected.

## Adaptive profiles

An adaptive profile chooses another profile for each channel when it starts, based on what [stream probing](/docs/advanced/stream-probing) found out about it. Assign one adaptive profile to a whole playlist, and let it send HEVC channels one way and everything else another.

Each rule has one or more conditions that must all be true, and a profile to use when they are. Rules are checked top to bottom, and the first match wins. **Otherwise (fallback)** is used when nothing matches, and for channels that haven't been probed yet.

| Order | Conditions | Use this profile |
|---|---|---|
| 1 | Video codec = `hevc` and video height ≥ `1080` | HEVC to H.264 |
| 2 | Audio channels ≥ `6` | Surround passthrough |
| Otherwise | | Default Live Profile |

Conditions can check the video's codec, width, height, bitrate, frame rate, profile, and aspect ratio; the audio's codec, channels, and sample rate; and the stream's format. Number fields use comparisons like `≥`; text fields use `=`, `≠`, **is one of**, and **is not one of**, without regard to case. For "or", add a second rule with the same profile.

An adaptive profile can't point at another adaptive profile, and a profile used by an adaptive profile can't be deleted until you remove it from the rules.

## Share transcoding between viewers

With [Redis pooling](redis-pooling), viewers watching the same channel with the same profile share one FFmpeg process instead of each getting their own.

<details>
<summary>Transcoding through the proxy's API</summary>

To transcode without M3U Editor, call the proxy's `/transcode` endpoint with a built-in profile (`default`, `hq`, `lowlatency`, `720p`, `1080p`, `hevc`, or `audio`) or your own arguments, which must start with `-`:

```bash
curl -X POST "http://m3u-proxy:38085/transcode" \
  -H "Content-Type: application/json" \
  -H "X-API-Token: your-token" \
  -d '{
    "url": "https://source.example.com/stream.m3u8",
    "profile": "hq",
    "profile_variables": { "crf": "20", "audio_bitrate": "192k" }
  }'
```

`GET /transcode/profiles` lists the built-in profiles. See the [API Reference](api-reference).

</details>

## Troubleshooting

| Problem | What to check |
|---|---|
| The profile doesn't apply | The playlist or channel is proxied, and the profile is assigned where your player gets its streams (the playlist, not the in-app player defaults). |
| Playback stutters | Open the [Stream Monitor](stream-monitor). If the encoder's speed is below `1.0x`, it can't keep up: use a GPU or a lighter profile. |
| FFmpeg rejects the arguments | `{input_url}` is in the arguments, and bitrates have a unit, like `2500k` or `2M`. |
