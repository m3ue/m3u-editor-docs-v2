import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Contributors from '../components/Contributors';
import GitHubMark from '../components/GitHubMark';
import MaterialIcon from '../components/MaterialIcon';
import ScreenshotsCarousel from '../components/ScreenshotsCarousel';
// Bundled at build time (not fetched) so the CDN can never serve a stale copy
import tvRelease from '@site/static/data/tv-release.json';
import {
  CONNECT_STEPS,
  DEVICE_GALLERIES,
  DIRECT_DOWNLOADS,
  PLATFORMS,
  PLAYBACK_ENGINES,
  PLAYBACK_POINTS,
  STORE_LINKS,
  TV_FEATURES,
} from '../data/tvFeatures';
import home from './index.module.css';
import styles from './tv.module.css';

const REPO_URL = 'https://github.com/m3ue/m3u-tv';
const RELEASES_URL = `${REPO_URL}/releases/latest`;
const SHARE_TITLE = 'M3U TV: your IPTV library on every screen';
const SHARE_IMAGE_ALT = 'M3U TV running on a TV, tablet, and phone';
const DESCRIPTION = 'M3U TV is a free, native player for your M3U Editor server: live TV, a full guide, movies, series, and DVR on your TV, phone, tablet, and desktop.';

// Deterministic "random" pixel positions so server and client renders match
const PIXELS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  animationDelay: `${(i * 1.7) % 5}s`,
  animationDuration: `${8 + ((i * 7) % 5)}s`,
}));

