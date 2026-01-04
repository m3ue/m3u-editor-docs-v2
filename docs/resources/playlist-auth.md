---
sidebar_position: 5
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

### User Access Control
Provide different users with individual credentials:
- Track usage per user
- Revoke access by disabling auth
- Share specific playlists with specific users
- Monitor and manage access centrally

### Client Management
Manage IPTV client access:
- One credential per device/client
- Easy rotation of credentials
- Disable compromised credentials
- Separate household members

### Subscription Management
Implement basic subscription control:
- Active/inactive subscription status via enabled toggle
- Different access levels via playlist assignment
- Time-based access (manually toggle enabled)
- Trial accounts

### Testing and Development
Create test accounts:
- Development credentials
- QA testing access
- Demo accounts for evaluation
- Temporary access credentials

## Creating Playlist Auth

1. Navigate to **Playlist Auth** in the sidebar
2. Click **Create Playlist Auth**
3. Configure settings:
   - **Name**: Descriptive identifier (internal use only)
   - **Username**: Login username
   - **Password**: Login password
   - **Enabled**: Activate the authentication
4. Click **Save**

## Configuration Options

### Basic Settings

#### Name
An internal descriptive name to identify this authentication credential. This is for your reference only and is not exposed to users.

**Examples**:
- `John's Living Room TV`
- `Premium Subscription - User123`
- `Trial Account - Expires 2026-02-01`
- `Development Test Account`

#### Username
The username that users/clients will use to authenticate. This is case-sensitive.

**Best Practices**:
- Use unique, identifiable usernames
- Consider including user IDs or device identifiers
- Avoid special characters that may cause URL encoding issues
- Keep it simple for users to type

**Examples**:
- `user123`
- `john_smith`
- `premium_user_456`
- `test_account_dev`

#### Password
The password for authentication. This is case-sensitive.

**Security Recommendations**:
- Use strong, unique passwords
- Avoid common passwords or patterns
- Consider using generated passwords
- Don't reuse passwords across auths
- Rotate periodically for security

#### Enabled
Toggle to activate or deactivate the authentication without deleting it.

- **Enabled**: Users can authenticate and access assigned playlist
- **Disabled**: Authentication attempts will fail

**Use Cases**:
- Suspend access temporarily
- Implement subscription expiration
- Quick revocation of access
- Testing purposes

## Assigning to Playlists

Playlist Auth uses a **one-to-one relationship** model: each auth can only be assigned to one playlist at a time, but you can reassign it to a different playlist.

### Supported Playlist Types

Playlist Auth can be assigned to:
- **Playlists** (standard imported playlists)
- **Custom Playlists** (manually curated)
- **Merged Playlists** (combined playlists)
- **Playlist Aliases** (alternative configurations)

### How to Assign

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
