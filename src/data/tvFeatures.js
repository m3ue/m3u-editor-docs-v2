// Content for the /tv (M3U TV) feature page. Icons are Material Symbols
// names; add any new ones to MATERIAL_ICONS in docusaurus.config.js.
//
// Images are require()d rather than linked by path so the build publishes
// them under content-hashed names: replacing a screenshot changes its URL,
// so the CDN can never keep serving the old one.

export const STORE_LINKS = [
  {
    name: 'App Store (TestFlight beta)',
    badge: require('@site/static/img/badges/app-store-badge.png').default,
    href: 'https://testflight.apple.com/join/hqJYVsJr',
    note: 'iPhone, iPad, Apple TV & Mac',
  },
  {
    name: 'Google Play',
    badge: require('@site/static/img/badges/play-store-badge.png').default,
    href: 'https://play.google.com/store/apps/details?id=dev.sparkison.tv&referrer=utm_source%3Ddocs%26utm_campaign%3Dtv_page',
    note: 'Android phones, tablets & Android TV',
  },
  {
    name: 'Microsoft Store',
    badge: require('@site/static/img/badges/microsoft-badge.png').default,
    href: 'https://apps.microsoft.com/detail/9P2PBHQ4XZ1L?referrer=appbadge&cid=docs',
    note: 'Windows 10 & 11',
  },
];

// One tab per device class. Frame decides the device chrome drawn around
// each screenshot; the desktop captures are macOS windows and need none.
export const DEVICE_GALLERIES = [
  {
    key: 'tv',
    label: 'TV',
    icon: 'tv',
    frame: 'tv',
    slidesPerView: 1.1,
    breakpoints: { 768: { slidesPerView: 1.35, spaceBetween: 24 }, 1200: { slidesPerView: 1.5, spaceBetween: 32 } },
    items: [
      { src: require('@site/static/img/tv/tv1.webp').default, alt: 'Home with Continue Watching' },
      { src: require('@site/static/img/tv/tv2.webp').default, alt: 'Live TV guide' },
      { src: require('@site/static/img/tv/tv3.webp').default, alt: 'Movie library' },
      { src: require('@site/static/img/tv/tv4.webp').default, alt: 'Movie details and cast' },
      { src: require('@site/static/img/tv/tv5.webp').default, alt: 'Series details' },
    ],
  },
  {
    key: 'desktop',
    label: 'Desktop',
    icon: 'laptop_mac',
    frame: 'none',
    slidesPerView: 1.1,
    breakpoints: { 768: { slidesPerView: 1.35, spaceBetween: 24 }, 1200: { slidesPerView: 1.5, spaceBetween: 32 } },
    items: [
      { src: require('@site/static/img/tv/desktop1.webp').default, alt: 'Home with Continue Watching' },
      { src: require('@site/static/img/tv/desktop2.webp').default, alt: 'Live TV guide' },
      { src: require('@site/static/img/tv/desktop3.webp').default, alt: 'Movie details and cast' },
      { src: require('@site/static/img/tv/desktop4.webp').default, alt: 'Series library' },
      { src: require('@site/static/img/tv/desktop5.webp').default, alt: 'Series details' },
    ],
  },
  {
    key: 'tablet',
    label: 'Tablet',
    icon: 'tablet_mac',
    frame: 'tablet',
    slidesPerView: 1.4,
    breakpoints: { 600: { slidesPerView: 2.2, spaceBetween: 24 }, 1200: { slidesPerView: 3, spaceBetween: 32 } },
    items: [
      { src: require('@site/static/img/tv/tablet1.webp').default, alt: 'Home' },
      { src: require('@site/static/img/tv/tablet2.webp').default, alt: 'Live TV channels' },
      { src: require('@site/static/img/tv/tablet3.webp').default, alt: 'Movie details' },
      { src: require('@site/static/img/tv/tablet4.webp').default, alt: 'Series details' },
      { src: require('@site/static/img/tv/tablet5.webp').default, alt: 'Movie library' },
    ],
  },
  {
    key: 'phone',
    label: 'Phone',
    icon: 'smartphone',
    frame: 'phone',
    slidesPerView: 1.8,
    breakpoints: { 600: { slidesPerView: 2.6, spaceBetween: 24 }, 996: { slidesPerView: 3.6, spaceBetween: 32 } },
    items: [
      { src: require('@site/static/img/tv/mobile1.webp').default, alt: 'Home' },
      { src: require('@site/static/img/tv/mobile2.webp').default, alt: 'Live TV list' },
      { src: require('@site/static/img/tv/mobile3.webp').default, alt: 'Movie library' },
      { src: require('@site/static/img/tv/mobile4.webp').default, alt: 'Movie details' },
      { src: require('@site/static/img/tv/mobile5.webp').default, alt: 'Series details' },
    ],
  },
];

export const PLATFORMS = [
  { icon: 'tv', label: 'Android TV' },
  { icon: 'connected_tv', label: 'Apple TV' },
  { icon: 'phone_iphone', label: 'iPhone & iPad' },
  { icon: 'smartphone', label: 'Android' },
  { icon: 'laptop_mac', label: 'macOS' },
  { icon: 'desktop_windows', label: 'Windows' },
  { icon: 'terminal', label: 'Linux' },
];

