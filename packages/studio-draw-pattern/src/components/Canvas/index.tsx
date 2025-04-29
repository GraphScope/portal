import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { useGenerateRelation } from '../../hooks/generateRelation/useGenerateRelation';
import { Property } from '../../types/property';
import { useTransform } from '../../hooks/transform/useTransform';
import { useGraphStore } from '../../stores/useGraphStore';
import { useEncodeCypher } from '../../hooks/cypher/useEncodeCypher';
import { Button, Tooltip } from 'antd';
import { usePropertiesStore } from '../../stores/usePropertiesStore';
import ButtonController from './ButtonController';
import { DrawPatternContext, DrawPatternValue } from '../DrawPattern';
import _ from 'lodash';
import { theme } from 'antd';
import { useSection } from '@graphscope/studio-components';
import { Background, MiniMap, Controls } from 'reactflow';
import { InsertRowRightOutlined, SearchOutlined } from '@ant-design/icons';
import { GraphProvider, GraphCanvas, ISchemaEdge, ISchemaNode } from '@graphscope/studio-flow-editor';

export const Canvas = () => {
  const [descState, setDescState] = useState<string>();
  const nodesStore = useNodeStore(state => state.nodes);
  const edgesStore = useEdgeStore(state => state.edges);
  const replaceNodes = useNodeStore(state => state.replaceNodes);
  const replaceEdges = useEdgeStore(state => state.replaceEdges);
  const { transformNode, transformEdge } = useTransform();
  const graphNodes = useGraphStore(state => state.graphNodes);
  const graphEdges = useGraphStore(state => state.graphEdges);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { encodeProperties, encodeNodes, encodeEdges, generateMATCH, generateWHERE } = useEncodeCypher();
  const updateProperties = usePropertiesStore(state => state.updateProperties);
  const properties = usePropertiesStore(state => state.properties);
  // const MATCHs: string = useMemo(() => (isModalOpen ? generateMATCH().join('\n') : ''), [isModalOpen]);
  // const WHEREs: string = useMemo(() => (isModalOpen ? generateWHERE() : ''), [isModalOpen]);
  const [MATCHs, setMATCHs] = useState<string>('');
  const [WHEREs, setWHEREs] = useState<string>('');
  const { generateRelation } = useGenerateRelation();
  const { onClick } = useContext(DrawPatternContext);
  const [RETURNs, setRETURNs] = useState<string>('');
  const { toggleLeftSide } = useSection();
  const [clickTrigger, setClickTrigger] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { token } = theme.useToken();

  useEffect(() => {
    const nodeReturn = Array.from(nodesStore).map(node => `${node.variable}`);
    const edgeReturn = Array.from(edgesStore).map(edge => `${edge.variable}`);
    [...nodeReturn, ...edgeReturn].length > 0 && setRETURNs(`RETURN ${[...nodeReturn, ...edgeReturn].join(', ')}`);
    clickTrigger &&
      MATCHs &&
      RETURNs &&
      onClick &&
      onClick({
        MATCHs,
        WHEREs,
        RETURNs: `RETURN ${[...nodeReturn, ...edgeReturn].join(', ')}`,
        description: descState ?? '',
      });
  }, [MATCHs, RETURNs, clickTrigger]);

  useEffect(() => {
    setMATCHs(generateMATCH().join('\n'));
    setWHEREs(generateWHERE());
  }, [nodesStore, edgesStore, properties]);

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
      <GraphCanvas
        noDefaultLabel={true}
        defaultNodes={graphNodes}
        defaultEdges={graphEdges as unknown as ISchemaEdge[]}
        onNodesChange={handleNodes}
        onEdgesChange={handleEdges}
      >
        <ButtonController />
        <Controls
          style={{
            gap: '4px',
            boxShadow:
              '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
          }}
        />
        <Background style={{ background: token.colorBgBase }} />
        <MiniMap style={{ backgroundColor: token.colorBgBase }} />
      </GraphCanvas>
    );
  }, [graphNodes, graphEdges]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GraphProvider>
        <MyGraph></MyGraph>
      </GraphProvider>
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
          setClickTrigger(true);
          setIsModalOpen(true);
        }}
        type="primary"
        style={{ position: 'absolute', bottom: '20px', right: '240px' }}
        icon={<SearchOutlined />}
      >
        <pre>Cypher</pre>查询
      </Button>
    </div>
  );
};
