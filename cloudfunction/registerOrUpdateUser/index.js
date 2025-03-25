// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const usersCollection = db.collection('users');

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const { action, ...userData } = event;

  try {
    if (action === 'register') {
      // 创建用户数据
      const result = await usersCollection.add({
        data: {
          ...userData,
          openId: wxContext.OPENID,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate(),
          _openid: wxContext.OPENID,
        },
      });
      return { success: true, message: '用户注册成功', data: result };
    }
    if (action === 'update') {
      // 更新用户数据
      const result = await usersCollection.where({ openId: wxContext.OPENID }).update({
        data: {
          ...userData,
          updatedAt: db.serverDate(),
        },
      });
      return { success: true, message: '用户更新成功', data: result };
    }
    return { success: false, message: '无效的操作类型' };
  } catch (error) {
    console.error('操作失败', error);
    return { success: false, message: '操作失败', error };
  }
};
