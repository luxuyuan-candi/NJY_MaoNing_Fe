const { ensureLogin } = require('../../utils/auth');
const { fetchNegativeFeedbackTop5, fetchProfile } = require('../../utils/profileApi');

Page({
  data: {
    rows: [],
    total: 0,
  },

  onShow() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        if (profile.userType !== '管理员') {
          wx.showToast({ title: '无权限', icon: 'none' });
          setTimeout(() => wx.navigateBack(), 600);
          return [];
        }
        return fetchNegativeFeedbackTop5();
      })
      .then((rows) => {
        const total = rows.reduce((sum, item) => sum + Number(item.count || 0), 0);
        this.setData({
          total,
          rows: rows.map((item, index) => ({
            ...item,
            rank: index + 1,
            percent: total ? Math.round((Number(item.count || 0) / total) * 100) : 0,
          })),
        });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },
});
