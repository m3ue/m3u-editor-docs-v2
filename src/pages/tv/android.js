import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import GitHubMark from '../../components/GitHubMark';
import MaterialIcon from '../../components/MaterialIcon';
import {
  HeroCard,
  ReleaseChannels,
  SectionHeader,
  ShareMeta,
  StepList,
  platformStyles as styles,
} from '../../components/TvPlatform';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import tvRelease from '@site/static/data/tv-release.json';
import {
  DOWNLOADER_CODE,
  DOWNLOADER_STEPS,
  PLAY_TESTING_STEPS,
  PLAY_TESTING_URL,
  STORE_LINKS,
} from '../../data/tvFeatures';
import home from '../index.module.css';
import tv from '../tv.module.css';

const RELEASES_URL = 'https://github.com/m3ue/m3u-tv/releases/latest';
const PAGE_PATH = '/tv/android';
const SHARE_TITLE = 'Get M3U TV on Android, Google TV, and Fire TV';
const SHARE_IMAGE_ALT = 'M3U TV on a TV, tablet, and phone, with the Downloader code for Fire TV';
const DESCRIPTION = 'Install M3U TV on Android phones, tablets, Android TV, Google TV, and Fire TV from Google Play, the Google Play beta, the Downloader app, or a direct APK.';

const GOOGLE_PLAY = STORE_LINKS.find((store) => store.name === 'Google Play');

// The code once it is registered, otherwise this page's own address, which
// Downloader opens in its browser so the APK button below can be selected
function DownloaderCard({ pageUrl }) {
  return (
    <HeroCard
      icon="connected_tv"
      label="Fire TV or Google TV"
      lead="Open the Downloader app and enter"
      footer={
        <div className={styles.heroCardLinks}>
          <a href="#downloader" className={styles.heroCardLink}>
            How to use Downloader <MaterialIcon name="arrow_forward" />
          </a>
        </div>
      }
    >
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
    </HeroCard>
  );
}

export default function TvAndroidPage() {
  const pageUrl = useBaseUrl(PAGE_PATH, { absolute: true }).replace(/^https?:\/\//, '');
  const apk = tvRelease?.assets?.['android.apk'];
  const apkSize = apk?.size ? ` (${Math.round(apk.size / 1e6)} MB)` : '';

  return (
    <Layout title="M3U TV for Android" description={DESCRIPTION}>
      <ShareMeta
        title={SHARE_TITLE}
        description={DESCRIPTION}
        image="/img/tv-android-social-card.jpg"
        imageAlt={SHARE_IMAGE_ALT}
      />

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
              {GOOGLE_PLAY && (
                <a href={GOOGLE_PLAY.href} target="_blank" rel="noopener noreferrer" className={tv.storeBadge}>
                  <img src={GOOGLE_PLAY.badge} alt="Get it on Google Play" className={styles.storeBadge} />
                </a>
              )}
              <a className={clsx('button button--lg', home.buttonGhost)} href={apk?.url || RELEASES_URL} rel="noopener noreferrer">
                <MaterialIcon name="download" />
                <span>Download APK{apkSize}</span>
              </a>
            </div>
          </div>
          <DownloaderCard pageUrl={pageUrl} />
        </div>
      </header>

      <main className={styles.main}>
        <section id="channels" className={clsx('container', home.section, styles.anchor)}>
          <SectionHeader
            eyebrow="Release channels"
            title="Pick how fast you get updates"
            subtitle="Every release lands on GitHub first. Google Play testers get it next, then it rolls out to everyone on Google Play."
          />
          <ReleaseChannels
            channels={[
              {
                speed: 'First',
                icon: 'bolt',
                title: 'APK & Downloader',
                text: 'Available the moment a release is published. Update by downloading the new APK, or entering the Downloader code again.',
                href: '#downloader',
                cta: 'Use Downloader',
              },
              {
                speed: 'Early',
                icon: 'science',
                title: 'Google Play beta',
                text: 'Opt in once and Google Play installs new builds before they reach the public listing, with automatic updates.',
                href: PLAY_TESTING_URL,
                cta: 'Become a tester',
              },
              {
                speed: 'Stable',
                icon: 'verified',
                title: 'Google Play',
                text: 'Builds that have been through testing. Updates install automatically.',
                href: GOOGLE_PLAY?.href || RELEASES_URL,
                cta: 'Open Google Play',
              },
            ]}
          />
        </section>

        <section id="downloader" className={clsx('container', home.section, styles.anchor)}>
          <SectionHeader
            eyebrow="Fire TV & Google TV"
            title="Install with Downloader"
            subtitle="Fire TV has no Google Play, so the quickest way onto it is the free Downloader app. It works on Google TV and Android TV boxes too."
          />
          <StepList steps={DOWNLOADER_STEPS} />
        </section>

        <section id="beta" className={clsx('container', home.section, styles.anchor)}>
          <SectionHeader
            eyebrow="Google Play beta"
            title="Join the beta on Google Play"
            subtitle="Testers get new builds through Google Play before they are promoted to production. You can leave any time from the same page."
          />
          <StepList steps={PLAY_TESTING_STEPS} />
          <div className={clsx(home.heroButtons, styles.sectionCta)}>
            <a className={clsx('button button--lg button--primary')} href={PLAY_TESTING_URL} target="_blank" rel="noopener noreferrer">
              <MaterialIcon name="science" />
              <span>Become a tester</span>
            </a>
          </div>
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
              (Settings, General, on by default). On iPhone, iPad, Apple TV, or Mac? See{' '}
              <Link to="/tv/apple">M3U TV for Apple</Link>. For Windows and Linux, see{' '}
              <Link to="/tv#download">all downloads</Link>.
            </span>
          </p>
        </section>
      </main>
    </Layout>
  );
}
