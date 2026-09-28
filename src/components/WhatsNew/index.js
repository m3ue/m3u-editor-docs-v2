import React, { useEffect, useState } from 'react';
import MaterialIcon from '../MaterialIcon';
import styles from './styles.module.css';

const MAX_HIGHLIGHTS = 4;
const PR_URL = 'https://github.com/m3ue/m3u-editor/pull/';

/**
 * Latest stable release highlights, read from static/data/release.json which
 * scripts/fetch-static-data.js generates at build time. Renders nothing if the
 * data is missing so the homepage never shows a broken strip.
 */
export default function WhatsNew() {
  const [release, setRelease] = useState(null);

  useEffect(() => {
    fetch('/data/release.json')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then((data) => {
        if (data && data.tag) setRelease(data);
      })
      .catch(() => {});
  }, []);

  if (!release) {
    return null;
  }

  // Lead with new features, then fill any remaining slots with bug fixes
  const highlights = [
    ...release.features.map((item) => ({ ...item, kind: 'feature' })),
    ...release.fixes.map((item) => ({ ...item, kind: 'fix' })),
  ].slice(0, MAX_HIGHLIGHTS);

  const releasedOn = new Date(release.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const { features, fixes, maintenance } = release.counts;

  return (
    <section className="container">
      <div className={styles.strip}>
        <div className={styles.summary}>
          <span className={styles.eyebrow}>
            <MaterialIcon name="new_releases" filled size="1.1rem" />
            What's new
          </span>
          <h2 className={styles.version}>{release.tag}</h2>
          <span className={styles.date}>
            <MaterialIcon name="calendar_today" size="1rem" />
            Released {releasedOn}
          </span>
          <div className={styles.counts}>
            {features > 0 && <span className={styles.count}>{features} {features === 1 ? 'feature' : 'features'}</span>}
            {fixes > 0 && <span className={styles.count}>{fixes} {fixes === 1 ? 'fix' : 'fixes'}</span>}
            {maintenance > 0 && <span className={styles.count}>{maintenance} maintenance</span>}
          </div>
          <a className={styles.notesLink} href={release.url} target="_blank" rel="noopener noreferrer">
            Full release notes <MaterialIcon name="open_in_new" size="1rem" />
          </a>
        </div>
        <ul className={styles.highlights}>
          {highlights.map((item) => (
            <li key={`${item.kind}-${item.text}`} className={styles.highlight}>
              <span className={item.kind === 'feature' ? styles.featureIcon : styles.fixIcon}>
                <MaterialIcon name={item.kind === 'feature' ? 'auto_awesome' : 'bug_report'} size="1.15rem" />
              </span>
              <div>
                <span className={styles.kind}>
                  {item.kind === 'feature' ? 'New' : 'Fixed'}
                  {item.scope && <span className={styles.scope}>{item.scope}</span>}
                </span>
                <p className={styles.text}>
                  {item.text}
                  {item.pr && (
                    <>
                      {' '}
                      <a href={`${PR_URL}${item.pr}`} target="_blank" rel="noopener noreferrer" className={styles.pr}>
                        #{item.pr}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
