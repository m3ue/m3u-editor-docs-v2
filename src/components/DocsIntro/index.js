/**
 * Building blocks for the docs landing page (docs/intro.md).
 *
 * Nothing here is a hand-maintained list that goes stale: the flow and the
 * suite cards read the homepage data (src/data/homeFeatures.js), and the
 * section cards come from the docs sidebar, so a new category shows up on
 * its own. Each category's card text and icon live in its _category_.json
 * (`description` and `customProps.icon`).
 */
import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useDocsSidebar } from '@docusaurus/plugin-content-docs/client';
import DocCardList from '@theme/DocCardList';
import { Steps, Step } from '../Steps';
import MaterialIcon from '../MaterialIcon';
import GitHubMark from '../GitHubMark';
import { ecosystem, flow } from '../../data/homeFeatures';
import styles from './styles.module.css';

const START_STEPS = [
  {
    title: 'Install',
    text: 'Run M3U Editor and M3U Proxy with Docker Compose. Pick a setup, from all-in-one to an external Postgres.',
    to: '/docs/quick_start',
  },
  {
    title: 'Add a playlist',
    text: 'Import an Xtream login, an M3U URL, or a file, then sort, rename, and filter its channels.',
    to: '/docs/resources/playlists',
  },
  {
    title: 'Add guide data',
    text: 'Attach XMLTV or Schedules Direct and map it to your channels automatically.',
    to: '/docs/resources/epg-setup',
  },
  {
    title: 'Connect your players',
    text: 'Point TiviMate, Kodi, Plex, Emby, M3U TV, and others at your M3U, Xtream, or HDHomeRun output.',
    to: '/docs/client_configuration',
  },
];

const HELP_LINKS = [
  { icon: 'forum', title: 'Discord', text: 'Ask the community', href: 'https://discord.gg/rS3abJ5dz7' },
  { icon: 'construction', title: 'Troubleshooting', text: 'Common problems and fixes', to: '/docs/troubleshooting' },
  { icon: 'bug_report', title: 'Report an issue', text: 'Found a bug? Tell us', href: 'https://github.com/m3ue/m3u-editor/issues' },
  { icon: 'new_releases', title: 'Release notes', text: 'What changed in each version', href: 'https://github.com/m3ue/m3u-editor/releases' },
];

function FlowColumn({ icon, label, items }) {
  return (
    <div className={styles.flowColumn}>
      <div className={styles.flowLabel}>
        <MaterialIcon name={icon} />
        {label}
      </div>
      <ul className={styles.flowList}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Sources, the editor in the middle, and players, then the three projects. */
export function SuiteOverview() {
  const logo = useBaseUrl('/img/logo.svg');
  return (
    <div className={styles.suite}>
      <div className={styles.flow}>
        <FlowColumn icon="input" label="Your sources" items={flow.sources} />
        <span className={styles.flowArrow} aria-hidden="true">
          <MaterialIcon name="arrow_forward" />
        </span>
        <div className={styles.flowHub}>
          <img src={logo} alt="" className={styles.flowLogo} />
          <strong>M3U Editor</strong>
          <span>Clean, merge, map, and enrich</span>
          <span className={styles.flowChip}>
            <MaterialIcon name="router" />
            Streams through M3U Proxy
          </span>
        </div>
        <span className={styles.flowArrow} aria-hidden="true">
          <MaterialIcon name="arrow_forward" />
        </span>
        <FlowColumn icon="devices" label="Your players" items={flow.clients} />
      </div>

      <div className={styles.projects}>
        {ecosystem.map((project) => {
          // The editor's own docs start here, so its card points onward
          const isEditor = project.docs === '/docs/intro';
          return (
            <div key={project.title} className={styles.project}>
              <span className={styles.projectIcon}>
                <MaterialIcon name={project.icon} />
              </span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className={styles.projectLinks}>
                <Link to={isEditor ? '/docs/quick_start' : project.docs}>
                  <MaterialIcon name="menu_book" />
                  {isEditor ? 'Get started' : 'Docs'}
                </Link>
                {project.page && (
                  <Link to={project.page}>
                    <MaterialIcon name="devices" />
                    Overview
                  </Link>
                )}
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <GitHubMark />
                  Source
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The four steps from nothing to watching. */
export function StartSteps() {
  return (
    <Steps>
      {START_STEPS.map((step) => (
        <Step
          key={step.title}
          title={
            <Link to={step.to} className={styles.stepTitle}>
              {step.title}
              <MaterialIcon name="arrow_forward" />
            </Link>
          }>
          <p className={styles.stepText}>{step.text}</p>
        </Step>
      ))}
    </Steps>
  );
}

/** One card per top-level sidebar category, straight from the sidebar. */
export function DocsSections() {
  const sidebar = useDocsSidebar();
  const categories = (sidebar?.items ?? []).filter((item) => item.type === 'category');
  if (categories.length === 0) {
    return null;
  }
  return <DocCardList items={categories} className={styles.sections} />;
}

export function HelpLinks() {
  return (
    <div className={styles.helpContainer}>
      <div className={styles.help}>
        {HELP_LINKS.map((item) => {
          const body = (
            <>
              <span className={styles.helpIcon}>
                <MaterialIcon name={item.icon} />
              </span>
              <span>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </span>
            </>
          );
          return item.to ? (
            <Link key={item.title} to={item.to} className={styles.helpLink}>
              {body}
            </Link>
          ) : (
            <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.helpLink}>
              {body}
            </a>
          );
        })}
      </div>
    </div>
  );
}
