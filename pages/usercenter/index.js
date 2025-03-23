import Toast from 'tdesign-miniprogram/toast/index';
const app = getApp();

const menuData = [
  [
    {
      title: '消息中心',
      tit: '',
      url: '',
      type: 'notification',
    },
  ],
  [
    {
      title: '帮助中心',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
];

const orderTagInfos = [
  {
    title: '待付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 5,
    status: 1,
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 10,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 40,
    status: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 60,
    status: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1,
  },
];

Page({
  data: {
    isLogin: false,
    showMakePhone: false,
    userInfo: {
      avatarUrl:
        'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
      nickName: 'TDesign',
      phoneNumber: '13438358888',
      gender: 2,
    },
    menuData,
    orderTagInfos,
    customerServiceInfo: {},
    showKefu: true,
    versionNo: '',
  },

  onLoad() {
    this.getVersionInfo();
  },

  async onShow() {
    this.getTabBar().init();

    if (app.globalData.isLogin) {
      this.fetchUserInfo();
    }

    this.setData({ isLogin: app.globalData.isLogin });
  },

  onPullDownRefresh() {
    // 刷新个人中心数据
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'notification': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了消息中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了帮助中心',
          icon: '',
          duration: 1000,
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  // 首次登录注册获取用户手机回调
  async getPhoneNumber(e) {
    if (!e.detail) {
      return;
    }
    const phoneRes = await wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: { code: e.detail.code },
    });

    if (!phoneRes.result.success) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: phoneRes.errMsg,
        direction: 'column',
        icon: 'error-circle',
      });
      return;
    }
    const { phoneNumber } = phoneRes.result.data;
    app.globalData.userInfo.phoneNumber = phoneNumber;

    // 获取到手机号后跳转个人信息编辑页
    this.gotoUserEditPage(phoneNumber);
  },

  // 跳转指定状态订单或全部订单
  jumpOrderList(e) {
    if (!this.data.isLogin) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请先登录',
        direction: 'column',
        icon: 'error-circle',
      });
      return;
    }

    const status = e.detail.tabType;
    if (typeof status === 'number') {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    } else {
      wx.navigateTo({ url: '/pages/order/order-list/index' });
    }
  },

  // 客服热线弹框
  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage(number = '') {
    wx.navigateTo({ url: `/pages/usercenter/user-info/index${number ? `?number=${number}` : ''}` });
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
