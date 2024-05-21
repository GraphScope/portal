import React, { useState } from 'react';
import CreateInstance from '../create-instance';
import type { ICreateGraph } from '../create-instance';
import { getSchema } from './service';
import { searchParamOf } from '@/components/utils/index';
import { Skeleton } from 'antd';

const ViewSchema: React.FunctionComponent<ICreateGraph> = () => {
  const [state, updateState] = useState<{
    isReady: boolean;
    nodes: any[];
    edges: any[];
  }>({
    isReady: false,
    nodes: [],
    edges: [],
  });

  const graphName = searchParamOf('graph_name') || '';
  const graph_id = searchParamOf('graph_id') || '';
  const options = {
    graphName,
    graph_id,
  };
  React.useEffect(() => {
    getSchema(graph_id).then(res => {
      //@ts-ignore
      const { nodes, edges } = res;
      updateState(preState => {
        return {
          ...preState,
          nodes,
          edges,
          isReady: true,
        };
      });
    });
  }, []);
  const { nodes, edges, isReady } = state;
  const isEmpty = nodes.length === 0 && edges.length === 0;
  if (!isReady) {
    return (
      <div style={{ padding: '12px 24px' }}>
        <Skeleton.Button />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }
  if (isEmpty) {
    return <CreateInstance mode="create" nodeList={nodes} edgeList={edges} {...options} />;
  }
  return <CreateInstance mode="view" nodeList={nodes} edgeList={edges} {...options} />;
};

export default ViewSchema;
