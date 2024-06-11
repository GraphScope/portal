import * as React from 'react';
import { Graphin } from '../graphin';
import { useContext } from './useContext';
import { Utils } from '@graphscope/studio-components';
import { NodeData, EdgeData } from './typing';

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

interface ICanvasProps {}
export const transform = (data): { nodes: NodeData[]; edges: EdgeData[] } => {
  const nodes = data.nodes.map(item => {
    const { label, data } = item;

    if (!categoryColors[label]) {
      categoryColors[label] = colors[index];
      index = index + 1;
    }
    const color = categoryColors[label];

    return {
      ...item,
      type: 'circle',
      style: {
        fill: color,
        labelText: data.name,
      },
    } as NodeData;
  });
  const edges = data.edges.map(item => {
    return {
      ...item,
      type: 'line',
      style: {
        endArrow: true,
      },
    };
  });
  return { nodes, edges };
};

const Canvas: React.FunctionComponent<ICanvasProps> = props => {
  const { store } = useContext();
  const { nodes, edges } = store;

  const data = transform(Utils.fakeSnapshot({ nodes, edges }));
  console.log('data', data);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Graphin
        style={{ width: '100%', height: '100%' }}
        options={{
          layout: {
            type: 'force',
          },
          data,
          behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
        }}
      />
    </div>
  );
};

export default Canvas;
