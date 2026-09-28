import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import ScreenshotsCarousel from '../components/ScreenshotsCarousel';
import Contributors from '../components/Contributors';
import DownloadBadge from '../components/DownloadBadge';
import MaterialIcon from '../components/MaterialIcon';
import WhatsNew from '../components/WhatsNew';
import { features, ecosystem, flow } from '../data/homeFeatures';
import styles from './index.module.css';

const INSTALL_COMMAND = [
  'curl -O https://raw.githubusercontent.com/m3ue/m3u-editor/master/docker-compose.proxy.yml',
  'docker compose -f docker-compose.proxy.yml up -d',
].join('\n');

// Deterministic "random" pixel positions so server and client renders match
const PIXELS = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  animationDelay: `${(i * 1.7) % 5}s`,
  animationDuration: `${8 + ((i * 7) % 5)}s`,
}));

function GitHubMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
    </svg>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className={styles.sectionHeader}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.sectionTitle}>{title}</h2>
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
}

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  const dashboardSrc = useBaseUrl('/img/screenshots/01_dashboard.png');

  return (
    <header className={styles.hero}>
      <div className={styles.gridBackground} />
      <div className={styles.floatingPixels}>
        {PIXELS.map((style, i) => (
          <div key={i} className={styles.pixel} style={style} />
        ))}
      </div>
      <div className={clsx('container', styles.heroInner)}>
        <div className={styles.heroCopy}>
          <div className={styles.heroBrand}>
            <img src={useBaseUrl('/img/logo.svg')} alt="" className={styles.logo} />
            <DownloadBadge />
          </div>
          <h1 className={styles.heroTitle}>
            Your IPTV,<br />
            <span className={styles.heroTitleAccent}>fully under control.</span>
          </h1>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.heroButtons}>
            <Link className={clsx('button button--lg', styles.buttonPrimary)} to="/docs/installation">
              <MaterialIcon name="rocket_launch" />
              <span>Get Started</span>
            </Link>
            <a className={clsx('button button--lg', styles.buttonGhost)} href="https://github.com/m3ue/m3u-editor" target="_blank" rel="noopener noreferrer">
              <GitHubMark />
              <span>GitHub</span>
            </a>
            <Link className={clsx('button button--lg', styles.buttonGhost)} to="/compose-wizard">
              <MaterialIcon name="construction" />
              <span>Compose Wizard</span>
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <img src={dashboardSrc} alt="M3U Editor dashboard" className={styles.heroShot} />
        </div>
      </div>
    </header>
  );
}

function FeatureGrid() {
  return (
    <section className={clsx('container', styles.section)}>
      <SectionHeader
        eyebrow="Features"
        title="Everything between your sources and your screens"
        subtitle="From a single playlist to a full media stack, M3U Editor handles the heavy lifting so every client gets a clean, consistent lineup."
      />
      <div className={styles.featureGrid}>
        {features.map((feature) => (
          <Link key={feature.title} to={feature.link} className={styles.featureCard}>
            <span className={styles.featureIcon}>
              <MaterialIcon name={feature.icon} />
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <span className={styles.featureMore}>
              Learn more <MaterialIcon name="arrow_forward" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FlowList({ icon, label, items }) {
  return (
    <div className={styles.flowColumn}>
      <div className={styles.flowLabel}>
        <MaterialIcon name={icon} />
        <span>{label}</span>
      </div>
      <ul className={styles.flowList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className={styles.flowSection}>
      <div className="container">
        <SectionHeader
          eyebrow="How it works"
          title="One hub for every source"
          subtitle="Clients only ever talk to M3U Editor, so you can swap providers, fix names, and fill in guide data without touching a single device."
        />
        <div className={styles.flow}>
          <FlowList icon="input" label="Sources" items={flow.sources} />
          <div className={styles.flowArrow} aria-hidden="true">
            <MaterialIcon name="arrow_forward" />
          </div>
          <div className={styles.flowHub}>
            <img src={useBaseUrl('/img/logo.svg')} alt="" className={styles.flowLogo} />
            <strong>M3U Editor</strong>
            <span>Clean, merge, map, enrich</span>
          </div>
          <div className={styles.flowArrow} aria-hidden="true">
            <MaterialIcon name="arrow_forward" />
          </div>
          <FlowList icon="devices" label="Clients" items={flow.clients} />
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  return (
    <section className={clsx('container', styles.section)}>
      <SectionHeader
        eyebrow="Ecosystem"
        title="Three projects, one experience"
        subtitle="Use the editor on its own, or pair it with the proxy and TV app for the complete setup."
      />
      <div className={styles.ecosystemGrid}>
        {ecosystem.map((project) => (
          <div key={project.title} className={styles.ecosystemCard}>
            <span className={styles.ecosystemIcon}>
              <MaterialIcon name={project.icon} />
            </span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className={styles.ecosystemLinks}>
                <Link to={project.docs}>
                  <MaterialIcon name="menu_book" /> Docs
                </Link>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <GitHubMark /> Source
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickStart() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(INSTALL_COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className={clsx('container', styles.section)}>
      <div className={styles.quickStart}>
        <div className={styles.quickStartCopy}>
          <span className={styles.eyebrow}>Quick start</span>
          <h2 className={styles.sectionTitle}>Up and running in minutes</h2>
          <p>
            Grab the recommended Docker Compose file and start the stack, then open{' '}
            <code>http://localhost:36400</code>. Want something tailored? The Compose Wizard builds a file for your setup.
          </p>
          <div className={styles.quickStartLinks}>
            <Link to="/docs/installation">
              Installation guide <MaterialIcon name="arrow_forward" />
            </Link>
            <Link to="/compose-wizard">
              Compose Wizard <MaterialIcon name="arrow_forward" />
            </Link>
          </div>
        </div>
        <div className={styles.terminal}>
          <div className={styles.terminalBar}>
            <span className={styles.terminalDots}><span /><span /><span /></span>
            <button type="button" className={styles.copyButton} onClick={copy} aria-label="Copy install commands">
              <MaterialIcon name={copied ? 'check' : 'content_copy'} />
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className={styles.terminalBody}>
            {INSTALL_COMMAND.split('\n').map((line) => (
              <div key={line}>
                <span className={styles.prompt}>$</span> {line}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
}

function SupportBand() {
  return (
    <section className={clsx('container', styles.section)}>
      <div className={styles.supportBand}>
        <div>
          <h2>Free, open source, and community driven</h2>
          <p>Join the Discord for help and previews of what is next, or chip in to keep development going.</p>
        </div>
        <div className={styles.supportButtons}>
          <a className={clsx('button button--lg', styles.buttonPrimary)} href="https://discord.gg/rS3abJ5dz7" target="_blank" rel="noopener noreferrer">
            <span>Join Discord</span>
          </a>
          <a className={clsx('button button--lg', styles.buttonGhost)} href="https://ko-fi.com/sparkison" target="_blank" rel="noopener noreferrer">
            <MaterialIcon name="favorite" filled />
            <span>Support the project</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero />
      <main>
        <WhatsNew />
        <HowItWorks />
        <Ecosystem />
        <QuickStart />

        <section className={clsx('container', styles.section)}>
          <SectionHeader eyebrow="Screenshots" title="See it in action" />
          <ScreenshotsCarousel />
        </section>

        <FeatureGrid />
        <SupportBand />
        <Contributors />
      </main>
    </Layout>
  );
}
