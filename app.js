import updateManager from './common/updateManager';
import createBus from './utils/eventBus';
import { connectSocket, fetchUnreadNum } from './mock/chat';

App({
  onLaunch() {
    this.getUnreadNum();
    this.connect();
  },
  onShow() {
    updateManager();
  },
  globalData: {
    userInfo: null,
    unreadNum: 0, // 未读消息数量
    socket: null, // SocketTask 对象
  },

  /** 全局事件总线 */
  eventBus: createBus(),

  /** 初始化WebSocket */
  connect() {
    const socket = connectSocket();
    socket.onMessage((data) => {
      data = JSON.parse(data);
      if (data.type === 'message' && !data.data.message.read) this.setUnreadNum(this.globalData.unreadNum + 1);
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
