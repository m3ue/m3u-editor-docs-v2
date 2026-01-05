import React, { useEffect, useState } from 'react';
import styles from './DownloadBadge.module.css';

export default function DownloadBadge() {
  const [downloadsText, setDownloadsText] = useState('Loading...');

  useEffect(() => {
    // Fetch from shields.io JSON endpoint (no CORS issues)
    fetch('https://img.shields.io/docker/pulls/sparkison/m3u-editor.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then((data) => {
        if (data && data.value) {
          // shields.io returns the value already formatted (e.g., "178k")
          // If you want to show the exact number with "+", you can parse it
          setDownloadsText(`${data.value}+`);
        }
      })
      .catch(() => {
        // Fallback to hardcoded value (update periodically)
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
