import { phoneEncryption } from '../../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';

const app = getApp();

Page({
  data: {
    isLogin: false,
    tempUsername: '',
    personInfo: {
      avatarUrl: '',
      nickName: '',
      gender: 0,
      phoneNumber: '13438358888',
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
    this.fetchUserData();

    this.getLocation();
    console.log('option.query :>> ', options);
  },

  onShow() {
    this.setData({ isLogin: app.globalData.isLogin });
  },

  // 获取用户详细信息
  fetchUserData() {
    // TODO: 从后端获取用户信息
    const personInfo = {
      avatarUrl:
        'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
      nickName: 'TDesign',
      phoneNumber: '13438358888',
      gender: 0,
    };
    this.setData({
      personInfo,
      'personInfo.phoneNumber': phoneEncryption(personInfo.phoneNumber),
    });
  },

  // 获取用户地理位置
  async getLocation() {
    // 检查用户是否授权获取地理位置
    const settingRes = await wx.getSetting();
    if (!settingRes.authSetting['scope.userLocation']) {
      // 未授权，请求授权
      const authRes = await wx.authorize({
        scope: 'scope.userLocation',
      });
      console.log('authRes :>> ', authRes);
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
      case 'name':
        this.setData({
          usernameDialogVisible: true,
          tempUsername: this.data.personInfo.nickName,
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
      case 'avatarUrl':
        this.toModifyAvatar();
        break;
      default: {
        break;
      }
    }
  },

  // 首次登录注册信息
  register() {
    // 注册成功后返回上一页
    wx.navigateBack();
  },

  onGenderChange(e) {
    console.log('e.detail.value :>> ', e.detail.value);
    this.setData({ 'personInfo.gender': e.detail.value });
  },

  // 用户昵称对话框
  closeUsernameDialog(e) {
    if (e.type === 'confirm') {
      this.setData({
        'personInfo.nickName': this.data.tempUsername,
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
  async toModifyAvatar() {
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const { path, size } = res.tempFiles[0];
            if (size <= 10485760) {
              resolve(path);
            } else {
              reject({ errMsg: '图片大小超出限制，请重新上传' });
            }
          },
          fail: (err) => reject(err),
        });
      });
      const tempUrlArr = tempFilePath.split('/');
      const tempFileName = tempUrlArr[tempUrlArr.length - 1];
      Toast({
        context: this,
        selector: '#t-toast',
        message: `已选择图片-${tempFileName}`,
        theme: 'success',
      });
    } catch (error) {
      if (error.errMsg === 'chooseImage:fail cancel') return;
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error',
      });
    }
  },

  onBirthPickerChange(e) {
    this.setData({ 'personInfo.birth': e.detail.value });
  },
  hideBirthPicker() {
    this.setData({ birthPickerVisible: false });
  },
});
