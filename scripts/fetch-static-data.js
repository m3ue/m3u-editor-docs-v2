#!/usr/bin/env node

/**
 * Fetch static data at build time to avoid runtime API rate limits.
 * Writes results to static/data/ so they are served as static assets.
 *
 * Data fetched:
 *  - Docker Hub pulls (via shields.io) → static/data/downloads.json
 *  - GitHub contributors across all repos  → static/data/contributors.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'static', 'data');

const REPOS = [
    'm3ue/m3u-editor',
    'm3ue/m3u-proxy',
    'm3ue/m3u-editor-docs-v2',
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
 * Fetch Docker Hub pull count and write to static/data/downloads.json
 */
async function fetchDownloads() {
    const data = await fetchJson(
        'https://img.shields.io/docker/pulls/sparkison/m3u-editor.json'
    );
    const formatted = data.value || '0';
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

(async () => {
    console.log('Fetching static data...');
    fs.mkdirSync(DATA_DIR, { recursive: true });

    const results = await Promise.allSettled([fetchDownloads(), fetchContributors()]);

    results.forEach((r) => {
        if (r.status === 'rejected') {
            console.warn(`  ⚠ Warning: ${r.reason.message}`);
        }
    });

    console.log('Static data fetch complete.');
})();
