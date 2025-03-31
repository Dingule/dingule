import Toast from 'tdesign-miniprogram/toast/index';
import { USER_ROLE, USER_ROLE_ZH, ACCOUNT_STATUS, ACCOUNT_STATUS_ZH, USER_GENDER } from '~/constants/users';
const app = getApp();

const STATUS_THEME = {
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
      default: {},
    },
    roleInfo: {
      type: Object,
      default: {},
    },
  },
  data: {
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    refreshIconName: 'refresh',
    loading: false,

    ACCOUNT_STATUS_ZH,
    STATUS_THEME,
    USER_GENDER,
    USER_ROLE,
    USER_ROLE_ZH,
    isRoleRegistered: false,
  },
  observers: {
    'userInfo.role': function (role) {
      if (!role) return;

      this.setData({
        isRoleRegistered: [USER_ROLE.STUDENT, USER_ROLE.TEACHER].includes(role),
      });
    },
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
