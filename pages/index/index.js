const { asset } = require('../../utils/request');

Page({
  data: {
    swiperInterval: 5000,
    videoList: [
      { src: asset('/public-assets/cat-video/video_1.mp4') },
      { src: asset('/public-assets/cat-video/video_2.mp4') },
      { src: asset('/public-assets/cat-video/video_3.mp4') },
      { src: asset('/public-assets/cat-video/video_4.mp4') },
    ],
  },

  onVideoPlay() {
    this.setData({ swiperInterval: 0 });
  },

  onVideoEnded() {
    this.setData({ swiperInterval: 5000 });
  },
});
