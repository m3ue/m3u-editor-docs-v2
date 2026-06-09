---
sidebar_position: 6
description: Configure authentication for playlist access
tags:
  - Resources
  - Security
  - Authentication
title: Playlist Auths
---

# Playlist Auths

Playlist Auth provides authentication and access control for your playlists. Secure your content with username/password combinations and control which users can access specific playlists.

## What is Playlist Auth?

Playlist Auth is a reusable authentication credential that can be assigned to playlists:
- Username and password combination
- Works with Xtream Codes API
- Can be enabled/disabled without deletion
- One auth per playlist (1:1 relationship)
- Shareable across different playlist types

## Use Cases

### Family Sharing
Give household members their own credentials without sharing your main account:
- One login per person or per TV
- Revoke or pause access for an individual without affecting others
- Point family members at different playlists tailored to their preferences (kids playlist, sports package, etc.)

### Per-Device Access
Keep each device independently credentialed:
- One set of credentials per smart TV, phone, or media player
- Swap or rotate credentials for a single device without touching others
- Disable a credential if a device is lost or decommissioned

### Temporary or Time-Limited Access
Share access with guests or for a limited period:
- Set an **expiration date** so access stops automatically without manual intervention
- Disable the credential when the period ends rather than deleting it
- Re-enable it later if needed

### Testing and Development
Create isolated credentials for testing:
- Test a new playlist or stream profile without risking your main credentials
- Create a throwaway account for evaluating client apps
- Disable it when done

## Creating Playlist Auth

1. Navigate to **Playlist Auth** in the sidebar
2. Click **Create Playlist Auth**
3. Configure settings:
   - **Name**: Descriptive identifier (internal use only)
   - **Username**: Login username
   - **Password**: Login password
   - **Enabled**: Activate the authentication
4. (Optional) Assign a playlist directly during creation
5. Click **Save**

## Configuration Options

### Basic Settings

#### Name
An internal descriptive name to identify this authentication credential. This is for your reference only and is not exposed to users.

**Examples**:
- `John's Living Room TV`
- `User123`
- `Expires 2026-02-01`
- `Development Test Account`

#### Username
The username that users/clients will use to authenticate. This is case-sensitive.

**Best Practices**:
- Use unique, identifiable usernames
- Consider including user IDs or device identifiers
- Avoid special characters that may cause URL encoding issues
- Keep it simple for users to type

#### Password
The password for authentication. This is case-sensitive.

**Security Recommendations**:
- Use strong, unique passwords
- Avoid common passwords or patterns
- Consider using generated passwords
- Don't reuse passwords across auths
- Rotate periodically for security

#### Expiration
An optional date and time after which the auth credential stops working automatically.

- Leave blank for no expiration
- Once the expiration time passes, authentication attempts will fail
- Useful for trial accounts or time-limited subscriptions

#### Enabled
Toggle to activate or deactivate the authentication without deleting it.

- **Enabled**: Users can authenticate and access assigned playlist
- **Disabled**: Authentication attempts will fail

**Use Cases**:
- Suspend access temporarily
- Implement subscription expiration
- Quick revocation of access
- Testing purposes

### Stream Limits

Control how many concurrent streams a single auth credential can have active at once. This is enforced at the proxy level — the assigned playlist must have the proxy enabled.

#### Max Connections
The maximum number of simultaneously active streams allowed for this auth user.

- Leave blank for unlimited connections
- Only enforced when the assigned playlist has proxy enabled
- When the limit is reached, new connection attempts are rejected unless **Stop Oldest Stream on Limit** is enabled

**Example**:
- `1` — single-stream subscription (one active stream at a time)
- `2` — allows watching on two devices simultaneously

#### Stop Oldest Stream on Limit

When enabled, if this auth's connection limit is reached, the **oldest active stream** is automatically stopped to make room for the new connection request.

- **Enabled**: Newest connection always wins; oldest stream is evicted
- **Disabled**: New connection is rejected when limit is reached

:::warning
Enabling this may interrupt an active viewer if a new connection comes in. It is best suited for single-device subscriptions where you want channel-switching to work seamlessly rather than blocking.
:::

## Assigning to Playlists

Playlist Auth uses a **one-to-one relationship** model: each auth can only be assigned to one playlist at a time, but you can reassign it to a different playlist.

### Supported Playlist Types

Playlist Auth can be assigned to:
- **Playlists** (standard imported playlists)
- **Custom Playlists** (manually curated)
- **Merged Playlists** (combined playlists)
- **Playlist Aliases** (alternative configurations)

### How to Assign

#### On Create
When creating a new Playlist Auth, you can immediately assign it to a playlist in the same form — no need to edit afterwards.

#### From Playlist Auth
1. Open the Playlist Auth
2. Use the relationship field
3. Select the playlist to assign
4. Save

This will automatically remove any previous assignment and create the new one.

#### From Playlist/Custom/Merged Playlist
1. Open the playlist resource
2. Find the authentication field
3. Select the Playlist Auth
4. Save

### Reassigning

To move a Playlist Auth from one playlist to another:
1. Edit the Playlist Auth
2. Select the new playlist
3. Save

The auth will be automatically removed from the old playlist and assigned to the new one.

### Viewing Assignments

Each Playlist Auth shows:
- Currently assigned playlist (if any)
- Playlist type (Playlist, Custom, Merged, Alias)
- Assignment status

## Related Resources

- [Adding Playlists](playlists.md) - Setting up playlists
- [Playlist Alias](playlist-alias.md) - Creating playlist variations
- [Custom Playlist](custom-playlist.md) - Curated playlists
- [Merged Playlist](merged-playlist.md) - Combined playlists
