const { request } = require('../../utils/request');

Page({
  data: {
    date: '',
    location: '',
    type: 'company',
    formData: {
      unit: '',
      contact: '',
      weight: '',
      herbs: [],
    },
  },

  onDateChange(e) {
    this.setData({
      date: e.detail.value,
    });
  },

  onTypeChange(e) {
    this.setData({
      type: e.detail.value,
    });
  },

  onFieldInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      formData: {
        ...this.data.formData,
        [field]: value,
      },
    });
  },

  onHerbsChange(e) {
    this.setData({
      formData: {
        ...this.data.formData,
        herbs: e.detail.value || [],
      },
    });
  },

  getLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: () => {
        wx.chooseLocation({
          success: (loc) => {
            this.setData({
              location: loc.address,
            });
          },
        });
      },
      fail: () => {
        wx.showToast({
          title: '无法获取定位权限',
          icon: 'none',
        });
      },
    });
  },

  handleSubmit() {
    const data = this.data.formData;
    const { date, location, type } = this.data;

    if (!data.unit || !data.contact || !date || !location || !data.weight) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none',
      });
      return;
    }

    const postData = {
      unit: data.unit,
      contact: data.contact,
      date,
      location,
      weight: data.weight,
      herbs: data.herbs || [],
      type,
    };

    request({
      url: '/api/add_recycle',
      method: 'POST',
      data: postData,
      header: {
        'content-type': 'application/json',
      },
    }).then((res) => {
      if (!res.data.success) {
        wx.showToast({
          title: res.data.msg || '提交失败',
          icon: 'none',
        });
        return;
      }

      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500,
        success() {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        },
      });
    }).catch(() => {
      wx.showToast({
        title: '网络错误',
        icon: 'none',
      });
    });
  },
});
