import React from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import GitHubMark from '../../components/GitHubMark';
import MaterialIcon from '../../components/MaterialIcon';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import tvRelease from '@site/static/data/tv-release.json';
import { DOWNLOADER_CODE, DOWNLOADER_STEPS, STORE_LINKS } from '../../data/tvFeatures';
import home from '../index.module.css';
import tv from '../tv.module.css';
import styles from './android.module.css';

const RELEASES_URL = 'https://github.com/m3ue/m3u-tv/releases/latest';
const PAGE_PATH = '/tv/android';
const SHARE_TITLE = 'Get M3U TV on Android, Google TV, and Fire TV';
const SHARE_IMAGE_ALT = 'M3U TV running on a TV, tablet, and phone';
const DESCRIPTION = 'Install M3U TV on Android phones, tablets, Android TV, Google TV, and Fire TV from Google Play, the Downloader app, or a direct APK.';

const GOOGLE_PLAY = STORE_LINKS.find((store) => store.name === 'Google Play');

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className={home.sectionHeader}>
      {eyebrow && <span className={home.eyebrow}>{eyebrow}</span>}
      <h2 className={home.sectionTitle}>{title}</h2>
      {subtitle && <p className={home.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
}

// The code once it is registered, otherwise this page's own address, which
// Downloader opens in its browser so the APK button below can be selected
function DownloaderCard({ pageUrl }) {
  return (
    <div className={styles.codeCard}>
      <div className={styles.codeHeader}>
        <MaterialIcon name="connected_tv" filled />
        Fire TV or Google TV
      </div>
      <p className={styles.codeLead}>Open the Downloader app and enter</p>
      {DOWNLOADER_CODE ? (
        <>
          <div className={styles.code} aria-label={`Downloader code ${DOWNLOADER_CODE}`}>
            {String(DOWNLOADER_CODE)}
          </div>
          <p className={styles.codeAlt}>
            or the address <strong>{pageUrl}</strong>
          </p>
        </>
      ) : (
        <div className={clsx(styles.code, styles.codeUrl)}>{pageUrl}</div>
      )}
      <a href="#downloader" className={styles.codeLink}>
        How to use Downloader <MaterialIcon name="arrow_forward" />
      </a>
    </div>
  );
}

export default function TvAndroidPage() {
  const socialCard = useBaseUrl('/img/tv-social-card.jpg', { absolute: true });
  const pageUrl = useBaseUrl(PAGE_PATH, { absolute: true }).replace(/^https?:\/\//, '');
  const apk = tvRelease?.assets?.['android.apk'];

  return (
    <Layout title="M3U TV for Android" description={DESCRIPTION}>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="M3U Editor" />
        <meta property="og:title" content={SHARE_TITLE} />
        <meta property="og:image" content={socialCard} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={SHARE_IMAGE_ALT} />
        <meta name="twitter:title" content={SHARE_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:image:alt" content={SHARE_IMAGE_ALT} />
      </Head>

      <header className={home.hero} data-navbar-over-hero>
        <div className={home.gridBackground} />
        <div className={clsx('container', home.heroInner, styles.heroInner)}>
          <div>
            <div className={home.heroBrand}>
              <img src={useBaseUrl('/img/tv-logo.svg')} alt="" className={clsx(home.logo, tv.tvLogo)} />
              {tvRelease?.tag && (
                <a className={tv.versionPill} href={tvRelease.url} target="_blank" rel="noopener noreferrer">
                  <MaterialIcon name="new_releases" filled />
                  M3U TV {tvRelease.tag}
                </a>
              )}
            </div>
            <h1 className={home.heroTitle}>
              M3U TV<br />
              <span className={clsx(home.heroTitleAccent, tv.tvAccent)}>for Android.</span>
            </h1>
            <p className={home.heroSubtitle}>
              One free app for Android phones, tablets, Android TV, Google TV, and Fire TV.
            </p>
            <div className={home.heroButtons}>
              <a className={clsx('button button--lg', home.buttonPrimary)} href={apk?.url || RELEASES_URL} rel="noopener noreferrer">
                <MaterialIcon name="download" />
                <span>Download APK{apk?.size ? ` (${Math.round(apk.size / 1e6)} MB)` : ''}</span>
              </a>
              {GOOGLE_PLAY && (
                <a href={GOOGLE_PLAY.href} target="_blank" rel="noopener noreferrer" className={tv.storeBadge}>
                  <img src={GOOGLE_PLAY.badge} alt="Get it on Google Play" className={styles.playBadge} />
                </a>
              )}
            </div>
          </div>
          <DownloaderCard pageUrl={pageUrl} />
        </div>
      </header>

      <main>
        <section id="downloader" className={clsx('container', home.section, styles.anchor)}>
          <SectionHeader
            eyebrow="Fire TV & Google TV"
            title="Install with Downloader"
            subtitle="Fire TV has no Google Play, so the quickest way onto it is the free Downloader app. It works on Google TV and Android TV boxes too."
          />
          <ol className={clsx(tv.steps, styles.steps)}>
            {DOWNLOADER_STEPS.map((step, index) => (
              <li key={step.title} className={tv.step}>
                <span className={tv.stepNumber}>{index + 1}</span>
                <MaterialIcon name={step.icon} className={tv.stepIcon} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={clsx('container', home.section, tv.downloadSection)}>
          <SectionHeader eyebrow="Other ways" title="Phones, tablets, and other devices" />
          <div className={styles.otherGrid}>
            {GOOGLE_PLAY && (
              <a href={GOOGLE_PLAY.href} target="_blank" rel="noopener noreferrer" className={tv.storeCard}>
                <img src={GOOGLE_PLAY.badge} alt="Google Play" />
                <span>{GOOGLE_PLAY.note}. Updates install automatically.</span>
              </a>
            )}
            <a href={apk?.url || RELEASES_URL} className={tv.directCard} rel="noopener noreferrer">
              <span className={tv.directIcon}>
                <GitHubMark />
              </span>
              <span className={tv.directText}>
                <strong>Direct APK</strong>
                <span>
                  {tvRelease?.tag ? `${tvRelease.tag} from GitHub` : 'Latest release from GitHub'}
                  {apk?.size ? ` · ${Math.round(apk.size / 1e6)} MB` : ''}
                </span>
              </span>
              <MaterialIcon name="download" className={tv.directArrow} />
            </a>
          </div>
          <p className={tv.downloadNote}>
            <MaterialIcon name="dns" />
            <span>
              M3U TV needs an M3U Editor server with <strong>Enhanced output</strong> enabled
              (Settings, General, on by default). Looking for iOS, Apple TV, Windows, macOS, or
              Linux? See <Link to="/tv#download">all downloads</Link>.
            </span>
          </p>
        </section>
      </main>
    </Layout>
  );
}
