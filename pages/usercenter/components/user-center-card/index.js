import Toast from 'tdesign-miniprogram/toast/index';
import { ACCOUNT_STATUS, USER_GENDER } from '~/constants/users';
const app = getApp();

const status_hans = {
  [ACCOUNT_STATUS.PENDING]: '审核中',
  [ACCOUNT_STATUS.APPROVED]: '已认证',
  [ACCOUNT_STATUS.REJECTED]: '未通过',
  [ACCOUNT_STATUS.DISABLED]: '禁用',
};
const status_themes = {
  [ACCOUNT_STATUS.PENDING]: 'primary',
  [ACCOUNT_STATUS.APPROVED]: 'success',
  [ACCOUNT_STATUS.REJECTED]: 'warning',
  [ACCOUNT_STATUS.DISABLED]: 'danger',
};

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    isLogin: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      value: {},
    },
    roleInfo: {
      type: Object,
      value: {},
    },
  },
  data: {
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    roleStatusZh: '',
    roleStatusTheme: '',
    refreshIconName: 'refresh',
    loading: false,
    USER_GENDER,
  },
  ready() {
    this.setData({
      roleStatusZh: status_hans[this.data.roleInfo.status] || '未认证',
      roleStatusTheme: status_themes[this.data.roleInfo.status] || '',
    });
  },
  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
    getPhoneNumber(e) {
      this.triggerEvent('getPhoneNumber', e.detail);
    },
    showRolePopup() {
      this.triggerEvent('showRolePopup', { visible: true });
    },
    async refresh() {
      if (this.data.loading) {
        return;
      }
      // 强制刷新
      this.setData({ loading: true, refreshIconName: '' });
      await app.loadUserInfo(true);
      // 手动延迟，防闪屏
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
      // 仅手动刷新时自更新状态，其余情况由父组件控制
      this.setData({
        loading: false,
        refreshIconName: 'refresh',
        userInfo: app.globalData.userInfo,
        roleInfo: app.globalData.roleInfo,
      });
      Toast({
        context: this,
        selector: '#t-toast',
        theme: 'success',
        message: '刷新成功',
      });
    },
  },
});
