import React, { useRef } from 'react';
import { Utils } from '@graphscope/studio-components';
import Graph from '../../graph';
import { useContext } from '../../hooks/useContext';
import { NodeData, EdgeData } from '../../hooks/typing';

export const colors: string[] = [
  '#569480',
  '#4C8EDA',
  '#FFE081',
  '#C990C0',
  '#F79767',
  '#57C7E3',
  '#F16667',
  '#D9C8AE',
  '#8DCC93',
  '#ECB5C9',
  '#FFC454',
  '#DA7194',
  '#848484',
  '#D9D9D9',
];

const categoryColors = {};
let index = 0;

export interface ICanvasProps {}
export const transform = (data): { nodes: NodeData[]; edges: EdgeData[] } => {
  // const nodes = data.nodes.map(item => {
  //   const { data, id } = item;
  //   const { label } = data;

  //   if (!categoryColors[label]) {
  //     categoryColors[label] = colors[index];
  //     index = index + 1;
  //   }
  //   const color = categoryColors[label];

  //   return {
  //     ...item,
  //     type: 'circle',
  //     group: data.group || data.layer,
  //     style: {
  //       fill: color,
  //       labelText: id,
  //     },
  //   } as NodeData;
  // });
  // const edges = data.edges.map(item => {
  //   return {
  //     ...item,
  //     type: 'line',
  //     group: data.group || data.layer,
  //     style: {
  //       endArrow: true,
  //     },
  //   };
  // });
  const { nodes, edges } = data;
  return { nodes, edges };
};

const Canvas: React.FunctionComponent<ICanvasProps> = props => {
  const { store, updateStore } = useContext();
  const { data, render, nodeStyle, edgeStyle, nodeStatus, edgeStatus } = store;
  const onInit = (graph, emitter) => {
    updateStore(draft => {
      draft.graph = graph;
      draft.emitter = emitter;
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Graph
        nodeStyle={nodeStyle}
        edgeStyle={edgeStyle}
        nodeStatus={nodeStatus}
        edgeStatus={edgeStatus}
        style={{ width: '100%', height: '100%' }}
        //@ts-ignore
        data={data}
        render={render}
        onInit={onInit}
      />
    </div>
  );
};

export default Canvas;
