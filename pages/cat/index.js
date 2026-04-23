const { buildUrl, request } = require('../../utils/request');

Page({
  data: {
    activeTab: 'sale',
    saleProducts: [],
    trialProducts: [],
  },

  onLoad() {
    this.loadAll();
  },

  onPullDownRefresh() {
    this.loadAll(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadAll(callback) {
    Promise.all([this.loadSaleProducts(), this.loadTrialProducts()])
      .catch(() => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      })
      .finally(() => {
        if (callback) callback();
      });
  },

  loadSaleProducts() {
    return request({
      url: '/api/maoning_maosha/products',
      method: 'GET',
    }).then((res) => {
      this.setData({
        saleProducts: res.data.map((item) => ({
          ...item,
          image: item.image ? buildUrl(item.image) : '',
          erweiimage: item.erweiimage ? buildUrl(item.erweiimage) : '',
          ywymimage: item.ywymimage ? buildUrl(item.ywymimage) : '',
        })),
      });
    });
  },

  loadTrialProducts() {
    return request({
      url: '/api/maoning_maoshashiyong/products',
      method: 'GET',
    }).then((res) => {
      this.setData({
        trialProducts: res.data.map((item) => ({
          ...item,
          image: item.image ? buildUrl(item.image) : '',
          statusLabel: item.status === 'approve' ? '已通过' : '待审核',
        })),
      });
    });
  },

  switchInnerTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab });
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.current;
    const urls = e.currentTarget.dataset.urls.filter((url) => url);

    wx.previewImage({
      current,
      urls,
    });
  },

  goToSaleAdd() {
    wx.navigateTo({ url: '/pages/maosha_add/index' });
  },

  goToTrialAdd() {
    wx.navigateTo({ url: '/pages/maoshashiyong_add/index' });
  },

  goToTrialDetail(e) {
    wx.navigateTo({
      url: `/pages/maoshashiyong_detail/index?id=${e.currentTarget.dataset.id}`,
    });
  },
});
