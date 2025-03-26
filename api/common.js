const { cloud } = wx;

export async function getDataByOpenid(collection) {
  try {
    const res = await cloud.callContainer({
      path: 'getDataByOpenid',
      header: { 'X-WX-SERVICE': 'common' },
      data: { collection },
      method: 'POST',
    });

    return res;
  } catch (error) {
    // 暂不做处理，默认成功
  }
}

export async function getDataByUserId({ collection, userId }) {
  try {
    const res = await cloud.callContainer({
      path: 'getDataByUserId',
      header: { 'X-WX-SERVICE': 'common' },
      data: { collection, userId },
      method: 'POST',
    });

    return res;
  } catch (error) {
    // 暂不做处理，默认成功
    return;
  }
}

/**
 * 上传图片到指定路径
 * @param {string} path 上传文件文件夹路径
 * @param {string} tempFilePath 图片临时路径
 * @returns {Promise<string>} 上传成功后返回文件ID
 */
export async function uploadImageByPath(path, tempFilePath) {
  const res = awaitcloud.callFunction({
    name: 'uploadImageByPath',
    data: {
      path,
      file: wx.getFileSystemManager().readFileSync(tempFilePath),
    },
  });
  return res.result;
}
