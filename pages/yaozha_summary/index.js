const { ensureLogin } = require('../../utils/auth');
const { fetchProfile } = require('../../utils/profileApi');
const { request } = require('../../utils/request');

const TYPE_MAP = {
  company: '单位',
  person: '个人',
};

Page({
  data: {
    summaryList: [],
    activeFilter: 'all',
  },

  onLoad() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        if (profile.userType !== '管理员') {
          wx.showToast({ title: '仅管理员可查看统计', icon: 'none' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1200);
          return null;
        }
        this.fetchSummary();
        return null;
      })
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  fetchSummary() {
    const { activeFilter } = this.data;
    let url = '/api/recycle_summary';

    if (activeFilter !== 'all') {
      url += `?type=${activeFilter}`;
    }

    request({
      url,
      method: 'GET',
    }).then((res) => {
      if (!res.data.success) {
        throw new Error('load failed');
      }

      this.setData({
        summaryList: res.data.data.map((item) => ({
          ...item,
          typeLabel: TYPE_MAP[item.type] || item.type,
        })),
      });
    }).catch(() => {
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  changeFilter(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ activeFilter: type }, () => {
      this.fetchSummary();
    });
  },

  goToDetail(e) {
    const { unit, location } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/yaozha_summary_detail/index?unit=${encodeURIComponent(unit)}&location=${encodeURIComponent(location)}`,
    });
  },
});
