const { ensureLogin, getCachedProfile } = require('../../utils/auth');
const { fetchProfile } = require('../../utils/profileApi');

Page({
  data: {
    profile: getCachedProfile() || {
      avatar: '',
      nickname: '未设置昵称',
      userType: '普通用户',
    },
    avatarInitial: '猫',
  },

  onShow() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        this.setData({
          profile,
          avatarInitial: (profile.nickname || '猫').slice(0, 1),
        });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  goToSettings() {
    wx.navigateTo({
      url: '/pages/profile_settings/index',
    });
  },

  goToFeedback() {
    wx.navigateTo({
      url: '/pages/profile_feedback/index',
    });
  },

  goToUsers() {
    wx.navigateTo({
      url: '/pages/profile_users/index',
    });
  },
});
