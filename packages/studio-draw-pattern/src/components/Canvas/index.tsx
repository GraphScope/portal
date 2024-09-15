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
import { useEncodeCypher } from '../../hooks/cypher/useEncodeCypher';
import { Button, Input, Modal } from 'antd';
import { getSequentialLetter } from '../../utils';

export const Canvas = () => {
  const nodesStore = useNodeStore(state => state.nodes);
  const edgesStore = useEdgeStore(state => state.edges);
  const replaceNodes = useNodeStore(state => state.replaceNodes);
  const replaceEdges = useEdgeStore(state => state.replaceEdges);
  const editNode = useNodeStore(state => state.editNode);
  const { transformNode, transformEdge } = useTransform();
  const graphNodes = useGraphStore(state => state.graphNodes);
  const graphEdges = useGraphStore(state => state.graphEdges);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { encodeProperties, encodeNodes, encodeEdges, generateMATCH, generateWHERE } = useEncodeCypher();

  const MATCHs: string = useMemo(() => (isModalOpen ? generateMATCH().join('\n') : ''), [isModalOpen]);
  const WHERE: string = useMemo(() => (isModalOpen ? generateWHERE() : ''), [isModalOpen]);
  const { generateRelation } = useGenerateRelation();

  useEffect(() => {
    generateRelation(edgesStore);
  }, [edgesStore]);

  useEffect(() => {
    console.log('节点更新啦', nodesStore);
  }, [nodesStore]);

  useEffect(() => {
    console.log('关系更新啦', edgesStore);
  }, [edgesStore]);

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
      const newNodes = nodes.map(node => {
        return transformNode(node);
      });
      replaceNodes && replaceNodes(newNodes);
    },
    [nodesStore],
  );

  const handleEdges = useCallback(
    (edges: ISchemaEdge[]) => {
      const newEdges = edges.map(edge => {
        return transformEdge(edge);
      });
      replaceEdges && replaceEdges(newEdges);
    },
    [edgesStore],
  );

  const MyGraph = useCallback(() => {
    return (
      <Graph
        graphId="edit-graph"
        defaultNodes={graphNodes}
        defaultEdges={graphEdges as unknown as ISchemaEdge[]}
        onNodesChange={handleNodes}
        onEdgesChange={handleEdges}
        isShowPopover={true}
        popoverCustomContent={<PopoverContent onChange={handlePropertiesChange}></PopoverContent>}
      />
    );
  }, [graphNodes, graphEdges]);

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
