import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface ILightAreaProps {
  rootRef: React.RefObject<HTMLDivElement>;
}

interface ILightAreaMethods {
  updatePosition: (event: MouseEvent) => void;
}

const LightArea = forwardRef<ILightAreaMethods, ILightAreaProps>((props, ref) => {
  const { rootRef } = props;
  const [state, setState] = React.useState({
    top: '50%',
    left: '80%',
  });
  const updatePosition = (event: any) => {
    if (!rootRef.current) {
      return;
    }
    const rect = rootRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left + 'px';
    const mouseY = event.clientY - rect.top + 'px';
    setState(preState => {
      return {
        ...preState,
        top: mouseY,
        left: mouseX,
      };
    });
  };
  const { top, left } = state;
  const rootStyle: React.CSSProperties = {
    position: 'absolute',
    top,
    left,
    height: '500px',
    width: '500px',
    // transition: 'all .1s ease',
    borderRadius: '50%',
    transform: 'translate(-50%,-50%)',
    filter: 'blur(120px)',
    // background: 'hsl(21 90% 48% / .1)',
    backgroundImage: 'linear-gradient(to bottom, #2581f0, #38ecd7)',
    opacity: 0.2,
    zIndex: 0,
  };
  useImperativeHandle(ref, () => {
    return {
      updatePosition,
    };
  });

  return <div style={rootStyle}></div>;
});

export default LightArea;

const debounce = <T extends unknown[]>(fn: (...args: T) => void, delay: number): ((...args: T) => void) => {
  let timer: NodeJS.Timeout | undefined;

  return (...args: T): void => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const useLightArea = () => {
  const lightAreaRef = useRef<ILightAreaMethods>(null);
  // const updatePosition = debounce((event: MouseEvent) => {
  //   if (lightAreaRef.current) {
  //     lightAreaRef.current.updatePosition(event);
  //   }
  // }, 60);

  const updatePosition = (event: MouseEvent) => {
    if (lightAreaRef.current) {
      lightAreaRef.current.updatePosition(event);
    }
  };

  return {
    updatePosition,
    lightAreaRef,
  };
};
