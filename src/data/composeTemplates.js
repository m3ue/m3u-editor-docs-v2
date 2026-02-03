/**
 * Docker Compose Template Generator
 *
 * Generates docker-compose.yml content based on wizard configuration.
 *
 * Service inclusion logic:
 * - AIO: Only m3u-editor (everything embedded)
 * - Proxy Mode:
 *   - embedded: No m3u-proxy container
 *   - external: Include m3u-proxy container
 * - Redis Mode:
 *   - internal: Redis embedded in editor, no m3u-redis container
 *   - external: Include m3u-redis container with password
 */

// Helper to format environment variables
const formatEnvVar = (name, value) => {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'boolean') return `      - ${name}=${value}`;
  return `      - ${name}=${value}`;
};

// Helper to add conditional env vars
const addEnvVar = (envVars, name, value, condition = true) => {
  if (condition && value !== '' && value !== null && value !== undefined) {
    envVars.push(formatEnvVar(name, value));
  }
};

// Check if external proxy is enabled
const isProxyExternal = (config) => config.M3U_PROXY_ENABLED === 'external';

// Check if external redis is enabled
const isRedisExternal = (config) => config.REDIS_MODE === 'external';

// Get image tag (default to 'latest')
const getImageTag = (config) => config.IMAGE_TAG || 'latest';

