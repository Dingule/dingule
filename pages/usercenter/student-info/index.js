// pages/usercenter/student-info/index.js
import { GRADE_ZH, GRADE_GROUPS } from '~/constants/grades';
import { USER_ROLE } from '~/constants/users';
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    gradeValue: [],
    studentInfo: {
      grade: '',
      subjects: '',
      intro: '',
    },
    GRADE_ZH,
    GRADE_GROUPS,
    gradePickerVisible: false,
    subjectPopupVisible: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const { roleInfo, userInfo } = app.globalData;
    const isEdit = Boolean(roleInfo?._id);
    if (isEdit) {
      this.setData({ studentInfo: roleInfo, gradeValue: [roleInfo.grade] });
    }

    wx.setNavigationBarTitle({ title: `学生${isEdit ? '信息' : '注册'}` });
    this.setData({ isEdit, 'studentInfo.user_id': userInfo._id });
  },

  // 年级选择相关方法
  showGradePicker() {
    this.setData({ gradePickerVisible: true });
  },

  onGradePickerCancel() {
    this.setData({ gradePickerVisible: false });
  },

  onGradePickerConfirm(e) {
    const { value } = e.detail;
    this.setData({
      'studentInfo.grade': value.join(''),
      gradeValue: value,
      gradePickerVisible: false,
    });
  },

  // 显示科目选择弹窗
  showSubjectPopup() {
    this.setData({ subjectPopupVisible: true });
  },
  obSubjectClose() {
    this.setData({ subjectPopupVisible: false });
  },
  onSubjectConfirm(e) {
    this.setData({ 'studentInfo.subjects': e.detail });
  },

  // 简介输入相关方法
  onIntroChange(e) {
    this.setData({
      'studentInfo.intro': e.detail.value,
    });
  },

  // 提交表单
  async submit() {
    const { studentInfo, isEdit } = this.data;
    if (!studentInfo.grade || !studentInfo.subjects) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请填写完整信息',
        theme: 'warning',
      });
      return;
    }

    Toast({
      context: this,
      selector: '#t-toast',
      duration: -1,
      theme: 'loading',
      direction: 'column',
      message: '保存中...',
    });

    const res = await wx.cloud.callFunction({
      name: 'registerOrUpdateStudent',
      data: {
        action: `${isEdit ? 'update' : 'register'}`,
        ...studentInfo,
      },
    });

    if (!res.result.success) {
      hideToast({ context: this, selector: '#t-toast' });
      Toast({
        context: this,
        selector: '#t-toast',
        message: `${isEdit ? '保存' : '注册'}失败，请稍后再试`,
        direction: 'column',
        theme: 'error',
      });
    }

    if (!isEdit) {
      const id = res.result.data;
      // 这里需要更新ID以便保存科目使用
      app.globalData.roleInfo = {
        ...studentInfo,
        _id: id,
      };
      app.globalData.userInfo.role = USER_ROLE.STUDENT;
      // 首次注册更新用户角色信息
      await wx.cloud.callFunction({
        name: 'registerOrUpdateUser',
        data: {
          role: USER_ROLE.STUDENT,
          action: 'update',
        },
      });
    }

    app.globalData.userInfoNeedRefresh = true;

    // 获取到教师ID后保存科目关系
    const subjectPopup = this.selectComponent('#subject-select-popup');
    await subjectPopup.onSave().catch(() => {
      // 暂时忽略错误处理🛠️
    });

    hideToast({ context: this, selector: '#t-toast' });
    Toast({
      context: this,
      selector: '#t-toast',
      message: isEdit ? '保存成功' : '注册成功，请耐心等待审核',
      direction: 'column',
      theme: 'success',
    });

    // 成功后自动返回上一页
    let timer = setTimeout(() => {
      wx.navigateBack();
      clearTimeout(timer);
      timer = null;
    }, 500);
  },
});
