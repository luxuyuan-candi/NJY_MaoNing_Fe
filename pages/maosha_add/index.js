const { uploadFile } = require('../../utils/request');

Page({
  data: {
    image: '',
    erweiimage: '',
    ywymimage: '',
    spec: '',
    price: '',
    location: '',
    phone: '',
  },

  chooseImage(e) {
    const key = e.currentTarget.dataset.key;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.setData({
          [key]: res.tempFiles[0].tempFilePath,
        });
      },
    });
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value,
    });
  },

  submit() {
    const {
      image,
      erweiimage,
      ywymimage,
      spec,
      price,
      location,
      phone,
    } = this.data;

    if (!image || !spec || !price || !location || !phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    uploadFile({
      url: '/api/maoning_maosha/upload',
      filePath: image,
      name: 'image',
      formData: { spec, price, location, phone },
    }).then(async (res) => {
      const data = JSON.parse(res.data);
      const { uploadId } = data;

      if (!uploadId) {
        throw new Error('missing uploadId');
      }

      if (erweiimage) {
        await uploadFile({
          url: '/api/maoning_maosha/upload',
          filePath: erweiimage,
          name: 'erweiimage',
          formData: { uploadId },
        });
      }

      if (ywymimage) {
        await uploadFile({
          url: '/api/maoning_maosha/upload',
          filePath: ywymimage,
          name: 'ywymimage',
          formData: { uploadId },
        });
      }

      wx.showToast({ title: '上传成功' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    }).catch(() => {
      wx.showToast({ title: '上传失败', icon: 'none' });
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
      fail() {
        wx.showToast({
          title: '无法获取定位权限',
          icon: 'none',
        });
      },
    });
  },
});