// Generate environment section for m3u-editor
const generateEditorEnv = (config, deploymentType) => {
  const envVars = [];
  const proxyExternal = isProxyExternal(config);
  const redisExternal = isRedisExternal(config);

  // Application settings
  addEnvVar(envVars, 'APP_URL', config.APP_URL);
  addEnvVar(envVars, 'APP_PORT', config.APP_PORT);
  addEnvVar(envVars, 'TZ', config.TZ);
  addEnvVar(envVars, 'APP_DEBUG', config.APP_DEBUG, config.APP_DEBUG);

  // Database settings
  addEnvVar(envVars, 'DB_CONNECTION', config.DB_CONNECTION);
  if (config.DB_CONNECTION === 'pgsql') {
    addEnvVar(envVars, 'ENABLE_POSTGRES', config.ENABLE_POSTGRES, config.ENABLE_POSTGRES);
    addEnvVar(envVars, 'PG_DATABASE', config.PG_DATABASE);
    addEnvVar(envVars, 'PG_USER', config.PG_USER);
    addEnvVar(envVars, 'PG_PASSWORD', config.PG_PASSWORD);
    addEnvVar(envVars, 'DB_HOST', config.DB_HOST);
    addEnvVar(envVars, 'DB_PORT', config.DB_PORT);
  }

  // Proxy settings (not for AIO)
  if (deploymentType !== 'aio') {
    // M3U_PROXY_ENABLED: true = embedded, false = external
    addEnvVar(envVars, 'M3U_PROXY_ENABLED', !proxyExternal);

    if (proxyExternal) {
      // External proxy - use configured host (127.0.0.1 for VPN, m3u-proxy for others)
      addEnvVar(envVars, 'M3U_PROXY_HOST', config.M3U_PROXY_HOST || 'm3u-proxy');
      addEnvVar(envVars, 'M3U_PROXY_PORT', '8085'); // Internal container port
    } else {
      // Embedded proxy - runs on localhost inside editor
      addEnvVar(envVars, 'M3U_PROXY_HOST', 'localhost');
      addEnvVar(envVars, 'M3U_PROXY_PORT', config.M3U_PROXY_PORT || '8085');
    }

    addEnvVar(envVars, 'M3U_PROXY_TOKEN', config.M3U_PROXY_TOKEN);
    addEnvVar(envVars, 'M3U_PROXY_LOG_LEVEL', config.M3U_PROXY_LOG_LEVEL, config.M3U_PROXY_LOG_LEVEL);
  }

  // Redis settings (not for AIO)
  if (deploymentType !== 'aio') {
    if (redisExternal) {
      // External Redis - use configured host (127.0.0.1 for VPN, m3u-redis for others)
      // Disable embedded Redis since we're using external
      addEnvVar(envVars, 'REDIS_ENABLED', false);
      addEnvVar(envVars, 'REDIS_HOST', config.REDIS_HOST || 'm3u-redis');
      addEnvVar(envVars, 'REDIS_SERVER_PORT', config.REDIS_SERVER_PORT || '6379');
      addEnvVar(envVars, 'REDIS_PASSWORD', config.REDIS_PASSWORD);
    } else {
      // Internal Redis - runs on localhost inside editor
      addEnvVar(envVars, 'REDIS_ENABLED', true);
      addEnvVar(envVars, 'REDIS_HOST', 'localhost');
      addEnvVar(envVars, 'REDIS_SERVER_PORT', config.REDIS_SERVER_PORT || '6379');
    }
  }

  // Web server settings
  if (deploymentType === 'external-nginx' || deploymentType === 'external-caddy') {
    addEnvVar(envVars, 'NGINX_ENABLED', false);
    addEnvVar(envVars, 'FPMPORT', config.FPMPORT || '9000');
  }

  addEnvVar(envVars, 'XTREAM_ONLY_ENABLED', config.XTREAM_ONLY_ENABLED, config.XTREAM_ONLY_ENABLED);
  addEnvVar(envVars, 'XTREAM_PORT', config.XTREAM_PORT, config.XTREAM_ONLY_ENABLED);

  // WebSocket settings
  addEnvVar(envVars, 'REVERB_PORT', config.REVERB_PORT);
  addEnvVar(envVars, 'REVERB_VERIFY', config.REVERB_VERIFY, !config.REVERB_VERIFY);

  // Playlist settings
  addEnvVar(envVars, 'MAX_CHANNELS', config.MAX_CHANNELS, config.MAX_CHANNELS !== '50000');
  addEnvVar(envVars, 'DISABLE_SYNC_LOGS', config.DISABLE_SYNC_LOGS, config.DISABLE_SYNC_LOGS);
  addEnvVar(envVars, 'INVALIDATE_IMPORT', config.INVALIDATE_IMPORT, config.INVALIDATE_IMPORT);
  addEnvVar(envVars, 'INVALIDATE_IMPORT_THRESHOLD', config.INVALIDATE_IMPORT_THRESHOLD, config.INVALIDATE_IMPORT);

  // HLS settings (not for AIO)
  if (deploymentType !== 'aio') {
    addEnvVar(envVars, 'HLS_TEMP_DIR', config.HLS_TEMP_DIR, config.HLS_TEMP_DIR !== '/tmp/hls');
    addEnvVar(envVars, 'HLS_GC_ENABLED', config.HLS_GC_ENABLED, !config.HLS_GC_ENABLED);
    addEnvVar(envVars, 'HLS_GC_INTERVAL', config.HLS_GC_INTERVAL, config.HLS_GC_INTERVAL !== '60');
    addEnvVar(envVars, 'HLS_GC_AGE_THRESHOLD', config.HLS_GC_AGE_THRESHOLD, config.HLS_GC_AGE_THRESHOLD !== '300');
  }

  // Auth settings
  addEnvVar(envVars, 'AUTO_LOGIN', config.AUTO_LOGIN, config.AUTO_LOGIN);
  addEnvVar(envVars, 'LOGIN_PATH', config.LOGIN_PATH, config.LOGIN_PATH !== 'login');
  addEnvVar(envVars, 'REDIRECT_GUEST_TO_LOGIN', config.REDIRECT_GUEST_TO_LOGIN, !config.REDIRECT_GUEST_TO_LOGIN);

  return envVars.filter(Boolean).join('\n');
};

// Generate volumes section
const generateVolumes = (config) => {
  const volumes = [];
  volumes.push(`      - ${config.CONFIG_PATH || './data'}:/config`);
  if (config.STRM_PATH) {
    volumes.push(`      - ${config.STRM_PATH}:/strm`);
  }
  return volumes.join('\n');
};

