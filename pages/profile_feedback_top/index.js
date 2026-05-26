const { ensureLogin } = require('../../utils/auth');
const { fetchNegativeFeedbackTop5, fetchProfile } = require('../../utils/profileApi');

const rankIcons = [
  '../../images/feedback_top5/num-1.png',
  '../../images/feedback_top5/num-2.png',
  '../../images/feedback_top5/num-3.png',
  '../../images/feedback_top5/num-4.png',
  '../../images/feedback_top5/num-5.png',
];

const categoryMeta = {
  其他问题: {
    label: '其他问题',
    icon: '../../images/feedback_top5/plant.png',
  },
  性能卡顿: {
    label: '性能卡顿',
    icon: '../../images/feedback_top5/battery.png',
  },
  页面体验: {
    label: '页面体验',
    icon: '../../images/feedback_top5/screen.png',
  },
  功能异常: {
    label: '功能异常',
    icon: '../../images/feedback_top5/bug.png',
  },
  数据内容: {
    label: '内容问题',
    icon: '../../images/feedback_top5/chat.png',
  },
  反馈建议: {
    label: '反馈建议',
    icon: '../../images/feedback_top5/plant.png',
  },
  账号登录: {
    label: '账号登录',
    icon: '../../images/feedback_top5/chat.png',
  },
};

Page({
  data: {
    rows: [],
    total: 0,
  },

  onShow() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        if (!profile.isAdmin) {
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
            count: Number(item.count || 0),
            percent: total ? Math.max(12, Math.round((Number(item.count || 0) / total) * 100)) : 0,
            rankIcon: rankIcons[index] || rankIcons[4],
            categoryLabel: (categoryMeta[item.problem_category] || categoryMeta['其他问题']).label,
            categoryIcon: (categoryMeta[item.problem_category] || categoryMeta['其他问题']).icon,
          })),
        });
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },
});
