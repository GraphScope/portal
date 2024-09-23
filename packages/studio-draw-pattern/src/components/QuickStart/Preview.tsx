import React, { useContext } from 'react';
import { Graph } from '@graphscope/studio-graph-editor';
import { ISchemaNode } from '@graphscope/studio-graph-editor';
import { ISchemaEdge } from '@graphscope/studio-graph-editor';
import { useTransform } from '../../hooks/transform/useTransform';
import { useGraphStore } from '../../stores/useGraphStore';
import { useNodeStore } from '../../stores/useNodeStore';
import { useEdgeStore } from '../../stores/useEdgeStore';
import { usePropertiesStore } from '../../stores/usePropertiesStore';
import { DrawPatternContext } from '../DrawPattern';
export const Preview = () => {
  const { transformNodes, transformEdges } = useTransform();

  const clearGraphStore = useGraphStore(state => state.clearGraphStore);
  const clearNode = useNodeStore(state => state.clearNode);
  const clearEdge = useEdgeStore(state => state.clearEdge);
  const clearProperties = usePropertiesStore(state => state.clearProperties);
  const handleSelectionChange = (nodes: ISchemaNode[], edges: ISchemaEdge[]) => {
    // 每次 selection change 都要清空 store;
    clearProperties();
    clearGraphStore();
    clearEdge && clearEdge();
    clearNode && clearNode();

    // 将 nodes 和 edges 转换为 新格式 ，来适配 MATCH 语句
    transformNodes(nodes);
    transformEdges(edges, nodes);
  };

  const { previewGraph } = useContext(DrawPatternContext);

  return (
    <div
      style={{
        borderRadius: '8px',
        border: '1px solid #E3E3E3',
        height: '30%',
        padding: '0.8rem',
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        flexBasis: '30%',
        marginTop: '1rem',
      }}
    >
      <span style={{ fontSize: '1rem' }}>Model Preview</span>
      <div style={{ flexGrow: '1', backgroundColor: 'white' }}>
        <Graph
          isControlButton={false}
          isMiniMap={false}
          disabled={true}
          isPreview={true}
          defaultEdges={previewGraph?.edges}
          // @ts-ignore
          defaultNodes={previewGraph?.nodes}
          graphId="preview-graph"
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </div>
  );
};
