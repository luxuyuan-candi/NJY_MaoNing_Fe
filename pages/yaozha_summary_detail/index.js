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
        unit: res.data.data.name || unit,
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
        color: ['#5b86e5', '#63b357'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderColor: '#dbe8d8',
          textStyle: { color: '#304338' },
        },
        legend: {
          top: 8,
          right: 0,
          itemWidth: 26,
          itemHeight: 16,
          textStyle: {
            color: '#33413a',
            fontSize: 13,
          },
          data: ['柱状图', '折线图'],
        },
        grid: {
          left: 66,
          right: 18,
          top: 72,
          bottom: 42,
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLine: {
            lineStyle: { color: '#7cb08a' },
          },
          axisTick: { show: false },
          axisLabel: {
            color: '#47584e',
            fontSize: 11,
          },
        },
        yAxis: {
          type: 'value',
          name: '回收量（kg）',
          nameGap: 28,
          nameTextStyle: {
            color: '#50635a',
            fontSize: 12,
            padding: [0, 0, 12, -8],
          },
          splitLine: {
            lineStyle: {
              color: '#d8e4d8',
              type: 'dashed',
            },
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#64766d',
            fontSize: 11,
          },
        },
        series: [
          {
            name: '柱状图',
            type: 'bar',
            data: barData,
            barWidth: '42%',
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              shadowColor: 'rgba(83, 120, 212, 0.22)',
              shadowBlur: 18,
            },
            label: {
              show: true,
              position: 'top',
              formatter: ({ value }) => `${value} kg`,
              color: '#ffffff',
              backgroundColor: '#4da44a',
              borderRadius: 10,
              padding: [6, 10],
            },
          },
          {
            name: '折线图',
            type: 'line',
            data: lineData,
            smooth: false,
            symbol: 'circle',
            symbolSize: 10,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              borderWidth: 2,
              borderColor: '#ffffff',
            },
          },
        ],
      });

      return chart;
    });
  },
});
