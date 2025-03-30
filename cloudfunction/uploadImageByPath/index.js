const cloud = require('wx-server-sdk');
cloud.init({ env: process.env.Env });

exports.main = async (event) => {
  const { path, file } = event;
  if (!path || !file) {
    return '';
  }
  const wxContext = cloud.getWXContext();

  // 以openid为文件名，便于查找
  const fileID = await cloud.uploadFile({
    cloudPath: `${path}/${wxContext.OPENID}_${Date.now().toString().slice(-4)}.png`,
    fileContent: Buffer.from(file, 'base64'),
  });
  return fileID.fileID;
};
