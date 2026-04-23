const { asset } = require('../../utils/request');

Page({
  data: {
    swiperInterval: 5000,
    videoList: [
      { src: asset('/cat-video/video_1.mp4') },
      { src: asset('/cat-video/video_2.mp4') },
      { src: asset('/cat-video/video_3.mp4') },
      { src: asset('/cat-video/video_4.mp4') },
    ],
  },

  onVideoPlay() {
    this.setData({ swiperInterval: 0 });
  },

  onVideoEnded() {
    this.setData({ swiperInterval: 5000 });
  },

  goToYaoZha() {
    wx.navigateTo({ url: '/pages/yaozha/index' });
  },

  goToMaoSha() {
    wx.navigateTo({ url: '/pages/maosha/index' });
  },

  goToMaoShaShiYong() {
    wx.navigateTo({ url: '/pages/maoshashiyong/index' });
  },
});
