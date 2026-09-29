import React from 'react';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import contributorsData from '@site/static/data/contributors.json';
import GitHubMark from '../GitHubMark';
import MaterialIcon from '../MaterialIcon';
import styles from './styles.module.css';

// Contributors at or above this many contributions get a featured card
const FEATURED_MIN_CONTRIBUTIONS = 50;

const REPOS = [
    { name: 'm3u-editor', url: 'https://github.com/m3ue/m3u-editor' },
    { name: 'm3u-proxy', url: 'https://github.com/m3ue/m3u-proxy' },
    { name: 'm3u-tv', url: 'https://github.com/m3ue/m3u-tv' },
    { name: 'm3u-editor-docs-v2', url: 'https://github.com/m3ue/m3u-editor-docs-v2' },
];

function contributionLabel(count) {
    return `${count.toLocaleString('en-US')} ${count === 1 ? 'contribution' : 'contributions'}`;
}

export default function Contributors() {
    const contributors = contributorsData.contributors || [];

    if (contributors.length === 0) {
        return null;
    }

    const featured = contributors.filter((c) => c.contributions >= FEATURED_MIN_CONTRIBUTIONS);
    const community = contributors.filter((c) => c.contributions < FEATURED_MIN_CONTRIBUTIONS);
    const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Community</span>
                    <h2 className={styles.title}>Built by contributors</h2>
                    <p className={styles.subtitle}>
                        Thank you to everyone who has helped build M3U Editor, the proxy, the TV app, and these docs.
                    </p>
                    <div className={styles.stats}>
                        <span><MaterialIcon name="groups" /> {contributors.length} contributors</span>
                        <span><MaterialIcon name="commit" /> {totalContributions.toLocaleString('en-US')} contributions</span>
                        <span><MaterialIcon name="folder" /> {REPOS.length} repositories</span>
                    </div>
                </div>

                <div className={styles.featuredGrid}>
                    {featured.map((contributor) => (
                        <a
                            key={contributor.login}
                            href={contributor.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.featuredCard}
                        >
                            <span className={styles.avatarRing}>
                                <img src={contributor.avatar_url} alt="" className={styles.featuredAvatar} loading="lazy" />
                            </span>
                            <span className={styles.featuredName}>{contributor.login}</span>
                            <span className={styles.featuredCount}>{contributionLabel(contributor.contributions)}</span>
                        </a>
                    ))}
                </div>

                {community.length > 0 && (
                    <ul className={styles.communityList}>
                        {community.map((contributor) => (
                            <li key={contributor.login}>
                                <a
                                    href={contributor.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.chip}
                                    title={`${contributor.login}: ${contributionLabel(contributor.contributions)}`}
                                >
                                    <img src={contributor.avatar_url} alt="" className={styles.chipAvatar} loading="lazy" />
                                    <span className={styles.chipName}>{contributor.login}</span>
                                    <span className={styles.chipCount}>{contributor.contributions}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                <div className={styles.join}>
                    <div className={styles.joinCopy}>
                        <MaterialIcon name="volunteer_activism" className={styles.joinIcon} />
                        <div>
                            <strong>Want to see your face here?</strong>
                            <span>Pick up an open issue, improve the docs, or send a fix. Every contribution counts.</span>
                        </div>
                    </div>
                    <div className={styles.joinLinks}>
                        <a href="https://github.com/m3ue/m3u-editor/issues" target="_blank" rel="noopener noreferrer" className={styles.joinPrimary}>
                            <MaterialIcon name="code" /> Browse open issues
                        </a>
                        <a href="https://github.com/m3ue/m3u-editor-docs-v2" target="_blank" rel="noopener noreferrer" className={styles.joinGhost}>
                            <MaterialIcon name="menu_book" /> Improve the docs
                        </a>
                    </div>
                </div>

                <p className={styles.footer}>
                    Counted across
                    {REPOS.map((repo) => (
                        <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer" className={styles.repoChip}>
                            <GitHubMark /> {repo.name}
                        </a>
                    ))}
                </p>
            </div>
        </section>
    );
}
