import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import GitHubRelease from '@site/src/components/GitHubRelease';
import ReleaseVersions from '@site/src/components/ReleaseVersions';
import ScreenshotsCarousel from '../components/ScreenshotsCarousel';
import Contributors from '../components/Contributors';
import styles from './index.module.css';
import DownloadBadge from '../components/DownloadBadge';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img src="/img/logo.svg" alt="logo" className={styles.logo} />
          <h1 className="hero__title">M3U Editor</h1>
          <p className="hero__subtitle">A full-featured IPTV editor — EPG, Xtream API output, series & playlist management, and more.</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <DownloadBadge />
          </div>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/quick_start">Quick Start</Link>
            <Link className="button button--secondary button--lg" to="/docs/intro" style={{ marginLeft: 12 }}>Documentation</Link>
            <a className="button button--secondary button--lg" href="https://github.com/sparkison/m3u-editor" target="_blank" style={{ marginLeft: 12 }}>
              <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z" />
                </g>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className={clsx('container', styles.fadeIn)} style={{ padding: '3rem 0' }}>
          <h2 className={styles.featuresHeading}>Features</h2>
          <div className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="heroAccentA" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#b3509f', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="heroLineA" x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 0.6 }} />
                      <stop offset="50%" style={{ stopColor: '#7c3aed', stopOpacity: 0.9 }} />
                      <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 0.6 }} />
                    </linearGradient>
                  </defs>

                  {/* TV body */}
                  <rect x="14" y="16" width="100" height="70" rx="12" ry="12" fill="transparent" stroke="url(#heroAccentA)" strokeWidth="2.5" />
                  {/* Screen */}
                  <rect x="22" y="24" width="84" height="56" rx="8" ry="8" fill="transparent" />

                  {/* Program rows: left badge + two lines */}
                  <g fill="#cbd5e1" opacity="0.95">
                    <rect x="30" y="32" width="18" height="10" rx="2" fill="url(#heroAccentA)" />
                    <rect x="52" y="34" width="36" height="6" rx="3" />
                    <rect x="52" y="42" width="28" height="6" rx="3" opacity="0.85" />

                    <rect x="30" y="48" width="14" height="10" rx="2" fill="#7c3aed" />
                    <rect x="52" y="50" width="38" height="6" rx="3" />
                    <rect x="52" y="58" width="26" height="6" rx="3" opacity="0.85" />

                    <rect x="30" y="64" width="12" height="10" rx="2" fill="#6366f1" />
                    <rect x="52" y="66" width="34" height="6" rx="3" />
                    <rect x="52" y="74" width="22" height="6" rx="3" opacity="0.85" />
                  </g>

                  {/* Right status dots */}
                  <circle cx="100" cy="37" r="3" fill="url(#heroAccentA)" />
                  <circle cx="100" cy="53" r="3" fill="#b3509f" />
                  <circle cx="100" cy="69" r="3" fill="#6366f1" />

                  {/* Stand */}
                  <path d="M 54 86 L 46 102 Q 46 106 52 106 L 76 106 Q 82 106 84 102 L 76 86" fill="transparent" stroke="url(#heroAccentA)" strokeWidth="2.5" strokeOpacity="1" />
                </svg>
              </span>
              <h3>Full EPG Support</h3>
              <p>XMLTV, remote EPG URLs, and Schedules Direct integration for accurate program data.</p>
            </article>
            <article className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                  <defs>
                    <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#b3509f', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="exportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ff1b6d', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#c026d3', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="exportShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.24" />
                    </filter>
                  </defs>

                  {/* stacked server */}
                  <g transform="translate(28,20)">
                    <rect x="0" y="0" width="60" height="20" rx="6" fill="transparent" stroke="url(#serverGrad)" strokeWidth="2.3" />
                    <rect x="0" y="26" width="60" height="20" rx="6" fill="transparent" stroke="url(#serverGrad)" strokeWidth="2.3" />
                    <rect x="0" y="52" width="60" height="20" rx="6" fill="transparent" stroke="url(#serverGrad)" strokeWidth="2.3" />

                    {/* uniform front bezels: slot + indicator */}
                    {/* top panel */}
                    <rect x="8" y="4" width="36" height="8" rx="2" fill="transparent" stroke="url(#serverGrad)" strokeWidth="0.9" />
                    <rect x="30" y="6" width="6" height="4" rx="1" fill="url(#serverGrad)" />
                    <circle cx="52" cy="8" r="3" fill="#cbd5e1" opacity="0.95" />
                    <circle cx="30.6" cy="5.8" r="0.9" fill="#ffffff" opacity="0.14" />

                    {/* middle panel */}
                    <rect x="8" y="30" width="36" height="8" rx="2" fill="transparent" stroke="url(#serverGrad)" strokeWidth="0.9" />
                    <rect x="30" y="32" width="6" height="4" rx="1" fill="url(#serverGrad)" />
                    <circle cx="52" cy="34" r="3" fill="#cbd5e1" opacity="0.95" />
                    <circle cx="30.6" cy="32.8" r="0.9" fill="#ffffff" opacity="0.14" />

                    {/* bottom panel (HDD bay in same bezel style) */}
                    <rect x="8" y="56" width="36" height="8" rx="2" fill="transparent" stroke="url(#serverGrad)" strokeWidth="0.9" />
                    <rect x="30" y="58" width="6" height="4" rx="1" fill="url(#serverGrad)" />
                    <circle cx="52" cy="60" r="3" fill="#cbd5e1" opacity="0.95" />
                    <rect x="12" y="58.5" width="20" height="1" rx="0.5" fill="#071124" opacity="0.6" />
                  </g>

                  {/* export badge separated from server */}
                  <g transform="translate(112,53)">
                    {/* gradient outline only, no fill */}
                    <circle cx="0" cy="0" r="15" fill="transparent" stroke="url(#exportGrad)" strokeWidth="2" />
                    <g>
                      <line x1="-6" y1="0" x2="3" y2="0" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <polygon points="4,-4 12,0 4,4" fill="#ffffff" />
                    </g>
                  </g>
                </svg>
              </span>
              <h3>Xtream & M3U Output</h3>
              <p>Export playlists as M3U/M3U8 or use the Xtream API to serve streams.</p>
            </article>
            <article className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 200 200" aria-hidden="true" role="img">
                  <defs>
                    <linearGradient id="featureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#b3509f', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="iconShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.18" />
                    </filter>
                  </defs>
                  <g filter="url(#iconShadow)">
                    <path d="M 44.02 184.49 C34.44,189.44 21.74,185.29 17.09,175.68 C14.56,170.45 14.37,163.12 16.65,158.32 C18.00,155.48 43.08,131.56 64.79,112.41 C67.89,109.68 68.02,109.30 66.94,106.25 C65.02,100.76 66.18,86.34 69.02,80.50 C72.11,74.15 78.16,68.08 84.53,64.95 C88.89,62.80 90.85,62.50 100.50,62.50 C113.68,62.50 119.27,64.47 119.82,69.32 C120.10,71.73 118.68,73.64 110.07,82.38 C98.57,94.06 97.60,96.57 103.25,100.01 C105.04,101.10 106.90,101.99 107.39,102.00 C107.89,102.00 112.84,97.55 118.39,92.11 C123.95,86.68 129.49,81.93 130.70,81.56 C135.99,79.96 140.58,91.13 139.77,103.64 C139.42,109.17 138.54,112.50 136.13,117.38 C130.31,129.21 120.10,135.44 106.50,135.48 C102.10,135.49 96.93,135.14 95.00,134.70 L 91.50 133.90 L 69.25 158.42 C57.01,171.91 45.66,183.64 44.02,184.49 ZM 115.89 187.25 C113.20,189.95 112.93,190.00 101.00,190.00 C89.07,190.00 88.80,189.95 86.10,187.25 C83.96,185.09 82.98,182.56 81.59,175.54 L 79.81 166.57 L 82.02 164.79 C86.38,161.26 89.29,163.28 90.98,171.00 C92.09,176.12 92.38,178.39 93.65,179.33 C94.65,180.07 96.25,180.00 99.32,179.87 C99.91,179.84 100.56,179.81 101.26,179.79 L 109.37 179.50 L 110.79 173.00 C112.29,166.14 114.23,163.00 116.97,163.00 C119.18,163.00 130.30,158.60 133.17,156.60 C136.74,154.10 140.56,154.69 146.56,158.67 L 152.09 162.34 L 157.54 156.96 C160.55,153.99 163.00,151.07 163.00,150.46 C163.00,149.85 161.43,147.14 159.50,144.43 C155.36,138.61 155.18,136.27 158.42,130.68 C159.76,128.38 161.82,123.57 163.00,120.00 C164.19,116.43 165.52,113.13 165.96,112.67 C166.40,112.21 169.85,111.06 173.63,110.11 L 180.50 108.38 L 180.79 100.24 L 181.08 92.10 L 177.29 91.13 C175.21,90.60 172.07,89.87 170.32,89.52 C166.26,88.69 165.64,87.88 163.01,80.00 C161.82,76.43 159.76,71.53 158.42,69.12 C155.21,63.32 155.35,61.43 159.50,55.28 C161.43,52.42 163.00,49.71 163.00,49.26 C163.00,48.80 160.57,46.03 157.60,43.10 C153.96,39.50 151.76,38.02 150.85,38.54 C150.11,38.98 147.10,40.90 144.16,42.82 L 138.82 46.32 L 132.66 43.17 C129.27,41.45 123.85,39.13 120.61,38.02 C117.37,36.92 114.14,35.53 113.44,34.95 C112.74,34.37 111.60,30.76 110.92,26.94 L 109.68 20.00 L 93.08 20.00 L 92.03 24.25 C89.03,36.38 89.46,35.72 83.23,37.52 C80.08,38.43 74.45,40.78 70.73,42.73 L 63.96 46.27 L 59.23 43.32 C56.63,41.69 53.49,39.72 52.25,38.94 C50.13,37.60 49.68,37.84 44.33,43.20 L 38.65 48.87 L 41.17 52.69 C44.46,57.67 46.03,59.96 46.14,62.33 C46.24,64.43 45.20,66.57 43.21,70.68 C43.15,70.82 43.08,70.96 43.01,71.11 C40.82,75.63 38.74,80.84 38.40,82.69 C37.58,87.03 34.14,89.66 28.18,90.47 C21.00,91.46 20.87,91.64 21.20,100.55 L 21.50 108.43 L 28.87 110.10 C32.92,111.02 36.63,112.39 37.11,113.14 C38.51,115.36 38.13,117.57 36.00,119.50 C34.07,121.25 33.69,121.25 25.25,119.48 C18.53,118.07 15.86,117.01 13.75,114.90 C11.06,112.21 11.00,111.91 11.00,100.21 C11.00,85.77 11.95,83.89 20.24,82.01 C23.13,81.36 26.26,80.62 27.19,80.36 C28.12,80.11 29.42,78.24 30.07,76.20 C30.73,74.17 32.35,70.35 33.67,67.72 L 36.06 62.95 L 32.94 58.42 C29.41,53.28 28.01,49.28 28.90,46.80 C29.23,45.87 33.28,41.25 37.89,36.55 C45.39,28.90 46.67,28.00 49.94,28.00 C52.36,28.00 55.38,29.13 58.88,31.33 L 64.17 34.67 L 80.99 27.52 L 82.15 21.64 C82.80,18.36 84.31,14.59 85.57,13.13 C87.71,10.63 88.37,10.48 98.98,10.16 C105.12,9.97 111.22,10.09 112.54,10.42 C116.44,11.40 118.73,14.76 119.98,21.33 L 121.15 27.50 L 129.91 31.05 L 138.68 34.61 L 143.57 31.30 C147.02,28.98 149.61,28.00 152.34,28.00 C155.79,28.00 157.02,28.79 163.70,35.25 C175.20,46.38 175.90,48.93 169.87,57.68 C168.22,60.09 167.01,62.61 167.19,63.28 C167.36,63.95 168.86,67.98 170.50,72.24 L 173.50 79.98 L 179.50 81.16 C183.66,81.99 186.34,83.20 188.25,85.10 C190.94,87.79 191.00,88.09 191.00,99.85 C191.00,111.08 190.85,112.03 188.58,114.72 C186.71,116.95 184.68,117.90 179.68,118.89 L 173.20 120.18 L 170.50 127.59 C169.01,131.67 167.39,135.26 166.90,135.56 C166.41,135.86 167.57,138.55 169.48,141.54 C175.86,151.50 175.37,153.45 163.77,164.69 C154.22,173.93 152.68,174.32 144.80,169.46 C139.09,165.93 138.48,165.77 135.59,166.96 C133.89,167.67 129.95,169.19 126.84,170.34 L 121.18 172.44 L 119.91 178.47 C119.04,182.56 117.75,185.39 115.89,187.25 ZM 31.39 176.02 C34.61,177.32 37.34,177.15 39.68,175.51 C40.85,174.69 48.26,166.93 56.14,158.26 C64.03,149.59 72.55,140.25 75.08,137.50 C77.61,134.75 81.61,130.36 83.97,127.75 C88.68,122.53 90.52,122.07 96.59,124.60 C102.69,127.15 112.55,126.18 118.59,122.45 C125.56,118.14 129.13,111.94 129.77,103.02 C130.04,99.16 129.90,96.00 129.46,96.00 C129.02,96.00 125.41,99.14 121.46,102.97 C111.65,112.48 107.54,113.85 100.12,110.06 C94.99,107.45 90.25,101.84 89.42,97.42 C88.29,91.38 90.32,87.11 97.97,79.53 C101.84,75.69 105.00,72.14 105.00,71.63 C105.00,70.07 92.34,71.79 88.15,73.92 C77.46,79.38 72.28,93.11 76.61,104.50 C77.45,106.70 78.37,109.27 78.67,110.21 C79.04,111.38 77.70,113.28 74.41,116.21 C66.82,122.99 41.26,146.62 32.75,154.71 C25.72,161.40 25.00,162.44 25.00,165.91 C25.00,170.08 27.85,174.59 31.39,176.02 Z" fill="url(#featureGrad)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.4" />
                  </g>
                </svg>
              </span>
              <h3>Series & Playlist Management</h3>
              <p>Manage series, save .strm files, and perform post-processing scripts or webhooks.</p>
            </article>
            <article className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 32 32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="deployGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#b3509f', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="deployShadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.16" />
                    </filter>
                  </defs>
                  <g filter="url(#deployShadow)" transform="translate(4, 4)">
                    <path d="M12.4,24c-0.2,0-0.4,0-0.5-0.1c-0.6-0.2-1.1-0.7-1.3-1.4L10,19.2c-0.1-0.5-0.3-0.9-0.6-1.2l-3.3-3.3 c-0.3-0.3-0.7-0.5-1.2-0.6l-3.4-0.7c-0.7-0.1-1.2-0.6-1.4-1.3c-0.2-0.6,0-1.3,0.5-1.8l2.6-2.6C4,6.9,5.1,6.3,6.3,6.3h3.1 c0.8-0.9,1.6-1.8,2.4-2.6C17.5-2,22.7,0.5,22.9,0.6l0.3,0.2l0.2,0.3c0.1,0.2,2.5,5.5-3.1,11.1c-0.9,0.9-1.8,1.7-2.6,2.4v3.1 c0,1.2-0.5,2.2-1.3,3.1l-2.6,2.6C13.4,23.8,12.9,24,12.4,24z M2.2,11.5l3.1,0.6c0.8,0.2,1.6,0.6,2.2,1.2l3.3,3.3 c0.6,0.6,1,1.4,1.2,2.2l0.6,3.1l2.4-2.4c0.4-0.4,0.7-1,0.7-1.6v-4l0.4-0.3c1-0.8,1.9-1.7,2.9-2.6c3.9-3.9,3.2-7.4,2.9-8.5 c-1.1-0.4-4.6-1-8.5,2.9c-0.9,0.9-1.8,1.9-2.6,2.9l-0.3,0.4h-4c-0.6,0-1.2,0.2-1.6,0.7L2.2,11.5z M2.1,24L2.1,24 c-0.8,0-1.3-0.1-1.6-0.4c-0.2-0.2-0.7-0.7-0.3-3.1c0.2-1.1,0.5-2.6,1.3-3.4c1.5-1.5,4-1.5,5.4,0c1.5,1.5,1.5,3.9,0,5.4 C5.8,23.7,3.3,24,2.1,24z M4.3,18c-0.5,0-1,0.2-1.3,0.5C2.4,19.1,2.1,21,2.1,22c1,0,2.9-0.3,3.5-0.8c0.7-0.7,0.7-1.9,0-2.6 C5.2,18.2,4.7,18,4.3,18z" fill="transparent" stroke="url(#deployGrad)" strokeWidth="0.8" strokeLinejoin="round" />
                    <circle cx="17" cy="7" r="2" fill="transparent" stroke="url(#deployGrad)" strokeWidth="0.5" strokeOpacity="0.85" />

                  </g>
                </svg>
              </span>
              <h3>Multiple Deploy Modes</h3>
              <p>Run modular (Nginx/Caddy) or all-in-one Docker deployments with examples included.</p>
            </article>
          </div>
        </section>

        <section className={clsx('container', styles.fadeIn)}>
          <ReleaseVersions />
        </section>


        <section className={clsx('container', styles.fadeIn)} style={{ padding: '2.5rem 0' }}>
          <h2 className={styles.screenshotsHeading}>Screenshots</h2>
          <ScreenshotsCarousel />
        </section>

        <Contributors />
      </main>
    </Layout>
  );
}
