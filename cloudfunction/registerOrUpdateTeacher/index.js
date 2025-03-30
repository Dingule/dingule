// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const teachersCollection = db.collection('teachers');

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const { action, ...teacherInfo } = event;

  try {
    if (action === 'register') {
      // 创建教师数据
      const result = await teachersCollection.add({
        data: {
          ...teacherInfo,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate(),
          _openid: wxContext.OPENID,
        },
      });
      return { success: true, message: '教师注册成功', data: result._id };
    }
    if (action === 'update') {
      delete teacherInfo._id;
      // 更新教师数据
      const result = await teachersCollection.where({ _openid: wxContext.OPENID }).update({
        data: {
          ...teacherInfo,
          updatedAt: db.serverDate(),
        },
      });
      return { success: true, message: '教师更新成功', data: result };
    }
    return { success: false, message: '无效的操作类型' };
  } catch (error) {
    console.error('操作失败', error);
    return { success: false, message: '操作失败', error };
  }
};