function formatSize(bytes) {
  return `${Math.round(bytes / 1e6)} MB`;
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className={home.sectionHeader}>
      {eyebrow && <span className={home.eyebrow}>{eyebrow}</span>}
      <h2 className={home.sectionTitle}>{title}</h2>
      {subtitle && <p className={home.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
}

function StoreBadges({ className }) {
  return (
    <div className={clsx(styles.storeBadges, className)}>
      {STORE_LINKS.map((store) => (
        <a key={store.name} href={store.href} target="_blank" rel="noopener noreferrer" className={styles.storeBadge}>
          <img src={store.badge} alt={store.name} />
        </a>
      ))}
    </div>
  );
}

// Pointer position over the device stack as -1..1 CSS variables, which each
// device layer turns into its own depth and drift for a parallax effect
function useParallax() {
  const ref = useRef(null);
  const onPointerMove = (event) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--px', (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
    ref.current.style.setProperty('--py', (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
  };
  const onPointerLeave = () => {
    ref.current?.style.setProperty('--px', '0');
    ref.current?.style.setProperty('--py', '0');
  };
  return { ref, onPointerMove, onPointerLeave };
}

function Hero() {
  const parallax = useParallax();
  return (
    <header className={home.hero} data-navbar-over-hero>
      <div className={home.gridBackground} />
      <div className={home.floatingPixels}>
        {PIXELS.map((style, i) => (
          <div key={i} className={home.pixel} style={style} />
        ))}
      </div>
      <div className={clsx('container', home.heroInner, styles.heroInner)}>
        <div>
          <div className={home.heroBrand}>
            <img src={useBaseUrl('/img/tv-logo.svg')} alt="" className={clsx(home.logo, styles.tvLogo)} />
            {tvRelease?.tag && (
              <a className={styles.versionPill} href={tvRelease.url} target="_blank" rel="noopener noreferrer">
                <MaterialIcon name="new_releases" filled />
                M3U TV {tvRelease.tag}
              </a>
            )}
          </div>
          <h1 className={home.heroTitle}>
            Your library,<br />
            <span className={clsx(home.heroTitleAccent, styles.tvAccent)}>on every screen.</span>
          </h1>
          <p className={home.heroSubtitle}>{DESCRIPTION}</p>
          <StoreBadges className={styles.heroBadges} />
          <div className={home.heroButtons}>
            <Link className={clsx('button button--lg', home.buttonPrimary)} to="#download">
              <MaterialIcon name="download" />
              <span>All downloads</span>
            </Link>
            <Link className={clsx('button button--lg', home.buttonGhost)} to="/docs/m3u-tv/overview">
              <MaterialIcon name="menu_book" />
              <span>Docs</span>
            </Link>
            <a className={clsx('button button--lg', home.buttonGhost)} href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <GitHubMark />
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div className={styles.deviceStack} {...parallax}>
          <div className={styles.deviceScene}>
            <div className={styles.heroTv}>
              <img src={require('@site/static/img/tv/tv1.webp').default} alt="M3U TV home screen on a TV" />
            </div>
            <div className={styles.heroTablet}>
              <img src={require('@site/static/img/tv/tablet3.webp').default} alt="M3U TV movie details on a tablet" />
            </div>
            <div className={styles.heroPhone}>
              <img src={require('@site/static/img/tv/mobile5.webp').default} alt="M3U TV series details on a phone" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function PlatformStrip() {
  return (
    <section className="container">
      <div className={styles.platformStrip}>
        <span className={styles.platformLabel}>Runs on</span>
        <ul className={styles.platformList}>
          {PLATFORMS.map((platform) => (
            <li key={platform.label}>
              <MaterialIcon name={platform.icon} />
              {platform.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DeviceGallery() {
  const [activeKey, setActiveKey] = useState(DEVICE_GALLERIES[0].key);
  const active = DEVICE_GALLERIES.find((device) => device.key === activeKey);

  return (
    <section className={clsx('container', home.section)}>
      <SectionHeader
        eyebrow="Screenshots"
        title="Designed for every screen"
        subtitle="The same app adapts its layout to each device: remote-friendly on the TV, touch-first on phones and tablets, and windowed on the desktop."
      />
      <div className={styles.tabs} role="tablist" aria-label="Device">
        {DEVICE_GALLERIES.map((device) => (
          <button
            key={device.key}
            type="button"
            role="tab"
            aria-selected={device.key === activeKey}
            className={clsx(styles.tab, device.key === activeKey && styles.tabActive)}
            onClick={() => setActiveKey(device.key)}
          >
            <MaterialIcon name={device.icon} />
            {device.label}
          </button>
        ))}
      </div>
      {/* Keyed so Swiper rebuilds with the new device's layout */}
      <div role="tabpanel" className={styles.galleryPanel}>
        <ScreenshotsCarousel
          key={active.key}
          screenshots={active.items}
          frame={active.frame}
          slidesPerView={active.slidesPerView}
          breakpoints={active.breakpoints}
        />
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className={clsx('container', home.section)}>
      <SectionHeader
        eyebrow="Features"
        title="Everything you want from a player"
        subtitle="Built alongside M3U Editor, so it understands your guide, your library, your recordings, and your watch history."
      />
      <div className={home.featureGrid}>
        {/* Features with a docs page lead, each group keeping its data order */}
        {[...TV_FEATURES].sort((a, b) => Number(!a.link) - Number(!b.link)).map((feature) => {
          const content = (
            <>
              <span className={home.featureIcon}>
                <MaterialIcon name={feature.icon} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              {feature.link && (
                <span className={home.featureMore}>
                  Learn more <MaterialIcon name="arrow_forward" />
                </span>
              )}
            </>
          );
          return feature.link ? (
            <Link key={feature.title} to={feature.link} className={home.featureCard}>{content}</Link>
          ) : (
            <div key={feature.title} className={home.featureCard}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}

function Playback() {
  return (
    <section className={home.flowSection}>
      <div className={clsx('container', styles.playback)}>
        <div>
          <span className={home.eyebrow}>Playback</span>
          <h2 className={home.sectionTitle}>Native engines, not a web view</h2>
          <p className={styles.playbackIntro}>
            Each platform plays through the best engine it has, with an automatic fallback when a stream
            needs something the first one cannot handle.
          </p>
          <div className={styles.playbackPoints}>
            {PLAYBACK_POINTS.map((point) => (
              <div key={point.title} className={styles.playbackPoint}>
                <MaterialIcon name={point.icon} />
                <div>
                  <strong>{point.title}</strong>
                  <span>{point.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.engineCard}>
          <div className={styles.engineHeader}>
            <MaterialIcon name="play_circle" filled />
            Video engine by platform
          </div>
          <ul className={styles.engineList}>
            {PLAYBACK_ENGINES.map((row) => (
              <li key={row.platform}>
                <strong>{row.platform}</strong>
                <span>{row.engine}</span>
              </li>
            ))}
          </ul>
          <Link to="/docs/m3u-tv/overview#platforms" className={styles.engineLink}>
            Platform details <MaterialIcon name="arrow_forward" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ConnectSteps() {
  return (
    <section className={clsx('container', home.section)}>
      <SectionHeader
        eyebrow="Getting started"
        title="Watching in three steps"
        subtitle="M3U TV connects to your own M3U Editor server over the Xtream API, the same way any other player would."
      />
      <ol className={styles.steps}>
        {CONNECT_STEPS.map((step, index) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <MaterialIcon name={step.icon} className={styles.stepIcon} />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <Link to={step.link.to} className={styles.stepLink}>
              {step.link.label} <MaterialIcon name="arrow_forward" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Downloads() {
  // Register the custom id so links to /tv#download pass the broken anchor check
  useBrokenLinks().collectAnchor('download');
  const releasedOn = tvRelease?.publishedAt
    ? new Date(tvRelease.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <section id="download" className={clsx('container', home.section, styles.downloadSection)}>
      <SectionHeader
        eyebrow="Download"
        title="Get M3U TV"
        subtitle={
          tvRelease?.tag
            ? `Latest release ${tvRelease.tag}, published ${releasedOn}. Free on every platform.`
            : 'Free on every platform.'
        }
      />

      <div className={styles.storeGrid}>
        {STORE_LINKS.map((store) => (
          <a key={store.name} href={store.href} target="_blank" rel="noopener noreferrer" className={styles.storeCard}>
            <img src={store.badge} alt={store.name} />
            <span>{store.note}</span>
          </a>
        ))}
      </div>

      <h3 className={styles.directTitle}>
        <GitHubMark /> Direct downloads
      </h3>
      <div className={styles.directGrid}>
        {DIRECT_DOWNLOADS.map((item) => {
          const asset = tvRelease?.assets?.[item.asset];
          return (
            <a
              key={item.asset}
              href={asset?.url || RELEASES_URL}
              className={styles.directCard}
              rel="noopener noreferrer"
            >
              <span className={styles.directIcon}>
                <MaterialIcon name={item.icon} />
              </span>
              <span className={styles.directText}>
                <strong>{item.platform}</strong>
                <span>
                  {item.format}
                  {asset?.size ? ` · ${formatSize(asset.size)}` : ''}
                </span>
              </span>
              <MaterialIcon name="download" className={styles.directArrow} />
            </a>
          );
        })}
      </div>
      <p className={styles.downloadNote}>
        <MaterialIcon name="dns" />
        <span>
          M3U TV needs an M3U Editor server with <strong>Enhanced output</strong> enabled
          (Settings, General, on by default). See{' '}
          <Link to="/docs/m3u-tv/overview">the M3U TV docs</Link> for details, or{' '}
          <a href={tvRelease?.url || RELEASES_URL} target="_blank" rel="noopener noreferrer">view the release notes</a>.
        </span>
      </p>
    </section>
  );
}

function OpenSourceBand() {
  return (
    <section className={clsx('container', home.section)}>
      <div className={home.supportBand}>
        <div>
          <h2>Free and open source</h2>
          <p>M3U TV is GPL-3.0 licensed. Report issues, suggest features, or send a pull request on GitHub.</p>
        </div>
        <div className={home.supportButtons}>
          <a className={clsx('button button--lg', home.buttonPrimary)} href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <MaterialIcon name="star" filled />
            <span>Star on GitHub</span>
          </a>
          <a className={clsx('button button--lg', home.buttonGhost)} href="https://discord.gg/rS3abJ5dz7" target="_blank" rel="noopener noreferrer">
            <span>Join Discord</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function TvPage() {
  const socialCard = useBaseUrl('/img/tv-social-card.jpg', { absolute: true });
  return (
    <Layout title="M3U TV" description={DESCRIPTION}>
      {/* Layout already sets description, og:description, og:url and the
          canonical link; these give shares their own title and card */}
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
      <Hero />
      <main>
        <PlatformStrip />
        <DeviceGallery />
        <FeatureGrid />
        <Playback />
        <ConnectSteps />
        <Downloads />
        <OpenSourceBand />
        {/* Everyone gets a card: the TV app has only a handful of contributors */}
        <Contributors
          repo="m3u-tv"
          featuredMin={1}
          subtitle="Thank you to everyone who has helped build M3U TV."
        />
      </main>
    </Layout>
  );
}
