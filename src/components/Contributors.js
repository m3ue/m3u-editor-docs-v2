import React, { useState, useEffect } from 'react';
import styles from './Contributors.module.css';

const REPOS = [
    'sparkison/m3u-editor',
    'sparkison/m3u-proxy',
    'sparkison/m3u-editor-docs-v2'
];

export default function Contributors() {
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContributors();
    }, []);

    const fetchContributors = async () => {
        try {
            const allContributors = new Map();

            // Fetch contributors from all repos
            for (const repo of REPOS) {
                const response = await fetch(
                    `https://api.github.com/repos/${repo}/contributors?per_page=100`,
                    {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch contributors for ${repo}`);
                }

                const data = await response.json();

                // Merge contributors, filtering out bots
                data.forEach(contributor => {
                    // Skip bots (any login ending with [bot])
                    if (contributor.login.endsWith('[bot]')) {
                        return;
                    }

                    if (allContributors.has(contributor.login)) {
                        // Add contributions from this repo to existing contributor
                        const existing = allContributors.get(contributor.login);
                        existing.contributions += contributor.contributions;
                    } else {
                        // Add new contributor
                        allContributors.set(contributor.login, {
                            login: contributor.login,
                            avatar_url: contributor.avatar_url,
                            html_url: contributor.html_url,
                            contributions: contributor.contributions
                        });
                    }
                });
            }

            // Convert to array and sort by contributions
            const sortedContributors = Array.from(allContributors.values())
                .sort((a, b) => b.contributions - a.contributions);

            setContributors(sortedContributors);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching contributors:', err);
            setError(err.message);
            setLoading(false);
        }
    };

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

    return (
        <section className={styles.contributorsSection}>
            <div className="container">
                <h2 className={styles.heading}>Contributors</h2>
                <p className={styles.subtitle}>
                    Thank you to all the amazing people who have contributed to the M3U Editor project! 🙌
                </p>
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
                <p className={styles.footer}>
                    Contributors are fetched from the{' '}
                    <a href="https://github.com/sparkison/m3u-editor" target="_blank" rel="noopener noreferrer">
                        m3u-editor
                    </a>
                    ,{' '}
                    <a href="https://github.com/sparkison/m3u-proxy" target="_blank" rel="noopener noreferrer">
                        m3u-proxy
                    </a>
                    , and{' '}
                    <a href="https://github.com/sparkison/m3u-editor-docs-v2" target="_blank" rel="noopener noreferrer">
                        m3u-editor-docs-v2
                    </a>
                    {' '}repositories.
                </p>
            </div>
        </section>
    );
}
