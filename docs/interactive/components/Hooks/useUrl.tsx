import { useState, useEffect, useLayoutEffect } from 'react';
import { useTheme } from './useTheme';
export function useUrlChange() {
  const [currentUrl, setCurrentUrl] = useState('');

  // 处理 URL 变化的通用函数
  const handleUrlChange = () => {
    const newUrl = window.location.href;
    setCurrentUrl(newUrl); // 更新状态
  };

  useEffect(() => {
    // 保存原始的 pushState 和 replaceState 方法
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    // 重写 pushState 方法
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event('urlchange'));
    };

    // 重写 replaceState 方法
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('urlchange'));
    };

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', handleUrlChange);

    // 监听自定义的 urlchange 事件
    window.addEventListener('urlchange', handleUrlChange);

    // 清理监听器
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('urlchange', handleUrlChange);
    };
  }, []); // 不依赖任何变量

  return { currentUrl, handleUrlChange };
}

export const useImageTheme = () => {
  const theme = useTheme();
  const { currentUrl } = useUrlChange();
  useLayoutEffect(() => {
    let timer = setTimeout(() => {
      const images = document.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        image.style.filter = theme === 'light' ? 'none' : 'invert(1)';
      }
    }, 16);
    return () => {
      clearTimeout(timer);
    };
  }, [theme, currentUrl]);

  return null;
};
