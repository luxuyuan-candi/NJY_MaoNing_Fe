const config = require('./config');

const OPENID_STORAGE_KEY = 'maoning_openid_v1';
const PROFILE_STORAGE_KEY = 'maoning_profile_cache_v1';

let loginPromise = null;

function getStoredOpenid() {
  return wx.getStorageSync(OPENID_STORAGE_KEY) || '';
}

function setStoredOpenid(openid) {
  wx.setStorageSync(OPENID_STORAGE_KEY, openid);
}

function getCachedProfile() {
  return wx.getStorageSync(PROFILE_STORAGE_KEY) || null;
}

function setCachedProfile(profile) {
  wx.setStorageSync(PROFILE_STORAGE_KEY, profile);
}

function rawRequest(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: resolve,
      fail: reject,
    });
  });
}

function ensureLogin() {
  const cachedOpenid = getStoredOpenid();
  if (cachedOpenid) {
    return Promise.resolve(cachedOpenid);
  }

  if (loginPromise) {
    return loginPromise;
  }

  loginPromise = new Promise((resolve, reject) => {
    wx.login({
      success: ({ code }) => {
        if (!code) {
          loginPromise = null;
          reject(new Error('missing code'));
          return;
        }

        rawRequest({
          url: `${config.apiBaseUrl}/api/auth/wechat-login`,
          method: 'POST',
          data: { code },
          header: {
            'content-type': 'application/json',
          },
        }).then((res) => {
          const profile = res.data && res.data.data;
          if (!res.data || !res.data.success || !profile || !profile.openid) {
            loginPromise = null;
            reject(new Error((res.data && res.data.msg) || 'login failed'));
            return;
          }

          const normalizedProfile = {
            ...profile,
            avatar: profile.avatar ? `${config.apiBaseUrl}${profile.avatar}` : '',
          };
          setStoredOpenid(normalizedProfile.openid);
          setCachedProfile(normalizedProfile);
          loginPromise = null;
          resolve(normalizedProfile.openid);
        }).catch((error) => {
          loginPromise = null;
          reject(error);
        });
      },
      fail: (error) => {
        loginPromise = null;
        reject(error);
      },
    });
  });

  return loginPromise;
}

module.exports = {
  ensureLogin,
  getStoredOpenid,
  getCachedProfile,
  setCachedProfile,
};
