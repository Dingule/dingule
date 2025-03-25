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
