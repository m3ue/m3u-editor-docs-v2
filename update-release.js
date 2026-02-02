#!/usr/bin/env node

/**
 * Script to update the latest release information in the ReleaseVersions component
 * Run this after publishing a new release to keep the docs site updated
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const REPO = 'm3ue/m3u-editor';
const VERSIONS_PATH = path.join(__dirname, 'src/components/ReleaseVersions/index.js');

function fetchAllReleases() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/releases?per_page=50`,
      method: 'GET',
      headers: {
        'User-Agent': 'M3U-Editor-Docs-Updater',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const releases = JSON.parse(data);
            resolve(releases);
          } catch (err) {
            reject(new Error('Failed to parse JSON response'));
          }
        } else {
          reject(new Error(`GitHub API returned ${res.statusCode}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

function categorizeReleases(releases) {
  // Choose the latest release for each category by published date
  let best = { production: null, development: null, experimental: null };

  for (const release of releases) {
    const tag = (release.tag_name || '').toLowerCase();
    const published = Date.parse(release.published_at || release.created_at || 0);

    const looksExperimental = tag.includes('exp') || tag.includes('experimental') || tag.includes('alpha');
    const looksDev = tag.includes('dev') || tag.includes('beta') || tag.includes('rc') || release.prerelease;
    const looksProduction = !release.prerelease && !looksDev && !looksExperimental;

    if (looksExperimental) {
      if (!best.experimental || published > Date.parse(best.experimental.published_at || best.experimental.created_at || 0)) {
        best.experimental = release;
      }
    } else if (looksDev) {
      if (!best.development || published > Date.parse(best.development.published_at || best.development.created_at || 0)) {
        best.development = release;
      }
    } else if (looksProduction) {
      if (!best.production || published > Date.parse(best.production.published_at || best.production.created_at || 0)) {
        best.production = release;
      }
    }
  }

  // As a fallback: if development wasn't found, pick the most recent prerelease
  if (!best.development) {
    const prereleases = releases.filter(r => r.prerelease);
    if (prereleases.length) {
      best.development = prereleases.reduce((a, b) => (Date.parse(b.published_at || b.created_at) > Date.parse(a.published_at || a.created_at) ? b : a));
    }
  }

  return best;
}

function updateVersionsComponent(categorized) {
  let content = fs.readFileSync(VERSIONS_PATH, 'utf8');

  function formatVersionForWrite(raw) {
    // If it looks numeric (starts with digit) prefix with v, else leave as-is (e.g., 'dev' or 'experimental')
    const stripped = raw.replace(/^v/, '');
    return /^[0-9]/.test(stripped) ? `v${stripped}` : stripped;
  }

  function replaceDownloadUrlForType(typeLabel, url) {
    const regex = new RegExp(`(type:\s*'${typeLabel}',[\s\S]*?downloadUrl:\s*')([^']*)(')`, 'm');
    if (regex.test(content)) {
      content = content.replace(regex, `$1${url}$3`);
      console.log(`✅ Set ${typeLabel} download URL to ${url}`);
    }
  }

  if (categorized.production) {
    const versionRaw = (categorized.production.tag_name || '').replace(/^v/, '');
    const version = formatVersionForWrite(versionRaw);
    const prodRegex = /version:\s*'[^']+',\s*\/\/\s*Production/;
    content = content.replace(prodRegex, `version: '${version}', // Production`);

    // Use release HTML url or zipball as download
    const prodUrl = categorized.production.html_url || categorized.production.zipball_url || `https://github.com/${REPO}/releases`;
    replaceDownloadUrlForType('Production', prodUrl);
    console.log(`✅ Updated Production to ${version}`);
  }

  if (categorized.development) {
    const versionRaw = (categorized.development.tag_name || 'dev').replace(/^v/, '');
    const version = formatVersionForWrite(versionRaw);
    const devRegex = /version:\s*'[^']+',\s*\/\/\s*Development/;
    content = content.replace(devRegex, `version: '${version}', // Development`);

    // If it's a branch fallback, point to branch archive
    let devUrl = `https://github.com/${REPO}/releases`;
    if (version === 'dev') {
      devUrl = `https://github.com/${REPO}/archive/refs/heads/dev.zip`;
    } else if (categorized.development.html_url) {
      devUrl = categorized.development.html_url;
    }
    replaceDownloadUrlForType('Development', devUrl);

    console.log(`✅ Updated Development to ${version}`);
  }

  if (categorized.experimental) {
    const versionRaw = (categorized.experimental.tag_name || 'experimental').replace(/^v/, '');
    const version = formatVersionForWrite(versionRaw);
    const expRegex = /version:\s*'[^']+',\s*\/\/\s*Experimental/;
    content = content.replace(expRegex, `version: '${version}', // Experimental`);

    let expUrl = `https://github.com/${REPO}/releases`;
    if (version === 'experimental') {
      expUrl = `https://github.com/${REPO}/archive/refs/heads/experimental.zip`;
    } else if (categorized.experimental.html_url) {
      expUrl = categorized.experimental.html_url;
    }
    replaceDownloadUrlForType('Experimental', expUrl);

    console.log(`✅ Updated Experimental to ${version}`);
  }

  fs.writeFileSync(VERSIONS_PATH, content, 'utf8');
}

async function fetchBranches() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/branches?per_page=100`,
      method: 'GET',
      headers: {
        'User-Agent': 'M3U-Editor-Docs-Updater',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const branches = JSON.parse(data);
            resolve(branches);
          } catch (err) {
            reject(new Error('Failed to parse branches JSON response'));
          }
        } else {
          reject(new Error(`GitHub API returned ${res.statusCode} for branches`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

// Fetch a file content from a specific branch using GitHub API (contents endpoint)
async function fetchFileFromRepo(filePath, ref) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(ref)}`,
      method: 'GET',
      headers: {
        'User-Agent': 'M3U-Editor-Docs-Updater',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const obj = JSON.parse(data);
            if (obj && obj.content) {
              const content = Buffer.from(obj.content, 'base64').toString('utf8');
              resolve(content);
            } else {
              reject(new Error('No content in file response'));
            }
          } catch (err) {
            reject(new Error('Failed to parse file JSON response'));
          }
        } else {
          reject(new Error(`GitHub API returned ${res.statusCode} for file ${filePath}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

function extractVersionFromConfig(content) {
  if (!content) return null;
  // Try several generic PHP style patterns
  const patterns = [
    /define\(\s*['\"]VERSION['\"]\s*,\s*['\"]([^'\"]+)['\"]\s*\)/i,
    /\$version\s*=\s*['\"]([^'\"]+)['\"]/i,
    /['\"]version['\"]\s*=>\s*['\"]([^'\"]+)['\"]/i,
    /\$app_version\s*=\s*['\"]([^'\"]+)['\"]/i
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

function extractVersionKey(content, key) {
  if (!content || !key) return null;
  // Try PHP array key pattern: 'key' => 'value' or "key" => "value"
  const regex = new RegExp(`["']${key}["']\\s*=>\\s*["']([^"']+)["']`, 'i');
  const m = content.match(regex);
  if (m && m[1]) return m[1];
  return null;
}

async function main() {
  try {
    console.log('🔄 Fetching releases from GitHub...');
    const releases = await fetchAllReleases();
    console.log(`📦 Found ${releases.length} releases`);

    // Debug: list recent tags to help diagnostics
    console.log('\n🔎 Recent releases:');
    releases.slice(0, 8).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.tag_name}  ${r.prerelease ? '(prerelease)' : ''}  published: ${r.published_at || r.created_at}`);
    });

    let categorized = categorizeReleases(releases);

    // If dev/experimental missing, fallback to branches 'dev' and 'experimental'
    if (!categorized.development || !categorized.experimental) {
      console.log('\n🔎 Checking branches for dev/experimental fallbacks...');
      const branches = await fetchBranches();
      const branchNames = branches.map(b => b.name.toLowerCase());
      if (!categorized.development && branchNames.includes('dev')) {
        const b = branches.find(b => b.name.toLowerCase() === 'dev');
        categorized.development = { tag_name: 'dev', published_at: (b.commit && b.commit.commit && b.commit.commit.author && b.commit.commit.author.date) || b.commit.sha };
        console.log('ℹ️  Found dev branch, using as Development fallback');
        // Try to read config/dev.php to extract a version string
        try {
          const content = await fetchFileFromRepo('config/dev.php', 'dev');
          const vKey = extractVersionKey(content, 'dev_version');
          const v = vKey || extractVersionFromConfig(content);
          if (v) {
            categorized.development.tag_name = v;
            console.log(`ℹ️  Extracted development version from config/dev.php: ${v}${vKey ? ' (from dev_version key)' : ''}`);
          }
        } catch (err) {
          console.log(`⚠️  Could not read config/dev.php from dev branch: ${err.message}`);
        }
      }
      if (!categorized.experimental && branchNames.includes('experimental')) {
        const b = branches.find(b => b.name.toLowerCase() === 'experimental');
        categorized.experimental = { tag_name: 'experimental', published_at: (b.commit && b.commit.commit && b.commit.commit.author && b.commit.commit.author.date) || b.commit.sha };
        console.log('ℹ️  Found experimental branch, using as Experimental fallback');
        // Try to read config/dev.php (or config/experimental.php) to extract a version
        const candidatePaths = ['config/dev.php', 'config/experimental.php', 'config/exp.php'];
        for (const p of candidatePaths) {
          try {
            const content = await fetchFileFromRepo(p, 'experimental');
            const vKey = extractVersionKey(content, 'experimental_version') || extractVersionKey(content, 'exp_version');
            const v = vKey || extractVersionFromConfig(content);
            if (v) {
              categorized.experimental.tag_name = v;
              console.log(`ℹ️  Extracted experimental version from ${p}: ${v}${vKey ? ' (from experimental_version key)' : ''}`);
              break;
            }
          } catch (err) {
            // ignore file-not-found or parse errors, try next
          }
        }
      }
    }

    console.log('\n📋 Identified versions:');
    console.log(`   Production:   ${categorized.production?.tag_name || 'Not found'}`);
    console.log(`   Development:  ${categorized.development?.tag_name || 'Not found'}`);
    console.log(`   Experimental: ${categorized.experimental?.tag_name || 'Not found'}\n`);

    // Compute total downloads across all releases' assets
    let totalDownloads = 0;
    for (const r of releases) {
      if (Array.isArray(r.assets)) {
        for (const a of r.assets) {
          totalDownloads += Number(a.download_count || 0);
        }
      }
    }

    // Write downloads to static JSON so the site can fetch it at runtime
    const downloadsOut = {
      downloads: totalDownloads,
      formatted: totalDownloads >= 1000 ? `${(totalDownloads / 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')},000+` : `${totalDownloads}`
    };
    const downloadsPath = path.join(__dirname, 'static', 'data');
    if (!fs.existsSync(downloadsPath)) fs.mkdirSync(downloadsPath, { recursive: true });
    fs.writeFileSync(path.join(downloadsPath, 'downloads.json'), JSON.stringify(downloadsOut, null, 2), 'utf8');
    console.log(`\n✅ Wrote total downloads (${totalDownloads}) to static/data/downloads.json`);

    updateVersionsComponent(categorized);
    console.log('\n🎉 Release information updated successfully!');
  } catch (error) {
    console.error('❌ Error updating release info:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}