Component({
  data: {
    active: 0,
  },

  methods: {
    init() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const nameRe = /pages\/(\w+)\/index/.exec(curPage.route);
        if (nameRe === null) return;
        if (nameRe[1] && nameRe) {
          this.setData({
            active: nameRe[1],
          });
          console.log('this.data.active :>> ', this.data.active);
        }
      }
    },

    onChange(e) {
      const { value } = e.detail;
      this.setData({ active: value });
      console.log('`/pages/${value}/index` :>> ', `/pages/${value}/index`);
      wx.switchTab({ url: `/pages/${value}/index` });
    },
  },
});
