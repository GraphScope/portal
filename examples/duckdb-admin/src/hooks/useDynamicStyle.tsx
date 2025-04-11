import { useEffect, useRef } from 'react';

/**
 * 自定义 Hook，用于在组件中动态插入和移除 <style> 标签
 * @param {string} css - 要插入的 CSS 样式字符串
 * @param {string} [id] - <style> 标签的唯一 ID，默认为 'dynamic-style'
 */
export function useDynamicStyle(css: string, id: string = 'dynamic-style') {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    // 如果已经插入了样式，则跳过
    if (styleRef.current) {
      return;
    }

    // 创建一个 <style> 标签
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = id;

    // 将 CSS 样式插入到 <style> 标签中
    if ('sheet' in style) {
      // 现代浏览器
      style.appendChild(document.createTextNode(css));
    } else if ('styleSheet' in style) {
      // IE8 及以下版本
      (style as any).styleSheet.cssText = css;
    }

    // 将 <style> 标签插入到文档的 <head> 中
    document.head.appendChild(style);

    // 保存 <style> 标签的引用
    styleRef.current = style;

    // 清理函数，确保在组件卸载时移除 <style> 标签
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [css, id]);
}
