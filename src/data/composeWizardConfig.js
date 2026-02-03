/**
 * Docker Compose Wizard Configuration
 *
 * This file defines all the sections, variables, and templates for the wizard.
 * To add new variables, simply add them to the appropriate section.
 * To add new sections, add a new object to the WIZARD_SECTIONS array.
 */

// Deployment type options
export const DEPLOYMENT_TYPES = [
  {
    id: 'modular',
    name: 'Modular (Recommended)',
    description: 'Separate containers for m3u-editor and m3u-proxy. Best for production.',
    features: ['Hardware acceleration support', 'Independent service scaling', 'Redis-based stream pooling', 'Easy to manage'],
    recommended: true,
  },
  {
    id: 'aio',
    name: 'All-in-One',
    description: 'Single container for quick testing and development.',
    features: ['Quick setup', 'Minimal configuration', 'Good for testing'],
    limitations: ['No hardware acceleration'],
  },
  {
    id: 'vpn',
    name: 'VPN (Gluetun)',
    description: 'Modular deployment with VPN protection via Gluetun.',
    features: ['All modular benefits', 'VPN protection for streaming', 'Multiple VPN provider support'],
  },
  {
    id: 'external-nginx',
    name: 'External (Nginx)',
    description: 'Fully modular with external Nginx reverse proxy.',
    features: ['Complete service isolation', 'Independent scaling', 'Custom Nginx configuration'],
  },
  {
    id: 'external-caddy',
    name: 'External (Caddy)',
    description: 'Fully modular with Caddy reverse proxy and automatic HTTPS.',
    features: ['Complete service isolation', 'Automatic HTTPS', 'Simple configuration'],
  },
];

// Variable field types
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  BOOLEAN: 'boolean',
  PASSWORD: 'password',
  TEXTAREA: 'textarea',
};

