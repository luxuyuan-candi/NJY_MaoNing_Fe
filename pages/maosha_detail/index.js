const { buildUrl, request } = require('../../utils/request');

Page({
  data: {
    form: null,
    imageSections: [],
  },

  onLoad(options) {
    const { id } = options;
    this.fetchDetail(id);
  },

  fetchDetail(id) {
    request({
      url: '/api/maoning_maosha/products',
      method: 'GET',
    }).then((res) => {
      const record = (res.data || []).find((item) => String(item.id) === String(id));

      if (!record) {
        wx.showToast({ title: '未找到详情', icon: 'none' });
        return;
      }

      const form = {
        ...record,
        image: record.image ? buildUrl(record.image) : '',
        erweiimage: record.erweiimage ? buildUrl(record.erweiimage) : '',
        ywymimage: record.ywymimage ? buildUrl(record.ywymimage) : '',
      };

      const imageSections = [
        { label: '产品图片', url: form.image },
        { label: '质量溯源二维码', url: form.erweiimage },
        { label: '一物一码图', url: form.ywymimage },
      ].filter((item) => item.url);

      this.setData({ form, imageSections });
    }).catch(() => {
      wx.showToast({ title: '加载失败', icon: 'none' });
    });
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.current;
    const urls = this.data.imageSections.map((item) => item.url);

    wx.previewImage({
      current,
      urls,
    });
  },
});
