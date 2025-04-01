// pages/usercenter/components/course-group/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    gridList: [
      {
        name: '找老师',
        icon: 'user-search',
        url: '',
      },
      {
        name: '找学生',
        icon: 'user-search',
        url: '',
      },
      {
        name: '找课程',
        icon: 'book-open',
        url: '',
      },
      {
        name: '帮助中心',
        icon: 'questionnaire',
        url: '',
      },
    ],
  },

  methods: {
    onItemClick(e) {
      const { name, url } = e.currentTarget.dataset.data;
      console.log('name, url :>> ', name, url);
    },
  },
});
