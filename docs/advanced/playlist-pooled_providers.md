---
sidebar_position: 1
description: Understanding and using pooled provider playlists
tags:
  - Resources
  - Playlists
  - Advanced
  - Experimental
title: Pooled Provider Profiles
---

# Pooled Provider Profiles

:::info
As of 1/5/2025 -- provider profiles are only available in the **experimental branch**
:::

## Overview

Provider Profiles allow you to pool multiple Xtream API accounts into a single playlist, effectively raising your concurrency ceiling. This enables more simultaneous streams by combining the connection limits of individual accounts into one larger, unified pool of available functionality.

:::note
Provider Profiles is designed for **pooling multiple accounts from the same IPTV provider**. You can use different servers from that provider, but mixing completely different providers may cause issues!
:::

---
## 📝 Requirements
Before enabling Provider Profiles, ensure:

- ✅ **Proxy mode is enabled** - Required for accurate connection tracking **This will get enabled when you toggle a playlist to use provider profiles**
- ✅ **M3U_PROXY_URL and M3U_PROXY_TOKEN are configured** - Provider Profiles requires the m3u-proxy service
- ✅ **Playlist is Xtream API type** - Profiles only work with Xtream playlists, not plain M3U files
- ✅ **Multiple accounts from the same provider** - You need additional IPTV accounts to pool

**Why Proxy is Required:**
- Tracks active connections in real-time via Redis
- Enables stream pooling (multiple viewers sharing one connection)
- Manages automatic profile selection based on capacity
- Handles credential transformation for different accounts                                                                             

## 💡 How It Works

### The Basics

Provider Profiles pools multiple IPTV accounts into a single playlist:

1. **Primary Profile** - Automatically created from your playlist's Xtream credentials
2. **Additional Profiles** - Extra accounts you add manually
3. **Automatic Selection** - System picks an account with available capacity
4. **Priority Order** - Profiles tried in order (priority 0 first, then 1, 2, etc.)

### What Each Profile Includes

- **Username & Password** - Xtream account credentials
- **Provider URL** (optional) - Different server from same provider (leave blank to use playlist URL)
- **Max Streams** - Connection limit (auto-detected or manually set)
- **Priority** - Selection order (lower = tried first)
- **Enabled/Disabled** - Toggle to activate/deactivate

### Stream Pooling (Bonus Feature!)

When multiple people watch the **same channel** with transcoding enabled, they can share a single provider connection:

**Scenario:** 5 family members watching the same football game **with different devices**

**Result:**
- ✅ Only 1 provider connection used
- ✅ All 5 viewers share the same transcoded stream
- ✅ Maximum efficiency achieved!

Instead of 5 separate connections consuming bandwidth and provider resources, everyone shares a single optimized stream. This leaves more connections available for watching different channels.

---

## 🛠️ Setting Up Provider Profiles


### Step 1: Enable Provider Profiles

1. Edit your playlist
2. Scroll to "Provider Profiles" section
3. Toggle "Enable Provider Profiles" to **ON**
4. Click **Save**

:::warning
If proxy mode isn't already enabled on your playlist, it will automatically be enabled when you turn on Provider Profiles. This is required for accurate connection tracking.
::: 

Your primary account is automatically created as the first profile.

### Step 2: Add Additional Accounts

Click **Add Profile** and fill in:

**Profile Name** (optional)  
Friendly name like "Backup Account" or "US Server"

**Provider URL** (optional)  
- Leave blank = uses same URL as playlist
- Enter URL = uses different server from same provider

**Username** (required)  
Your IPTV account username

**Password** (required)  
Your IPTV account password

**Max Streams** (optional)  
Leave blank to auto-detect, or set a manual limit

**Priority** (default: auto-assigned)  
Lower numbers tried first (0, 1, 2...)

**Enabled** (default: ON)  
Toggle to activate this profile

### Step 3: Test the Profile

