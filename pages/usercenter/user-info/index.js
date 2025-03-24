import { phoneEncryption } from '../../../utils/util';
import Toast, { hideToast } from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  data: {
    isLogin: false,
    tempUsername: '',
    personInfo: {
      avatar: '',
      avatar_file_id: '',
      birth: '',
      gender: 0,
      nickname: '',
      phoneNumber: '', // 默认值为空
      encryptedNumber: '', // 加密后的手机号
    },
    userLocation: {
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
    },
    usernameDialogVisible: false,
    genderOptions: [
      {
        label: '先生',
        value: 1,
      },
      {
        label: '女士',
        value: 2,
      },
    ],
    birthPickerVisible: false,
    birthFilter: (type, options) => (type === 'year' ? options.sort((a, b) => a.value - b.value) : options),
  },

  onLoad(options) {
    if (app.globalData.isLogin) {
      this.initUserDataFromStorage();
    } else {
      const phoneNumber = options.number || '';
      this.setData({
        isLogin: app.globalData.isLogin,
        'personInfo.phoneNumber': phoneNumber,
        'personInfo.encryptedNumber': phoneEncryption(phoneNumber),
      });

      this.getLocation();
    }
  },

  onShow() {},

  // 获取用户详细信息
  initUserDataFromStorage() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({
          personInfo: {
            avatar: userInfo.avatar || '',
            birth: userInfo.birth || '',
            gender: userInfo.gender || 0,
            nickname: userInfo.nickname || '',
            phoneNumber: userInfo.phone_number || '',
            encryptedNumber: phoneEncryption(userInfo.phone_number || ''),
          },
          userLocation: {
            name: userInfo.location_name || '',
            address: userInfo.location_address || '',
            latitude: userInfo.latitude || 0,
            longitude: userInfo.longitude || 0,
          },
        });
      }
    } catch (error) {
      console.error('从存储中获取用户数据失败', error);
    }
  },

  // 获取用户地理位置
  async getLocation() {
    // 检查用户是否授权获取地理位置
    const settingRes = await wx.getSetting();
    if (!settingRes.authSetting['scope.userLocation']) {
      // 未授权，请求授权
      await wx.authorize({
        scope: 'scope.userLocation',
      });
    }

    const locationRes = await wx.getLocation({ type: 'gcj02' });
    const { latitude, longitude } = locationRes;
    this.setData({
      userLocation: {
        latitude,
        longitude,
      },
    });
  },

  async onClickCell({ currentTarget }) {
    const { dataset } = currentTarget;
    switch (dataset.type) {
      case 'nickname':
        this.setData({
          usernameDialogVisible: true,
          tempUsername: this.data.personInfo.nickname,
        });
        break;
      case 'birth':
        this.setData({
          birthPickerVisible: true,
        });
        break;
      case 'location':
        this.toChooseLocation();
        break;
      case 'avatar':
        this.openChooseAvatar();
        break;
      default: {
        break;
      }
    }
  },

  onGenderChange(e) {
    this.setData({ 'personInfo.gender': e.detail.value });
  },

  // 用户昵称对话框
  closeUsernameDialog(e) {
    if (e.type === 'confirm') {
      this.setData({
        'personInfo.nickname': this.data.tempUsername,
      });
    }
    this.setData({ usernameDialogVisible: false });
  },
  onUsernameChange(e) {
    this.setData({ tempUsername: e.detail.value });
  },

  // 选择地理位置
  async toChooseLocation() {
    try {
      const selectedLocation = await wx.chooseLocation({
        ...this.data.userLocation,
      });
      const { name, address, latitude, longitude } = selectedLocation;

      this.setData({
        userLocation: {
          name,
          address,
          latitude,
          longitude,
        },
      });
    } catch (error) {
      // 用户取消选择，无需处理
    }
  },

  // 修改头像
  async openChooseAvatar() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
      });

      if (res.tempFiles[0].size > 5000000) {
        return Toast({
          context: this,
          selector: '#t-toast',
          message: '图片大小不超过5M',
          direction: 'column',
          theme: 'warning',
        });
      }

      // 更新头像显示
      this.setData({
        'personInfo.avatar': res.tempFiles[0].tempFilePath,
      });
    } catch (error) {
      if (error.errMsg === 'chooseMedia:fail cancel') return;
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error',
      });
    }
  },

  // 上传头像
  async uploadAvatar() {
    const file = this.data.personInfo.avatar;
    const res = await wx.cloud.callFunction({
      name: 'uploadAvatar',
      data: { file: wx.getFileSystemManager().readFileSync(file) },
    });

    this.setData({ 'personInfo.avatar_file_id': res.result });
  },

  onBirthPickerChange(e) {
    this.setData({ 'personInfo.birth': e.detail.value });
  },
  hideBirthPicker() {
    this.setData({ birthPickerVisible: false });
  },

  async afterSave(isLogin, personInfo) {
    app.globalData.isLogin = true;
    app.globalData.userInfo = personInfo;

    wx.setStorageSync('userInfo', personInfo);
    wx.setStorageSync('isLogin', true);

    hideToast({ context: this, selector: '#t-toast' });
    Toast({
      context: this,
      selector: '#t-toast',
      message: isLogin ? '更新成功' : '注册成功',
      theme: 'success',
    });
    // 成功后自动返回上一页
    let timer = setTimeout(() => {
      wx.navigateBack();
      clearTimeout(timer);
      timer = null;
    }, 500);
  },

  validateRequiredFields(fields) {
    for (const field of fields) {
      if (!field.value) {
        Toast({
          context: this,
          selector: '#t-toast',
          message: field.message,
          theme: 'warning',
        });
        return false;
      }
    }
    return true;
  },

  async onConfirm() {
    const { personInfo, userLocation, isLogin } = this.data;
    // 校验必填项
    const requiredFields = [
      { value: personInfo.nickname, message: '请填写用户名' },
      { value: personInfo.gender, message: '请选择性别' },
      { value: personInfo.birth, message: '请选择出生日期' },
      { value: userLocation.name, message: '请选择地理位置' },
    ];

    if (!this.validateRequiredFields(requiredFields)) {
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
    // 用户选了头像才上传
    if (personInfo.avatar) {
      await this.uploadAvatar();
    }

    const requestBody = {
      nickname: personInfo.nickname,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      location_address: userLocation.address,
      location_name: userLocation.name,
      birth: personInfo.birth,
      phone_number: personInfo.phoneNumber,
      gender: personInfo.gender,
      avatar_file_id: personInfo.avatar_file_id,
    };

    try {
      const res = await wx.cloud.callFunction({
        name: 'registerOrUpdateUser',
        data: {
          ...requestBody,
          action: isLogin ? 'update' : 'register',
        },
      });
      if (!res.result.success) {
        throw new Error(res.result.message);
      }

      this.afterSave(isLogin, personInfo);
    } catch (err) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '操作失败，请稍后重试',
        theme: 'error',
      });
      console.error('云函数调用失败', err);
    }
  },
});
