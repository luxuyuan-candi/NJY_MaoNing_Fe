const { uploadFile } = require('../../utils/request');

Page({
  data: {
    image: '',
    name: '',
    phone: '',
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.setData({
          image: res.tempFiles[0].tempFilePath,
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
    const { image, name, phone } = this.data;
    if (!image || !name || !phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    uploadFile({
      url: '/api/maoning_maoshashiyong/upload',
      filePath: image,
      name: 'image',
      formData: { name, phone },
    }).then(() => {
      wx.showToast({ title: '上传成功' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    }).catch(() => {
      wx.showToast({ title: '上传失败', icon: 'none' });
    });
  },
});
