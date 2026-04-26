const { ensureLogin, getCachedProfile } = require('../../utils/auth');
const { fetchProfile, updateProfile, uploadAvatar } = require('../../utils/profileApi');

Page({
  data: {
    profile: getCachedProfile() || {
      avatar: '',
      nickname: '',
      email: '',
    },
  },

  onLoad() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        this.setData({ profile });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
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
    const nextProfile = {
      ...this.data.profile,
      nickname: this.data.profile.nickname || '未设置昵称',
    };

    const save = nextProfile.avatar && !/^https?:\/\//.test(nextProfile.avatar) && nextProfile.avatar.indexOf('/api/assets/') !== 0
      ? uploadAvatar(nextProfile.avatar).then((avatarData) => updateProfile({
          nickname: nextProfile.nickname,
          email: nextProfile.email,
          avatarKey: avatarData.avatarKey,
        }))
      : updateProfile({
          nickname: nextProfile.nickname,
          email: nextProfile.email,
        });

    save.then(() => {
      wx.showToast({ title: '已保存', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    }).catch((error) => {
      wx.showToast({ title: error.message || '保存失败', icon: 'none' });
    });
  },
});
