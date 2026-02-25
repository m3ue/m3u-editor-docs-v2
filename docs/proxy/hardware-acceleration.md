---
sidebar_position: 11
title: Hardware Acceleration
description: GPU-accelerated transcoding with NVIDIA, Intel, and AMD GPUs
tags:
  - Proxy
  - Transcoding
  - GPU
  - Hardware Acceleration
---

# Hardware Acceleration

The proxy includes automatic GPU detection and hardware-accelerated transcoding via FFmpeg. When a compatible GPU is available, encoding is offloaded from the CPU — dramatically increasing throughput and reducing latency.

:::warning
Hardware acceleration is only available when using as an external instance. Using the AIO container with the embedded proxy instance **does not support hardware acceleration**.
:::

:::info
Hardware acceleration only applies to **transcoding**. Pass-through streaming (the default) does not use the GPU.
:::

## Supported Hardware

### NVIDIA GPUs

- **Requirements**: NVIDIA Container Toolkit
- **Acceleration**: CUDA, NVENC, NVDEC
- **Performance**: 10–20× faster than CPU encoding
- **Best for**: High-concurrency setups with 4+ simultaneous transcoded streams

### Intel GPUs

- **Requirements**: `/dev/dri` devices passed to the container
- **Acceleration**: VAAPI, QuickSync (QSV)
- **Performance**: 3–8× faster than CPU encoding
- **Best for**: Efficient transcoding with good quality/performance balance

### AMD GPUs

- **Requirements**: `/dev/dri` devices passed to the container
- **Acceleration**: VAAPI
- **Performance**: 3–5× faster than CPU encoding
- **Best for**: Open-source acceleration on AMD hardware

### CPU Fallback

When no GPU is detected, the proxy automatically falls back to software encoding (`libx264`, `libx265`). Single stream recommended for CPU-only setups.

## Docker Setup

### NVIDIA GPU

Install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) on the host first.

```yaml
services:
  m3u-proxy:
    image: sparkison/m3u-proxy:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - "8085:8085"
```

Or with `docker run`:

```bash
docker run -d --name m3u-proxy \
  --gpus all \
  -p 8085:8085 \
  sparkison/m3u-proxy:latest
```

### Intel / AMD GPU

```yaml
services:
  m3u-proxy:
    image: sparkison/m3u-proxy:latest
    devices:
      - /dev/dri:/dev/dri
    ports:
      - "8085:8085"
```

Or with `docker run`:

```bash
docker run -d --name m3u-proxy \
  --device /dev/dri:/dev/dri \
  -p 8085:8085 \
  sparkison/m3u-proxy:latest
```

### CPU Only

No special configuration needed:

```bash
docker run -d --name m3u-proxy \
  -p 8085:8085 \
  sparkison/m3u-proxy:latest
```

## Auto-Detection

On startup, the container automatically:

1. Detects available GPU hardware using `lspci`
2. Checks device accessibility (`/dev/nvidia*`, `/dev/dri/*`)
3. Tests FFmpeg capabilities for the detected hardware
4. Selects the optimal encoder (NVENC, VAAPI, or software)
5. Logs the result

Example startup output:

```
📦 m3u-proxy starting up...
🎬 FFmpeg version: 8.0
🔍 Running hardware acceleration check...
🔍 Hardware detection: NVIDIA GPU (GeForce RTX 3080)
✅ FFmpeg NVIDIA acceleration: AVAILABLE
🚀 Starting m3u-proxy application...
```

The detected acceleration type is available via the environment variables `HW_ACCEL_AVAILABLE`, `HW_ACCEL_TYPE`, and `HW_ACCEL_DEVICE`.

## Performance Comparison

| Hardware | Concurrent streams | CPU usage | Encoding speed |
|----------|--------------------|-----------|----------------|
| NVIDIA GPU | 4+ | Very low | 10–20× CPU |
| Intel/AMD GPU | 1–2 | Low | 3–8× CPU |
| CPU only | 1 | High | Baseline |

## Troubleshooting

**No GPU detected**

```bash
# Check GPU device availability in container
docker run --rm sparkison/m3u-proxy:latest ls -la /dev/dri /dev/nvidia* 2>/dev/null

# Check detection logs
docker logs m3u-proxy | grep -E "🔍|✅|❌"
```

**NVIDIA issues**

```bash
# Test NVIDIA container runtime on the host
docker run --rm --gpus all nvidia/cuda:12.0-base-ubuntu22.04 nvidia-smi

# Verify host driver
nvidia-smi
```

**Intel/AMD issues**

```bash
# Check DRI devices on the host
ls -la /dev/dri/

# Test VAAPI inside the container
docker run --rm --device /dev/dri:/dev/dri sparkison/m3u-proxy:latest vainfo
```

## Verifying GPU Access

After starting the container:

```bash
docker exec -it m3u-proxy ls -la /dev/dri      # Intel/AMD
docker exec -it m3u-proxy nvidia-smi           # NVIDIA
```

## Next Steps

Once hardware acceleration is configured, see [Transcoding](./transcoding.md) for how to create transcoded streams and customise encoding profiles.
