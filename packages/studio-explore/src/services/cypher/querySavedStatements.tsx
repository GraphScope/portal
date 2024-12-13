import localforage from 'localforage';

const DB_QUERY_SAVED = localforage.createInstance({
  name: 'DB_QUERY_SAVED',
});
export const querySavedStaments = async () => {
  const result: any[] = [];
  await DB_QUERY_SAVED.iterate(item => {
    if (item) {
      result.push(item);
    }
  });
  return result;
};
