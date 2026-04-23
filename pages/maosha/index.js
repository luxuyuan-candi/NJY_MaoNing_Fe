const { buildUrl, request } = require('../../utils/request');

Page({
  data: {
    products: [],
  },

  onLoad() {
    this.loadProducts();
  },

  loadProducts(callback) {
    request({
      url: '/api/maoning_maosha/products',
      method: 'GET',
    }).then((res) => {
      this.setData({
        products: res.data.map((item) => ({
          ...item,
          image: item.image ? buildUrl(item.image) : '',
          erweiimage: item.erweiimage ? buildUrl(item.erweiimage) : '',
          ywymimage: item.ywymimage ? buildUrl(item.ywymimage) : '',
        })),
      });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(() => {
      if (callback) callback();
    });
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.current;
    const urls = e.currentTarget.dataset.urls.filter((url) => url);

    wx.previewImage({
      current,
      urls,
    });
  },

  onPullDownRefresh() {
    this.loadProducts(() => {
      wx.stopPullDownRefresh();
    });
  },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/maosha_add/index',
    });
  },
});
