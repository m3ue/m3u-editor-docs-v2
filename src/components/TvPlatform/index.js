import React from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MaterialIcon from '../MaterialIcon';
import home from '../../pages/index.module.css';
import tv from '../../pages/tv.module.css';
import styles from './styles.module.css';

/**
 * Shared building blocks for the per-platform M3U TV landing pages
 * (/tv/android, /tv/apple). Hero, step and card styles come from
 * index.module.css and tv.module.css, as on /tv itself.
 */

// Open Graph and Twitter tags. Each card is 1200x630, rendered by
// scripts/generate-social-cards.sh.
export function ShareMeta({ title, description, image, imageAlt }) {
  const imageUrl = useBaseUrl(image, { absolute: true });

  return (
    <Head>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="M3U Editor" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Head>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className={home.sectionHeader}>
      {eyebrow && <span className={home.eyebrow}>{eyebrow}</span>}
      <h2 className={home.sectionTitle}>{title}</h2>
      {subtitle && <p className={home.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
}

// Numbered step cards. A step may carry a link ({ href, label }).
export function StepList({ steps, className }) {
  return (
    <ol className={clsx(tv.steps, styles.steps, className)}>
      {steps.map((step, index) => (
        <li key={step.title} className={tv.step}>
          <span className={tv.stepNumber}>{index + 1}</span>
          <MaterialIcon name={step.icon} className={tv.stepIcon} />
          <h3>{step.title}</h3>
          <p>{step.text}</p>
          {step.link && (
            <a href={step.link.href} target="_blank" rel="noopener noreferrer" className={tv.stepLink}>
              {step.link.label} <MaterialIcon name="arrow_forward" />
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}

// The three ways a build reaches people, fastest first: GitHub release,
// store beta, then the public store listing.
export function ReleaseChannels({ channels }) {
  return (
    <div className={styles.channels}>
      {channels.map((channel) => (
        <a
          key={channel.title}
          href={channel.href}
          target={channel.href.startsWith('#') ? undefined : '_blank'}
          rel="noopener noreferrer"
          className={styles.channel}
        >
          <span className={styles.channelSpeed}>{channel.speed}</span>
          <span className={styles.channelHead}>
            <MaterialIcon name={channel.icon} className={styles.channelIcon} />
            <strong>{channel.title}</strong>
          </span>
          <span className={styles.channelText}>{channel.text}</span>
          <span className={styles.channelCta}>
            {channel.cta} <MaterialIcon name="arrow_forward" />
          </span>
        </a>
      ))}
    </div>
  );
}

// Glass card on the right of the hero: a big code or label and a caption
export function HeroCard({ icon, label, lead, children, footer }) {
  return (
    <div className={styles.heroCard}>
      <div className={styles.heroCardHeader}>
        <MaterialIcon name={icon} filled />
        {label}
      </div>
      {lead && <p className={styles.heroCardLead}>{lead}</p>}
      {children}
      {footer}
    </div>
  );
}

export { styles as platformStyles };
