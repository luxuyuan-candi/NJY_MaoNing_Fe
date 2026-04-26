const config = require('./utils/config');
const { ensureLogin } = require('./utils/auth');

App({
  globalData: {
    apiBaseUrl: config.apiBaseUrl,
    assetBaseUrl: config.assetBaseUrl,
  },

  onLaunch() {
    ensureLogin().catch(() => {});
  },
});
