import updateManager from './common/updateManager';
import createBus from './utils/eventBus';
import { getDataByUserId } from 'api/common';
import { USER_ROLE } from 'constants/users';
import { connectSocket, fetchUnreadNum } from './mock/chat';
const { init } = require('@cloudbase/wx-cloud-client-sdk');
const ENV_ID = 'cloud1-4gufq5rv2f4710bd';

App({
  onLaunch() {
    // 初始化云函数2.0
    wx.cloud.Cloud({
      resourceEnv: ENV_ID,
    });

    // 初始化云开发环境
    wx.cloud.init({
      env: ENV_ID,
      traceUser: true,
    });

    // 初始化微信数据模型 SDK
    const client = init(wx.cloud); // 使用 wx.cloud 初始化 SDK
    const { models } = client; // 获取数据模型
    this.models = models; // 注册到 App 实例

    // 初始化未读消息数量和 WebSocket
    this.getUnreadNum();
    this.connect();
  },

  onShow() {
    updateManager(); // 检查更新

    // 检查用户是否已授权
    this.loadUserInfo();
  },

  globalData: {
    isLogin: false,
    userInfo: {},
    roleInfo: {},
    userInfoNeedRefresh: true, // 注册或更新用户信息后触发强制刷新

    unreadNum: 0, // 未读消息数量
    socket: null, // SocketTask 对象
  },

  models: null, // 全局数据模型

  /** 全局事件总线 */
  eventBus: createBus(),

  async loadUserInfo(forceRefresh = false) {
    let userInfo = wx.getStorageSync('userInfo') || {};
    let roleInfo = wx.getStorageSync('roleInfo') || {};

    if (!Object.keys(userInfo).length || forceRefresh || this.globalData.userInfoNeedRefresh) {
      const res = await wx.cloud.callFunction({ name: 'login' });
      this.globalData.isLogin = Boolean(res.result?.success);
      this.globalData.userInfoNeedRefresh = false;
      userInfo = res.result.data[0];

      const tempUrlRes = await wx.cloud.getTempFileURL({ fileList: [userInfo.avatar_file_id] });
      userInfo.avatar = tempUrlRes.fileList[0].tempFileURL;

      // 如果用户已注册角色，那么一并查询角色信息
      if (userInfo.role) {
        const roleRes = await getDataByUserId({
          collection: userInfo.role === USER_ROLE.STUDENT ? 'students' : 'teachers',
          userId: userInfo._id,
        }).catch(() => {
          // ❗2.0函数，经常挂，待优化；如果查询失败，则不更新角色信息
        });
        roleInfo = roleRes?.data?.data || roleInfo;
      }

      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('roleInfo', roleInfo);
      wx.setStorageSync('isLogin', true);
    }

    this.globalData.isLogin = true;
    this.globalData.userInfo = userInfo;
    this.globalData.roleInfo = roleInfo;
  },

  /** 初始化 WebSocket */
  connect() {
    const socket = connectSocket();
    socket.onMessage((data) => {
      data = JSON.parse(data);
      if (data.type === 'message' && !data.data.message.read) {
        this.setUnreadNum(this.globalData.unreadNum + 1);
      }
    });
    this.globalData.socket = socket;
  },

  /** 获取未读消息数量 */
  getUnreadNum() {
    fetchUnreadNum().then(({ data }) => {
      this.globalData.unreadNum = data;
      this.eventBus.emit('unread-num-change', data);
    });
  },

  /** 设置未读消息数量 */
  setUnreadNum(unreadNum) {
    this.globalData.unreadNum = unreadNum;
    this.eventBus.emit('unread-num-change', unreadNum);
  },
});
