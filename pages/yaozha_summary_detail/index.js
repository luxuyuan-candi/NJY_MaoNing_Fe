const { request } = require('../../utils/request');

Page({
  data: {
    unit: '',
    location: '',
    total: 0,
    categories: [],
    barData: [],
    lineData: [],
    ec: null,
  },

  onLoad(options) {
    const unit = decodeURIComponent(options.unit || '');
    const location = decodeURIComponent(options.location || '');
    this.setData({ unit, location });
    this.fetchDetail(unit, location);
  },

  fetchDetail(unit, location) {
    request({
      url: `/api/recycle_by_unit?unit=${encodeURIComponent(unit)}&location=${encodeURIComponent(location)}`,
      method: 'GET',
    }).then((res) => {
      if (!res.data.success) {
        throw new Error('load failed');
      }

      const { records, total } = res.data.data;
      const categories = records.map((record) => {
        const d = new Date(record.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      });
      const barData = records.map((record) => parseFloat(record.total_weight));
      const lineData = [...barData];

      this.setData({
        location: res.data.data.location,
        total,
        categories,
        barData,
        lineData,
      }, () => {
        this.initChart();
      });
    }).catch(() => {
      wx.showToast({ title: '网络错误', icon: 'none' });
    });
  },

  initChart() {
    const chartComponent = this.selectComponent('#recycleChart');
    const echarts = require('../../components/ec-canvas/echarts');

    chartComponent.init((canvas, width, height, dpr) => {
      const chart = echarts.init(canvas, null, {
        width,
        height,
        devicePixelRatio: dpr,
      });
      canvas.setChart(chart);

      const { categories, barData, lineData } = this.data;
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['柱状图', '折线图'] },
        xAxis: {
          type: 'category',
          data: categories,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '柱状图',
            type: 'bar',
            data: barData,
          },
          {
            name: '折线图',
            type: 'line',
            data: lineData,
          },
        ],
      });

      return chart;
    });
  },
});
