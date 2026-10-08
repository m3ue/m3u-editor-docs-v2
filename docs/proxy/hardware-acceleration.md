---
sidebar_position: 3
title: Hardware Acceleration
description: Transcode with an NVIDIA, Intel, or AMD GPU by passing it through to the M3U Proxy container.
tags:
  - Proxy
  - Transcoding
  - GPU
  - Hardware Acceleration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Hardware Acceleration

[Transcoding](transcoding) on the CPU is slow and heavy: a typical CPU manages one or two streams. A GPU can handle several at once with little CPU use. M3U Proxy finds a GPU on its own when it starts, and uses it for every transcoding profile.

It only matters for transcoding. Streams passed through untouched (the default) don't use the GPU.

:::warning Needs the separate proxy container
Hardware acceleration works with M3U Proxy in its own container, as in the [modular setup](/docs/deployment/docker-compose#modular). The all-in-one container's embedded proxy can't use a GPU.
:::

## Give the proxy your GPU

<Tabs groupId="gpu" queryString>
<TabItem value="intel-amd" label="Intel or AMD" default>

Intel (Quick Sync, VAAPI) and AMD (VAAPI) GPUs are shared with the container through `/dev/dri`. Uncomment these lines under `m3u-proxy` in your compose file:

```yaml
services:
  m3u-proxy:
    devices:
      - /dev/dri:/dev/dri
```

</TabItem>
<TabItem value="nvidia" label="NVIDIA">

Install the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) on the host first, then reserve the GPU for the proxy:

```yaml
services:
  m3u-proxy:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
```

</TabItem>
</Tabs>

Recreate the container with `docker compose up -d`.

## Check it's working

In M3U Editor, go to **Settings → Proxy** and choose **Test connection**. **Hardware Acceleration** shows whether a GPU was found, and its type and device.

The proxy's startup log shows the same thing:

```bash
docker compose logs m3u-proxy | grep -i "hardware\|gpu"
```

A working GPU shows a line like `Hardware detection: NVIDIA GPU (...)`. If none is found, the proxy uses the CPU.

## Troubleshooting

| Problem | What to check |
|---|---|
| No GPU is found (Intel or AMD) | `ls -la /dev/dri` on the host shows `renderD128` or similar. `docker exec m3u-proxy ls -la /dev/dri` shows the same inside the container. |
| No GPU is found (NVIDIA) | `nvidia-smi` works on the host, and `docker run --rm --gpus all nvidia/cuda:12.0-base-ubuntu22.04 nvidia-smi` works in a test container. If not, the Container Toolkit isn't set up yet. |
| The log says a device "exists but is not accessible" | The container can see the device but can't use it. Check the device's permissions on the host. |
| Transcoding still uses the CPU | The playlist or channel is using a profile, and **Test connection** reports the GPU. Profiles written for `libx264` are switched to the GPU automatically. |
