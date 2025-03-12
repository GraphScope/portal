import { useState, useEffect } from 'react';

const KEY = 'theme';

const getThemeByAlgo = () => {
  const algo = localStorage.getItem('algorithm');
  if (algo === 'darkAlgorithm') {
    return 'dark';
  }
  return 'light';
};

const getThemeByDumi = () => {
  return localStorage.getItem('dumi:prefers-color');
};
export const useTheme = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const targetElement = document.querySelector('html'); // 目标元素
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.attributeName === 'style' || mutation.attributeName === 'data-prefers-color') {
          const theme_value = localStorage.getItem('theme') || getThemeByDumi() || getThemeByAlgo() || 'light';
          setValue(theme_value);
        }
      }
    });
    //@ts-ignore
    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ['style', 'data-prefers-color'], // 仅观察 'style' 和 'data-prefers-color' 属性
    });
    const theme_value = localStorage.getItem('theme') || getThemeByDumi() || getThemeByAlgo() || 'light';

    setValue(theme_value);
  }, []);

  return value || 'light';
};
