const { asset, request } = require('../../utils/request');

Page({
  data: {
    videoList: [
      { id: 0, title: '宣传视频一', src: asset('/public-assets/cat-video/video_1.mp4') },
      { id: 1, title: '宣传视频二', src: asset('/public-assets/cat-video/video_2.mp4') },
      { id: 2, title: '宣传视频三', src: asset('/public-assets/cat-video/video_3.mp4') },
      { id: 3, title: '宣传视频四', src: asset('/public-assets/cat-video/video_4.mp4') },
    ],
    currentVideoIndex: 0,
    stats: {
      recycledWeight: '0.00',
      catLitterOutput: '0',
      pharmacyCount: '0',
    },
  },

  onLoad() {
    this.loadHomepageStats();
  },

  onPullDownRefresh() {
    this.loadHomepageStats(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadHomepageStats(callback) {
    Promise.all([
      request({
        url: '/api/recycle_summary',
        method: 'GET',
      }),
      request({
        url: '/api/maoning_maosha/products',
        method: 'GET',
      }),
    ]).then(([summaryRes, productRes]) => {
      const summaryList = (summaryRes.data && summaryRes.data.data) || [];
      const products = Array.isArray(productRes.data) ? productRes.data : [];
      const recycledWeight = summaryList.reduce((sum, item) => {
        return sum + Number(item.total_weight || 0);
      }, 0);
      const pharmacyCount = new Set(
        summaryList
          .filter((item) => item.type === 'company')
          .map((item) => `${item.name}-${item.address}`)
      ).size;

      this.setData({
        stats: {
          recycledWeight: recycledWeight.toFixed(2),
          catLitterOutput: String(products.length),
          pharmacyCount: String(pharmacyCount),
        },
      });
    }).catch(() => {
      wx.showToast({ title: '首页数据加载失败', icon: 'none' });
    }).finally(() => {
      if (callback) callback();
    });
  },

  selectVideo(e) {
    this.setData({
      currentVideoIndex: Number(e.currentTarget.dataset.index || 0),
    });
  },
});
