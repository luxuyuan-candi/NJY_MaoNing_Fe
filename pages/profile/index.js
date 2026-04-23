const STORAGE_KEY = 'maoning_profile';

Page({
  data: {
    profile: {
      nickname: '',
      phone: '',
      role: '',
    },
  },

  onShow() {
    this.loadProfile();
  },

  loadProfile() {
    const saved = wx.getStorageSync(STORAGE_KEY);

    if (saved) {
      this.setData({ profile: saved });
    }
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;

    this.setData({
      profile: {
        ...this.data.profile,
        [field]: value,
      },
    });
  },

  saveProfile() {
    wx.setStorageSync(STORAGE_KEY, this.data.profile);
    wx.showToast({ title: '已保存', icon: 'success' });
  },
});
