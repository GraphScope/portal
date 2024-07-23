import React, { CSSProperties, PropsWithChildren, forwardRef, memo, useImperativeHandle } from 'react';

import useGraph from './useGraph';
import type { GraphProps } from './types';

type GraphRef = any | null;

const Graph = memo(
  forwardRef<GraphRef, PropsWithChildren<GraphProps>>((props, ref) => {
    const { style, children, ...restProps } = props;
    const { graph, containerRef, isReady, emitter } = useGraph<GraphProps>(restProps);
    useImperativeHandle(ref, () => graph!, [isReady]);
    const containerStyle: CSSProperties = {
      height: 'inherit',
      position: 'relative',
      ...style,
    };
    return <div ref={containerRef} style={containerStyle}></div>;
  }),
);

export default Graph;
