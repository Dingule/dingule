import { fetchHome } from '../../services/home/home';

Page({
  data: {
    tabList: [],
  },

  onShow() {
    this.getTabBar().init();

    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    console.log('e :>> ', e);
  },
});
