import * as React from 'react';
import { Typography, Button, Menu } from 'antd';
import { useContext, getDataMap, GraphData } from '../../../';

import { BranchesOutlined } from '@ant-design/icons';
import { handleExpand, applyStatus } from '../NeighborQuery/utils';

export interface IQueryCommonNeighbor {
  id: 'queryCommonNeighbor';
  query: (selectIds: string[]) => Promise<GraphData>;
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
const CommonNeighbor = () => {
  const { store, updateStore } = useContext();
  const { selectNodes, emitter, graph, getService } = store;

  const handleClick = async () => {
    updateStore(draft => {
      draft.isLoading = true;
    });

    emitter?.emit('canvas:click');

    const selectedIds = selectNodes.map(item => item.id);

    const res = await getService<IQueryCommonNeighbor>('queryCommonNeighbor')(selectedIds);

    if (res.nodes.length > 0) {
      const { nodeStatus, edgeStatus } = applyStatus(res as any, item => {
        return { selected: true };
      });
      const newData = handleExpand(graph, res, selectedIds);
      updateStore(draft => {
        draft.data = newData;
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
