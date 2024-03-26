import React, { useState } from 'react';
import CreateInstance from '../create-instance';
import type { ICreateGraph } from '../create-instance';
import { getSchema } from './service';
import { searchParamOf } from '@/components/utils/index';
import { transformSchemaToOptions } from '@/components/utils/schema';
import { Skeleton } from 'antd';

const ViewSchema: React.FunctionComponent<ICreateGraph> = props => {
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

  React.useEffect(() => {
    getSchema(graphName).then(res => {
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
  if (isReady) {
    if (isEmpty) {
      <CreateInstance mode="create" nodeList={nodes} edgeList={edges} graphName={graphName} />;
    }
    return <CreateInstance mode="view" nodeList={nodes} edgeList={edges} graphName={graphName} />;
  }

  return <Skeleton />;
};

export default ViewSchema;
