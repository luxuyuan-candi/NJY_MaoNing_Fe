const { request } = require('../../utils/request');

Page({
  data: {
    date: '',
    location: '',
    type: 'company',
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

  onSubmit(e) {
    const data = e.detail.value;
    const { date, location, type } = this.data;

    if (!data.contact || !date || !location || !data.weight) {
      wx.showToast({
        title: '请填写所有字段',
        icon: 'none',
      });
      return;
    }

    const postData = {
      unit: type === 'company' ? '单位用户' : '个人用户',
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
