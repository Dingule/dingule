// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const db = cloud.database();
const studentsCollection = db.collection('students');

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const { action, ...studentInfo } = event;

  try {
    if (action === 'register') {
      // 创建学生数据
      const result = await studentsCollection.add({
        data: {
          ...studentInfo,
          status: '1', // 学生无需认证，默认通过
          createdAt: db.serverDate(),
          updatedAt: db.serverDate(),
          _openid: wxContext.OPENID,
        },
      });
      return { success: true, message: '学生注册成功', data: result._id };
    }
    if (action === 'update') {
      delete studentInfo._id;
      // 更新学生数据
      const result = await studentsCollection.where({ _openid: wxContext.OPENID }).update({
        data: {
          ...studentInfo,
          updatedAt: db.serverDate(),
        },
      });
      return { success: true, message: '学生更新成功', data: result };
    }
    return { success: false, message: '无效的操作类型' };
  } catch (error) {
    console.error('操作失败', error);
    return { success: false, message: '操作失败', error };
  }
};
