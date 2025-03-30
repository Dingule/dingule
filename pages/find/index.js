import { getSubjects } from '~/api/getSubjects';

Page({
  data: {
    subjects: [], // 一级科目
    subSubjects: [], // 二级科目
    sideBarIndex: 1,
    scrollTop: 0,
  },

  async onShow() {
    this.getTabBar().init();

    // 按照 subject 字段去重
    const subjectList = await getSubjects();
    this.setData({
      subjects: subjectList,
    });
  },

  tabChangeHandle(e) {
    const { detail } = e;

    const targetSubject = this.data.subjects.find((item) => item.label === detail.value);
    this.setData({ subSubjects: targetSubject.children, scrollTop: 0 });
  },

  onSideBarChange(e) {
    const { value } = e.detail;
    console.log('---', value);
    this.setData({ sideBarIndex: value, scrollTop: 0 });
  },
});
