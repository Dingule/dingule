import { OrderStatus } from '../config';

Page({
  page: {
    size: 5,
    num: 1,
  },

  data: {
    tabs: [
      { key: -1, text: '全部' },
      { key: OrderStatus.PENDING_PAYMENT, text: '待付款', info: '' },
      { key: OrderStatus.PENDING_DELIVERY, text: '待发货', info: '' },
      { key: OrderStatus.PENDING_RECEIPT, text: '待收货', info: '' },
      { key: OrderStatus.COMPLETE, text: '已完成', info: '' },
    ],
    curTab: -1,
    orderList: [],
    listLoading: 0,
    pullDownRefreshing: false,
    emptyImg: 'https://cdn-we-retail.ym.tencent.com/miniapp/order/empty-order-list.png',
    backRefresh: false,
    status: -1,
  },

  onLoad(query) {
    let status = parseInt(query.status);
    status = this.data.tabs.map((t) => t.key).includes(status) ? status : -1;
    this.init(status);
    this.pullDownRefresh = this.selectComponent('#wr-pull-down-refresh');
  },

  onShow() {
    if (!this.data.backRefresh) return;
    this.onRefresh();
    this.setData({ backRefresh: false });
  },

  onReachBottom() {
    if (this.data.listLoading === 0) {
      // this.getOrderList(this.data.curTab);
    }
  },

  onPageScroll(e) {
    this.pullDownRefresh && this.pullDownRefresh.onPageScroll(e);
  },

  onPullDownRefresh_(e) {
    const { callback } = e.detail;
    this.setData({ pullDownRefreshing: true });
    this.refreshList(this.data.curTab)
      .then(() => {
        this.setData({ pullDownRefreshing: false });
        callback && callback();
      })
      .catch((err) => {
        this.setData({ pullDownRefreshing: false });
        Promise.reject(err);
      });
  },

  init(status) {
    status = status !== undefined ? status : this.data.curTab;
    this.setData({
      status,
    });
    this.refreshList(status);
  },

  /**
   * 获取订单列表
   * @param {number} statusCode 订单状态码
   */
  getOrderList() {},

  onReTryLoad() {
    this.getOrderList(this.data.curTab);
  },

  onTabChange(e) {
    const { value } = e.detail;
    this.setData({
      status: value,
    });
    this.refreshList(value);
  },

  /**
   * 获取各个状态订单数量
   */
  getOrdersCount() {},

  refreshList(status = -1) {
    this.page = {
      size: this.page.size,
      num: 1,
    };
    this.setData({ curTab: status, orderList: [] });

    return Promise.all([this.getOrderList(status, true), this.getOrdersCount()]);
  },

  onRefresh() {
    this.refreshList(this.data.curTab);
  },

  onOrderCardTap(e) {
    console.log('点击了订单', e);
  },
});
