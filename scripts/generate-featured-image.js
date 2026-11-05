#!/usr/bin/env node
/**
 * Generates a blog post's images from a few screenshots:
 *
 *   static/img/blog/<slug>/featured.jpg   1200x630, for `image:` in the post
 *   static/img/blog/<slug>/<shot>.jpg     each screenshot, sized for the web
 *
 * A post is set up in scripts/featured-images/<slug>/card.json, which holds the
 * featured image's text and one entry per screenshot:
 *
 *   name   the file name, without extension
 *   label  what to capture, shown on its placeholder until you have
 *   size   the placeholder's size, like "1920x1080"
 *   frame  tv, tablet, phone, or browser, the chrome around it on the card
 *   box    [left, top, width, height] on the 1200x630 card. Leave it out for
 *          a screenshot only the post uses.
 *   z      optional stacking order on the card
 *
 * To swap in a real screenshot, save it as
 * scripts/featured-images/<slug>/shots/<name>.png (or .jpg, .jpeg, .webp) and
 * run this again. Anything still missing gets a labelled placeholder, and the
 * script lists what's left. Screenshots aren't committed, only the images made
 * from them, so a later run with no shots/ folder keeps the images it finds.
 *
 * Usage:
 *   npm run generate-featured-image -- <slug>
 *   npm run generate-featured-image         (every post in featured-images/)
 *
 * Needs Google Chrome (or set $CHROME) and ImageMagick (brew install imagemagick).
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..');
const CARDS_DIR = path.join(__dirname, 'featured-images');
const TEMPLATE = path.join(CARDS_DIR, 'template.html');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOT_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
const PLACEHOLDER_MARK = 'm3ue-featured-image-placeholder';
const MAX_SHOT_SIZE = 1600;

const magick = (...args) => execFileSync('magick', args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

/** Renders the template with [data] to a PNG at [width]x[height]. */
function render(data, width, height, dest) {
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  // Rendered at 2x then scaled down, for crisper text. --allow-file-access-from-files
  // lets the file:// page load the local font and images.
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=2',
    `--window-size=${width},${height}`,
    '--virtual-time-budget=3000',
    `--screenshot=${dest}`,
    `file://${TEMPLATE}?data=${encodeURIComponent(encoded)}`,
  ], { stdio: 'ignore' });
}

function isPlaceholder(file) {
  return fs.existsSync(file) && magick('identify', '-format', '%c', file).includes(PLACEHOLDER_MARK);
}

/**
 * Writes [shot]'s web image and returns whether it's still a placeholder.
 */
function writeShot(shot, slug, shotsDir, outDir, tmp) {
  const out = path.join(outDir, `${shot.name}.jpg`);
  const source = SHOT_EXTENSIONS
    .map((extension) => path.join(shotsDir, `${shot.name}.${extension}`))
    .find((file) => fs.existsSync(file));

  if (source) {
    magick(source, '-resize', `${MAX_SHOT_SIZE}x${MAX_SHOT_SIZE}>`, '-strip', '-quality', '85', out);
    return false;
  }
  if (fs.existsSync(out) && !isPlaceholder(out)) {
    return false;
  }

  const [width, height] = shot.size.split('x').map(Number);
  const scale = Math.min(1, 1000 / Math.max(width, height));
  const png = path.join(tmp, `${shot.name}.png`);
  render({
    placeholder: { label: shot.label, file: `${path.basename(shotsDir)}/${shot.name}.png` },
  }, Math.round(width * scale), Math.round(height * scale), png);
  magick(png, '-resize', `${MAX_SHOT_SIZE}x${MAX_SHOT_SIZE}>`, '-strip', '-quality', '80', '-set', 'comment', PLACEHOLDER_MARK, out);
  return true;
}

function generate(slug) {
  const cardDir = path.join(CARDS_DIR, slug);
  const card = JSON.parse(fs.readFileSync(path.join(cardDir, 'card.json'), 'utf8'));
  const shotsDir = path.join(cardDir, 'shots');
  const outDir = path.join(DOCS_DIR, 'static', 'img', 'blog', slug);
  fs.mkdirSync(shotsDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'featured-image-'));
  try {
    const missing = card.shots.filter((shot) => writeShot(shot, slug, shotsDir, outDir, tmp));

    const png = path.join(tmp, 'featured.png');
    render({
      ...card,
      shots: card.shots
        .filter((shot) => shot.box)
        .map((shot) => ({ ...shot, src: `file://${path.join(outDir, `${shot.name}.jpg`)}` })),
    }, 1200, 630, png);
    const featured = path.join(outDir, 'featured.jpg');
    magick(png, '-resize', '1200x630!', '-strip', '-quality', '88', featured);

    console.log(`${path.relative(DOCS_DIR, featured)} (${Math.round(fs.statSync(featured).size / 1024)} KB)`);
    if (missing.length === 0) {
      console.log('  All screenshots are in place.');
    } else {
      console.log(`  ${missing.length} of ${card.shots.length} still placeholders. Save these in ${path.relative(DOCS_DIR, shotsDir)}/ and run this again:`);
      missing.forEach((shot) => console.log(`    ${shot.name}.png (${shot.size}): ${shot.label}`));
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at: ${CHROME}\nSet CHROME to the Chrome or Chromium binary.`);
  process.exit(1);
}

const requested = process.argv.slice(2);
const slugs = requested.length > 0
  ? requested
  : fs.readdirSync(CARDS_DIR).filter((entry) => fs.existsSync(path.join(CARDS_DIR, entry, 'card.json')));

slugs.forEach((slug) => {
  if (!fs.existsSync(path.join(CARDS_DIR, slug, 'card.json'))) {
    console.error(`No card.json in scripts/featured-images/${slug}/`);
    process.exit(1);
  }
  generate(slug);
});
