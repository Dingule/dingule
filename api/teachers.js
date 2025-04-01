import { ACCOUNT_STATUS } from '~/constants/users';
const app = getApp();

export async function getTeacherList() {
  try {
    const res = await app.models.teachers.list({
      select: {
        _id: true,
        real_name: true,
        edu_background: true,
        school: true,
        major: true,
        intro: true,
        subjects: true,
        status: true,
        user_id: {
          avatar_file_id: true,
          gender: true,
          birth: true,
          location_name: true,
        },
      },
      filter: {
        where: {
          status: {
            $eq: ACCOUNT_STATUS.APPROVED,
          },
        },
      },
    });
    let expandedTeahcerList = res.data?.records?.map((teacher) => {
      const expandedTeacher = {
        ...teacher,
        ...teacher.user_id,
      };
      delete expandedTeacher.user_id;
      return expandedTeacher;
    });

    const tempUrlRes = await wx.cloud.getTempFileURL({
      fileList: expandedTeahcerList.map((teacher) => teacher.avatar_file_id),
    });
    expandedTeahcerList = expandedTeahcerList.map((teacher, index) => {
      return {
        ...teacher,
        avatar: tempUrlRes.fileList[index].tempFileURL,
        subjects: teacher.subjects.split('、'),
      };
    });

    return expandedTeahcerList;
  } catch (error) {
    return [];
  }
}
