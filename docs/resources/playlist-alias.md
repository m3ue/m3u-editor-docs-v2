---
sidebar_position: 4
description: Understanding and using Playlist Aliases in M3U Editor
tags:
  - Resources
  - Playlists
  - Advanced
title: Playlist Alias
---

# Playlist Alias

Playlist Aliases allow you to create alternate versions of existing playlists with different settings, authentication, or proxy configurations. This is useful when you need to serve the same playlist content to different clients with varying requirements.

## What is a Playlist Alias?

A Playlist Alias is a reference to an existing playlist that allows you to:
- Apply different stream profiles for transcoding
- Use separate authentication credentials
- Configure custom proxy settings
- Set different priorities for channel selection
- Apply custom headers
- Enable/disable specific features per alias

Think of it as a "view" of your original playlist with customized settings.

## Use Cases

### Multiple Client Configurations
Serve the same playlist to different IPTV clients with optimized settings for each:
- High-quality streams for local network clients
- Transcoded streams for remote/mobile clients
- Different authentication per device

### Testing and Development
Create test aliases without affecting production playlists:
- Test new stream profiles
- Experiment with proxy configurations
- Validate channel priorities

### Multi-User Environments
Provide the same content with user-specific access:
- Individual authentication per user
- Custom stream quality per subscription tier
- Separate tracking and analytics

## Creating a Playlist Alias

1. Navigate to **Playlists** in the sidebar
2. Find the playlist you want to alias
3. Click the actions menu (three dots)
4. Select **Create Alias**
5. Configure alias settings:
   - **Name**: Descriptive name for this alias
   - **Enabled**: Toggle to activate/deactivate
   - **Priority**: Channel selection priority (higher = preferred)

## Related Resources

- [Adding Playlists](playlists.md) - How to add source playlists
- [Playlist Auth](playlist-auth.md) - Authentication configuration
- [Custom Playlist](custom-playlist.md) - Creating custom playlists
- [Merged Playlist](merged-playlist.md) - Merging multiple playlists
