import React, { useRef } from 'react';
import { Button } from 'antd';
import { ImportFiles, Utils } from '@graphscope/studio-components';
import { useContext } from '../../hooks/useContext';

import { getStyleConfig, getDataMap } from '../Prepare/utils';

export interface IImportFromCSVProps {}

const ImportFromJSON: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore, store } = useContext();
  const { graphId } = store;

  const onSubmit = params => {
    const { files } = params;
    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeSchemas = new Map();
    const edgeSchemas = new Map();
    const NODE_MAP = new Map();
    const sortFiles = files.sort((a, b) => {
      return a.meta.graphFields.type === 'Vertex' ? -1 : 1;
    });

    sortFiles.forEach(item => {
      const { meta, contents } = item;
      const { graphFields, name } = meta;
      let data: any[] = [];
      if (meta.type === 'csv') {
        data = Utils.covertCSV2JSON(contents, meta.header, meta.delimiter);
      }
      if (meta.type === 'json') {
        data = JSON.parse(contents);
      }

      const {
        idField,
        sourceField = 'source',
        targetField = 'target',
        type,
        nodeLabelField,
        edgeLabelField,
      } = graphFields;

      if (type === 'Vertex') {
        data.forEach(node => {
          const id = node[idField];
          const label = node[nodeLabelField] || 'unknow';
          // generate graph data
          if (id) {
            NODE_MAP.set(id, label);
            nodes.push({
              id,
              label,
              properties: node,
            });
          }
          // generate graph schema
          if (!nodeSchemas.has(label)) {
            const nodeSchema = {
              label,
              properties: Utils.extractProperties(node).reduce((acc, curr) => {
                return {
                  ...acc,
                  [curr.name]: curr.type,
                };
              }, {}),
            };
            nodeSchemas.set(label, nodeSchema);
          }
        });
      }
      if (type === 'Edge') {
        data.forEach(edge => {
          const source = edge[sourceField];
          const target = edge[targetField];
          const label = edge[edgeLabelField] || 'unknow';
          // check edge
          const sourceLabel = NODE_MAP.get(source);
          const targetLabel = NODE_MAP.get(target);
          if (!sourceLabel || !targetLabel) {
            console.warn(`数据不合法, 找不到 ${!sourceLabel ? `Source ID：${source}` : `Target ID：${target}`}`);
            return;
          }
          // generate graph data
          if (source && target) {
            edges.push({
              id: `${edge[sourceField]}-${edge[targetField]}`,
              label,
              source,
              target,
              properties: edge,
            });
          }
          // generate graph schema
          if (!edgeSchemas.has(label)) {
            const edgeSchema = {
              label,
              source: sourceLabel,
              target: targetLabel,
              properties: Utils.extractProperties(edge).reduce((acc, curr) => {
                return {
                  ...acc,
                  [curr.name]: curr.type,
                };
              }, {}),
            };
            edgeSchemas.set(label, edgeSchema);
          }
        });
      }
    });
    const schema = {
      nodes: [...nodeSchemas.values()],
      edges: [...edgeSchemas.values()],
    };

    const id = graphId || String(new Date());
    const style = getStyleConfig(schema, id);
    updateStore(draft => {
      draft.data = {
        nodes,
        edges,
      };
      draft.source = {
        nodes,
        edges,
      };
      draft.graphId = id;
      draft.schema = schema;
      draft.nodeStyle = style.nodeStyle;
      draft.edgeStyle = style.edgeStyle;
      draft.dataMap = getDataMap(
        Utils.fakeSnapshot({
          nodes,
          edges,
        }),
      );
    });
  };

  return (
    <ImportFiles
      upload={{
        accept: '.json,.csv',
        title: 'xxx',
        description: 'xxx',
      }}
      type="json"
    >
      {params => {
        return (
          <>
            <Button type="primary" onClick={() => onSubmit(params)} loading={params.loading}>
              Visualization
            </Button>
          </>
        );
      }}
    </ImportFiles>
  );
};

export default ImportFromJSON;
