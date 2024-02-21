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
