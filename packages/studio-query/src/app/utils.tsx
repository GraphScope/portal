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

export function formatCypherStatement(cypherStatement) {
  const keywords = ['MATCH', 'WHERE', 'RETURN', 'CREATE', 'DELETE'];

  // 添加换行符到每个关键词后面
  for (const keyword of keywords) {
    cypherStatement = cypherStatement.replace(new RegExp(`(${keyword})(?![^\\(]*\\))`, 'g'), '\n$1');
  }

  // 在逗号后添加换行符
  cypherStatement = cypherStatement.replace(/, /g, ',\n');

  // 其他格式化步骤...

  // 使用正则表达式匹配连续的换行符，并将其替换为单个换行符
  cypherStatement = cypherStatement.replace(/\n+/g, '\n');

  // 返回格式化后的Cypher语句
  return cypherStatement.trim();
}

export function countLines(str) {
  // 使用正则表达式匹配换行符，并计算匹配到的数量，即为行数
  return (str.match(/\r?\n/g) || []).length + 1;
}
