// pages/usercenter/teacher-info/index.js
import Toast from 'tdesign-miniprogram/toast/index';
// import { toSnakeCase } from '~/utils/util';
// import { uploadImageByPath } from '~/api/common';
import { isValidIdCardNo, isValidChineseName } from '~/utils/regex';
import { EDUCATION_BACKGROUND_ZH } from '~/constants/users';

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
    current: 0,
    scrollLeft: 0,
    steps: [{ title: '教育背景' }, { title: '实名认证' }, { title: '个人简介' }],
    eduBgPickerVisible: false,
    subjectPopupVisible: false,
    eduBackgroundOptions,
    teacherInfo: {
      // 教育背景
      eduBackground: '',
      school: '',
      major: '',
      studentCard: '', // 学生证图片fileId
      hasDegree: false,
      isGraduated: false,
      diploma: '', // 学位证书图片fileId

      // 实名认证
      realName: '',
      idCardNo: '',
      idCardFront: '',

      // 个人简介
      intro: '',
    },
    teacherSubject: '', // 科目不在教师表中，单独储存

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
      realName: { status: '', tips: '' },
      idCardNo: { status: '', tips: '' },
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
  onShow() {},

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
    if (!teacherInfo.eduBackground) {
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
    if (!teacherInfo.isGraduated && !teacherInfo.studentCard) {
      isValid = false;
    }

    // 毕业证验证
    if ((teacherInfo.isGraduated || teacherInfo.hasDegree) && !teacherInfo.diploma) {
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
    if (!teacherInfo.realName) {
      validation.realName = { status: 'error', tips: '请输入真实姓名' };
      isValid = false;
    } else if (!isValidChineseName(teacherInfo.realName)) {
      validation.realName = { status: 'error', tips: '请输入正确的中文姓名' };
      isValid = false;
    }

    // 身份证号验证
    if (!teacherInfo.idCardNo) {
      validation.idCardNo = { status: 'error', tips: '请输入身份证号码' };
      isValid = false;
    } else if (!isValidIdCardNo(teacherInfo.idCardNo)) {
      validation.idCardNo = { status: 'error', tips: '请输入正确的身份证号码' };
      isValid = false;
    }

    // 身份证照片验证
    if (!teacherInfo.idCardFront) {
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
      'teacherInfo.eduBackground': value,
      eduBgPickerVisible: false,
    });
  },

  // 修改文件上传成功方法
  onUploadSuccess(e) {
    const { field } = e.currentTarget.dataset;
    const { files } = e.detail;
    this.setData({
      [`teacherInfo.${field}`]: files[0].url,
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
    this.setData({ teacherSubject: e.detail });
  },

  // 修改提交方法
  submit() {
    if (!this.validateForm()) {
      return;
    }
    // 验证通过，处理提交逻辑
    wx.showToast({
      title: '提交成功',
      icon: 'success',
    });
    console.log('this.data.teacherInfo :>> ', this.data.teacherInfo);
  },
});
