import { useState, useEffect } from 'react';

/**
 * 主题类型
 */
type ThemeType = 'defaultAlgorithm' | 'darkAlgorithm';

/**
 * 获取算法主题
 */
const getThemeByAlgo = (): ThemeType => {
  const algo = localStorage.getItem('algorithm');
  return (algo === 'darkAlgorithm' ? 'darkAlgorithm' : 'defaultAlgorithm') as ThemeType;
};

/**
 * 获取 dumi 主题
 */
const getThemeByDumi = (): string | null => {
  return localStorage.getItem('dumi:prefers-color');
};

/**
 * 主题 Hook
 *
 * 用于管理和监听主题变化
 * 支持算法主题和 dumi 主题
 */
export const useTheme = (): ThemeType => {
  const [theme, setTheme] = useState<ThemeType>('defaultAlgorithm');

  useEffect(() => {
    // 初始化主题
    const initialTheme = getThemeByAlgo();
    setTheme(initialTheme);

    // 监听主题变化
    const targetElement = document.querySelector('html');
    if (!targetElement) return;

    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = getThemeByAlgo();
          setTheme(newTheme);
        }
      }
    });

    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};
