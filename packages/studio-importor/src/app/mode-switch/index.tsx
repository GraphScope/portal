import { Button, Segmented } from 'antd';
import * as React from 'react';
import { useContext } from '../useContext';
import { useReactFlow } from 'reactflow';
import { ApartmentOutlined, BranchesOutlined } from '@ant-design/icons';

import { transEdge2Entity, transformEdges, transformNodes, layout, transformGraphNodes } from '../elements/index';
interface IModeSwitchProps {
  style?: React.CSSProperties;
}

export const getBBox = (nodes: { position: { x: number; y: number } }[]) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const padding = 100;
  nodes.forEach(node => {
    if (node.position.x < minX) minX = node.position.x;
    if (node.position.x > maxX) maxX = node.position.x;
    if (node.position.y < minY) minY = node.position.y;
    if (node.position.y > maxY) maxY = node.position.y;
  });

  let width = maxX - minX + padding;
  let height = maxY - minY + padding;
  return {
    x: minX,
    y: minY,
    width: width,
    height: height,
  };
};

const ModeSwitch: React.FunctionComponent<IModeSwitchProps> = props => {
  const { style } = props;
  const { store, updateStore } = useContext();
  const { displayMode } = store;
  const { fitBounds } = useReactFlow();
  const handleChange = value => {
    updateStore(draft => {
      draft.displayMode = value;
      if (value === 'table') {
        const data = transEdge2Entity({ nodes: draft.nodes, edges: draft.edges });
        /** layout */

        layout(data, 'LR');
        draft.source.nodes = [...draft.nodes];
        draft.source.edges = [...draft.edges];
        draft.nodes = transformNodes(data.nodes, 'table');
        //@ts-ignore
        draft.edges = transformEdges(data.edges, 'table');

        const bbox = getBBox(draft.nodes);
        fitBounds(bbox, { duration: 600 });
      }
      if (value === 'graph') {
        draft.nodes = transformGraphNodes(draft.source.nodes, 'graph');
        //@ts-ignore
        draft.edges = transformEdges(draft.source.edges, 'graph');
        const bbox = getBBox(draft.nodes);
        fitBounds(bbox, { duration: 600 });
      }
    });
  };
  const icon = displayMode === 'graph' ? <ApartmentOutlined /> : <BranchesOutlined />;
  return (
    <div style={style}>
      <Button
        type="text"
        icon={icon}
        onClick={() => {
          const value = displayMode === 'graph' ? 'table' : 'graph';
          handleChange(value);
        }}
      ></Button>
      {/* <Segmented options={['table', 'graph']} value={displayMode} onChange={handleChange} /> */}
    </div>
  );
};

export default ModeSwitch;