// Generate m3u-proxy service
const generateProxyService = (config, useVpnNetwork = false) => {
  const redisExternal = isRedisExternal(config);
  const imageTag = getImageTag(config);
  // Use the configured redis host from the form
  // For VPN, this will be 127.0.0.1; for others, it will be m3u-redis or m3u-editor
  let redisHost;
  if (redisExternal) {
    redisHost = config.REDIS_HOST || 'm3u-redis';
  } else {
    // Redis is embedded in editor, so proxy needs to connect to editor
    // Use 127.0.0.1 for VPN (same network), m3u-editor for others
    redisHost = useVpnNetwork ? '127.0.0.1' : 'm3u-editor';
  }

  let service = `
  m3u-proxy:
    image: sparkison/m3u-proxy:${imageTag}
    container_name: m3u-proxy`;

  if (useVpnNetwork) {
    service += `
    network_mode: "service:gluetun"`;
  }

  service += `
    environment:
      - API_TOKEN=\${M3U_PROXY_TOKEN:-${config.M3U_PROXY_TOKEN}}
      - REDIS_ENABLED=true
      - REDIS_HOST=${redisHost}
      - REDIS_SERVER_PORT=${config.REDIS_SERVER_PORT || '6379'}
      - REDIS_DB=6`;

  if (redisExternal && config.REDIS_PASSWORD) {
    service += `
      - REDIS_PASSWORD=\${REDIS_PASSWORD:-${config.REDIS_PASSWORD}}`;
  }

  // Only add ENABLE_TRANSCODING_POOLING if it's enabled (default true)
  if (config.ENABLE_TRANSCODING_POOLING !== false) {
    service += `
      - ENABLE_TRANSCODING_POOLING=true`;
  }

  service += `
      - LOG_LEVEL=${config.M3U_PROXY_LOG_LEVEL || 'INFO'}`;

  if (!useVpnNetwork) {
    service += `
    ports:
      - "${config.M3U_PROXY_PORT || '38085'}:8085"`;
  }

  service += `
    restart: unless-stopped`;

  if (useVpnNetwork) {
    service += `
    depends_on:
      - gluetun`;
    if (redisExternal) {
      service += `
      - m3u-redis`;
    } else {
      service += `
      - m3u-editor`;
    }
  } else {
    if (redisExternal) {
      service += `
    depends_on:
      - m3u-redis
    networks:
      - m3u-network`;
    } else {
      service += `
    depends_on:
      - m3u-editor
    networks:
      - m3u-network`;
    }
  }

  return service;
};

// Generate m3u-redis service
const generateRedisService = (config) => {
  let service = `
  m3u-redis:
    image: redis:alpine
    container_name: m3u-redis`;

  if (config.REDIS_PASSWORD) {
    service += `
    command: redis-server --appendonly yes --requirepass "\${REDIS_PASSWORD:-${config.REDIS_PASSWORD}}"`;
  } else {
    service += `
    command: redis-server --appendonly yes`;
  }

  service += `
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - m3u-network`;

  return service;
};

