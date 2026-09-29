import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import ScreenshotsCarousel from '../components/ScreenshotsCarousel';
import Contributors from '../components/Contributors';
import DownloadBadge from '../components/DownloadBadge';
import GitHubMark from '../components/GitHubMark';
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
    <header className={styles.hero} data-navbar-over-hero>
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
                {project.page && (
                  <Link to={project.page}>
                    <MaterialIcon name="devices" /> Overview
                  </Link>
                )}
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
