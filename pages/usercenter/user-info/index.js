import { phoneEncryption } from '../../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
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
    showUnbindConfirm: false,
    pickerOptions: [
      {
        name: '先生',
        code: '1',
      },
      {
        name: '女士',
        code: '2',
      },
    ],
    genderPickerVisible: false,
    genderMap: ['请选择', '先生', '女士'],
  },
  onLoad(options) {
    this.fetchData();

    this.getLocation();
    console.log('option.query :>> ', options);
  },

  onShow() {},

  // 获取用户详细信息
  fetchData() {
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
    const { nickName } = this.data.personInfo;

    switch (dataset.type) {
      case 'name':
        wx.navigateTo({
          url: `/pages/usercenter/name-edit/index?name=${nickName}`,
        });
        break;
      case 'gender':
        this.setData({
          genderPickerVisible: true,
        });
        break;
      case 'location': {
        try {
          const selectedLocation = await wx.chooseLocation({
            ...this.data.userLocation,
          });
          const { name, address, latitude, longitude } = selectedLocation;

          // 用户未选中具体地址就点击确定
          if (!name) {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '请选择具体地址',
              theme: 'warning',
            });
            break;
          }
          this.setData({
            userLocation: {
              name,
              address,
              latitude,
              longitude,
            },
          });
        } catch (error) {}

        break;
      }
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

  onClose() {
    this.setData({
      genderPickerVisible: false,
    });
  },
  onConfirm(e) {
    const { value } = e.detail;
    this.setData(
      {
        genderPickerVisible: false,
        'personInfo.gender': value,
      },
      () => {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '设置成功',
          theme: 'success',
        });
      },
    );
  },
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
});
