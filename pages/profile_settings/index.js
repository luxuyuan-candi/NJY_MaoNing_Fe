const { loadProfile, saveProfile } = require('../../utils/profileStore');

Page({
  data: {
    profile: loadProfile(),
    userTypes: ['普通用户', '管理员'],
    userTypeIndex: 0,
  },

  onLoad() {
    const profile = loadProfile();
    const userTypes = ['普通用户', '管理员'];
    this.setData({
      profile,
      userTypeIndex: Math.max(userTypes.indexOf(profile.userType), 0),
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

  onTypeChange(e) {
    const index = Number(e.detail.value);
    const nextType = this.data.userTypes[index] || '普通用户';

    this.setData({
      userTypeIndex: index,
      profile: {
        ...this.data.profile,
        userType: nextType,
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
