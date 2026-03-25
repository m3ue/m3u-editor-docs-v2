import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function Contributors() {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/data/contributors.json')
            .then((r) => {
                if (!r.ok) throw new Error('Failed to fetch contributors data');
                return r.json();
            })
            .then((data) => {
                setContributors(data.contributors || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error loading contributors:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className={styles.contributorsSection}>
                <div className="container">
                    <h2 className={styles.heading}>Contributors</h2>
                    <p className={styles.loading}>Loading contributors...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.contributorsSection}>
                <div className="container">
                    <h2 className={styles.heading}>Contributors</h2>
                    <p className={styles.error}>Unable to load contributors. Please check back later.</p>
                </div>
            </section>
        );
    }

    // Separate contributors by contribution count
    const majorContributors = contributors.filter(c => c.contributions >= 10);
    const minorContributors = contributors.filter(c => c.contributions < 10);

    return (
        <section className={styles.contributorsSection}>
            <div className="container">
                <h2 className={styles.heading}>Contributors</h2>
                <p className={styles.subtitle}>
                    Thank you to all the amazing people who have contributed to the M3U Editor project! 🙌
                </p>

                {/* Major Contributors */}
                {contributors.length > 0 && (
                    <div className={styles.contributorsGrid}>
                        {contributors.map((contributor) => (
                            <a
                                key={contributor.login}
                                href={contributor.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contributorCard}
                                title={`${contributor.login} - ${contributor.contributions} contributions`}
                            >
                                <img
                                    src={contributor.avatar_url}
                                    alt={contributor.login}
                                    className={styles.avatar}
                                    loading="lazy"
                                />
                                <div className={styles.contributorInfo}>
                                    <div className={styles.username}>{contributor.login}</div>
                                    <div className={styles.contributions}>
                                        {contributor.contributions} {contributor.contributions === 1 ? 'contribution' : 'contributions'}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
                <p className={styles.footer}>
                    Contributors are fetched from the{' '}
                    <a href="https://github.com/m3ue/m3u-editor" target="_blank" rel="noopener noreferrer">
                        m3u-editor
                    </a>
                    ,{' '}
                    <a href="https://github.com/m3ue/m3u-proxy" target="_blank" rel="noopener noreferrer">
                        m3u-proxy
                    </a>
                    , and{' '}
                    <a href="https://github.com/m3ue/m3u-editor-docs-v2" target="_blank" rel="noopener noreferrer">
                        m3u-editor-docs-v2
                    </a>
                    {' '}repositories.
                </p>
            </div>
        </section>
    );
}
