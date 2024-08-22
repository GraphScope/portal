import * as React from 'react';
import { Typography, Button, Menu } from 'antd';
import { useContext } from '../../../hooks/useContext';
import { Utils } from '@graphscope/studio-components';
import { getDataMap } from '../../Prepare/utils';

interface INeighborQueryProps {
  onQuery: (params: any) => Promise<any>;
}

const CommonNeighbor: React.FunctionComponent<INeighborQueryProps> = props => {
  const { onQuery } = props;
  const { store, updateStore } = useContext();
  const { nodeStatus, schema, dataMap, emitter } = store;

  const selectId =
    Object.keys(nodeStatus).filter(key => {
      return nodeStatus[key].selected;
    })[0] || '';
  const selectNode = dataMap[selectId] || {};

  const relatedEdges = schema.edges.filter(item => {
    return item.source === selectNode.label;
  });
  const itemChildren = relatedEdges.map(item => {
    const { source, target, label } = item;
    if (source === target) {
      return {
        key: `(a:${source})-[b:${label}]-(c:${target})`,
        label: `[${label}]-(${target})`,
      };
    }
    return {
      key: `(a:${source})-[b:${label}]->(c:${target})`,
      label: `[${label}]->(${target})`,
    };
  });

  const items = [
    {
      key: 'CommonNeighbor',
      // icon: <ShareAltOutlined />,
      label: 'CommonNeighbor',
      children: itemChildren,
    },
  ];

  const onClick = async ({ key }) => {
    const { name, title } = selectNode.properties;
    let script = '';
    if (name) {
      script = `
      MATCH ${key}
        WHERE a.name = "${name}"
        RETURN a, b, c
      `;
    }
    if (title) {
      script = `
      MATCH ${key}
        WHERE a.title = "${title}"
        RETURN a, b, c
      `;
    }

    console.log(script);
    /**
     * 
     * 
     * MATCH (p1:Paper)<-[c1:Cite]-(p2:Paper)
 WHERE p1.title = 'Parallel Subgraph Listing in a Large-Scale Graph'
 RETURN p1, c1, p2
     */
    const res = await onQuery({
      script,
      language: 'cypher',
    });
    console.log(res);
    if (res.nodes.length > 0) {
      updateStore(draft => {
        draft.data = Utils.handleExpand(draft.data, res);
        draft.dataMap = getDataMap(draft.data);
      });
    }
    emitter?.emit('canvas:click');
  };
  return (
    <Menu onClick={onClick} style={{ margin: '0px', padding: '0px', width: '103%' }} mode="vertical" items={items} />
  );
};

export default CommonNeighbor;
