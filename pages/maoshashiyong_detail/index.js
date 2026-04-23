const { buildUrl, request } = require('../../utils/request');

Page({
  data: {
    form: {},
    showModal: false,
  },

  onLoad(options) {
    const { id } = options;
    this.fetchDetail(id);
  },

  fetchDetail(id) {
    request({
      url: `/api/maoning_maoshashiyong/product?id=${id}`,
      method: 'GET',
    }).then((res) => {
      this.setData({
        form: {
          ...res.data,
          image: res.data.image ? buildUrl(res.data.image) : '',
          statusLabel: res.data.status === 'approve' ? '已通过' : '待审核',
        },
      });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  markAsFinished() {
    this.setData({ showModal: true });
  },

  onCancel() {
    this.setData({ showModal: false });
  },

  onConfirm() {
    request({
      url: '/api/maoning_maoshashiyong/update',
      method: 'POST',
      data: {
        id: this.data.form.id,
        state: 'approve',
      },
      header: { 'content-type': 'application/json' },
    }).then((res) => {
      if (res.data.success) {
        wx.showToast({
          title: '已核准',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          },
        });
      } else {
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    }).catch(() => {
      wx.showToast({ title: '网络错误', icon: 'none' });
    });

    this.setData({ showModal: false });
  },
});
