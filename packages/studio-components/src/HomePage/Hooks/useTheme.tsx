import { useState, useEffect } from 'react';

const KEY = 'theme';
export const useTheme = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const targetElement = document.querySelector('html'); // 目标元素
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          //   const { cssText } = mutation.target.style;
          const theme_value = localStorage.getItem('theme') || 'light';
          setValue(theme_value);
        }
      }
    });
    //@ts-ignore
    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ['style'], // 仅观察 'style' 属性
    });
    const theme_value = localStorage.getItem('theme') || 'light';
    setValue(theme_value);
  }, []);

  return value || 'light';
};
