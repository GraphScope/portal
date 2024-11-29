import React, { useRef } from 'react';
import Graph from '../../graph';
import { useContext } from '../../hooks/useContext';
import { NodeData, EdgeData } from '../../hooks/typing';
import { theme } from 'antd';

let index = 0;

export interface ICanvasProps {}
export const transform = (data): { nodes: NodeData[]; edges: EdgeData[] } => {
  const { nodes, edges } = data;
  return { nodes, edges };
};

const Canvas: React.FunctionComponent<ICanvasProps> = props => {
  const { id, store, updateStore } = useContext();
  const { data, render, nodeStyle, edgeStyle, nodeStatus, edgeStatus } = store;
  const { token } = theme.useToken();
  const onInit = (graph, emitter, { width, height }) => {
    updateStore(draft => {
      draft.graph = graph;
      draft.emitter = emitter;
      draft.width = width;
      draft.height = height;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Graph
        id={id}
        nodeStyle={nodeStyle}
        edgeStyle={edgeStyle}
        nodeStatus={nodeStatus}
        edgeStatus={edgeStatus}
        style={{ width: '100%', height: '100%', background: token.colorBgBase }}
        //@ts-ignore
        data={data}
        render={render}
        //@ts-ignore
        onInit={onInit}
      />
    </div>
  );
};

export default Canvas;
