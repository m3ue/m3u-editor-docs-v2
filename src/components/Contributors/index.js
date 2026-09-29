import React from 'react';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import contributorsData from '@site/static/data/contributors.json';
import GitHubMark from '../GitHubMark';
import MaterialIcon from '../MaterialIcon';
import styles from './styles.module.css';

// Contributors at or above this many contributions get a featured card
const FEATURED_MIN_CONTRIBUTIONS = 50;

const DEFAULT_SUBTITLE = 'Thank you to everyone who has helped build M3U Editor, the proxy, the TV app, and these docs.';

const REPOS = [
    { name: 'm3u-editor', url: 'https://github.com/m3ue/m3u-editor' },
    { name: 'm3u-proxy', url: 'https://github.com/m3ue/m3u-proxy' },
    { name: 'm3u-tv', url: 'https://github.com/m3ue/m3u-tv' },
    { name: 'm3u-editor-docs-v2', url: 'https://github.com/m3ue/m3u-editor-docs-v2' },
];

function contributionLabel(count) {
    return `${count.toLocaleString('en-US')} ${count === 1 ? 'contribution' : 'contributions'}`;
}

/**
 * Contributor credits. By default covers every repo in the project; pass
 * `repo` (a name from REPOS, e.g. "m3u-tv") to credit just that one, and
 * `featuredMin` to change who gets a large card instead of a chip.
 */
export default function Contributors({
    repo,
    subtitle = DEFAULT_SUBTITLE,
    featuredMin = FEATURED_MIN_CONTRIBUTIONS,
}) {
    const contributors = (repo ? contributorsData.repos?.[repo] : contributorsData.contributors) || [];
    const repos = repo ? REPOS.filter((r) => r.name === repo) : REPOS;
    // Issues for a single repo point at that repo; the whole project at the editor
    const issuesUrl = `${(repos[0] || REPOS[0]).url}/issues`;

    if (contributors.length === 0) {
        return null;
    }

    const featured = contributors.filter((c) => c.contributions >= featuredMin);
    const community = contributors.filter((c) => c.contributions < featuredMin);
    const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Community</span>
                    <h2 className={styles.title}>Built by contributors</h2>
                    <p className={styles.subtitle}>{subtitle}</p>
                    <div className={styles.stats}>
                        <span><MaterialIcon name="groups" /> {contributors.length} contributors</span>
                        <span><MaterialIcon name="commit" /> {totalContributions.toLocaleString('en-US')} contributions</span>
                        <span><MaterialIcon name="folder" /> {repos.length} {repos.length === 1 ? 'repository' : 'repositories'}</span>
                    </div>
                </div>

                {featured.length > 0 && (
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
                )}

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
                        <a href={issuesUrl} target="_blank" rel="noopener noreferrer" className={styles.joinPrimary}>
                            <MaterialIcon name="code" /> Browse open issues
                        </a>
                        <a href="https://github.com/m3ue/m3u-editor-docs-v2" target="_blank" rel="noopener noreferrer" className={styles.joinGhost}>
                            <MaterialIcon name="menu_book" /> Improve the docs
                        </a>
                    </div>
                </div>

                <p className={styles.footer}>
                    Counted across
                    {repos.map((r) => (
                        <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className={styles.repoChip}>
                            <GitHubMark /> {r.name}
                        </a>
                    ))}
                </p>
            </div>
        </section>
    );
}
