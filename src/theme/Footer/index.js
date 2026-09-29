import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useThemeConfig } from '@docusaurus/theme-common';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import release from '@site/static/data/release.json';
import tvRelease from '@site/static/data/tv-release.json';
import downloads from '@site/static/data/downloads.json';
import GitHubMark from '../../components/GitHubMark';
import MaterialIcon from '../../components/MaterialIcon';
import styles from './styles.module.css';

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/m3ue/m3u-editor', icon: <GitHubMark /> },
  { label: 'Discord', href: 'https://discord.gg/rS3abJ5dz7', icon: <MaterialIcon name="forum" /> },
  { label: 'Support on Ko-fi', href: 'https://ko-fi.com/sparkison', icon: <MaterialIcon name="favorite" filled /> },
];

function FooterLink({ item }) {
  const external = item.href && !isInternalUrl(item.href);
  return (
    <Link
      className={styles.link}
      {...(item.to ? { to: item.to } : { href: item.href })}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span>{item.label}</span>
      {external && <MaterialIcon name="north_east" className={styles.linkIcon} />}
    </Link>
  );
}

function StatusChips() {
  const chips = [
    release?.tag && { key: 'editor', icon: 'new_releases', label: `Editor ${release.tag}`, href: release.url },
    tvRelease?.tag && { key: 'tv', icon: 'tv', label: `TV ${tvRelease.tag}`, href: tvRelease.url },
    downloads?.formatted && {
      key: 'pulls',
      icon: 'download',
      label: `${downloads.formatted} pulls`,
      href: 'https://hub.docker.com/r/sparkison/m3u-editor',
    },
  ].filter(Boolean);

  return (
    <div className={styles.chips}>
      {chips.map((chip) => (
        <a key={chip.key} href={chip.href} target="_blank" rel="noopener noreferrer" className={styles.chip}>
          <MaterialIcon name={chip.icon} />
          {chip.label}
        </a>
      ))}
    </div>
  );
}

/**
 * Site footer, replacing the theme's default. Link columns and the copyright
 * still come from themeConfig.footer in docusaurus.config.js.
 */
export default function Footer() {
  const { footer } = useThemeConfig();
  const logo = useBaseUrl('/img/logo.svg');

  if (!footer) {
    return null;
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className={styles.footer}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={clsx('container', styles.inner)}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLink}>
              <img src={logo} alt="" className={styles.logo} />
              <span>M3U Suite</span>
            </Link>
            <p className={styles.tagline}>
              Self-hosted IPTV, end to end: an editor to manage it all, a proxy to stream it, and a native TV app to watch it.
            </p>
            <div className={styles.social}>
              {SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
            <StatusChips />
          </div>

          <nav className={styles.columns} aria-label="Footer">
            {(footer.links || []).map((column) => (
              <div key={column.title} className={styles.column}>
                <h3 className={styles.columnTitle}>{column.title}</h3>
                <ul className={styles.list}>
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          {footer.copyright && <p className={styles.copyright}>{footer.copyright}</p>}
          <button type="button" className={styles.toTop} onClick={scrollToTop}>
            <MaterialIcon name="arrow_upward" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
