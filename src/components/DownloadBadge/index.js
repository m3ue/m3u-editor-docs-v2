import React, { useEffect, useState } from 'react';
import MaterialIcon from '../MaterialIcon';
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
            <MaterialIcon name="download" size="1.15rem" className={styles.icon} />
            <span><strong>{downloadsText}</strong> Docker pulls</span>
        </a>
    );
}
