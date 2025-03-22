const app = getApp();

export async function getSubjects() {
  const { data } = await app.models.subjects.list({
    select: {
      name: true,
      subject: true,
      value: true,
    },
    orderBy: [{ order: 'asc' }],
  });

  const { records } = data;
  const subjectMap = {};
  records.forEach((item) => {
    if (!subjectMap[item.subject]) {
      subjectMap[item.subject] = [];
    }
    subjectMap[item.subject].push(item);
  });
  const subjects = Object.keys(subjectMap).map((subjectName) => {
    return {
      name: subjectName,
      children: subjectMap[subjectName],
    };
  });

  return subjects;
}