export const TV_FEATURES = [
  {
    icon: 'live_tv',
    title: 'Live TV & guide',
    description: 'Browse channels by category and scroll a full EPG timeline, with catchup badges on programmes you can replay.',
  },
  {
    icon: 'movie',
    title: 'Movies & series',
    description: 'Rich detail pages with artwork, title logos, ratings, cast, and a season picker with an episode strip.',
  },
  {
    icon: 'history',
    title: 'Continue Watching',
    description: 'Progress lives on your M3U Editor instance, so you can stop on the TV and resume on your phone.',
    link: '/docs/m3u-tv/continue-watching',
  },
  {
    icon: 'qr_code_2',
    title: 'Device pairing',
    description: 'Show a short code on the TV, approve it from your phone, and you are in. No typing passwords with a remote.',
    link: '/docs/m3u-tv/device-pairing',
  },
  {
    icon: 'grid_view',
    title: 'Multiview',
    description: 'Watch up to nine live streams at once, promote one to featured, or pop it out into picture-in-picture.',
  },
  {
    icon: 'radio_button_checked',
    title: 'DVR',
    description: 'Schedule recordings right from the guide, browse recorded shows, and skip detected commercial breaks.',
    link: '/docs/integrations/dvr_integration',
  },
  {
    icon: 'skip_next',
    title: 'Skip intro & up next',
    description: 'Jump past intros and roll straight into the next episode with an up next prompt near the end.',
  },
  {
    icon: 'search',
    title: 'Search & favorites',
    description: 'Search across live channels, movies, and series, and pin the things you watch most.',
  },
  {
    icon: 'playlist_add',
    title: 'Requests',
    description: 'Search for movies and shows you do not have yet and request them through your Sonarr and Radarr setup.',
    link: '/docs/integrations/arrs_integration',
  },
  {
    icon: 'travel_explore',
    title: 'AIOStreams',
    description: 'Browse AIOStreams catalogs with the same detail pages as the rest of your library and pick a stream.',
  },
  {
    icon: 'sync',
    title: 'Trakt sync',
    description: 'Connect Trakt with a QR code to keep your watch history in step with your other apps.',
  },
  {
    icon: 'notifications',
    title: 'Push notifications',
    description: 'Get notified on your phone about syncs, recordings, and alerts, even when the app is closed.',
    link: '/docs/m3u-tv/push-notifications',
  },
];

export const PLAYBACK_POINTS = [
  { icon: 'memory', title: 'GPU accelerated', text: 'Hardware decode and render on every platform.' },
  { icon: 'hdr_on', title: 'HDR passthrough', text: 'HDR10 metadata sent straight to your display.' },
  { icon: 'subtitles', title: 'Subtitles & audio', text: 'Pick tracks and load external subtitles.' },
  { icon: 'tune', title: 'Proxy & transcoding', text: 'Optional M3U Proxy profiles per stream type.' },
];

export const PLAYBACK_ENGINES = [
  { platform: 'Android & Android TV', engine: 'ExoPlayer (Media3), with an mpv fallback' },
  { platform: 'iPhone, iPad & Apple TV', engine: 'mpv (MPVKit), with an AVKit fallback' },
  { platform: 'macOS', engine: 'mpv (MPVKit)' },
  { platform: 'Windows & Linux', engine: 'libmpv, in process' },
];

// Direct downloads from the latest GitHub release. `asset` keys match the
// part of the file name after the version in static/data/tv-release.json.
export const DIRECT_DOWNLOADS = [
  { icon: 'tv', platform: 'Android & Android TV', format: 'APK', asset: 'android.apk' },
  { icon: 'phone_iphone', platform: 'iPhone & iPad', format: 'IPA (sideload)', asset: 'ios.ipa' },
  { icon: 'connected_tv', platform: 'Apple TV', format: 'IPA (sideload)', asset: 'tvos.ipa' },
  { icon: 'laptop_mac', platform: 'macOS', format: 'DMG (Universal)', asset: 'macos.dmg' },
  { icon: 'desktop_windows', platform: 'Windows', format: 'Installer', asset: 'windows-setup.exe' },
  { icon: 'folder_zip', platform: 'Windows', format: 'Portable ZIP', asset: 'windows.zip' },
  { icon: 'terminal', platform: 'Linux', format: 'Portable ZIP', asset: 'linux.zip' },
];

export const CONNECT_STEPS = [
  {
    icon: 'dns',
    title: 'Run M3U Editor',
    text: 'M3U TV is a front end for your own M3U Editor instance. Set one up with Docker in a few minutes.',
    link: { to: '/docs/installation', label: 'Installation guide' },
  },
  {
    icon: 'download',
    title: 'Install the app',
    text: 'Grab M3U TV from your app store, or download a build for your platform from GitHub.',
    link: { to: '#download', label: 'Downloads' },
  },
  {
    icon: 'qr_code_2',
    title: 'Pair and watch',
    text: 'Choose "Pair with code" and approve it from M3U Editor, or enter your Xtream login by hand.',
    link: { to: '/docs/m3u-tv/overview#connect-it', label: 'Connecting' },
  },
];
