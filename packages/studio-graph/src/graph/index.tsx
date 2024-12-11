import React, { CSSProperties } from 'react';

import { useNodeStyle, useEdgeStyle, useData, useInit, useLayout, useComboLayout } from './hooks';

const Canvas = props => {
  const { containerRef, id } = useInit();
  useData();
  useEdgeStyle();
  useNodeStyle();
  useLayout();
  useComboLayout();
  const containerStyle: CSSProperties = {
    position: 'relative',
    height: '100%',
  };
  return <div id={`GRAPH_${id}`} ref={containerRef} style={containerStyle}></div>;
};

export default Canvas;
