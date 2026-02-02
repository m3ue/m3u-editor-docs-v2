import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const RELEASE_VERSIONS_TEMPLATE = [
  {
    type: 'Production',
    description: 'Stable, production-ready release with all tested features',
    status: 'stable',
    downloadUrl: 'https://github.com/m3ue/m3u-editor/tree/master',
    color: 'var(--ifm-color-primary)',
    configUrl: 'https://raw.githubusercontent.com/m3ue/m3u-editor/refs/heads/master/config/dev.php',
    versionField: 'version'
  },
  {
    type: 'Development',
    description: 'Latest development build with new features and improvements',
    status: 'beta',
    downloadUrl: 'https://github.com/m3ue/m3u-editor/tree/dev',
    color: '#fbbf24',
    configUrl: 'https://raw.githubusercontent.com/m3ue/m3u-editor/refs/heads/dev/config/dev.php',
    versionField: 'dev_version'
  },
  {
    type: 'Experimental',
    description: 'Cutting-edge experimental features (use with caution) -- There be dragons!',
    status: 'experimental',
    downloadUrl: 'https://github.com/m3ue/m3u-editor/tree/experimental',
    color: '#f87171',
    configUrl: 'https://raw.githubusercontent.com/m3ue/m3u-editor/refs/heads/experimental/config/dev.php',
    versionField: 'experimental_version'
  }
];

export default function ReleaseVersions() {
  const [versions, setVersions] = useState(
    RELEASE_VERSIONS_TEMPLATE.map(v => ({ ...v, version: 'Loading...' }))
  );

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const updatedVersions = await Promise.all(
          RELEASE_VERSIONS_TEMPLATE.map(async (release) => {
            try {
              const response = await fetch(release.configUrl);
              const text = await response.text();
              const regex = new RegExp(`'${release.versionField}'\\s*=>\\s*'([^']+)'`);
              const match = text.match(regex);
              const version = match ? `v${match[1]}` : 'N/A';
              return { ...release, version };
            } catch (error) {
              console.error(`Failed to fetch ${release.type} version:`, error);
              return { ...release, version: 'Error' };
            }
          })
        );
        setVersions(updatedVersions);
      } catch (error) {
        console.error('Failed to fetch versions:', error);
      }
    };

    fetchVersions();
  }, []);

  return (
    <div className={styles.versionsContainer}>
      <h2>Latest Releases</h2>
      <div className={styles.versionsGrid}>
        {versions.map((release) => (
          <div key={release.type} className={styles.versionCard}>
            <div className={styles.versionHeader}>
              <h3 style={{ color: release.color }}>{release.type}</h3>
              <span className={`${styles.status} ${styles[release.status]}`}>
                {release.status}
              </span>
            </div>
            <div className={styles.versionNumber}>
              {release.version}
            </div>
            <p className={styles.description}>
              {release.description}
            </p>
            <a
              href={release.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadLink}
            >
              View Branch →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}