export const modifyTableData = ({ data }: any) => {
  if (!data || !data.length) {
    return [];
  }

  return data.map((record: any) => {
    return { ...record, isCompleted: record.isCompleted.toString(), isImportant: record.isImportant.toString() };
  });
};

export const convertTableData = ({ data }: any) => {
  if (!data || !data.length) {
    return [];
  }

  return data.map((record: any) => {
    return {
      ...record,
      isCompleted: record.isCompleted === 'true',
      timesSolved: +record.timesSolved,
      isImportant: record.isImportant === 'true',
    };
  });
};
