const app = getApp();

export async function getSubjects() {
  const { data } = await app.models.subjects.list({
    select: {
      label: true,
      value: true,
      subject: true,
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
  const subjects = Object.keys(subjectMap).map((label) => {
    return {
      label,
      value: label,
      children: subjectMap[label],
    };
  });

  return subjects;
}
