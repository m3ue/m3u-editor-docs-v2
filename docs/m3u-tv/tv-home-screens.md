---
sidebar_position: 3.6
title: Home Screens
description: Lay out M3U TV's nav and Home for each playlist from M3U Editor, and add rows like a seasonal category or a sports league.
tags:
  - M3U TV
  - Settings
---

# Home Screens

*(M3U Editor v0.14.2+ with M3U TV v1.3.0+)* A Home Screen sets up a playlist's [Navigation & Home](settings#navigation--home) from M3U Editor: the order of the sections, which ones show in the nav and on Home, and extra rows inside them. For example, a **Christmas Movies** row above the usual Movies row every December, or a **Game Day** row with just the NFL.

## Create a Home Screen

Go to **Administration → Devices → Home Screens** and choose **New Home Screen**.

1. Pick the **Playlist** it's for: a Playlist, Custom Playlist, Merged Playlist, or Playlist Alias. Each can have one Home Screen. Every login to that playlist gets it, including your own and the [Playlist Auths](/docs/resources/playlist-auth) assigned to it. The playlist can't be changed later. To use the layout for another playlist, [copy it](#copy-a-home-screen).
2. Choose the **Layout**:
   - **Default (user can change)**: the TV starts with your layout, and people can still rearrange it in **Navigation & Home**. Anyone who already arranged their own keeps it.
   - **Enforced (locked)**: the TV always uses your layout, and **Navigation & Home** is locked.
3. Arrange the **Sections**: drag them into order, and turn **Show in nav** and **Show on Home** on or off for each.

Home, Search, Continue Watching, Notifications, and Settings always stay where they are in the app, so they aren't listed.

## Add rows

Open a section and choose **Add row**. Each section keeps its built-in row (the usual Live TV, Movies, or Series row), which you can move but not remove. Rows move with their section.

| Section | Row you can add |
|---|---|
| **Live TV**, **Movies**, **Series** | One category from the playlist, under your own title. Dynamic Groups are listed too, since they show up as categories. |
| **Sports** | Games from the leagues you pick, from **Today** or **The next 3 days**, up to the number you set. |

A row can also have **Show from** and **Show until** dates. Only the month and day count, so the row shows between them every year, like December 1 to December 31. The dates can span New Year, like December 15 to January 5. A row with nothing in it is hidden.

**Show on Home** applies to a whole section: turn it off and none of the section's rows show on Home.

## On the TV

- **Navigation & Home** lists your rows under their section, each with its own **Home** switch, so people can turn rows off when the layout isn't enforced. **Reset to default** brings back your layout and every row.
- An enforced layout shows a lock and can't be changed.
- Changes reach an open app within a few seconds, and a device that's off or offline picks them up when it next connects.

## Copy a Home Screen

**Duplicate to another playlist** copies a Home Screen to another playlist. Each playlist has its own categories, so category rows only carry over when the other playlist has that category.

## Good to know

- A Playlist Auth gets the Home Screen of the playlist it's assigned to. Assign it to another playlist and it gets that playlist's Home Screen instead.
- A Playlist Alias is a playlist of its own, so it uses its own Home Screen, not the one of the playlist it's based on.
- Deleting a playlist deletes its Home Screen.
- Home Screens need **Enhanced output enabled**, under **Settings → General**, like the rest of M3U TV.
- Older versions of M3U TV ignore Home Screens and keep their own layout.
