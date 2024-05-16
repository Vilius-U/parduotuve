const { addWebpackDevServer } = require('customize-cra');

module.exports = function override(config, env) {
    if (env === 'development') {
      if (!config.devServer) {
        config.devServer = {}; // Ensure devServer object exists
      }
      config.devServer.allowedHosts = 'all';
    }
    return config;
  };  