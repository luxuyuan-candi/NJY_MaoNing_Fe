const config = require('./utils/config');

App({
  globalData: {
    apiBaseUrl: config.apiBaseUrl,
    assetBaseUrl: config.assetBaseUrl,
  },
});
