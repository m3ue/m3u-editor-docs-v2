import React from 'react';
import styles from './styles.module.css';

// Static release data - update this when you publish new releases
const LATEST_RELEASE = {
  tag_name: 'v0.8.19',
  published_at: '2024-12-15T10:30:00Z',
  html_url: 'https://github.com/m3ue/m3u-editor/releases/latest',
  body: `## What's New

### ✨ New Features
- Enhanced playlist management with improved filtering
- New API endpoints for better integration
- Improved EPG data handling

### 🐛 Bug Fixes
- Fixed channel sorting issues
- Resolved memory leaks in long-running processes
- Improved error handling for network timeouts

### 📈 Performance
- 40% faster playlist processing
- Reduced memory usage for large playlists
- Optimized database queries`
};

export default function GitHubRelease({ repo = 'm3ue/m3u-editor' }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const release = LATEST_RELEASE;

  return (
    <div className={styles.releaseCard}>
      <h3>Latest Release</h3>
      <div className={styles.releaseInfo}>
        <div className={styles.version}>
          <strong>{release.tag_name}</strong>
        </div>
        <div className={styles.date}>
          Released {formatDate(release.published_at)}
        </div>
        {release.body && (
          <div className={styles.description}>
            {release.body.split('\n').slice(0, 6).join('\n')}
            {release.body.split('\n').length > 6 && '...'}
          </div>
        )}
        <div className={styles.links}>
          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}