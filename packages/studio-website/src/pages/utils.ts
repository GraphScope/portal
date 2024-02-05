export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};
