#!/usr/bin/env bash
#
# Regenerate the social share cards (1200x630 JPEG):
#
#   static/img/social-card.jpg     M3U Editor (site default, docusaurus.config.js)
#   static/img/tv-social-card.jpg  M3U TV (/tv page)
#
# Both are rendered from scripts/social-cards/card.html with headless Chrome,
# using the screenshots already in static/img/screenshots and static/img/tv.
# Update those first (copy the editor screenshots in, or run
# sync-tv-screenshots), then run this.
#
# Usage:
#   scripts/generate-social-cards.sh
#   npm run generate-social-cards
#
# Needs Google Chrome (or set $CHROME) and ImageMagick (brew install imagemagick).

set -euo pipefail

DOCS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE="$DOCS_DIR/scripts/social-cards/card.html"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

if [ ! -x "$CHROME" ]; then
    echo "Chrome not found at: $CHROME" >&2
    echo "Set CHROME to the Chrome or Chromium binary." >&2
    exit 1
fi

if ! command -v magick > /dev/null 2>&1; then
    echo "ImageMagick is not installed. Install it with: brew install imagemagick" >&2
    exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

render() {
    local card="$1" dest="$2"
    # Rendered at 2x, then scaled down, for crisper text and screenshots.
    # --allow-file-access-from-files lets the file:// page load the local font.
    "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
        --allow-file-access-from-files \
        --force-device-scale-factor=2 \
        --window-size=1200,630 \
        --virtual-time-budget=3000 \
        --screenshot="$TMP/$card.png" \
        "file://$TEMPLATE?card=$card" > /dev/null 2>&1
    magick "$TMP/$card.png" -resize 1200x630! -strip -quality 88 "$dest"
    echo "  ✓ ${dest#"$DOCS_DIR"/} ($(du -k "$dest" | cut -f1) KB)"
}

render editor "$DOCS_DIR/static/img/social-card.jpg"
render tv "$DOCS_DIR/static/img/tv-social-card.jpg"
