/**
 * 获取hash上的search对象
 * @param location
 * @returns
 */
export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};

export const searchParamOf = (key: string) => {
  const { searchParams } = getSearchParams(window.location);
  return searchParams.get(key);
};

export const getUrlParams = () => {
  return Object.fromEntries(new URLSearchParams(location.href.split('?')[1]).entries());
};

type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): DebouncedFunction<T> {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
/** 导出数据*/
export const download = (queryData: string, states: BlobPart) => {
  const eleLink = document.createElement('a');
  eleLink.download = queryData;
  eleLink.style.display = 'none';
  const blob = new Blob([states]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
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
