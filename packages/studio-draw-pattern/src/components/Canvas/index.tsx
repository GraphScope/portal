import { Graph } from '@graphscope/studio-graph-editor';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';

export const Canvas = () => {
  const nodes = useNodeStore(state => state.nodes);
  const edges = useEdgeStore(state => state.edges);

  const deTransformNodes = useMemo(() => nodes.map(node => node.data), [nodes]);
  const deTransformEdges = useMemo(() => edges.map(edge => edge.data), [edges]);

  const MyGraph = useCallback(
    () => (
      <Graph
        graphId="edit"
        defaultNodes={deTransformNodes}
        defaultEdges={deTransformEdges as unknown as ISchemaEdge[]}
        onNodesChange={nodes => console.log('节点发生变化', nodes)}
        isShowPopover={true}
        popoverCustomContent={<></>}
      />
    ),
    [deTransformNodes, deTransformEdges],
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MyGraph></MyGraph>
    </div>
  );
};