// Template generators for each deployment type
export const generateModularCompose = (config) => {
  const editorEnv = generateEditorEnv(config, 'modular');
  const volumes = generateVolumes(config);
  const proxyExternal = isProxyExternal(config);
  const redisExternal = isRedisExternal(config);
  const imageTag = getImageTag(config);

  // Build depends_on for editor
  const editorDependsOn = [];
  if (proxyExternal) editorDependsOn.push('m3u-proxy');
  if (redisExternal) editorDependsOn.push('m3u-redis');

  let compose = `# Docker Compose - Modular Deployment
# Generated by M3U Editor Compose Wizard
# https://m3u-editor.com/compose-wizard
`;

  // Add note about embedded services
  if (!proxyExternal && !redisExternal) {
    compose += `#
# Note: Proxy and Redis are running embedded in the editor container.
`;
  } else if (!proxyExternal) {
    compose += `#
# Note: Proxy is running embedded in the editor container.
`;
  } else if (!redisExternal) {
    compose += `#
# Note: Redis is running embedded in the editor container.
`;
  }

  compose += `
services:
  m3u-editor:
    image: sparkison/m3u-editor:${imageTag}
    container_name: m3u-editor
    environment:
${editorEnv}
    volumes:
${volumes}
    ports:
      - "${config.APP_PORT}:${config.APP_PORT}"${config.XTREAM_ONLY_ENABLED ? `
      - "${config.XTREAM_PORT}:${config.XTREAM_PORT}"` : ''}
    restart: unless-stopped`;

  if (editorDependsOn.length > 0) {
    compose += `
    depends_on:
${editorDependsOn.map(d => `      - ${d}`).join('\n')}`;
  }

  compose += `
    networks:
      - m3u-network`;

  // Add m3u-proxy service if external
  if (proxyExternal) {
    compose += generateProxyService(config);
  }

  // Add m3u-redis service if external
  if (redisExternal) {
    compose += generateRedisService(config);
  }

  compose += `

networks:
  m3u-network:
    driver: bridge`;

  // Add volumes section if redis is external
  if (redisExternal) {
    compose += `

volumes:
  redis-data:`;
  }

  compose += '\n';

  return compose;
};

export const generateAioCompose = (config) => {
  const editorEnv = generateEditorEnv(config, 'aio');
  const volumes = generateVolumes(config);
  const imageTag = getImageTag(config);

  return `# Docker Compose - All-in-One Deployment
# Generated by M3U Editor Compose Wizard
# https://m3u-editor.com/compose-wizard
#
# Note: This configuration does NOT support hardware acceleration.
# Proxy and Redis run embedded in the editor container.
# For hardware acceleration, use the Modular deployment with external proxy.

services:
  m3u-editor:
    image: sparkison/m3u-editor:${imageTag}
    container_name: m3u-editor
    environment:
${editorEnv}
    volumes:
${volumes}
    ports:
      - "${config.APP_PORT}:${config.APP_PORT}"${config.XTREAM_ONLY_ENABLED ? `
      - "${config.XTREAM_PORT}:${config.XTREAM_PORT}"` : ''}
    restart: unless-stopped
`;
};

export const generateVpnCompose = (config) => {
  const editorEnv = generateEditorEnv(config, 'vpn');
  const volumes = generateVolumes(config);
  const proxyExternal = isProxyExternal(config);
  const redisExternal = isRedisExternal(config);
  const imageTag = getImageTag(config);

  // VPN-specific environment variables
  let vpnEnv = `      - VPN_SERVICE_PROVIDER=${config.VPN_SERVICE_PROVIDER}
      - VPN_TYPE=${config.VPN_TYPE}`;

  if (config.VPN_TYPE === 'openvpn') {
    if (config.OPENVPN_USER) vpnEnv += `\n      - OPENVPN_USER=${config.OPENVPN_USER}`;
    if (config.OPENVPN_PASSWORD) vpnEnv += `\n      - OPENVPN_PASSWORD=${config.OPENVPN_PASSWORD}`;
  } else if (config.VPN_TYPE === 'wireguard') {
    if (config.WIREGUARD_PRIVATE_KEY) vpnEnv += `\n      - WIREGUARD_PRIVATE_KEY=${config.WIREGUARD_PRIVATE_KEY}`;
  }

  if (config.SERVER_COUNTRIES) {
    vpnEnv += `\n      - SERVER_COUNTRIES=${config.SERVER_COUNTRIES}`;
  }

  // Build depends_on for editor
  const editorDependsOn = [];
  if (proxyExternal) editorDependsOn.push('m3u-proxy');
  if (redisExternal) editorDependsOn.push('m3u-redis');

  let compose = `# Docker Compose - VPN Deployment (Gluetun)
# Generated by M3U Editor Compose Wizard
# https://m3u-editor.com/compose-wizard
#
# IMPORTANT: Configure your VPN provider settings below.
# See https://github.com/qdm12/gluetun for provider-specific configuration.
`;

  if (!proxyExternal) {
    compose += `#
# Note: Proxy is running embedded in the editor container (not through VPN).
# For VPN protection on proxy traffic, use External proxy mode.
`;
  }

  compose += `
services:
  gluetun:
    image: qmcgaw/gluetun:latest
    container_name: gluetun
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun:/dev/net/tun
    environment:
${vpnEnv}
    ports:
      - "${config.APP_PORT}:${config.APP_PORT}"  # m3u-editor${config.XTREAM_ONLY_ENABLED ? `
      - "${config.XTREAM_PORT}:${config.XTREAM_PORT}"  # xtream-only` : ''}`;

  if (proxyExternal) {
    compose += `
      - "${config.M3U_PROXY_PORT || '38085'}:8085"  # m3u-proxy`;
  }

  compose += `
    volumes:
      - gluetun-data:/gluetun
    restart: unless-stopped
    networks:
      - m3u-network

  m3u-editor:
    image: sparkison/m3u-editor:${imageTag}
    container_name: m3u-editor
    network_mode: "service:gluetun"
    environment:
${editorEnv}
    volumes:
${volumes}
    restart: unless-stopped
    depends_on:
      - gluetun`;

  if (redisExternal) {
    compose += `
      - m3u-redis`;
  }

  // Add m3u-proxy service if external (runs through VPN)
  if (proxyExternal) {
    compose += generateProxyService(config, true);
  }

  // Add m3u-redis service if external
  if (redisExternal) {
    compose += generateRedisService(config);
  }

  compose += `

networks:
  m3u-network:
    driver: bridge

volumes:
  gluetun-data:`;

  if (redisExternal) {
    compose += `
  redis-data:`;
  }

  compose += '\n';

  return compose;
};

