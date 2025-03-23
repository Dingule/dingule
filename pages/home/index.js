import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
  },

  onShow() {
    this.getTabBar().init();
    this.setData({
      pageLoading: true,
    });
    setTimeout(() => {
      this.setData({
        pageLoading: false,
      });
    }, 1000);
  },

  onLoad() {},

  onReachBottom() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '到底部了',
    });
  },
  onPullDownRefresh() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '触发了刷新',
    });
    setTimeout(() => {
      wx.stopPullDownRefresh();
      Toast({
        context: this,
        selector: '#t-toast',
        message: '刷新结束',
      });
    }, 1000);
  },
});
