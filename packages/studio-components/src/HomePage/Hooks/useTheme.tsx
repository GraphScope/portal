import { useState, useEffect } from 'react';


const getThemeByAlgo = () => {
  const algo = localStorage.getItem('algorithm');
  if (algo === 'darkAlgorithm') {
    return 'darkAlgorithm';
  }
  return 'defaultAlgorithm';
};

const getThemeByDumi = () => {
  return localStorage.getItem('dumi:prefers-color');
};
export const useTheme = () => {
  const [value, setValue] = useState("defaultAlgorithm");

  useEffect(() => {
    const targetElement = document.querySelector('html'); // 目标元素
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          //   const { cssText } = mutation.target.style;
          const theme_value = localStorage.getItem('algorithm') || 'defaultAlgorithm';
          setValue(JSON.parse(theme_value));
        }
      }
    });
    //@ts-ignore
    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ['data-theme'], // 仅观察 'style' 属性
    });
    const theme_value = localStorage.getItem('algorithm') ||  'defaultAlgorithm';

    setValue(JSON.parse(theme_value));
  }, []);

  return value || 'defaultAlgorithm';
};
