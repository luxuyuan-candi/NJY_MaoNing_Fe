const config = require('./config');

function buildUrl(path) {
  return `${config.apiBaseUrl}${path}`;
}

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: buildUrl(options.url),
      success: resolve,
      fail: reject,
    });
  });
}

function uploadFile(options) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      ...options,
      url: buildUrl(options.url),
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
