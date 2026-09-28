// Homepage feature grid. `icon` is a Material Symbols name - if you add a new
// one, also add it to MATERIAL_ICONS in docusaurus.config.js.
// Browse icons at https://fonts.google.com/icons

export const features = [
  {
    icon: 'playlist_play',
    title: 'Playlists & Channels',
    description: 'Import M3U, M3U8, and Xtream sources, then sort, rename, renumber, and bulk edit thousands of channels. Build custom and merged playlists with the Easy Editor.',
    link: '/docs/resources/playlists',
  },
  {
    icon: 'tv_guide',
    title: 'EPG & TV Guide',
    description: 'XMLTV files, remote URLs, and Schedules Direct with smart channel mapping, dummy EPGs, and a cached, fast built-in guide.',
    link: '/docs/resources/epg-setup',
  },
  {
    icon: 'hub',
    title: 'Serve Any Client',
    description: 'One endpoint for M3U, Xtream Codes API, HDHomeRun, and XMLTV output, with per-playlist auth, aliases, and bouquets.',
    link: '/docs/client_configuration',
  },
  {
    icon: 'bolt',
    title: 'Streaming Proxy',
    description: 'Shared upstream connections, hardware-accelerated transcoding, sticky sessions, and live stream monitoring via M3U Proxy.',
    link: '/docs/proxy/overview',
  },
  {
    icon: 'merge',
    title: 'Auto-Merge & Failover',
    description: 'Deduplicate channels across providers and fail over automatically when a stream drops, plus Xtream DNS failover.',
    link: '/docs/advanced/auto-merge-channels',
  },
  {
    icon: 'radio_button_checked',
    title: 'Built-in DVR',
    description: 'Schedule recordings and series rules straight from the guide, with Comskip, NFO output, OTA support, and disk quotas.',
    link: '/docs/integrations/dvr_integration',
  },
  {
    icon: 'movie',
    title: 'VOD & Series',
    description: 'Organize movies and series, generate .strm files for your media server, and cache content locally for offline playback.',
    link: '/docs/advanced/strm-files',
  },
  {
    icon: 'auto_awesome',
    title: 'TMDB Enrichment',
    description: 'Artwork, cast, and ratings from TMDB, plus dynamic Trending, Popular, and streaming-service groups.',
    link: '/docs/integrations/tmdb_integration',
  },
  {
    icon: 'dns',
    title: 'Media Servers',
    description: 'Bring in libraries from Emby, Jellyfin, Plex, local folders, and WebDAV, then serve them next to your live TV.',
    link: '/docs/integrations/overview',
  },
  {
    icon: 'cloud_download',
    title: 'Requests & Debrid',
    description: 'Request movies and shows through Sonarr and Radarr, and stream debrid catalogs with AIOStreams.',
    link: '/docs/integrations/arrs_integration',
  },
  {
    icon: 'smart_toy',
    title: 'AI Copilot',
    description: 'An in-app assistant that searches, edits, and navigates for you in plain English.',
    link: '/docs/ai-copilot/overview',
  },
  {
    icon: 'extension',
    title: 'Plugins & Automation',
    description: 'Extend the app with plugins, hooks, webhooks, and post-processing scripts, or automate it through the REST API.',
    link: '/docs/extensions/overview',
  },
];

export const ecosystem = [
  {
    icon: 'tune',
    title: 'M3U Editor',
    description: 'The web app where you import, organize, and publish everything.',
    link: 'https://github.com/m3ue/m3u-editor',
    docs: '/docs/intro',
  },
  {
    icon: 'router',
    title: 'M3U Proxy',
    description: 'A high-performance streaming proxy with failover and transcoding.',
    link: 'https://github.com/m3ue/m3u-proxy',
    docs: '/docs/proxy/overview',
  },
  {
    icon: 'tv',
    title: 'M3U TV',
    description: 'A native player for TV, mobile, and desktop, built for M3U Editor.',
    link: 'https://github.com/m3ue/m3u-tv',
    docs: '/docs/m3u-tv/overview',
  },
];

export const flow = {
  sources: ['IPTV providers', 'XMLTV & Schedules Direct', 'Emby, Jellyfin & Plex', 'Local & WebDAV media', 'AIOStreams & *arrs'],
  clients: ['Plex, Emby & Jellyfin', 'TiviMate, Kodi & VLC', 'Any Xtream or M3U app', 'M3U TV'],
};
