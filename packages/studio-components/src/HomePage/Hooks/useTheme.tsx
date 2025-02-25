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
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          //   const { cssText } = mutation.target.style;
          const theme_value = localStorage.getItem('theme') || getThemeByDumi() || getThemeByAlgo() || 'light';
          setValue(theme_value);
        }
      }
    });
    //@ts-ignore
    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ['style'], // 仅观察 'style' 属性
    });
    const theme_value = localStorage.getItem('theme') || getThemeByDumi() || getThemeByAlgo() || 'light';

    setValue(theme_value);
  }, []);

  return value || 'light';
};
