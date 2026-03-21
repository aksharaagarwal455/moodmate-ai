// C:\Users\paras\moodcast-ai\config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
  // Add polyfills for Node.js core modules
  const fallbacks = config.resolve.fallback || {};
  Object.assign(fallbacks, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    fs: false, // File system is not available in the browser
    path: require.resolve('path-browserify'),
    buffer: require.resolve('buffer'),
    vm: require.resolve('vm-browserify'), // <--- ADD THIS LINE
  });
  config.resolve.fallback = fallbacks;

  // Add alias for 'process/browser' to handle explicit imports
  const aliases = config.resolve.alias || {};
  Object.assign(aliases, {
    'process/browser': require.resolve('process/browser.js'),
  });
  config.resolve.alias = aliases;

  // Provide global variables for 'process' and 'Buffer'
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};