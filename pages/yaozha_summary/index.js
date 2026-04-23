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
    this.fetchSummary();
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
