import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';
import { USER_ROLE } from 'constants/users';

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
    rolePopupVisible: false, // 用户角色选择弹框
    showMakePhone: false, // 客服热线弹框
    userInfo: {},
    roleInfo: {},
    menuData,
    orderTagInfos,
    customerServiceInfo: {},
    showKefu: true,
    versionNo: '',
    USER_ROLE,
  },

  onLoad() {
    this.getVersionInfo();
  },

  async onShow() {
    this.getTabBar().init();
    await this.loadUserInfo();
    // 更新用户信息后再检查是否注册
    this.checkUserRole();
  },

  // 检查用户是否注册角色，未注册的话唤起弹框
  checkUserRole() {
    const { isLogin, userInfo } = app.globalData;
    if (!isLogin || +userInfo.role) {
      return;
    }
    let timer = setTimeout(() => {
      this.setData({ rolePopupVisible: true });
      clearTimeout(timer);
      timer = null;
    }, 300);
  },

  async loadUserInfo() {
    if (app.globalData.userInfoNeedRefresh) {
      Toast({
        context: this,
        selector: '#t-toast',
        duration: -1,
        theme: 'loading',
        direction: 'column',
        message: '加载中...',
      });
      await app.loadUserInfo();
      hideToast({ context: this, selector: '#t-toast' });
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      roleInfo: app.globalData.roleInfo,
      isLogin: app.globalData.isLogin,
    });
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

  onRoleVisibleChange(e) {
    this.setData({ rolePopupVisible: e.detail.visible });
  },

  onRoleSelect(e) {
    const { role } = e.currentTarget.dataset;
    if (role === USER_ROLE.STUDENT) {
      wx.navigateTo({ url: '/pages/usercenter/student-info/index' });
    } else {
      wx.navigateTo({ url: '/pages/usercenter/teacher-info/index' });
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
      phoneNumber: '400-8888-8888',
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
