// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async () => {
  const wxContext = cloud.getWXContext();

  try {
    const userData = await db
      .collection('user')
      .where({
        openId: wxContext.OPENID,
      })
      .get();

    // 返回标准化数据结构
    return {
      success: true,
      data: userData.data, // 返回用户数据
      message: '查询成功',
    };
  } catch (error) {
    // 捕获错误并返回标准化错误信息
    return {
      success: false,
      errorCode: error.code || -1,
      message: error.message || '查询失败',
    };
  }
};