export const generateExternalNginxCompose = (config) => {
  const editorEnv = generateEditorEnv(config, 'external-nginx');
  const volumes = generateVolumes(config);
  const proxyExternal = isProxyExternal(config);
  const redisExternal = isRedisExternal(config);
  const imageTag = getImageTag(config);

  // Build depends_on for editor
  const editorDependsOn = [];
  if (proxyExternal) editorDependsOn.push('m3u-proxy');
  if (redisExternal) editorDependsOn.push('m3u-redis');

  let compose = `# Docker Compose - External Nginx Deployment
# Generated by M3U Editor Compose Wizard
# https://m3u-editor.com/compose-wizard
#
# This configuration uses an external Nginx reverse proxy.
# See the Nginx configuration section below.

services:
  m3u-editor:
    image: sparkison/m3u-editor:${imageTag}
    container_name: m3u-editor
    environment:
${editorEnv}
    volumes:
${volumes}
    restart: unless-stopped`;

  if (editorDependsOn.length > 0) {
    compose += `
    depends_on:
${editorDependsOn.map(d => `      - ${d}`).join('\n')}`;
  }

  compose += `
    networks:
      - m3u-network`;

  // Add m3u-proxy service if external
  if (proxyExternal) {
    compose += generateProxyService(config);
  }

  // Add m3u-redis service if external
  if (redisExternal) {
    compose += generateRedisService(config);
  }

  compose += `

  nginx:
    image: nginx:alpine
    container_name: m3u-nginx
    ports:
      - "${config.APP_PORT}:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ${config.CONFIG_PATH || './data'}:/var/www/html:ro
    restart: unless-stopped
    depends_on:
      - m3u-editor
    networks:
      - m3u-network

networks:
  m3u-network:
    driver: bridge`;

  if (redisExternal) {
    compose += `

volumes:
  redis-data:`;
  }

  compose += `

# -----------------------------------------------------------
# NGINX CONFIGURATION
# Save the following as nginx.conf in the same directory
# -----------------------------------------------------------
#
# worker_processes auto;
# events { worker_connections 1024; }
#
# http {
#     include /etc/nginx/mime.types;
#     default_type application/octet-stream;
#
#     upstream php-fpm {
#         server m3u-editor:${config.FPMPORT || '9000'};
#     }
#
#     server {
#         listen 80;
#         server_name _;
#         root /var/www/html/public;
#         index index.php;
#
#         location / {
#             try_files $uri $uri/ /index.php?$query_string;
#         }
#
#         location ~ \\.php$ {
#             fastcgi_pass php-fpm;
#             fastcgi_index index.php;
#             fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
#             include fastcgi_params;
#         }
#     }
# }
`;

  return compose;
};

