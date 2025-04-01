import Toast from 'tdesign-miniprogram/toast/index';
import { getTeacherList } from '~/api/teachers';

Page({
  data: {
    teacherList: [],
  },

  onLoad() {
    this.fetchTeacherList();
  },

  onShow() {
    this.getTabBar().init();
  },

  async fetchTeacherList() {
    const teacherList = await getTeacherList();
    console.log('teacherList :>> ', teacherList);
    this.setData({ teacherList });
  },

  onTeacherCardTap(e) {
    console.log('e :>> ', e);
  },

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
