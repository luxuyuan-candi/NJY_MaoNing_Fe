const { request } = require('../../utils/request');

const TYPE_MAP = {
  company: '单位',
  person: '个人',
};

Page({
  data: {
    unitList: [],
    filters: ['全部', '单位', '个人'],
    activeFilter: '全部',
  },

  onLoad() {
    this.fetchRecycleList();
  },

  onPullDownRefresh() {
    this.fetchRecycleList(() => {
      wx.stopPullDownRefresh();
    });
  },

  onFilterChange(e) {
    const selected = e.currentTarget.dataset.type;
    this.setData({ activeFilter: selected }, () => {
      this.fetchRecycleList();
    });
  },

  fetchRecycleList(callback) {
    let url = '/api/get_recycles';
    const typeMap = { '单位': 'company', '个人': 'person' };
    const typeParam = typeMap[this.data.activeFilter];

    if (typeParam) {
      url += `?type=${encodeURIComponent(typeParam)}`;
    }

    request({
      url,
      method: 'GET',
    }).then((res) => {
      if (!res.data.success) {
        throw new Error('load failed');
      }

      const formattedList = res.data.data.map((item) => {
        const dateObj = new Date(item.date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return {
          ...item,
          date: `${year}-${month}-${day}`,
          typeLabel: TYPE_MAP[item.type] || item.type,
        };
      });

      this.setData({ unitList: formattedList });
    }).catch(() => {
      wx.showToast({ title: '网络错误', icon: 'none' });
    }).finally(() => {
      if (callback) callback();
    });
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/yaozha_recycle_detail/index?id=${id}`,
    });
  },

  goToStatistics() {
    wx.navigateTo({ url: '/pages/yaozha_summary/index' });
  },

  onAddClick() {
    wx.navigateTo({ url: '/pages/yaozha_add/index' });
  },
});
