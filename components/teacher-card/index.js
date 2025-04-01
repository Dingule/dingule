// components/teacher-card/index.js
import { EDUCATION_BACKGROUND_ZH } from '~/constants/users';

Component({
  /**   * 组件的属性列表   */
  properties: {
    data: {
      type: Object,
      value: {},
    },
  },
  data: {
    defaultAvatar: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    EDUCATION_BACKGROUND_ZH,
    ageGroup: '',
  },
  observers: {
    'data.birth': function (birth) {
      if (birth) {
        const year = parseInt(birth.split('-')[0]);
        this.setData({ ageGroup: this.calculateAgeGroup(year) });
      }
    },
  },
  attached() {
    console.log(this.properties.data);
  },
  methods: {
    calculateAgeGroup(year) {
      // 获取年份的后两位数字
      const yearLastTwo = year % 100;
      // 向下取整到最近的5
      const fiveYearGroup = Math.floor(yearLastTwo / 5) * 5;
      return `${fiveYearGroup}后`;
    },
    onTapCard() {
      const { teacherInfo } = this.properties;
      this.triggerEvent('cardtap', { teacherId: teacherInfo.id });
    },
  },
});
