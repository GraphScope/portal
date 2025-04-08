import { useState, useEffect } from 'react';

export const useLocale = () => {
  const [value, setValue] = useState("en-US");

  useEffect(() => {
    const targetElement = document.querySelector('html'); // 目标元素
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-locale') {
          //   const { cssText } = mutation.target.style;
          const locale_value = localStorage.getItem('locale') || 'en-US';
          console.log('locale_value::: ', locale_value);
          setValue(JSON.parse(locale_value));
        }
      }
    });
    //@ts-ignore
    observer.observe(targetElement, {
      attributes: true,
      attributeFilter: ['data-locale'], // 仅观察 'style' 属性
    });
    const locale_value = localStorage.getItem('locale') ||  'en-US';

    setValue(JSON.parse(locale_value));
  }, []);

  return value || 'en-US';
};
