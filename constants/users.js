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

export const EDUCATION_BACKGROUND = {
  PRIMARY: '1',
  JUNIOR: '2',
  HIGH: '3',
  SECONDARY: '4',
  ASSOCIATE: '5',
  BACHELORS: '6',
  MASTERS: '7',
  DOCTOR: '8',
  POSTDOCTORAL: '9',
};

export const EDUCATION_BACKGROUND_ZH = {
  [EDUCATION_BACKGROUND.PRIMARY]: '小学',
  [EDUCATION_BACKGROUND.JUNIOR]: '初中',
  [EDUCATION_BACKGROUND.HIGH]: '高中',
  [EDUCATION_BACKGROUND.SECONDARY]: '中专',
  [EDUCATION_BACKGROUND.ASSOCIATE]: '专科',
  [EDUCATION_BACKGROUND.BACHELORS]: '本科',
  [EDUCATION_BACKGROUND.MASTERS]: '硕士',
  [EDUCATION_BACKGROUND.DOCTOR]: '博士',
  [EDUCATION_BACKGROUND.POSTDOCTORAL]: '博士后',
};
