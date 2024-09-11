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
import { Button, Input, Modal } from 'antd';
import { getSequentialLetter } from '../../utils';

export const Canvas = () => {
  const nodesStore = useNodeStore(state => state.nodes);
  const edgesStore = useEdgeStore(state => state.edges);
  const editNode = useNodeStore(state => state.editNode);
  const editEdge = useEdgeStore(state => state.editEdge);
  const addNode = useNodeStore(state => state.addNode);
  const addEdge = useEdgeStore(state => state.addEdge);
  const { transformNode, transformEdge } = useTransform();
  const graphNodes = useGraphStore(state => state.graphNodes);
  const graphEdges = useGraphStore(state => state.graphEdges);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { encodeProperties, encodeNodes, encodeEdges, generateMATCH, generateWHERE } = useEncodeCypher();

  const MATCHs: string = useMemo(() => (isModalOpen ? generateMATCH().join('\n') : ''), [isModalOpen]);
  const WHERE: string = useMemo(() => (isModalOpen ? generateWHERE() : ''), [isModalOpen]);
  const { generateRelation } = useGenerateRelation();

  useEffect(() => {
    console.log('开始产生关系');
    generateRelation(edgesStore);
  }, [edgesStore]);

  useEffect(() => {
    console.log('节点更新啦', nodesStore);
  }, [nodesStore]);

  useEffect(() => {
    console.log('关系更新啦', edgesStore);
  }, [edgesStore]);

  useEffect(() => {
    console.log('图表发生变化', graphEdges, graphNodes);
  }, [graphEdges, graphNodes]);

  const handlePropertiesChange = useCallback(
    (value: { currentId: string; properties: Property[] }) => {
      const currentNode = nodesStore.find(node => node.nodeKey === value.currentId);

      if (editNode && currentNode) {
        editNode({
          ...currentNode,
          properties: value.properties,
          variable: getSequentialLetter()(),
        });
      }
    },
    [nodesStore],
  );

  // let preNodes: ISchemaNode[] = [];

  const handleNodes = useCallback(
    (nodes: ISchemaNode[]) => {
      nodes.forEach(node => {
        const isExist = nodesStore.some(nodeStore => nodeStore.nodeKey === node.id);
        if (isExist) editNode && editNode(transformNode(node));
        if (!isExist) addNode && addNode(transformNode(node));
        editNode && editNode(transformNode(node));
      });
    },
    [nodesStore],
  );

  const handleEdges = useCallback(
    (edges: ISchemaEdge[]) => {
      console.log('edges', edges);
      edges.forEach(edge => {
        const isExist = edgesStore.some(edgeStore => edgeStore.edgeKey === edge.id);
        if (isExist) editEdge && editEdge(transformEdge(edge));
        if (!isExist) addEdge && addEdge(transformEdge(edge));
      });
    },
    [edgesStore],
  );

  const MyGraph = useCallback(
    () => (
      <Graph
        graphId="edit-graph"
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
  useEffect(() => {
    console.log('节点变化啦', nodesStore);
  }, [isModalOpen]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MyGraph></MyGraph>
      <Button
        onClick={() => {
          encodeEdges();
          encodeNodes();
          encodeProperties();
          setIsModalOpen(true);
        }}
        type="primary"
        style={{ position: 'absolute', bottom: '20px', right: '240px' }}
      >
        This is your Cypher
      </Button>
      <Modal
        title="Generate Cypher Code"
        open={isModalOpen}
        onOk={() => setIsModalOpen(true)}
        onCancel={() => setIsModalOpen(false)}
      >
        MATCH 语句：<br></br>
        <Input.TextArea value={MATCHs} style={{ height: '5rem' }}></Input.TextArea>
        WHERE 语句 <br></br>
        <Input.TextArea value={WHERE} style={{ height: '5rem' }}></Input.TextArea>
        Desc 描述
        <Input placeholder="desc"></Input>
      </Modal>
    </div>
  );
};
