// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  try {
    const result = await cloud.openapi.phonenumber.getPhoneNumber({
      code: event.code,
    });
    return {
      success: true,
      data: result.phoneInfo,
      message: '查询成功',
    };
  } catch (error) {
    return {
      success: false,
      errorCode: error.errCode || -1,
      message: error.errMsg || '查询失败',
    };
  }
};
