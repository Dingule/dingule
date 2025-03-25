// 同步数据库枚举强制使用字符串

export const USER_ROLE = {
  UNSET: '0',
  STUDENT: '1',
  TEACHER: '2',
};

export const ACCOUNT_STATUS = {
  PENDING: '0', // 审核中
  APPROVED: '1', // 审核通过
  REJECTED: '2', // 审核未通过
  DISABLED: '3', // 禁用
};