**Always test before saving!**

1. Click **Test** button next to the profile
2. System verifies credentials and detects max connections
3. Review the results
4. Click **Save** when ready

### Step 4: Verify Pool Status
After adding profiles, check the "Pool Status" display:

**Example**

Total: 3/10 active | 7 available

✓ ⭐ Primary Account: 2/5 streams

✓ Account 2: 1/5 streams  

✗ Account 3: 0/5 streams (Disabled)

---

# Using Multiple Server URLs

### When to Use Different URLs

### Use Cases

**Important**: Provider Profiles is designed for **the same provider with multiple accounts**. The `url` field allows different servers/endpoints from that same provider, not different providers entirely.

---
## 💼 Managing Your Profiles

### Testing Profiles

Always test a profile after adding it:

1. Click the **Test** button next to the profile
2. The system will:
   - Verify the username and password
   - Check connectivity to the provider URL
   - Auto-detect the maximum connections allowed
3. Review the test results
4. The Max Streams field will update automatically if successful

### Enabling/Disabling Profiles

You can temporarily disable profiles without deleting them:

- **Disabled profiles** are skipped during selection
- Useful for troubleshooting or rotating accounts
- Toggle the "Enabled" switch on/off

### Setting Priorities

Control which profiles are used first:

- **Priority 0** = Try this profile first (usually your primary account)
- **Priority 1** = Try this profile second (backup)
- **Priority 2** = Try this profile third (second backup)

Lower priority numbers = higher priority for selection.

### Adjusting Connection Limits

You can manually override the connection limit:

**Why override?**
- Reserve connections for specific devices
- Prevent one playlist from using all connections
- Account for connections used by other apps

**How to set:**
1. Enter a number in the "Max Streams" field
2. System will use the lower of:
   - Your manual limit
   - Provider's actual limit

## 🔍 Troubleshooting

### Profile Test Failed

**Possible Causes:**
- Incorrect username or password
- Wrong provider URL
- Provider server is down
- Network connectivity issue

**How to Fix:**
1. Double-check the username and password
2. Verify the provider URL is correct (check for typos)
3. Try accessing the provider's website to confirm it's online
4. Test with a different URL if your provider has backup servers

---

### No Profiles Have Capacity

**Symptoms:**  
Unable to start new streams even though profiles are enabled

**Possible Causes:**
- All profiles are at their connection limit
- All profiles are disabled
- Provider information needs refreshing

**How to Fix:**
1. Check the Pool Status to see current usage
2. Wait for active streams to end
3. Click **Test** on the primary profile to refresh connection limits
4. Enable any disabled profiles
5. Add a new profile if needed

---

### Streams Not Sharing Connections

**Symptoms:**  
Multiple people watching the same channel but using separate connections

**This is normal if:**
- Transcoding is disabled
- People started watching at very different times
- Different transcoding quality settings are selected

**To enable connection sharing:**
1. Make sure transcoding is enabled on the playlist
2. All viewers should use the same transcoding profile
3. Connection pooling happens automatically for the same channel + quality

---

## 💬 Frequently Asked Questions

### Q: Can I use accounts from completely different IPTV providers?

**AWhile technically possible by setting different URLs, it's **not recommended**. Provider Profiles is designed for the same provider with multiple accounts. Different providers may have:
- Incompatible URL structures
- Different API implementations  
- Varying authentication methods
- Different channel naming/IDs

For different providers, create separate playlists instead.

### Q: Why can't I just set any URL I want?

**A:** The URL transformation system uses pattern matching to replace credentials and server URLs. It expects a consistent Xtream API URL format:
```
http://provider.com/live/username/password/stream123.ts
```

If Provider B uses a different structure, the transformation will fail:
```
http://different.com/stream/username/password/123.ts  ← Won't match pattern
```
Proxy Not Enabled Error

**Symptoms:**  
"Provider Profiles require proxy to be enabled"
