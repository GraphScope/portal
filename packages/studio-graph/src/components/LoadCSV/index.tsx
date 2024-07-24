import React from 'react';
import { Button } from 'antd';
import { ImportFiles, Utils } from '@graphscope/studio-components';
import { useContext } from '../../hooks/useContext';

export interface IImportFromCSVProps {}

const ImportFromJSON: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore } = useContext();

  const onSubmit = params => {
    const { files } = params;
    const nodes: any[] = [];
    const edges: any[] = [];
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
          const id = node[idField];
          if (id) {
            nodes.push({
              id,
              type: 'circle',
              data: node,
            });
          }
        });
      }
      if (type === 'Edge') {
        data.forEach(edge => {
          const source = edge[sourceField];
          const target = edge[targetField];
          if (source && target) {
            edges.push({
              id: `${edge[sourceField]}-${edge[targetField]}`,
              source,
              target,
              data: edge,
            });
          }
        });
      }
    });
    updateStore(draft => {
      draft.data = {
        nodes,
        edges,
      };
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
