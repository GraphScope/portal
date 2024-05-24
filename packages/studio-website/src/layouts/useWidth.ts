import React from 'react';

const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: Parameters<T>): void => {
    //@ts-ignore
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
function calculateContainerWidth() {
  const screenWidth = window.innerWidth;

  // 根据屏幕宽度设定不同的容器宽度
  if (screenWidth < 860) {
    return 860;
  } else if (screenWidth < 1060) {
    return 1060;
  } else if (screenWidth < 1260) {
    return 1260;
  } else if (screenWidth < 1460) {
    return 1460;
  } else if (screenWidth < 1660) {
    return 1660;
  } else {
    return 1860;
  }
}
export default () => {
  const [width, setWidth] = React.useState(calculateContainerWidth());

  React.useEffect(() => {
    const handleResize = debounce(() => {
      setWidth(calculateContainerWidth());
    }, 200);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return width - 160;
};
