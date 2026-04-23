const { asset } = require('../../utils/request');

Page({
  data: {
    videoList: [
      { id: 0, title: '一', src: asset('/public-assets/cat-video/video_1.mp4') },
      { id: 1, title: '二', src: asset('/public-assets/cat-video/video_2.mp4') },
      { id: 2, title: '三', src: asset('/public-assets/cat-video/video_3.mp4') },
      { id: 3, title: '四', src: asset('/public-assets/cat-video/video_4.mp4') },
    ],
    currentVideoIndex: 0,
  },

  selectVideo(e) {
    this.setData({
      currentVideoIndex: Number(e.currentTarget.dataset.index || 0),
    });
  },
});
