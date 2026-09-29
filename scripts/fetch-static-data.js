#!/usr/bin/env node

/**
 * Fetch static data at build time to avoid runtime API rate limits.
 * Writes results to static/data/ so they are served as static assets.
 *
 * Data fetched:
 *  - Docker Hub pulls (shields.io as fallback) → static/data/downloads.json
 *  - GitHub contributors across all repos  → static/data/contributors.json
 *  - Latest stable m3u-editor release notes → static/data/release.json
 *  - Latest stable m3u-tv release downloads → static/data/tv-release.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'static', 'data');

const REPOS = [
    'm3ue/m3u-editor',
    'm3ue/m3u-proxy',
    'm3ue/m3u-editor-docs-v2',
    'm3ue/m3u-tv',
];

/**
 * Perform a GET request and resolve with the parsed JSON body.
 */
function fetchJson(url, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = { headers: { 'User-Agent': 'docusaurus-prebuild', ...headers } };
        https.get(url, options, (res) => {
            let raw = '';
            res.on('data', (chunk) => { raw += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(raw));
                    } catch (e) {
                        reject(new Error(`JSON parse error for ${url}: ${e.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                }
            });
        }).on('error', reject);
    });
}

/**
 * Format a pull count the way shields.io does: 673630 -> "673k", 1234567 -> "1.2M".
 */
function formatCount(count) {
    if (count >= 1e6) return `${(count / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
    if (count >= 1e3) return `${Math.floor(count / 1e3)}k`;
    return String(count);
}

/**
 * Fetch the Docker Hub pull count and write it to static/data/downloads.json.
 * Reads Docker Hub directly, falling back to shields.io. shields.io answers
 * HTTP 200 with a message such as "rate limited by upstream service" in place
 * of the number when Docker Hub throttles it, so any value that is not a count
 * is rejected. On failure the file is left as is, keeping the last good value.
 */
async function fetchDownloads() {
    let formatted = null;

    try {
        const hub = await fetchJson('https://hub.docker.com/v2/repositories/sparkison/m3u-editor/');
        if (Number.isFinite(hub.pull_count) && hub.pull_count > 0) {
            formatted = formatCount(hub.pull_count);
        }
    } catch (e) {
        console.warn(`  ⚠ Docker Hub pull count unavailable (${e.message}), trying shields.io`);
    }

    if (!formatted) {
        const shields = await fetchJson('https://img.shields.io/docker/pulls/sparkison/m3u-editor.json');
        if (/^\d+(\.\d+)?[kMB]?$/.test(shields.value || '')) {
            formatted = shields.value;
        }
    }

    if (!formatted) {
        throw new Error('No valid Docker pull count, keeping the previous downloads.json');
    }

    const result = { formatted: `${formatted}+`, fetchedAt: new Date().toISOString() };
    fs.writeFileSync(
        path.join(DATA_DIR, 'downloads.json'),
        JSON.stringify(result, null, 2)
    );
    console.log(`  ✓ Downloads cached: ${result.formatted}`);
}

/**
 * Fetch contributors from all repos and write to static/data/contributors.json
 */
async function fetchContributors() {
    const allContributors = new Map();

    for (const repo of REPOS) {
        console.log(`  → Fetching contributors for ${repo}...`);
        const data = await fetchJson(
            `https://api.github.com/repos/${repo}/contributors?per_page=100`,
            { Accept: 'application/vnd.github.v3+json' }
        );

        data.forEach((contributor) => {
            if (contributor.login.endsWith('[bot]') || contributor.login === 'Copilot') {
                return;
            }
            if (allContributors.has(contributor.login)) {
                allContributors.get(contributor.login).contributions += contributor.contributions;
            } else {
                allContributors.set(contributor.login, {
                    login: contributor.login,
                    avatar_url: contributor.avatar_url,
                    html_url: contributor.html_url,
                    contributions: contributor.contributions,
                });
            }
        });
    }

    const sorted = Array.from(allContributors.values())
        .sort((a, b) => b.contributions - a.contributions);

    const result = { contributors: sorted, fetchedAt: new Date().toISOString() };
    fs.writeFileSync(
        path.join(DATA_DIR, 'contributors.json'),
        JSON.stringify(result, null, 2)
    );
    console.log(`  ✓ Contributors cached: ${sorted.length} unique contributors`);
}

/**
 * Parse one "### Heading" section of a release body into highlight items.
 * Lines look like: "- feat(emby): publish dynamic groups (#1535) (`0919fd43`)"
 */
function parseReleaseSection(body, heading) {
    const match = body.match(new RegExp(`###\\s*${heading}\\s*\\n([\\s\\S]*?)(?=\\n#{2,3}\\s|\\n---|\\n\\*\\*Full Changelog|$)`, 'i'));
    if (!match) return [];

    return match[1]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('- '))
        .map((line) => {
            let text = line.slice(2).replace(/\s*\(`[0-9a-f]{7,40}`\)\s*$/i, '');
            const pr = (text.match(/\s*\(#(\d+)\)\s*$/) || [])[1] || null;
            text = text.replace(/\s*\(#\d+\)\s*$/, '');
            const conventional = text.match(/^[a-z]+(?:\(([^)]+)\))?!?:\s*/i);
            const scope = conventional && conventional[1] ? conventional[1] : null;
            if (conventional) text = text.slice(conventional[0].length);
            text = text.charAt(0).toUpperCase() + text.slice(1);
            return { text, scope, pr: pr ? Number(pr) : null };
        });
}

/**
 * Fetch the latest stable m3u-editor release and write its highlights to
 * static/data/release.json for the homepage "What's new" strip.
 */
async function fetchLatestRelease() {
    const release = await fetchJson(
        'https://api.github.com/repos/m3ue/m3u-editor/releases/latest',
        { Accept: 'application/vnd.github.v3+json' }
    );
    const body = (release.body || '').replace(/\r\n/g, '\n');
    const features = parseReleaseSection(body, 'Features');
    const fixes = parseReleaseSection(body, 'Bug Fixes');
    const maintenance = parseReleaseSection(body, 'Maintenance');

    const result = {
        tag: release.tag_name,
        url: release.html_url,
        publishedAt: release.published_at,
        features,
        fixes,
        counts: { features: features.length, fixes: fixes.length, maintenance: maintenance.length },
        fetchedAt: new Date().toISOString(),
    };
    fs.writeFileSync(
        path.join(DATA_DIR, 'release.json'),
        JSON.stringify(result, null, 2)
    );
    console.log(`  ✓ Release cached: ${result.tag} (${features.length} features, ${fixes.length} fixes)`);
}

/**
 * Fetch the latest stable m3u-tv release and write its version plus direct
 * download links to static/data/tv-release.json for the /tv page. Assets are
 * named m3u-tv-v<version>-<platform>.<ext>, so they are keyed by the part
 * after the version (e.g. "android.apk", "windows-setup.exe").
 */
async function fetchLatestTvRelease() {
    const release = await fetchJson(
        'https://api.github.com/repos/m3ue/m3u-tv/releases/latest',
        { Accept: 'application/vnd.github.v3+json' }
    );
    const prefix = `m3u-tv-${release.tag_name}-`;
    const assets = {};
    (release.assets || [])
        .filter((asset) => asset.name.startsWith(prefix) && !asset.name.endsWith('.sha256'))
        .forEach((asset) => {
            assets[asset.name.slice(prefix.length)] = {
                url: asset.browser_download_url,
                size: asset.size,
            };
        });

    const result = {
        tag: release.tag_name,
        url: release.html_url,
        publishedAt: release.published_at,
        assets,
        fetchedAt: new Date().toISOString(),
    };
    fs.writeFileSync(
        path.join(DATA_DIR, 'tv-release.json'),
        JSON.stringify(result, null, 2)
    );
    console.log(`  ✓ TV release cached: ${result.tag} (${Object.keys(assets).length} downloads)`);
}

(async () => {
    console.log('Fetching static data...');
    fs.mkdirSync(DATA_DIR, { recursive: true });

    const results = await Promise.allSettled([
        fetchDownloads(),
        fetchContributors(),
        fetchLatestRelease(),
        fetchLatestTvRelease(),
    ]);

    results.forEach((r) => {
        if (r.status === 'rejected') {
            console.warn(`  ⚠ Warning: ${r.reason.message}`);
        }
    });

    console.log('Static data fetch complete.');
})();
