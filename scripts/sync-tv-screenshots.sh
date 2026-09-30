#!/usr/bin/env bash
#
# Sync the M3U TV screenshots used by the /tv page.
#
# Converts PNGs from the m3u-tv repo's app-screenshots folder into WebP files
# in static/img/tv/, sized per device. Only new or changed screenshots are
# converted unless --force is passed. Changes are detected by content hash
# (kept in scripts/.tv-screenshots.sha1), not file dates, since copied or
# exported screenshots often keep their original, older timestamp.
#
# Usage:
#   scripts/sync-tv-screenshots.sh [--force] [source-dir]
#   npm run sync-tv-screenshots -- [--force] [source-dir]
#
# The source defaults to ../m3u-tv/flutter_client/screenshots/app-screenshots
# (the m3u-tv repo checked out next to this one), or $TV_SCREENSHOTS_DIR.
#
# File names decide the size: tv*.png, desktop*.png, tablet*.png and
# mobile*.png. To show a new file on the page, add it to DEVICE_GALLERIES in
# src/data/tvFeatures.js.

set -euo pipefail

DOCS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="$DOCS_DIR/static/img/tv"
GALLERY_DATA="$DOCS_DIR/src/data/tvFeatures.js"
MANIFEST="$DOCS_DIR/scripts/.tv-screenshots.sha1"

FORCE=0
SRC_DIR="${TV_SCREENSHOTS_DIR:-$DOCS_DIR/../m3u-tv/flutter_client/screenshots/app-screenshots}"

for arg in "$@"; do
    case "$arg" in
        --force | -f) FORCE=1 ;;
        --help | -h)
            sed -n '3,/^$/p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *) SRC_DIR="$arg" ;;
    esac
done

if ! command -v cwebp > /dev/null 2>&1; then
    echo "cwebp is not installed. Install it with: brew install webp" >&2
    exit 1
fi

if [ ! -d "$SRC_DIR" ]; then
    echo "Screenshot folder not found: $SRC_DIR" >&2
    echo "Pass the path as an argument or set TV_SCREENSHOTS_DIR." >&2
    exit 1
fi

mkdir -p "$DEST_DIR"
touch "$MANIFEST"
NEW_MANIFEST="$(mktemp)"
trap 'rm -f "$NEW_MANIFEST"' EXIT

converted=0
skipped=0
unused=()

shopt -s nullglob
for src in "$SRC_DIR"/*.png; do
    name="$(basename "$src" .png)"
    dest="$DEST_DIR/$name.webp"

    # Width per device, matching how large each one is shown on the page.
    # Desktop captures keep their transparent window shadow (alpha).
    case "$name" in
        tv*) width=1600; alpha=() ;;
        desktop*) width=1624; alpha=(-alpha_q 90) ;;
        tablet*) width=900; alpha=() ;;
        mobile*) width=620; alpha=() ;;
        *)
            echo "  ? $name.png skipped (name must start with tv, desktop, tablet or mobile)"
            continue
            ;;
    esac

    hash="$(shasum "$src" | cut -d' ' -f1)"
    echo "$hash  $name.png" >> "$NEW_MANIFEST"

    if [ "$FORCE" -eq 0 ] && [ -f "$dest" ] && grep -qx "$hash  $name.png" "$MANIFEST"; then
        skipped=$((skipped + 1))
        continue
    fi

    # ${alpha[@]+...} keeps an empty array safe under set -u on macOS bash 3.2
    cwebp -quiet -q 82 ${alpha[@]+"${alpha[@]}"} -resize "$width" 0 "$src" -o "$dest"
    size="$(du -k "$dest" | cut -f1)"
    echo "  ✓ $name.webp (${width}px wide, ${size} KB)"
    converted=$((converted + 1))

    if ! grep -q "/img/tv/$name.webp" "$GALLERY_DATA"; then
        unused+=("$name.webp")
    fi
done

sort -k2 "$NEW_MANIFEST" > "$MANIFEST"

echo "Converted $converted, unchanged $skipped."

if [ "${#unused[@]}" -gt 0 ]; then
    echo
    echo "Not shown on the page yet (add to DEVICE_GALLERIES in src/data/tvFeatures.js):"
    printf '  - %s\n' "${unused[@]}"
fi
