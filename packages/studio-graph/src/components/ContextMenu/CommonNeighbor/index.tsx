import * as React from 'react';
import { Typography, Button, Menu } from 'antd';
import { useContext, getDataMap } from '../../../';

import { BranchesOutlined } from '@ant-design/icons';
import { handleExpand, applyStatus } from '../NeighborQuery/utils';

interface INeighborQueryProps {
  onQuery: (params: any) => Promise<any>;
}

const getScript = (selectedIds, dataMap) => {
  const scripts = selectedIds.map((id, index) => {
    const selectNode = dataMap[id];
    const { name, title } = selectNode.properties;
    const currentPoint = `p${index}`;
    const currentLink = `l${index}`;

    let whereScript = '';
    if (name) {
      whereScript = `${currentPoint}.name = "${name}"
      `;
    }
    if (title) {
      whereScript = `${currentPoint}.title = "${title}"
      `;
    }

    let matchScript = `
(${currentPoint})-[${currentLink}]-(neighbor)`;
    return {
      whereScript,
      matchScript,
      returnScript: currentPoint + ',' + currentLink,
    };
  });
  const matchScript = scripts.map(item => item.matchScript).join(',');
  const whereScript = scripts.map(item => item.whereScript).join(' AND ');
  const returnScript = scripts.map(item => item.returnScript).join(',');

  console.log(`
  MATCH ${matchScript} 
  WHERE ${whereScript} 
  RETURN ${returnScript},neighbor
  `);

  return `
  MATCH ${matchScript} 
  WHERE ${whereScript} 
  RETURN ${returnScript},neighbor
  `;
};
const CommonNeighbor: React.FunctionComponent<INeighborQueryProps> = props => {
  const { onQuery } = props;
  const { store, updateStore } = useContext();
  const { nodeStatus, schema, dataMap, emitter, graph } = store;

  const handleClick = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });
    emitter?.emit('canvas:click');
    const selectedIds = Object.keys(nodeStatus).filter((key, index) => {
      return nodeStatus[key].selected;
    });

    const script = getScript(selectedIds, dataMap);

    const res = await onQuery({
      script,
      language: 'cypher',
    });

    if (res.nodes.length > 0) {
      const { nodeStatus, edgeStatus } = applyStatus(res, item => {
        return { selected: true };
      });

      updateStore(draft => {
        const newData = handleExpand(graph, res, selectedIds);
        draft.data = newData;
        draft.dataMap = getDataMap(newData);
        draft.isLoading = false;
        draft.nodeStatus = nodeStatus;
        draft.edgeStatus = edgeStatus;
      });
    } else {
      updateStore(draft => {
        draft.isLoading = false;
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      icon={<BranchesOutlined />}
      type="text"
      style={{ width: '100%', justifyContent: 'left' }}
    >
      CommonNeighbor
    </Button>
  );
};

export default CommonNeighbor;
