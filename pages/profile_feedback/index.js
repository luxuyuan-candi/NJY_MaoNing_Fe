const { ensureLogin, getCachedProfile } = require('../../utils/auth');
const { fetchFeedbacks, fetchProfile, submitFeedback } = require('../../utils/profileApi');

Page({
  data: {
    profile: getCachedProfile() || {
      userType: '普通用户',
    },
    feedbacks: [],
    draft: '',
  },

  onShow() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        this.setData({ profile });
        if (profile.userType === '管理员') {
          return fetchFeedbacks();
        }
        return [];
      })
      .then((feedbacks) => {
        this.setData({
          feedbacks: feedbacks.map((item) => ({
            ...item,
            formattedTime: item.created_at ? String(item.created_at).replace('T', ' ').slice(0, 16) : '',
            nickname: item.nickname_snapshot || '未设置昵称',
            email: item.email_snapshot || '未填写邮箱',
          })),
        });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
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

    submitFeedback(content)
      .then(() => {
        this.setData({ draft: '' });
        wx.showToast({ title: '提交成功', icon: 'success' });
      })
      .catch((error) => {
        wx.showToast({ title: error.message || '提交失败', icon: 'none' });
      });
  },
});
