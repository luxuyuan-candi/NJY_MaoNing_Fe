const { loadProfile, saveProfile } = require('../../utils/profileStore');

Page({
  data: {
    profile: loadProfile(),
  },

  onLoad() {
    this.setData({
      profile: loadProfile(),
    });
  },

  onChooseAvatar(e) {
    this.setData({
      profile: {
        ...this.data.profile,
        avatar: e.detail.avatarUrl,
      },
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      profile: {
        ...this.data.profile,
        [field]: e.detail.value,
      },
    });
  },

  saveSettings() {
    const next = {
      ...this.data.profile,
      nickname: this.data.profile.nickname || '未设置昵称',
      userType: this.data.profile.userType || '普通用户',
    };

    saveProfile(next);
    wx.showToast({ title: '已保存', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1200);
  },
});
