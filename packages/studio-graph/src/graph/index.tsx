import React, { CSSProperties } from 'react';

import { useNodeStyle, useEdgeStyle, useInit, useCombos, useDataAndLayout } from './hooks';
import { theme } from 'antd';
const Canvas = props => {
  const { containerRef, id } = useInit();
  useNodeStyle();
  useEdgeStyle();
  useDataAndLayout();
  useCombos();
  const { token } = theme.useToken();

  const containerStyle: CSSProperties = {
    position: 'relative',
    height: '100%',
    background: token.colorBgBase,
  };
  return <div id={`GRAPH_${id}`} ref={containerRef} style={containerStyle}></div>;
};

export default Canvas;
