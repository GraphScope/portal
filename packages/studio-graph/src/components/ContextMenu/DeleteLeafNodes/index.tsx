import * as React from 'react';
import { Typography, Button } from 'antd';
import { ShareAltOutlined, DeleteColumnOutlined } from '@ant-design/icons';
import { useContext } from '../../../hooks/useContext';
import { getDataMap } from '../../Prepare/utils';
interface IDeleteLeafNodesProps {}

const DeleteLeafNodes: React.FunctionComponent<IDeleteLeafNodesProps> = props => {
  const { store, updateStore } = useContext();
  const { nodeStatus, graph, dataMap, emitter } = store;

  const handleClick = () => {
    emitter?.emit('canvas:click');
    const selectedIds = Object.keys(nodeStatus).filter((key, index) => {
      return nodeStatus[key].selected;
    });
    const selectId = selectedIds[0];

    if (graph && selectId) {
      const data = removeLeafNodes(graph.graphData(), selectId);
      updateStore(draft => {
        //@ts-ignore
        draft.data = data;
        draft.dataMap = getDataMap(data);
      });
    }
  };
  return (
    <Button
      onClick={handleClick}
      icon={<DeleteColumnOutlined />}
      type="text"
      style={{ width: '100%', justifyContent: 'left' }}
    >
      Delete LeafNodes
    </Button>
  );
};

export default DeleteLeafNodes;

const removeLeafNodes = (graphData, selectId) => {
  const { nodes, links } = graphData;

  // 创建边索引
  const linkMap = new Map();
  links.forEach(link => {
    if (!linkMap.has(link.source.id)) {
      linkMap.set(link.source.id, []);
    }
    if (!linkMap.has(link.target.id)) {
      linkMap.set(link.target.id, []);
    }
    linkMap.get(link.source.id).push(link);
    linkMap.get(link.target.id).push(link);
  });

  // 找到和 selectId 相关联的叶子节点
  const leafNodesToRemove = new Set();
  const linksToRemove = new Set();

  (linkMap.get(selectId) || []).forEach(link => {
    const targetNode = link.source.id === selectId ? link.target : link.source;
    const connectedLinks = linkMap.get(targetNode.id) || [];

    // 自环检查
    const isSelfLoop = link.source.id === link.target.id;

    // 如果该节点只有一个连接且不是自环，则为叶节点
    if (connectedLinks.length === 1 && !isSelfLoop) {
      leafNodesToRemove.add(targetNode.id);
      linksToRemove.add(link);
    }
  });

  // 确保自环不被删除
  const updatedLinks = links
    .filter(link => {
      // 仅删除非自环且被标记为删除的边
      return !(linksToRemove.has(link) && link.source.id !== link.target.id);
    })
    .map(item => {
      return {
        ...item,
        source: item.source.id,
        target: item.target.id,
      };
    });

  // 删除叶节点及其相关边
  const updatedNodes = nodes.filter(node => !leafNodesToRemove.has(node.id));

  return {
    nodes: updatedNodes,
    edges: updatedLinks,
  };
};
