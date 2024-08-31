import { Graph } from '@graphscope/studio-graph-editor';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { ISchemaEdge } from '@graphscope/studio-graph-editor/dist/types/edge';
import { useGenerateRelation } from '../../hooks/generateRelation/useGenerateRelation';
import PopoverContent from './PopoverContent';
import { Property } from '../../types/property';
import { useTransform } from '../../hooks/transform/useTransform';
import { ISchemaNode } from '@graphscope/studio-graph-editor/dist/types/node';
import _ from 'lodash';
import { useGraphStore } from '../../stores/useGraphStore';
import { useEncodeCypher } from '../../hooks/Cypher/useEncodeCypher';
import { Button } from 'antd';

export const Canvas = () => {
  const nodes = useNodeStore(state => state.nodes);
  const edges = useEdgeStore(state => state.edges);
  const editNode = useNodeStore(state => state.editNode);
  const editEdge = useEdgeStore(state => state.editEdge);
  const { transformNode, transformEdge } = useTransform();
  // const [changeSource, setChangeSource] = useState<"internal"|>('');
  const graphNodes = useGraphStore(state => state.graphNodes);
  const graphEdges = useGraphStore(state => state.graphEdges);
  // const {}

  const { encodeProperties, encodeNodes, encodeEdges } = useEncodeCypher();

  const { generateRelation } = useGenerateRelation();

  useEffect(() => {
    console.log('开始产生关系');
    generateRelation(edges);
  }, [edges]);

  useEffect(() => {
    console.log('节点更新啦', nodes);
  }, [nodes]);

  useEffect(() => {
    console.log('关系更新啦', edges);
  }, [edges]);

  useEffect(() => {
    console.log('图表发生变化', graphEdges, graphNodes);
  }, [graphEdges, graphNodes]);

  const handlePropertiesChange = (value: { currentId: string; properties: Property[] }) => {
    const currentNode = nodes.find(node => node.nodeKey === value.currentId);

    if (editNode && currentNode) {
      editNode({
        ...currentNode,
        properties: value.properties,
      });
    }
  };

  // let preNodes: ISchemaNode[] = [];

  const handleNodes = useCallback((nodes: ISchemaNode[]) => {
    nodes.forEach(node => {
      editNode && editNode(transformNode(node));
    });
  }, []);

  const handleEdges = useCallback((edges: ISchemaEdge[]) => {
    edges.forEach(edge => {
      editEdge && editEdge(transformEdge(edge));
    });
  }, []);

  const MyGraph = useCallback(
    () => (
      <Graph
        graphId="edit"
        defaultNodes={graphNodes}
        defaultEdges={graphEdges as unknown as ISchemaEdge[]}
        onNodesChange={handleNodes}
        onEdgesChange={handleEdges}
        isShowPopover={true}
        popoverCustomContent={<PopoverContent onChange={handlePropertiesChange}></PopoverContent>}
      />
    ),
    [graphNodes, graphEdges],
  );

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MyGraph></MyGraph>
      <Button
        onClick={() => {
          encodeEdges();
          encodeNodes();
          encodeProperties();
        }}
        style={{ position: 'absolute', top: '10px' }}
      >
        Start Encode
      </Button>
    </div>
  );
};
