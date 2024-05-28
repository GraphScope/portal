export const storage = {
  get<T>(key: string): T | undefined {
    try {
      const values = localStorage.getItem(key);
      if (values) {
        return JSON.parse(values);
      }
    } catch (error) {
      console.error('Error while retrieving data from localStorage:', error);
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value, null, 2));
    } catch (error) {
      console.error('Error while storing data in localStorage:', error);
    }
  },
};

export function isDarkTheme() {
  const { mode } = storage.get<{ mode: string; primaryColor: string }>('STUDIO_QUERY_THEME') || {};
  return mode === 'darkAlgorithm';
}

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: Parameters<T>): void => {
    //@ts-ignore
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
