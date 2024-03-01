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
      const { nodes, edges } = transformSchemaToOptions(res as any, true);
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
  if (isReady) {
    return (
      <CreateInstance mode="view" nodeList={nodes} edgeList={edges} engineType="interactive" graphName={graphName} />
    );
  }
  return <Skeleton />;
};

export default ViewSchema;
