import * as React from 'react';
import { Tooltip, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { useContext } from '../../';

interface IReportProps {}

const ClearCanvas: React.FunctionComponent<IReportProps> = props => {
  const { updateStore, store } = useContext();
  const { graph } = store;

  const handleClick = () => {
    updateStore(draft => {
      draft.data = { nodes: [], edges: [] };
      draft.source = { nodes: [], edges: [] };
      draft.combos = [];
      draft.layout = {
        type: 'force',
        options: {},
      };
    });
    if (graph) {
      graph.zoomToFit();
      //@ts-ignore
      graph.zoom(6);
    }
  };
  return (
    <Tooltip title="Clear Canvas" placement="left">
      <Button onClick={handleClick} icon={<ClearOutlined />} type="text"></Button>
    </Tooltip>
  );
};

export default ClearCanvas;
