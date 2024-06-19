import React from 'react';

import { Button } from 'antd';

import { ImportFiles, Utils } from '@graphscope/studio-components';
import type { NodeData, EdgeData } from '../typing';
import { useContext } from '../useContext';

interface IImportFromCSVProps {}

const ImportFromJSON: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { store, updateStore } = useContext();

  const onSubmit = params => {
    console.log('state', params);
    const { files } = params;
    const nodes: NodeData[] = [];
    const edges: EdgeData[] = [];
    files.forEach(item => {
      const { meta, contents } = item;
      const { graphFields, name } = meta;
      let data: any[] = [];
      if (meta.type === 'csv') {
        data = Utils.covertCSV2JSON(contents, meta.header, meta.delimiter);
      }
      if (meta.type === 'json') {
        data = JSON.parse(contents);
      }

      const { idField, sourceField = 'source', targetField = 'target', type } = graphFields;

      if (type === 'Vertex') {
        data.forEach(node => {
          nodes.push({
            id: node[idField],
            type: 'circle',
            data: node,
          });
        });
      }
      if (type === 'Edge') {
        data.forEach(edge => {
          edges.push({
            id: `${edge[sourceField]}-${edge[targetField]}`,
            source: edge[sourceField],
            target: edge[targetField],
            data: edge,
          });
        });
      }
    });
    updateStore(draft => {
      draft.edges = edges;
      draft.nodes = nodes;
    });
  };

  return (
    <ImportFiles
      upload={{
        accept: '.json,.csv',
        title: 'xxx',
        description: 'xxx',
      }}
    >
      {params => {
        return (
          <Button type="primary" onClick={() => onSubmit(params)} loading={params.loading}>
            Visualization
          </Button>
        );
      }}
    </ImportFiles>
  );
};

export default ImportFromJSON;
