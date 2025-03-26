// 验证是否为身份证号
export const isValidIdCardNo = (value) => {
  return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value);
};

// 验证是否为合法的中文名
export const isValidChineseName = (value) => {
  return /^[\u4e00-\u9fa5]{2,6}$/.test(value);
};
