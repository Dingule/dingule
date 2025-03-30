// pages/usercenter/components/subject-select-popup/index.js
import { getSubjects } from '~/api/getSubjects';
import { getSubjectRelations, addSubjectRelations, deleteSubjectRelations } from '~/api/subjectRelations';
import { USER_ROLE } from '~/constants/users';
import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();
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
    subjectValue: [], // 组件使用的格式
    subjectValueMap: {}, // 跨专业选项缓存
    subjectOptions: [],

    remoteIdList: [], // 数据库已存在id列表
    currentIdList: [], // 当前选中的id列表
  },
  async attached() {
    await this.fetchSubjects();
    this.getSubjectRelations();
  },

  methods: {
    // 获取已存在的关系列表并初始化组件数据
    async getSubjectRelations() {
      const { userInfo } = app.globalData;
      const { subjectOptions } = this.data;

      const remoteIdList = await getSubjectRelations(userInfo.role === USER_ROLE.STUDENT ? 'student' : 'teacher');
      const subjectValue = subjectOptions
        .map((subject) => {
          const children = subject.children.filter((child) => remoteIdList.includes(child._id));
          return [subject.value, children.map((child) => child.value)];
        })
        .filter((item) => item[1].length);

      this.setData({
        remoteIdList,
        subjectValue: subjectValue[0],
        currentSubject: subjectValue[0]?.[0],
        subjectValueMap: Object.fromEntries(subjectValue),
      });
      this.onConfirm();
    },

    async fetchSubjects() {
      const res = await getSubjects();
      this.setData({ subjectOptions: res });
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
            message: `最多选择${MAX_SUBJECT_COUNT}个科目`,
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
      this.setData({ currentIdList: [] });

      // 根据value数组获取中文供显示
      const valueList = [];
      Object.keys(subjectValueMap).forEach((key) => {
        valueList.push(
          ...subjectValueMap[key].map((value) => {
            const subject = subjectOptions.find((subItem) => subItem.value === key);
            const subSubject = subject.children.find((subItem) => subItem.value === value);
            this.setData({ currentIdList: [...this.data.currentIdList, subSubject._id] });
            return subSubject.label;
          }),
        );
      });
      this.triggerEvent('confirm', valueList.join('、'));
      this.closePopup();
    },

    // 父组件保存后调用
    onSave() {
      const { roleInfo, userInfo } = app.globalData;
      const { _id } = roleInfo;
      const { currentIdList, remoteIdList } = this.data;

      // 与remoteIdList对比出增量数组和减量数组
      const addList = currentIdList.filter((id) => !remoteIdList.includes(id));
      const removeList = remoteIdList.filter((id) => !currentIdList.includes(id));

      const promises = [];
      const role = userInfo.role === USER_ROLE.STUDENT ? 'student' : 'teacher';
      if (addList.length) {
        promises.push(addSubjectRelations(role, _id, addList));
      }
      if (remoteIdList.length) {
        promises.push(deleteSubjectRelations(role, removeList));
      }
      return Promise.all(promises);
    },

    closePopup() {
      this.triggerEvent('close');
    },
  },
});
