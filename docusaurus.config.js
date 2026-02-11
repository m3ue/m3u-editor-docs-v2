// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'M3U Editor',
  tagline: 'A full-featured IPTV editor — EPG, Xtream API output, series & playlist management, and more.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://m3ue.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'm3ue', // Usually your GitHub org/user name.
  projectName: 'm3u-editor-docs-v2', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          breadcrumbs: true,
          showLastUpdateTime: true,
          editUrl: 'https://github.com/m3ue/m3u-editor-docs-v2/tree/master',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
        searchResultContextMaxLength: 50,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        // defaultMode: 'dark', // Default to user's system preference
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: '',
        logo: {
          alt: 'M3U Editor Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            to: '/compose-wizard',
            label: 'Compose Wizard',
            position: 'left',
          },
          {
            href: 'https://discord.gg/rS3abJ5dz7',
            label: 'Discord',
            position: 'right',
          },
          {
            href: 'https://github.com/m3ue/m3u-editor',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://ko-fi.com/sparkison',
            label: 'Support',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/installation',
              },
              {
                label: 'Deployment',
                to: '/docs/deployment/docker-compose',
              },
              {
                label: 'Compose Wizard',
                to: '/compose-wizard',
              },
              {
                label: 'Advanced Topics',
                to: '/docs/category/advanced',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/rS3abJ5dz7',
              },
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/m3ue/m3u-editor/discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub (Main Project)',
                href: 'https://github.com/m3ue/m3u-editor',
              },
              {
                label: 'GitHub (Proxy)',
                href: 'https://github.com/m3ue/m3u-proxy',
              },
              {
                label: 'GitHub (Docs)',
                href: 'https://github.com/m3ue/m3u-editor-docs-v2',
              },
              {
                label: 'Issue Tracker',
                href: 'https://github.com/users/sparkison/projects/2/views/1',
              },
              {
                label: 'Report Issues',
                href: 'https://github.com/m3ue/m3u-editor/issues',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} M3U Editor. Licensed under CC BY-NC-SA 4.0. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.vsDark,
        // darkTheme: prismThemes.vsDark,
      },
    }),
};

export default config;
