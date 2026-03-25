import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function DownloadBadge() {
    const [downloadsText, setDownloadsText] = useState('Loading...');

    useEffect(() => {
        fetch('/data/downloads.json')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to fetch');
                return r.json();
            })
            .then((data) => {
                if (data && data.formatted) {
                    setDownloadsText(data.formatted);
                }
            })
            .catch(() => {
                setDownloadsText('100,000+');
            });
    }, []);

    return (
        <a
            href="https://hub.docker.com/r/sparkison/m3u-editor"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadBadge}
            role="status"
            aria-live="polite"
        >
            <span className={styles.emoji} aria-hidden="true">🚀</span>
            {downloadsText} Downloads
        </a>
    );
}
