const { addFeedback, loadFeedbacks, loadProfile } = require('../../utils/profileStore');

Page({
  data: {
    profile: loadProfile(),
    feedbacks: [],
    draft: '',
  },

  onShow() {
    const profile = loadProfile();
    const feedbacks = profile.userType === '管理员'
      ? loadFeedbacks().map((item) => ({
          ...item,
          formattedTime: item.createdAt.replace('T', ' ').slice(0, 16),
        }))
      : [];

    this.setData({
      profile,
      feedbacks,
    });
  },

  onDraftChange(e) {
    this.setData({
      draft: e.detail.value,
    });
  },

  submitFeedback() {
    const content = this.data.draft.trim();

    if (!content) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }

    addFeedback({
      nickname: this.data.profile.nickname,
      email: this.data.profile.email,
      userType: this.data.profile.userType,
      content,
    });

    this.setData({ draft: '' });
    wx.showToast({ title: '提交成功', icon: 'success' });
  },
});
