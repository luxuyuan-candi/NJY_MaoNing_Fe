const PROFILE_STORAGE_KEY = 'maoning_profile_v2';
const FEEDBACKS_STORAGE_KEY = 'maoning_feedbacks_v1';

const DEFAULT_PROFILE = {
  avatar: '',
  nickname: '未设置昵称',
  email: '',
  userType: '普通用户',
};

function loadProfile() {
  const saved = wx.getStorageSync(PROFILE_STORAGE_KEY) || {};
  return {
    ...DEFAULT_PROFILE,
    ...saved,
  };
}

function saveProfile(profile) {
  const next = {
    ...DEFAULT_PROFILE,
    ...profile,
  };
  wx.setStorageSync(PROFILE_STORAGE_KEY, next);
  return next;
}

function loadFeedbacks() {
  const saved = wx.getStorageSync(FEEDBACKS_STORAGE_KEY) || [];
  return saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function addFeedback(payload) {
  const feedbacks = loadFeedbacks();
  const next = [
    {
      id: `fb_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...payload,
    },
    ...feedbacks,
  ];
  wx.setStorageSync(FEEDBACKS_STORAGE_KEY, next);
  return next;
}

module.exports = {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  loadFeedbacks,
  addFeedback,
};
