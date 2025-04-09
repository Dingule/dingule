// pages/usercenter/components/course-group/index.js
import { USER_ROLE } from '~/constants/users';
const app = getApp();
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
        name: '附近老师',
        icon: 'user-search',
        url: '',
        role: USER_ROLE.STUDENT,
      },
      {
        name: '附近学生',
        icon: 'user-search',
        url: '',
        role: USER_ROLE.TEACHER,
      },
      {
        name: '找课程',
        icon: 'book-open',
        url: '',
      },
      {
        name: 'AI定制',
        icon: 'system-sum',
        url: '',
      },
      {
        name: '帮助中心',
        icon: 'questionnaire',
        url: '',
      },
    ],

    userInfo,
    USER_ROLE,
  },

  attached() {
    this.setData({ userInfo: app.globalData.userInfo });
  },

  methods: {
    onItemClick(e) {
      const { name, url } = e.currentTarget.dataset.data;
      console.log('name, url :>> ', name, url);
    },
  },
});
