import { Graph } from '@graphscope/studio-graph-editor';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { ISchemaEdge } from '@graphscope/studio-graph-editor';
import { useGenerateRelation } from '../../hooks/generateRelation/useGenerateRelation';
import PopoverContent from './PopoverContent';
import { Property } from '../../types/property';
import { useTransform } from '../../hooks/transform/useTransform';
import { ISchemaNode } from '@graphscope/studio-graph-editor';
import { useGraphStore } from '../../stores/useGraphStore';
import { useEncodeCypher } from '../../hooks/cypher/useEncodeCypher';
import { Button, Input, Modal, Tooltip } from 'antd';
import { usePropertiesStore } from '../../stores/usePropertiesStore';
import { DrawPatternContext, DrawPatternValue } from '../DrawPattern';
import _ from 'lodash';
import { useSection } from '@graphscope/studio-components';
import { InsertRowRightOutlined } from '@ant-design/icons';

export const Canvas = () => {
  const [descState, setDescState] = useState<string>();
  const nodesStore = useNodeStore(state => state.nodes);
  const edgesStore = useEdgeStore(state => state.edges);
  const replaceNodes = useNodeStore(state => state.replaceNodes);
  const replaceEdges = useEdgeStore(state => state.replaceEdges);
  const { transformNode, transformEdge } = useTransform();
  const graphNodes = useGraphStore(state => state.graphNodes);
  const graphEdges = useGraphStore(state => state.graphEdges);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { encodeProperties, encodeNodes, encodeEdges, generateMATCH, generateWHERE } = useEncodeCypher();
  const updateProperties = usePropertiesStore(state => state.updateProperties);
  const properties = usePropertiesStore(state => state.properties);
  const MATCHs: string = useMemo(() => (isModalOpen ? generateMATCH().join('\n') : ''), [isModalOpen]);
  const WHEREs: string = useMemo(() => (isModalOpen ? generateWHERE() : ''), [isModalOpen]);
  const { generateRelation } = useGenerateRelation();
  const { onClick } = useContext(DrawPatternContext);
  const [RETURNs, setRETURNs] = useState<string>('');
  const { toggleLeftSide } = useSection();

  useEffect(() => {
    if (isModalOpen) {
      const nodeReturn = Array.from(nodesStore).map(node => `${node.variable}`);
      const edgeReturn = Array.from(edgesStore).map(edge => `${edge.variable}`);
      [...nodeReturn, ...edgeReturn].length > 0 && setRETURNs(`RETURN ${[...nodeReturn, ...edgeReturn].join(', ')}`);
    }
  }, [isModalOpen]);

  useEffect(() => {
    generateRelation(edgesStore);
  }, [edgesStore]);

  const handlePropertiesChange = useCallback(
    (value: { currentId: string; properties: Property[] }) => {
      updateProperties([
        ...properties,
        {
          belongId: value.currentId,
          belongType: 'node',
          data: value.properties,
        },
      ]);
    },
    [nodesStore],
  );

  const handleNodes = useCallback(
    (nodes: ISchemaNode[]) => {
      const newNodes = nodes.map(node => {
        const currentNode = nodesStore.find(graphNode => graphNode.id === node.id);
        if (currentNode)
          return {
            ...currentNode,
            ...transformNode(node),
          };
        else return transformNode(node);
      });
      replaceNodes && replaceNodes(newNodes);
    },
    [nodesStore],
  );

  const handleEdges = useCallback(
    (edges: ISchemaEdge[]) => {
      const newEdges = edges.map(edge => {
        const currentEdge = edgesStore.find(graphEdge => graphEdge.id === edge.id);
        if (currentEdge)
          return {
            ...currentEdge,
            ...transformEdge(edge),
          };
        else return transformEdge(edge);
      });
      replaceEdges && replaceEdges(newEdges);
    },

    [edgesStore],
  );

  const MyGraph = useCallback(() => {
    return (
      <Graph
        graphId="edit-graph"
        isLabelEmpty={true}
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
      <div
        style={{
          backgroundColor: 'white',
          position: 'absolute',
          top: '140px',
          left: '24px',
          padding: '4px',
          borderRadius: '4px',
          boxShadow:
            '0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 9px 28px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Tooltip title={'展开工具栏'} placement="right">
          <Button
            onClick={() => {
              toggleLeftSide();
            }}
            type="text"
            icon={<InsertRowRightOutlined />}
          ></Button>
        </Tooltip>
      </div>
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
        Export Your Cypher
      </Button>
      <Modal
        title="Generate Cypher Code"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(true);
          const newState: DrawPatternValue = {
            MATCHs,
            WHEREs,
            RETURNs,
            description: descState ?? '',
          };
          onClick && onClick(newState);
        }}
        onCancel={() => setIsModalOpen(false)}
        cancelText="取消"
        okText="查询"
      >
        MATCH 语句：<br></br>
        <Input.TextArea value={MATCHs} style={{ height: '5rem' }}></Input.TextArea>
        WHERE 语句 <br></br>
        <Input.TextArea value={WHEREs} style={{ height: '5rem' }}></Input.TextArea>
        RETURN 语句 <br></br>
        <Input.TextArea
          value={RETURNs}
          style={{ height: '5rem' }}
          onChange={e => setRETURNs(e.target.value)}
        ></Input.TextArea>
        Desc 描述
        <Input placeholder="desc" value={descState} onChange={e => setDescState(e.target.value)}></Input>
      </Modal>
    </div>
  );
};
