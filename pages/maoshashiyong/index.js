const { ensureLogin, getCachedProfile } = require('../../utils/auth');
const { fetchProfile } = require('../../utils/profileApi');
const { buildUrl, request } = require('../../utils/request');

Page({
  data: {
    products: [],
    profile: getCachedProfile() || {
      userType: '普通用户',
    },
  },

  onLoad() {
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        this.setData({ profile });
        this.loadProducts();
      })
      .catch(() => {
        this.loadProducts();
      });
  },

  loadProducts(callback) {
    request({
      url: '/api/maoning_maoshashiyong/products',
      method: 'GET',
    }).then((res) => {
      this.setData({
        products: res.data.map((item) => ({
          ...item,
          image: item.image ? buildUrl(item.image) : '',
          statusLabel: item.status === 'approve' ? '已通过' : '待审核',
        })),
      });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    }).finally(() => {
      if (callback) callback();
    });
  },

  onPullDownRefresh() {
    this.loadProducts(() => {
      wx.stopPullDownRefresh();
    });
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/maoshashiyong_detail/index?id=${id}`,
    });
  },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/maoshashiyong_add/index',
    });
  },
});
