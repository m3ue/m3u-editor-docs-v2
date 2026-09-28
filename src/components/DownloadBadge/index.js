import React from 'react';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import downloads from '@site/static/data/downloads.json';
import MaterialIcon from '../MaterialIcon';
import styles from './styles.module.css';

export default function DownloadBadge() {
    const downloadsText = downloads.formatted || '100,000+';

    return (
        <a
            href="https://hub.docker.com/r/sparkison/m3u-editor"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadBadge}
            role="status"
            aria-live="polite"
        >
            <MaterialIcon name="download" size="1.15rem" className={styles.icon} />
            <span><strong>{downloadsText}</strong> Docker pulls</span>
        </a>
    );
}