export const generateExternalCaddyCompose = (config) => {
  const editorEnv = generateEditorEnv(config, 'external-caddy');
  const volumes = generateVolumes(config);
  const proxyExternal = isProxyExternal(config);
  const redisExternal = isRedisExternal(config);
  const imageTag = getImageTag(config);

  // Extract domain from APP_URL
  const domain = config.APP_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'localhost';

  // Build depends_on for editor
  const editorDependsOn = [];
  if (proxyExternal) editorDependsOn.push('m3u-proxy');
  if (redisExternal) editorDependsOn.push('m3u-redis');

  let compose = `# Docker Compose - External Caddy Deployment
# Generated by M3U Editor Compose Wizard
# https://m3u-editor.com/compose-wizard
#
# This configuration uses Caddy reverse proxy with automatic HTTPS.

services:
  m3u-editor:
    image: sparkison/m3u-editor:${imageTag}
    container_name: m3u-editor
    environment:
${editorEnv}
    volumes:
${volumes}
    restart: unless-stopped`;

  if (editorDependsOn.length > 0) {
    compose += `
    depends_on:
${editorDependsOn.map(d => `      - ${d}`).join('\n')}`;
  }

  compose += `
    networks:
      - m3u-network`;

  // Add m3u-proxy service if external
  if (proxyExternal) {
    compose += generateProxyService(config);
  }

  // Add m3u-redis service if external
  if (redisExternal) {
    compose += generateRedisService(config);
  }

  compose += `

  caddy:
    image: caddy:alpine
    container_name: m3u-caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data
      - caddy-config:/config
      - ${config.CONFIG_PATH || './data'}:/var/www/html:ro
    restart: unless-stopped
    depends_on:
      - m3u-editor
    networks:
      - m3u-network

networks:
  m3u-network:
    driver: bridge

volumes:
  caddy-data:
  caddy-config:`;

  if (redisExternal) {
    compose += `
  redis-data:`;
  }

  compose += `

# -----------------------------------------------------------
# CADDYFILE CONFIGURATION
# Save the following as Caddyfile in the same directory
# -----------------------------------------------------------
#
# ${domain} {
#     root * /var/www/html/public
#     php_fastcgi m3u-editor:${config.FPMPORT || '9000'}
#     file_server
#     encode gzip
#
#     @proxy path /proxy/*
#     reverse_proxy @proxy m3u-proxy:8085
# }
`;

  return compose;
};

// Main generator function
export const generateComposeFile = (deploymentType, config) => {
  switch (deploymentType) {
    case 'modular':
      return generateModularCompose(config);
    case 'aio':
      return generateAioCompose(config);
    case 'vpn':
      return generateVpnCompose(config);
    case 'external-nginx':
      return generateExternalNginxCompose(config);
    case 'external-caddy':
      return generateExternalCaddyCompose(config);
    default:
      return generateModularCompose(config);
  }
};

// Generate .env file content
export const generateEnvFile = (config) => {
  const lines = [
    '# M3U Editor Environment Configuration',
    '# Generated by M3U Editor Compose Wizard',
    '',
  ];

  // Add token for docker-compose variable substitution
  if (config.M3U_PROXY_TOKEN) {
    lines.push(`M3U_PROXY_TOKEN=${config.M3U_PROXY_TOKEN}`);
  }
  if (config.PG_PASSWORD) {
    lines.push(`PG_PASSWORD=${config.PG_PASSWORD}`);
  }
  if (config.REDIS_PASSWORD && config.REDIS_MODE === 'external') {
    lines.push(`REDIS_PASSWORD=${config.REDIS_PASSWORD}`);
  }

  return lines.join('\n');
};
