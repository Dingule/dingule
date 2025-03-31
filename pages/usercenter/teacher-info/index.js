// pages/usercenter/teacher-info/index.js
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';
import { uploadImageByPath } from '~/api/common';
import { isValidIdCardNo, isValidChineseName } from '~/utils/regex';
import { EDUCATION_BACKGROUND_ZH, USER_ROLE } from '~/constants/users';

const app = getApp();
// 转换为选择器需要的格式
const eduBackgroundOptions = Object.entries(EDUCATION_BACKGROUND_ZH).map(([value, label]) => ({
  label,
  value,
}));

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEdit: false,
    current: 0,
    scrollLeft: 0,
    steps: [{ title: '教育背景' }, { title: '实名认证' }, { title: '个人简介' }],
    eduBgPickerVisible: false,
    subjectPopupVisible: false,
    eduBackgroundOptions,
    teacherInfo: {
      // 教育背景
      edu_background: '',
      school: '',
      major: '',
      student_card: '', // 学生证图片fileId
      student_card_file_id: '',
      has_degree: false,
      is_graduate: false,
      diploma: '',
      diploma_file_id: '', // 学位证书图片fileId

      // 实名认证
      real_name: '',
      id_card_no: '',
      id_card_front: '',
      id_card_file_id: '', // 身份证正面图片fileId

      // 个人简介
      subjects: '',
      intro: '',
    },

    // 是否修改标志位，优化存储空间
    student_card_modified: false,
    diploma_modified: false,
    id_card_front_modified: false,

    introPlaceholder:
      '请介绍您的教学经验、特色等，可以从以下几个方面介绍： 1. 教学资质 2. 教学成果 3. 教学特色 4. 资质证书 5. 教学理念',
    gridConfig: {
      column: 1,
      width: 160,
      height: 160,
    },
    EDUCATION_BACKGROUND_ZH,
    isScrolling: false,
    lastScrollLeft: 0,

    // 添加表单校验状态
    formValidation: {
      school: { status: '', tips: '' },
      major: { status: '', tips: '' },
      real_name: { status: '', tips: '' },
      id_card_no: { status: '', tips: '' },
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取屏幕宽度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      screenWidth: systemInfo.windowWidth,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const { roleInfo, userInfo } = app.globalData;
    const isEdit = Boolean(roleInfo?._id);
    if (isEdit) {
      this.setData({ teacherInfo: roleInfo });
    }

    wx.setNavigationBarTitle({ title: `教师${isEdit ? '信息' : '认证'}` });
    this.setData({ isEdit, 'teacherInfo.user_id': userInfo._id });
  },

  // 切换步骤
  onChange(e) {
    const { current } = e.detail;
    this.scrollToStep(current);
  },

  // 下一步
  nextStep() {
    if (this.data.current < 2) {
      this.scrollToStep(this.data.current + 1);
    }
  },

  // 上一步
  prevStep() {
    if (this.data.current > 0) {
      this.scrollToStep(this.data.current - 1);
    }
  },

  // 监听滚动
  onScroll(e) {
    this.data.lastScrollLeft = e.detail.scrollLeft;
    if (!this.data.isScrolling) {
      this.setData({ isScrolling: true });
    }

    // 清除之前的定时器
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    // 设置新的定时器，滚动结束后自动吸附
    this.scrollTimer = setTimeout(() => {
      this.snapToNearestPage();
    }, 150);
  },

  // 滚动结束
  onScrollEnd() {
    if (this.data.isScrolling) {
      this.snapToNearestPage();
    }
  },

  // 自动吸附到最近的页面
  snapToNearestPage() {
    const { screenWidth, lastScrollLeft } = this.data;
    const pageWidth = screenWidth - 32; // 32是padding

    // 计算最近的页面索引
    const nearestPage = Math.round(lastScrollLeft / pageWidth);

    // 更新当前步骤和滚动位置
    this.scrollToStep(nearestPage);
    this.setData({
      isScrolling: false,
      lastScrollLeft: nearestPage * pageWidth,
    });
  },

  // 滚动至指定页面
  scrollToStep(step) {
    const scrollLeft = step * (this.data.screenWidth - 32);
    this.setData({
      current: step,
      scrollLeft,
    });
  },

  // 验证教育背景信息
  validateEducation() {
    const { teacherInfo } = this.data;
    const validation = {};
    let isValid = true;

    // 学历验证
    if (!teacherInfo.edu_background) {
      isValid = false;
    }

    // 学校验证
    if (!teacherInfo.school) {
      validation.school = { status: 'error', tips: '请输入学校名称' };
      isValid = false;
    }

    // 专业验证
    if (!teacherInfo.major) {
      validation.major = { status: 'error', tips: '请输入专业名称' };
      isValid = false;
    }

    // 证件验证
    if (!teacherInfo.is_graduate && !teacherInfo.student_card) {
      isValid = false;
    }

    // 毕业证验证
    if ((teacherInfo.is_graduate || teacherInfo.has_degree) && !teacherInfo.diploma) {
      isValid = false;
    }

    return { isValid, validation };
  },

  // 验证实名认证信息
  validateIdentity() {
    const { teacherInfo } = this.data;
    const validation = {};
    let isValid = true;

    // 姓名验证
    if (!teacherInfo.real_name) {
      validation.real_name = { status: 'error', tips: '请输入真实姓名' };
      isValid = false;
    } else if (!isValidChineseName(teacherInfo.real_name)) {
      validation.real_name = { status: 'error', tips: '请输入正确的中文姓名' };
      isValid = false;
    }

    // 身份证号验证
    if (!teacherInfo.id_card_no) {
      validation.id_card_no = { status: 'error', tips: '请输入身份证号码' };
      isValid = false;
    } else if (!isValidIdCardNo(teacherInfo.id_card_no)) {
      validation.id_card_no = { status: 'error', tips: '请输入正确的身份证号码' };
      isValid = false;
    }

    // 身份证照片验证
    if (!teacherInfo.id_card_front) {
      isValid = false;
    }

    return { isValid, validation };
  },

  // 验证个人简介信息
  validateIntro() {
    const { teacherInfo } = this.data;
    const validation = {};
    let isValid = true;

    if (!teacherInfo.subjects) {
      isValid = false;
    }

    return { isValid, validation };
  },

  // 更新表单验证状态并处理错误
  handleValidationResult(validationResults) {
    const allValidations = {};
    let firstErrorStep = -1;
    let isValid = true;

    // 合并所有验证结果
    validationResults.forEach(({ step, result }) => {
      if (!result.isValid) {
        isValid = false;
        if (firstErrorStep === -1) {
          firstErrorStep = step;
        }
      }
      Object.assign(allValidations, result.validation);
    });

    // 更新表单验证状态
    this.setData({
      formValidation: { ...this.data.formValidation, ...allValidations },
    });

    // 处理验证失败情况
    if (!isValid) {
      this.scrollToStep(firstErrorStep);
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请检查必填信息',
        theme: 'error',
      });
    }

    return isValid;
  },

  // 主验证函数
  validateForm() {
    const validationResults = [
      { step: 0, result: this.validateEducation() },
      { step: 1, result: this.validateIdentity() },
      { step: 2, result: this.validateIntro() },
    ];

    return this.handleValidationResult(validationResults);
  },

  // 清除字段的错误状态
  clearFieldError(field) {
    this.setData({
      [`formValidation.${field}`]: { status: '', tips: '' },
    });
  },

  // 修改输入框变化处理方法
  onValueChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({ [`teacherInfo.${field}`]: value });
  },

  // 学历背景选择
  showEduPicker() {
    this.setData({ eduBgPickerVisible: true });
  },

  onEduPickerCancel() {
    this.setData({ eduBgPickerVisible: false });
  },

  onEduPickerConfirm(e) {
    const { value } = e.detail;
    this.setData({
      'teacherInfo.edu_background': value[0],
      eduBgPickerVisible: false,
    });
  },

  // 修改文件上传成功方法
  onUploadSuccess(e) {
    const { field } = e.currentTarget.dataset;
    const { files } = e.detail;
    this.setData({
      [`teacherInfo.${field}`]: files[0].url,
      [`${field}_modified`]: true,
    });
    // 清除该字段的错误状态
    this.clearFieldError(field);
  },

  // 文件删除
  onUploadRemove(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`teacherInfo.${field}`]: '',
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
    this.setData({ 'teacherInfo.subjects': e.detail });
  },

  // 上传所有图片
  async uploadAllImages() {
    const { teacherInfo, diploma_modified, id_card_front_modified, student_card_modified } = this.data;
    const { id_card_front, diploma, student_card } = teacherInfo;
    // 如果图片没有修改，则不上传
    const uploadPromises = [
      uploadImageByPath('id-card', id_card_front_modified ? id_card_front : ''),
      uploadImageByPath('diploma', diploma_modified ? diploma : ''),
      uploadImageByPath('student-card', student_card_modified ? student_card : ''),
    ];
    const results = await Promise.all(uploadPromises);
    const [id_card_file_id, diploma_file_id, student_card_file_id] = results;

    this.setData({
      teacherInfo: {
        ...this.data.teacherInfo,
        id_card_file_id,
        diploma_file_id,
        student_card_file_id,
      },
    });
  },

  // 修改提交方法
  async submit() {
    if (!this.validateForm()) {
      return;
    }
    // 验证通过，处理提交逻辑
    Toast({
      context: this,
      selector: '#t-toast',
      duration: -1,
      theme: 'loading',
      direction: 'column',
      message: '保存中...',
    });
    await this.uploadAllImages();

    const { isEdit, teacherInfo } = this.data;
    const res = await wx.cloud.callFunction({
      name: 'registerOrUpdateTeacher',
      data: {
        action: `${isEdit ? 'update' : 'register'}`,
        ...teacherInfo,
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
        ...teacherInfo,
        _id: id,
      };
      app.globalData.userInfo.role = USER_ROLE.TEACHER;
      // 首次注册更新用户角色信息
      await wx.cloud.callFunction({
        name: 'registerOrUpdateUser',
        data: {
          role: USER_ROLE.TEACHER,
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
