const { request } = require('../../utils/request');

Page({
  data: {
    form: {},
    showModal: false,
    inputWeight: '',
    inputBatchNo: '',
  },

  onLoad(options) {
    const { id } = options;
    this.fetchDetail(id);
  },

  fetchDetail(id) {
    request({
      url: `/api/get_recycle?id=${id}`,
      method: 'GET',
    }).then((res) => {
      if (!res.data.success) {
        wx.showToast({ title: '加载失败', icon: 'none' });
        return;
      }

      const data = res.data.data;

      if (data.date) {
        const d = new Date(data.date);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        data.date = `${y}-${m}-${day}`;
      }

      data.status = data.state === 'finish' ? '已回收' : '待处理';
      data.herbs = data.herbs || '';
      this.setData({ form: data });
    }).catch(() => {
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  markAsFinished() {
    this.setData({ showModal: true });
  },

  onInputWeight(e) {
    this.setData({ inputWeight: e.detail.value });
  },

  onInputBatchNo(e) {
    this.setData({ inputBatchNo: e.detail.value });
  },

  onCancel() {
    this.setData({ showModal: false, inputWeight: '', inputBatchNo: '' });
  },

  onConfirm() {
    const weight = parseFloat(this.data.inputWeight);
    const batchNo = this.data.inputBatchNo.trim();

    if (Number.isNaN(weight) || weight <= 0) {
      wx.showToast({ title: '请输入有效重量', icon: 'none' });
      return;
    }
    if (!batchNo) {
      wx.showToast({ title: '请输入批号', icon: 'none' });
      return;
    }

    request({
      url: '/api/update_state',
      method: 'POST',
      data: {
        id: this.data.form.id,
        state: 'finish',
        approved_weight: weight,
        batch_no: batchNo,
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

    this.setData({ showModal: false, inputWeight: '', inputBatchNo: '' });
  },
});
