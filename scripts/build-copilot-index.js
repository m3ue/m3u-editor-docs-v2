#!/usr/bin/env node

/**
 * Build the documentation index used by the m3u-editor AI Copilot.
 *
 * Walks docs/**\/*.md(x), strips MDX/JSX noise, splits each page into
 * sections by heading, and writes static/data/copilot-docs.json. That file is
 * served at <site>/data/copilot-docs.json, where the editor's SearchDocsTool
 * downloads it. Because the URLs are derived from the files on disk, the
 * Copilot can never point at a page that does not exist.
 *
 * Runs automatically before `npm run build` / `npm start` (see package.json).
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT = path.join(__dirname, '..', 'static', 'data', 'copilot-docs.json');
const SITE_URL = 'https://m3ue.sparkison.dev';
const ROUTE_BASE = '/docs';

// Bump when the JSON shape changes in a way the editor must know about.
const SCHEMA_VERSION = 1;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

/** Minimal frontmatter reader (flat keys plus simple "- item" lists). */
function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };

  const data = {};
  let listKey = null;

  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      data[listKey].push(unquote(item[1]));
      continue;
    }
    const pair = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!pair) continue;
    if (pair[2] === '') {
      listKey = pair[1];
      data[listKey] = [];
    } else {
      listKey = null;
      data[pair[1]] = unquote(pair[2]);
    }
  }

  return { data, body: source.slice(match[0].length) };
}

function unquote(value) {
  return value.trim().replace(/^(['"])(.*)\1$/, '$2');
}

/** Same algorithm Docusaurus uses for heading anchors (github-slugger style). */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .replace(/\s/g, '-');
}

function cleanInline(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> label
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ') // inline JSX / HTML tags
    .replace(/\{#[\w-]+\}/g, '') // explicit heading ids
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Split an MDX body into sections. Code fences are preserved verbatim since
 * config snippets and env vars are often the answer.
 */
function toSections(body, pageTitle) {
  const lines = body.split(/\r?\n/);
  const sections = [];
  let current = { heading: pageTitle, anchor: '', lines: [] };
  let inFence = false;
  let inEsmBlock = false;

  const flush = () => {
    const text = current.lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (text) sections.push({ heading: current.heading, anchor: current.anchor, text });
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, '');

    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      current.lines.push(line);
      continue;
    }
    if (inFence) {
      current.lines.push(line);
      continue;
    }

    // MDX import/export statements (possibly multi-line)
    if (inEsmBlock) {
      if (/[;}]\s*$/.test(line) || /from\s+['"].*['"];?\s*$/.test(line)) inEsmBlock = false;
      continue;
    }
    if (/^(import|export)\s/.test(line)) {
      if (!/from\s+['"].*['"];?\s*$/.test(line) && !/;\s*$/.test(line)) inEsmBlock = true;
      continue;
    }

    // Admonition fences (:::tip) keep their content, drop the markers
    if (/^:::/.test(line)) {
      const label = line.match(/^:::(\w+)/);
      if (label) current.lines.push(`${label[1].toUpperCase()}:`);
      continue;
    }

    // Tab labels carry meaning (Discord / Slack / Telegram), so surface them
    const tab = line.match(/<TabItem[^>]*\blabel=["']([^"']+)["']/);
    if (tab) {
      current.lines.push(`**${tab[1]}**`);
      continue;
    }

    // Self-contained JSX lines (components, wrappers) carry no docs text
    if (/^\s*<\/?[A-Z][\w.]*(\s[^>]*)?\/?>\s*$/.test(line)) continue;
    if (/^\s*<!--.*-->\s*$/.test(line)) continue;

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const explicitId = heading[2].match(/\{#([\w-]+)\}/);
      const title = cleanInline(heading[2]);

      // The H1 repeats the page title; it only starts the first section.
      if (level === 1) {
        current.heading = title || pageTitle;
        continue;
      }

      // Merge H3/H4 into their parent H2 so sections stay answer-sized,
      // but keep the sub-heading in the text for context.
      if (level >= 3) {
        current.lines.push(`${'#'.repeat(level)} ${title}`);
        continue;
      }

      flush();
      current = {
        heading: title,
        anchor: explicitId ? explicitId[1] : slugify(title),
        lines: [],
      };
      continue;
    }

    current.lines.push(cleanInline(line) === '' ? '' : cleanInlinePreserveCode(line));
  }

  flush();
  return sections;
}

/** Strip links/images/tags but keep list markers, table pipes, and inline code. */
function cleanInlinePreserveCode(line) {
  const parts = line.split(/(`[^`]*`)/);
  return parts
    .map((part, index) => (index % 2 === 1 ? part : cleanInlineKeepSpacing(part)))
    .join('');
}

function cleanInlineKeepSpacing(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/\{#[\w-]+\}/g, '');
}

function buildPage(file) {
  const relative = path.relative(DOCS_DIR, file).split(path.sep).join('/');
  const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'));

  const withoutExt = relative.replace(/\.mdx?$/, '');
  const slug = data.slug
    ? data.slug.replace(/^\//, '')
    : withoutExt.replace(/\/index$/, '').replace(/^index$/, '');
  const title = data.title || (body.match(/^#\s+(.*)$/m) || [])[1] || path.basename(withoutExt);

  return {
    path: withoutExt,
    url: `${SITE_URL}${ROUTE_BASE}/${slug}`.replace(/\/$/, ''),
    title: cleanInline(title),
    description: data.description || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    sections: toSections(body, cleanInline(title)),
  };
}

function main() {
  const pages = walk(DOCS_DIR)
    .sort()
    .map(buildPage)
    .filter((page) => page.sections.length > 0);

  const index = {
    schema: SCHEMA_VERSION,
    generated_at: new Date().toISOString(),
    site_url: SITE_URL,
    pages,
  };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(index));

  const kb = (fs.statSync(OUTPUT).size / 1024).toFixed(0);
  const sectionCount = pages.reduce((sum, page) => sum + page.sections.length, 0);
  console.log(`Copilot docs index: ${pages.length} pages, ${sectionCount} sections, ${kb} KB -> ${path.relative(process.cwd(), OUTPUT)}`);
}

main();
