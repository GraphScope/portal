export function safeParse(input) {
  try {
    // 尝试直接解析
    return JSON.parse(input);
  } catch (error) {
    // 如果直接解析失败，检查是否可以通过添加双引号来修复
    if (typeof input === 'string' && !input.startsWith('"') && !input.endsWith('"')) {
      try {
        // 尝试添加双引号并重新解析
        return JSON.parse(`"${input}"`);
      } catch (innerError) {
        // 如果仍然无法解析，则返回原始输入或者抛出错误
        console.error('Failed to parse the input:', innerError);
        return input;
      }
    } else {
      // 如果输入已经是有效的 JSON 字符串或其他类型的数据，直接返回
      return input;
    }
  }
}

export const storage = {
  get<T>(key: string): T | undefined {
    try {
      const values = localStorage.getItem(key);
      if (values) {
        return safeParse(values);
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
export const getAllSearchParams = () => {
  // hash router
  if (window.location.hash.includes('?')) {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    return Object.fromEntries(params.entries());
  }
  // browser router
  //@ts-ignore
  const url = new URL(window.location);
  const { searchParams } = url;

  return Object.fromEntries(searchParams.entries());
};

export const getSearchParams = (key: string) => {
  // hash router
  if (window.location.hash.includes('?')) {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    if (key) {
      return params.get(key) || '';
    }
  }
  // browser router
  //@ts-ignore
  const url = new URL(window.location);
  const { searchParams } = url;
  if (key) {
    return searchParams.get(key) || '';
  }
  return '';
};
export const setSearchParams = (params: Record<string, string>, HashMode?: boolean) => {
  const isHashMode = window.location.hash.startsWith('#/') || HashMode;

  if (isHashMode) {
    // 处理 hash router
    let hash = window.location.hash.substring(1);
    const [path, search] = hash.split('?');
    const searchParams = new URLSearchParams(search);

    // 更新 searchParams
    Object.keys(params).forEach(key => {
      searchParams.set(key, params[key]);
    });

    window.location.hash = '#' + path + '?' + searchParams.toString();
  } else {
    // 处理 browser router
    //@ts-ignore
    const url = new URL(window.location);
    const { searchParams } = url;

    Object.keys(params).forEach(key => {
      searchParams.set(key, params[key]);
    });

    // 更新浏览器的 URL，只改变 search 部分
    window.history.pushState({}, '', url);
  }
};

export const removeSearchParams = (deleteKeys: string[], HashMode?: boolean) => {
  const isHashMode = window.location.hash.startsWith('#/') || HashMode;

  if (isHashMode) {
    // 处理 hash router
    let hash = window.location.hash.substring(1);
    const [path, search] = hash.split('?');
    const searchParams = new URLSearchParams(search);

    // 更新 searchParams
    deleteKeys.forEach(key => {
      searchParams.delete(key);
    });

    window.location.hash = '#' + path + '?' + searchParams.toString();
  } else {
    // 处理 browser router
    //@ts-ignore
    const url = new URL(window.location);
    const { searchParams } = url;

    deleteKeys.forEach(key => {
      searchParams.delete(key);
    });

    // 更新浏览器的 URL，只改变 search 部分
    window.history.pushState({}, '', url);
  }
};

export const getCurrentNav = () => {
  const hashMode = window.location.hash.startsWith('#/');
  if (hashMode) {
    const [pathname] = window.location.hash.slice(1).split('?');
    return '/' + pathname.split('/')[1];
  } else {
    const { pathname } = window.location;
    return '/' + pathname.split('/')[1];
  }
};

export const searchParamOf = (key: string) => {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get(key);
};

export const getUrlParams = () => {
  return Object.fromEntries(new URLSearchParams(location.hash.split('?')[1]).entries());
};

export const fakeSnapshot = obj => {
  return JSON.parse(JSON.stringify(obj));
};

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
export const downloadImage = (dataUrl: string, name: string) => {
  const a = document.createElement('a');
  a.setAttribute('download', name);
  a.setAttribute('href', dataUrl);
  a.click();
};

export function createDownload(content: string | Blob, filename: string = 'untitled.txt') {
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  const blob = typeof content === 'string' ? new Blob([content]) : content;
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
  URL.revokeObjectURL(eleLink.href);
}

export function groupBy(array, fun) {
  return array.reduce((result, currentItem) => {
    // 获取自定义分组键值
    const groupKey = fun(currentItem);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(currentItem);

    return result;
  }, {});
}

export { generatorSchemaByGraphData } from './schema';
export { asyncFunctionWithWorker } from './work';

export {
  parseFile,
  extractHeaderAndDelimiter,
  detectDataTypes,
  getFileSize,
  parseCSV,
  covertCSV2JSON,
} from './parseCSV';
export { inferredGraphFields } from './inferredGraphFields';
export { parseJSON } from './parseJSON';

export { extractProperties } from './inferredSchema';
export { handleExpand, uniqueElementsBy } from './expand';
export { transSchema } from './transSchema';
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getObjByPath(obj, path) {
  if (obj == null || typeof path !== 'string') return undefined;

  let keys = 0,
    key = '',
    len = path.length,
    result = obj;

  while (keys < len) {
    const char = path[keys];
    if (char === '.') {
      result = result[key];
      if (result == null) return undefined;
      key = '';
    } else {
      key += char;
    }
    keys++;
  }

  return result[key];
}
