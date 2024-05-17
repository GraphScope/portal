import { Button, Segmented } from 'antd';
import * as React from 'react';
import { useContext } from '../useContext';
import { transEdge2Entity, transformEdges, transformNodes, layout, transformGraphNodes } from '../elements/index';
interface IModeSwitchProps {
  style: React.CSSProperties;
}

const ModeSwitch: React.FunctionComponent<IModeSwitchProps> = props => {
  const { style } = props;
  const { store, updateStore } = useContext();
  const { displayMode } = store;
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
        draft.edges = transformEdges(data.edges, 'table');
        console.log('data', data, draft.nodes, draft.edges);
      }
      if (value === 'graph') {
        draft.nodes = transformGraphNodes(draft.source.nodes, 'graph');
        draft.edges = transformEdges(draft.source.edges, 'graph');
      }
    });
  };

  return (
    <div style={style}>
      <Segmented options={['table', 'graph']} value={displayMode} onChange={handleChange} />
    </div>
  );
};

export default ModeSwitch;
