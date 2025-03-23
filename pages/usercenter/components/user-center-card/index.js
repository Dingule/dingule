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
  },
  data: {
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
  },
  methods: {
    gotoUserEditPage() {
      this.triggerEvent('gotoUserEditPage');
    },
    getPhoneNumber(e) {
      this.triggerEvent('getPhoneNumber', e.detail);
    },
  },
});
