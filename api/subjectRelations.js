const app = getApp();

// ❗关系表权限为仅允许创建者读写，故读写时不需要再传入身份标识
/**
 * 获取角色的科目关系列表
 * @param {string} role - 角色类型('student'/'teacher')
 * @returns {Promise<Array>} 返回科目ID列表
 */
export async function getSubjectRelations(role) {
  const res = await app.models[`${role}_subject`].list({
    select: { subject_id: true },
  });
  return res.data.records.map((item) => item.subject_id);
}

/**
 * 添加角色的科目关系
 * @param {string} role - 角色类型('student'/'teacher')
 * @param {string} roleId - 角色ID
 * @param {Array<string>} subjectIdList - 要添加的科目ID列表
 * @returns {Promise} 创建结果
 */
export function addSubjectRelations(role, roleId, subjectIdList) {
  return app.models[`${role}_subject`].createMany({
    data: subjectIdList.map((subjectId) => ({
      [`${role}_id`]: { _id: roleId },
      subject_id: subjectId,
    })),
  });
}

/**
 * 删除角色的科目关系
 * @param {string} role - 角色类型('student'/'teacher')
 * @param {Array<string>} subjectIdList - 要删除的科目ID列表
 * @returns {Promise} 删除结果
 */
export function deleteSubjectRelations(role, subjectIdList) {
  return app.models[`${role}_subject`].deleteMany({
    filter: {
      where: {
        subject_id: {
          $in: subjectIdList,
        },
      },
    },
  });
}
