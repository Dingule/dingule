// 年级常量
export const GRADES = {
  K0: 'K0', // 学前班
  K1: 'K1', // 幼儿园小班
  K2: 'K2', // 幼儿园中班
  K3: 'K3', // 幼儿园大班
  G1: 'G1', // 小学一年级
  G2: 'G2', // 小学二年级
  G3: 'G3', // 小学三年级
  G4: 'G4', // 小学四年级
  G5: 'G5', // 小学五年级
  G6: 'G6', // 小学六年级
};

// 年级中文名称映射
export const GRADE_ZH = {
  [GRADES.K0]: '学前班',
  [GRADES.K1]: '幼儿园小班',
  [GRADES.K2]: '幼儿园中班',
  [GRADES.K3]: '幼儿园大班',
  [GRADES.G1]: '小学一年级',
  [GRADES.G2]: '小学二年级',
  [GRADES.G3]: '小学三年级',
  [GRADES.G4]: '小学四年级',
  [GRADES.G5]: '小学五年级',
  [GRADES.G6]: '小学六年级',
};

// 按教育阶段分组的年级列表
export const GRADE_GROUPS = [
  {
    value: GRADES.K0,
    label: GRADE_ZH[GRADES.K0],
  },
  {
    value: GRADES.K1,
    label: GRADE_ZH[GRADES.K1],
  },
  {
    value: GRADES.K2,
    label: GRADE_ZH[GRADES.K2],
  },
  {
    value: GRADES.K3,
    label: GRADE_ZH[GRADES.K3],
  },

  {
    value: GRADES.G1,
    label: GRADE_ZH[GRADES.G1],
  },
  {
    value: GRADES.G2,
    label: GRADE_ZH[GRADES.G2],
  },
  {
    value: GRADES.G3,
    label: GRADE_ZH[GRADES.G3],
  },
  {
    value: GRADES.G4,
    label: GRADE_ZH[GRADES.G4],
  },
  {
    value: GRADES.G5,
    label: GRADE_ZH[GRADES.G5],
  },
  {
    value: GRADES.G6,
    label: GRADE_ZH[GRADES.G6],
  },
];
