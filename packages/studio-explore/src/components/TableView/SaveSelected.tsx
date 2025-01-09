import * as React from 'react';
import { Button, Dropdown, Typography, MenuProps, Tooltip } from 'antd';
import { MoreOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useContext, useApis } from '@graphscope/studio-graph';
interface ISaveSelectedProps {}

const SaveSelected: React.FunctionComponent<ISaveSelectedProps> = props => {
  const { store, updateStore } = useContext();
  const { focusNodes } = useApis();
  const { selectNodes } = store;

  const handleChangeData = () => {
    const matchIds = selectNodes.map(item => item.id);
    updateStore(draft => {
      draft.data.nodes = selectNodes;

      const newEdges = draft.data.edges.filter(item => {
        const { source, target } = item;
        const matchSource = matchIds.indexOf(typeof source === 'object' ? source.id : source) !== -1;
        const matchTarget = matchIds.indexOf(typeof target === 'object' ? target.id : target) !== -1;
        return matchSource && matchTarget;
      });

      draft.data.edges = newEdges;
      draft.source.nodes = selectNodes;
      draft.source.edges = newEdges;
    });
    focusNodes(matchIds);
  };

  return (
    <Tooltip title="Save selected items to the graph" placement="right">
      <Button onClick={handleChangeData} type="text" icon={<PlayCircleOutlined />}></Button>
    </Tooltip>
  );
};

export default SaveSelected;
