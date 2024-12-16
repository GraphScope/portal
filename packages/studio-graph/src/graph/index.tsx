import React, { CSSProperties } from 'react';

import { useNodeStyle, useEdgeStyle, useInit, useCombos, useDataAndLayout } from './hooks';

const Canvas = props => {
  const { containerRef, id } = useInit();
  useNodeStyle();
  useEdgeStyle();
  useDataAndLayout();
  useCombos();

  const containerStyle: CSSProperties = {
    position: 'relative',
    height: '100%',
  };
  return <div id={`GRAPH_${id}`} ref={containerRef} style={containerStyle}></div>;
};

export default Canvas;
