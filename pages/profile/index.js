const { loadProfile } = require('../../utils/profileStore');

Page({
  data: {
    profile: loadProfile(),
    avatarInitial: '猫',
  },

  onShow() {
    const profile = loadProfile();
    this.setData({
      profile,
      avatarInitial: (profile.nickname || '猫').slice(0, 1),
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
});
