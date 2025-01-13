import { useState, useEffect, useRef } from 'react';

function useResizeWidth(initialWidth = 200) {
  const [width, setWidth] = useState(initialWidth);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  // Throttling function to limit the frequency of state updates
  const throttle = (fn, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      fn(...args);
    };
  };

  const handleMouseDown = event => {
    isResizingRef.current = true;
    startXRef.current = event.clientX;
    startWidthRef.current = width;
  };

  const handleMouseMove = throttle(event => {
    if (!isResizingRef.current) return;

    const dx = event.clientX - startXRef.current;
    const newWidth = Math.max(100, startWidthRef.current + dx); // Minimum width of 100px

    if (newWidth !== width) {
      setWidth(newWidth);
    }
  }, 16); // Approximately 60 FPS

  const handleMouseUp = () => {
    isResizingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { width, handleMouseDown };
}

export default useResizeWidth;
