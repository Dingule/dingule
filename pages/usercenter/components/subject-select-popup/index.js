// pages/usercenter/components/subject-select-popup/index.js
import { getSubjects } from '~/api/getSubjects';
import Toast from 'tdesign-miniprogram/toast/index';

const MAX_SUBJECT_COUNT = 5;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentSubject: '',
    subjectValue: [],
    subjectValueMap: {}, // 跨专业选项缓存
    subjectOptions: [],
  },
  attached() {
    this.fetchSubjects();
  },

  methods: {
    async fetchSubjects() {
      const res = await getSubjects();
      const subjectOptions = res.map((item) => {
        return {
          value: item.name,
          label: item.name,
          children: item.children.map((child) => {
            return {
              value: child.value,
              label: child.name,
            };
          }),
        };
      });
      this.setData({ subjectOptions });
    },

    onChange(e) {
      const { subjectValueMap, currentSubject } = this.data;
      const subject = e.detail.value[0];
      let subSubject = e.detail.value[1];

      // 切换科目时从缓存中读取
      if (subject !== currentSubject) {
        subSubject = subjectValueMap[subject] || subSubject;
      } else {
        // 限制最多选择5个科目
        let count = 0;
        Object.keys(subjectValueMap).forEach((key) => {
          if (key === subject) {
            count += subSubject.length;
          } else {
            count += subjectValueMap[key]?.length || 0;
          }
        });
        if (count > MAX_SUBJECT_COUNT) {
          Toast({
            context: this,
            selector: '#t-toast',
            direction: 'column',
            message: `最多只能选择${MAX_SUBJECT_COUNT}个科目`,
            theme: 'warning',
          });
          return;
        }
      }

      // 更新缓存
      subjectValueMap[subject] = subSubject;
      this.setData({
        subjectValue: [subject, subSubject],
        currentSubject: subject,
        subjectValueMap,
      });
    },

    onConfirm() {
      const { subjectValueMap, subjectOptions } = this.data;

      const valueList = [];
      Object.keys(subjectValueMap).forEach((key) => {
        valueList.push(
          ...subjectValueMap[key].map((value) => {
            const subject = subjectOptions.find((subItem) => subItem.value === key);
            const subSubject = subject.children.find((subItem) => subItem.value === value);
            return subSubject.label;
          }),
        );
      });
      this.triggerEvent('confirm', valueList.join('、'));
      this.closePopup();
    },

    closePopup() {
      this.triggerEvent('close');
    },
  },
});
