const config = require('./config');
const { getStoredOpenid } = require('./auth');

function buildUrl(path) {
  return `${config.apiBaseUrl}${path}`;
}

function request(options) {
  return new Promise((resolve, reject) => {
    const openid = getStoredOpenid();
    wx.request({
      ...options,
      url: buildUrl(options.url),
      header: {
        ...(options.header || {}),
        ...(openid ? { 'X-User-Openid': openid } : {}),
      },
      success: resolve,
      fail: reject,
    });
  });
}

function uploadFile(options) {
  return new Promise((resolve, reject) => {
    const openid = getStoredOpenid();
    wx.uploadFile({
      ...options,
      url: buildUrl(options.url),
      header: {
        ...(options.header || {}),
        ...(openid ? { 'X-User-Openid': openid } : {}),
      },
      success: resolve,
      fail: reject,
    });
  });
}

function asset(path) {
  return `${config.assetBaseUrl}${path}`;
}

module.exports = {
  asset,
  buildUrl,
  request,
  uploadFile,
};
