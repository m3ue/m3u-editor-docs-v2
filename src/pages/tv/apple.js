import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
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
import { DIRECT_DOWNLOADS, STORE_LINKS, TESTFLIGHT_STEPS, TESTFLIGHT_URL } from '../../data/tvFeatures';
import home from '../index.module.css';
import tv from '../tv.module.css';

const RELEASES_URL = 'https://github.com/m3ue/m3u-tv/releases/latest';
const SHARE_TITLE = 'Get M3U TV on iPhone, iPad, Apple TV, and Mac';
const SHARE_IMAGE_ALT = 'M3U TV on a Mac, iPad, and iPhone';
const DESCRIPTION = 'Install M3U TV on iPhone, iPad, Apple TV, and Mac from the App Store, join the TestFlight beta for early builds, or sideload the latest release.';

const APP_STORE = STORE_LINKS.find((store) => store.name === 'App Store');
const APPLE_ASSETS = ['ios.ipa', 'tvos.ipa', 'macos.dmg'];
const APPLE_DOWNLOADS = DIRECT_DOWNLOADS.filter((item) => APPLE_ASSETS.includes(item.asset));
const TESTFLIGHT_LABEL = TESTFLIGHT_URL.replace(/^https?:\/\//, '');

function formatSize(bytes) {
  return `${Math.round(bytes / 1e6)} MB`;
}

function TestFlightCard() {
  return (
    <HeroCard
      icon="science"
      label="Beta on TestFlight"
      lead="Get new builds before they reach the App Store"
      footer={
        <div className={styles.heroCardLinks}>
          <a href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer" className={styles.heroCardLink}>
            Join the beta <MaterialIcon name="arrow_forward" />
          </a>
          <a href="#testflight" className={styles.heroCardLink}>
            How it works <MaterialIcon name="arrow_forward" />
          </a>
        </div>
      }
    >
      <div className={clsx(styles.code, styles.codeText)}>TestFlight</div>
      <p className={styles.codeAlt}>
        Open <strong>{TESTFLIGHT_LABEL}</strong> on your iPhone or iPad
      </p>
    </HeroCard>
  );
}

export default function TvApplePage() {
  return (
    <Layout title="M3U TV for Apple" description={DESCRIPTION}>
      <ShareMeta
        title={SHARE_TITLE}
        description={DESCRIPTION}
        image="/img/tv-apple-social-card.jpg"
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
              <span className={clsx(home.heroTitleAccent, tv.tvAccent)}>for Apple.</span>
            </h1>
            <p className={home.heroSubtitle}>
              One free app for iPhone, iPad, Apple TV, and Mac.
            </p>
            <div className={home.heroButtons}>
              {APP_STORE && (
                <a href={APP_STORE.href} target="_blank" rel="noopener noreferrer" className={tv.storeBadge}>
                  <img src={APP_STORE.badge} alt="Download on the App Store" className={styles.storeBadge} />
                </a>
              )}
              <a className={clsx('button button--lg', home.buttonGhost)} href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer">
                <MaterialIcon name="science" />
                <span>Join TestFlight</span>
              </a>
            </div>
          </div>
          <TestFlightCard />
        </div>
      </header>

      <main className={styles.main}>
        <section id="channels" className={clsx('container', home.section, styles.anchor)}>
          <SectionHeader
            eyebrow="Release channels"
            title="Pick how fast you get updates"
            subtitle="Every release lands on GitHub first. TestFlight testers get it next, then it goes out to everyone on the App Store."
          />
          <ReleaseChannels
            channels={[
              {
                speed: 'First',
                icon: 'bolt',
                title: 'Sideload',
                text: 'IPA and DMG files on GitHub, available the moment a release is published. iPhone, iPad, and Apple TV need a sideloading tool.',
                href: '#sideload',
                cta: 'Direct downloads',
              },
              {
                speed: 'Early',
                icon: 'science',
                title: 'TestFlight beta',
                text: 'Join once with your Apple ID and TestFlight installs new builds before they reach the App Store.',
                href: TESTFLIGHT_URL,
                cta: 'Join the beta',
              },
              {
                speed: 'Stable',
                icon: 'verified',
                title: 'App Store',
                text: 'Builds that have been through testing. One listing covers iPhone, iPad, Apple TV, and Mac.',
                href: APP_STORE?.href || RELEASES_URL,
                cta: 'Open the App Store',
              },
            ]}
          />
        </section>

        <section id="testflight" className={clsx('container', home.section, styles.anchor)}>
          <SectionHeader
            eyebrow="TestFlight"
            title="Join the beta"
            subtitle="TestFlight is Apple's own beta app. Each beta build expires 90 days after release, and you can leave the beta any time from TestFlight."
          />
          <StepList steps={TESTFLIGHT_STEPS} />
          <div className={clsx(home.heroButtons, styles.sectionCta)}>
            <a className="button button--lg button--primary" href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer">
              <MaterialIcon name="science" />
              <span>Join the TestFlight beta</span>
            </a>
          </div>
        </section>

        <section id="sideload" className={clsx('container', home.section, tv.downloadSection, styles.anchor)}>
          <SectionHeader
            eyebrow="Other ways"
            title="App Store and direct downloads"
            subtitle="The App Store is the simplest option. The IPA files are for sideloading with a tool such as AltStore or Sideloadly, which re-signs the app with your own Apple ID."
          />
          <div className={styles.otherGrid}>
            {APP_STORE && (
              <a href={APP_STORE.href} target="_blank" rel="noopener noreferrer" className={tv.storeCard}>
                <img src={APP_STORE.badge} alt="App Store" />
                <span>{APP_STORE.note}. Updates install automatically.</span>
              </a>
            )}
          </div>
          <div className={styles.otherGrid}>
            {APPLE_DOWNLOADS.map((item) => {
              const asset = tvRelease?.assets?.[item.asset];
              return (
                <a key={item.asset} href={asset?.url || RELEASES_URL} className={tv.directCard} rel="noopener noreferrer">
                  <span className={tv.directIcon}>
                    <MaterialIcon name={item.icon} />
                  </span>
                  <span className={tv.directText}>
                    <strong>{item.platform}</strong>
                    <span>
                      {item.format}
                      {asset?.size ? ` · ${formatSize(asset.size)}` : ''}
                    </span>
                  </span>
                  <MaterialIcon name="download" className={tv.directArrow} />
                </a>
              );
            })}
          </div>
          <p className={tv.downloadNote}>
            <MaterialIcon name="dns" />
            <span>
              M3U TV needs an M3U Editor server with <strong>Enhanced output</strong> enabled
              (Settings, General, on by default). On Android, Google TV, or Fire TV? See{' '}
              <Link to="/tv/android">M3U TV for Android</Link>. For Windows and Linux, see{' '}
              <Link to="/tv#download">all downloads</Link>.
            </span>
          </p>
        </section>
      </main>
    </Layout>
  );
}
