export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};
/** 处理alert 属性options方法 */
export const handleOptions = (data: { [x: string]: string }[], type: string) => {
  return [{ value: 'All', text: 'All' }].concat(
    data.map((item: { [x: string]: string }) => {
      const text = item[type].substring(0, 1).toUpperCase() + item[type].substring(1);
      return { value: item[type], text };
    }),
  );
};
