const { ensureLogin, getCachedProfile } = require('../../utils/auth');
const { fetchProfile } = require('../../utils/profileApi');
const { buildUrl, request } = require('../../utils/request');

Page({
  data: {
    form: {},
    showModal: false,
    profile: getCachedProfile() || {
      userType: '普通用户',
    },
  },

  onLoad(options) {
    const { id } = options;
    ensureLogin()
      .then(() => fetchProfile())
      .then((profile) => {
        this.setData({ profile });
        this.fetchDetail(id);
      })
      .catch(() => {
        this.fetchDetail(id);
      });
  },

  fetchDetail(id) {
    request({
      url: `/api/maoning_maoshashiyong/product?id=${id}`,
      method: 'GET',
    }).then((res) => {
      const hasError = res.statusCode >= 400 || (res.data && res.data.success === false);
      if (hasError || !res.data || !res.data.id) {
        wx.showToast({
          title: (res.data && res.data.msg) || '无权限',
          icon: 'none',
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1200);
        return;
      }
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
    if (this.data.profile.userType !== '管理员') {
      wx.showToast({ title: '仅管理员可审批', icon: 'none' });
      return;
    }
    this.setData({ showModal: true });
  },

  onCancel() {
    this.setData({ showModal: false });
  },

  onConfirm() {
    if (this.data.profile.userType !== '管理员') {
      wx.showToast({ title: '仅管理员可审批', icon: 'none' });
      this.setData({ showModal: false });
      return;
    }

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