// Wizard sections with their variables
export const WIZARD_SECTIONS = [
  {
    id: 'application',
    title: 'Application Settings',
    description: 'Core application configuration',
    icon: '⚙️',
    variables: [
      {
        name: 'IMAGE_TAG',
        label: 'Version',
        description: 'Docker image version tag for editor and proxy',
        type: FIELD_TYPES.SELECT,
        default: 'latest',
        options: [
          { value: 'latest', label: 'Latest (Stable)' },
          { value: 'dev', label: 'Dev (Development)' },
          { value: 'experimental', label: 'Experimental (Bleeding edge)' },
        ],
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'APP_URL',
        label: 'Application URL',
        description: 'The base URL where your application will be accessible',
        type: FIELD_TYPES.TEXT,
        default: 'http://localhost',
        placeholder: 'https://m3u.example.com',
        required: true,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'APP_PORT',
        label: 'Application Port',
        description: 'Port number for the application',
        type: FIELD_TYPES.NUMBER,
        default: '36400',
        required: true,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'TZ',
        label: 'Timezone',
        description: 'Default timezone for the application',
        type: FIELD_TYPES.TEXT,
        default: 'UTC',
        placeholder: 'America/New_York',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'APP_DEBUG',
        label: 'Debug Mode',
        description: 'Enable debug mode (only for development)',
        type: FIELD_TYPES.BOOLEAN,
        default: false,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'NETWORK_BROADCAST_ENABLED',
        label: 'Network Broadcast',
        description: 'Enable broadcasting for local media server content. Requires media server integration.',
        type: FIELD_TYPES.BOOLEAN,
        default: false,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'database',
    title: 'Database Configuration',
    description: 'Database connection settings',
    icon: '🗄️',
    variables: [
      {
        name: 'DB_CONNECTION',
        label: 'Database Type',
        description: 'Select your database driver',
        type: FIELD_TYPES.SELECT,
        default: 'pgsql',
        options: [
          { value: 'sqlite', label: 'SQLite (Simple, no setup)' },
          { value: 'pgsql', label: 'PostgreSQL (Recommended for production)' },
        ],
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'ENABLE_POSTGRES',
        label: 'Enable Embedded PostgreSQL',
        description: 'Use the embedded PostgreSQL container',
        type: FIELD_TYPES.BOOLEAN,
        default: true,
        showWhen: { field: 'DB_CONNECTION', value: 'pgsql' },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'PG_DATABASE',
        label: 'Database Name',
        description: 'PostgreSQL database name',
        type: FIELD_TYPES.TEXT,
        default: 'm3ue',
        showWhen: { field: 'DB_CONNECTION', value: 'pgsql' },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'PG_USER',
        label: 'Database Username',
        description: 'PostgreSQL username',
        type: FIELD_TYPES.TEXT,
        default: 'm3ue',
        showWhen: { field: 'DB_CONNECTION', value: 'pgsql' },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'PG_PASSWORD',
        label: 'Database Password',
        description: 'PostgreSQL password',
        type: FIELD_TYPES.PASSWORD,
        default: '',
        placeholder: 'Enter a secure password',
        showWhen: { field: 'DB_CONNECTION', value: 'pgsql' },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
        generateButton: true,
      },
      {
        name: 'DB_HOST',
        label: 'Database Host',
        description: 'Database server hostname',
        type: FIELD_TYPES.TEXT,
        default: '127.0.0.1',
        showWhen: { field: 'DB_CONNECTION', values: ['pgsql', 'mysql'] },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'DB_PORT',
        label: 'Database Port',
        description: 'Database server port',
        type: FIELD_TYPES.NUMBER,
        default: '5432',
        showWhen: { field: 'DB_CONNECTION', values: ['pgsql', 'mysql'] },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'proxy',
    title: 'M3U Proxy Configuration',
    description: 'Streaming proxy settings',
    icon: '📡',
    variables: [
      {
        name: 'M3U_PROXY_ENABLED',
        label: 'Proxy Mode',
        description: 'Choose between embedded or external proxy',
        type: FIELD_TYPES.SELECT,
        default: 'external',
        options: [
          { value: 'external', label: 'External (Separate container)' },
          { value: 'embedded', label: 'Embedded (Same container)' },
        ],
        deploymentTypes: ['modular', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'M3U_PROXY_PORT',
        label: 'Proxy Port',
        description: 'Port for the proxy service',
        type: FIELD_TYPES.NUMBER,
        default: '38085',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'M3U_PROXY_HOST',
        label: 'Proxy Host',
        description: 'Hostname for the proxy service',
        type: FIELD_TYPES.TEXT,
        default: 'm3u-proxy',
        showWhen: { field: 'M3U_PROXY_ENABLED', value: 'external' },
        deploymentTypes: ['modular', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'M3U_PROXY_TOKEN',
        label: 'Proxy Token',
        description: 'Authentication token for proxy communication',
        type: FIELD_TYPES.PASSWORD,
        default: '',
        placeholder: 'Auto-generated if empty',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
        generateButton: true,
      },
      {
        name: 'M3U_PROXY_LOG_LEVEL',
        label: 'Proxy Log Level',
        description: 'Logging verbosity for proxy',
        type: FIELD_TYPES.SELECT,
        default: '',
        options: [
          { value: '', label: 'Disabled' },
          { value: 'DEBUG', label: 'Debug' },
          { value: 'INFO', label: 'Info' },
          { value: 'WARN', label: 'Warning' },
          { value: 'ERROR', label: 'Error' },
        ],
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'ENABLE_TRANSCODING_POOLING',
        label: 'Enable Transcoding Pooling',
        description: 'Enable connection pooling for transcoding streams (requires Redis)',
        type: FIELD_TYPES.BOOLEAN,
        default: true,
        showWhen: { field: 'M3U_PROXY_ENABLED', value: 'external' },
        deploymentTypes: ['modular', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'redis',
    title: 'Redis Configuration',
    description: 'Cache and stream pooling settings',
    icon: '🔴',
    variables: [
      {
        name: 'REDIS_MODE',
        label: 'Redis Mode',
        description: 'Internal runs inside the editor container, External uses a separate Redis container',
        type: FIELD_TYPES.SELECT,
        default: 'internal',
        options: [
          { value: 'internal', label: 'Internal (Embedded in editor)' },
          { value: 'external', label: 'External (Separate container)' },
        ],
        deploymentTypes: ['modular', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'REDIS_HOST',
        label: 'Redis Host',
        description: 'Hostname for the Redis service (auto-set based on deployment type)',
        type: FIELD_TYPES.TEXT,
        default: 'm3u-redis',
        showWhen: { field: 'REDIS_MODE', value: 'external' },
        deploymentTypes: ['modular', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'REDIS_SERVER_PORT',
        label: 'Redis Port',
        description: 'Redis server port',
        type: FIELD_TYPES.NUMBER,
        default: '63790',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'REDIS_PASSWORD',
        label: 'Redis Password',
        description: 'Password for Redis authentication (required for external mode)',
        type: FIELD_TYPES.PASSWORD,
        default: '',
        placeholder: 'Generate a secure password',
        showWhen: { field: 'REDIS_MODE', value: 'external' },
        deploymentTypes: ['modular', 'vpn', 'external-nginx', 'external-caddy'],
        generateButton: true,
      },
    ],
  },
  {
    id: 'vpn',
    title: 'VPN Configuration',
    description: 'Gluetun VPN settings',
    icon: '🔒',
    deploymentTypes: ['vpn'],
    variables: [
      {
        name: 'VPN_SERVICE_PROVIDER',
        label: 'VPN Provider',
        description: 'Select your VPN provider',
        type: FIELD_TYPES.SELECT,
        default: 'nordvpn',
        options: [
          { value: 'nordvpn', label: 'NordVPN' },
          { value: 'protonvpn', label: 'ProtonVPN' },
          { value: 'expressvpn', label: 'ExpressVPN' },
          { value: 'mullvad', label: 'Mullvad' },
          { value: 'surfshark', label: 'Surfshark' },
          { value: 'private_internet_access', label: 'Private Internet Access' },
          { value: 'custom', label: 'Custom/OpenVPN' },
        ],
        deploymentTypes: ['vpn'],
      },
      {
        name: 'VPN_TYPE',
        label: 'VPN Type',
        description: 'VPN connection protocol',
        type: FIELD_TYPES.SELECT,
        default: 'openvpn',
        options: [
          { value: 'openvpn', label: 'OpenVPN' },
          { value: 'wireguard', label: 'WireGuard' },
        ],
        deploymentTypes: ['vpn'],
      },
      {
        name: 'OPENVPN_USER',
        label: 'VPN Username',
        description: 'Your VPN service username',
        type: FIELD_TYPES.TEXT,
        default: '',
        placeholder: 'VPN username',
        showWhen: { field: 'VPN_TYPE', value: 'openvpn' },
        deploymentTypes: ['vpn'],
      },
      {
        name: 'OPENVPN_PASSWORD',
        label: 'VPN Password',
        description: 'Your VPN service password',
        type: FIELD_TYPES.PASSWORD,
        default: '',
        placeholder: 'VPN password',
        showWhen: { field: 'VPN_TYPE', value: 'openvpn' },
        deploymentTypes: ['vpn'],
      },
      {
        name: 'WIREGUARD_PRIVATE_KEY',
        label: 'WireGuard Private Key',
        description: 'Your WireGuard private key',
        type: FIELD_TYPES.PASSWORD,
        default: '',
        placeholder: 'WireGuard private key',
        showWhen: { field: 'VPN_TYPE', value: 'wireguard' },
        deploymentTypes: ['vpn'],
      },
      {
        name: 'SERVER_COUNTRIES',
        label: 'Server Countries',
        description: 'Comma-separated list of countries',
        type: FIELD_TYPES.TEXT,
        default: '',
        placeholder: 'USA,Canada,UK',
        deploymentTypes: ['vpn'],
      },
    ],
  },
  {
    id: 'webserver',
    title: 'Web Server Configuration',
    description: 'Nginx/Caddy and PHP-FPM settings',
    icon: '🌐',
    variables: [
      {
        name: 'NGINX_ENABLED',
        label: 'Enable Embedded Nginx',
        description: 'Use the built-in Nginx web server',
        type: FIELD_TYPES.BOOLEAN,
        default: true,
        deploymentTypes: ['modular', 'aio', 'vpn'],
      },
      {
        name: 'FPMPORT',
        label: 'PHP-FPM Port',
        description: 'Port for PHP-FPM (for external web server)',
        type: FIELD_TYPES.NUMBER,
        default: '9000',
        showWhen: { field: 'NGINX_ENABLED', value: false },
        deploymentTypes: ['external-nginx', 'external-caddy'],
      },
      {
        name: 'XTREAM_ONLY_ENABLED',
        label: 'Enable Xtream-Only Endpoint',
        description: 'Enable separate Nginx instance for Xtream API only',
        type: FIELD_TYPES.BOOLEAN,
        default: false,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'XTREAM_PORT',
        label: 'Xtream API Port',
        description: 'Port for Xtream-only endpoint',
        type: FIELD_TYPES.NUMBER,
        default: '36401',
        showWhen: { field: 'XTREAM_ONLY_ENABLED', value: true },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'websocket',
    title: 'WebSocket Configuration',
    description: 'Real-time notification settings',
    icon: '🔌',
    variables: [
      {
        name: 'REVERB_PORT',
        label: 'WebSocket Port',
        description: 'Port for WebSocket server',
        type: FIELD_TYPES.NUMBER,
        default: '36800',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'REVERB_VERIFY',
        label: 'SSL Verification',
        description: 'Enable SSL verification for WebSocket connections',
        type: FIELD_TYPES.BOOLEAN,
        default: true,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'playlist',
    title: 'Playlist Settings',
    description: 'Channel and sync configuration',
    icon: '📋',
    collapsed: true,
    variables: [
      {
        name: 'MAX_CHANNELS',
        label: 'Max Channels',
        description: 'Maximum channels to import from M3U playlists',
        type: FIELD_TYPES.NUMBER,
        default: '50000',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'DISABLE_SYNC_LOGS',
        label: 'Disable Sync Logs',
        description: 'Disable sync log creation (improves SQLite performance)',
        type: FIELD_TYPES.BOOLEAN,
        default: false,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'INVALIDATE_IMPORT',
        label: 'Enable Import Validation',
        description: 'Cancel sync if channel count drops significantly',
        type: FIELD_TYPES.BOOLEAN,
        default: false,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'INVALIDATE_IMPORT_THRESHOLD',
        label: 'Validation Threshold',
        description: 'Minimum channel difference before canceling sync',
        type: FIELD_TYPES.NUMBER,
        default: '100',
        showWhen: { field: 'INVALIDATE_IMPORT', value: true },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'hls',
    title: 'HLS Storage',
    description: 'HLS segment storage and cleanup',
    icon: '💾',
    collapsed: true,
    variables: [
      {
        name: 'HLS_TEMP_DIR',
        label: 'HLS Directory',
        description: 'Directory for storing HLS segments',
        type: FIELD_TYPES.TEXT,
        default: '/tmp/hls',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'HLS_GC_ENABLED',
        label: 'Enable Garbage Collection',
        description: 'Automatically clean up old HLS segments',
        type: FIELD_TYPES.BOOLEAN,
        default: true,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'HLS_GC_INTERVAL',
        label: 'GC Interval (seconds)',
        description: 'How often to run garbage collection',
        type: FIELD_TYPES.NUMBER,
        default: '60',
        showWhen: { field: 'HLS_GC_ENABLED', value: true },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'HLS_GC_AGE_THRESHOLD',
        label: 'GC Age Threshold (seconds)',
        description: 'Delete segments older than this value',
        type: FIELD_TYPES.NUMBER,
        default: '300',
        showWhen: { field: 'HLS_GC_ENABLED', value: true },
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'auth',
    title: 'Authentication',
    description: 'Login and access control settings',
    icon: '🔐',
    collapsed: true,
    variables: [
      {
        name: 'AUTO_LOGIN',
        label: 'Auto Login',
        description: 'Enable auto-login (development only)',
        type: FIELD_TYPES.BOOLEAN,
        default: false,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'LOGIN_PATH',
        label: 'Login Path',
        description: 'Custom path for login page',
        type: FIELD_TYPES.TEXT,
        default: 'login',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'REDIRECT_GUEST_TO_LOGIN',
        label: 'Redirect Guests to Login',
        description: 'Redirect unauthenticated users to login page',
        type: FIELD_TYPES.BOOLEAN,
        default: true,
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
  {
    id: 'volumes',
    title: 'Volume Paths',
    description: 'Data persistence configuration',
    icon: '📁',
    variables: [
      {
        name: 'CONFIG_PATH',
        label: 'Config Volume',
        description: 'Host path for config data',
        type: FIELD_TYPES.TEXT,
        default: './data',
        placeholder: '/path/to/data',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
      {
        name: 'STRM_PATH',
        label: 'STRM Volume',
        description: 'Host path for STRM files (optional)',
        type: FIELD_TYPES.TEXT,
        default: '',
        placeholder: '/path/to/strm',
        deploymentTypes: ['modular', 'aio', 'vpn', 'external-nginx', 'external-caddy'],
      },
    ],
  },
];

// Helper function to generate a secure random token
export const generateToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(length);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return result;
};

// Default values for form initialization
export const getDefaultValues = (deploymentType) => {
  const defaults = {};
  WIZARD_SECTIONS.forEach(section => {
    section.variables.forEach(variable => {
      if (variable.deploymentTypes.includes(deploymentType)) {
        defaults[variable.name] = variable.default;
      }
    });
  });

  // Set deployment-type specific defaults
  // VPN deployments use 127.0.0.1 for all service hosts (Gluetun network)
  if (deploymentType === 'vpn') {
    defaults.M3U_PROXY_HOST = '127.0.0.1';
    defaults.REDIS_HOST = '127.0.0.1';
  } else {
    defaults.M3U_PROXY_HOST = 'm3u-proxy';
    defaults.REDIS_HOST = 'm3u-redis';
  }

  return defaults;
};
