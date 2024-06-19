import React, { useState } from 'react';

import { Button } from 'antd';

import { useContext } from '../../useContext';

import { Utils, ImportFiles } from '@graphscope/studio-components';

import { covertSchemaByTables } from './parse-ddl';
import { transformEdges, transformGraphNodes } from '../../elements';
interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore } = useContext();

  const onSubmit = async (params, updateState) => {
    updateState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    const { nodes, edges } = covertSchemaByTables(params.files);
    console.log(nodes, edges);
    updateStore(draft => {
      draft.hasLayouted = false;
      draft.nodes = transformGraphNodes(nodes, 'graph');
      draft.edges = transformEdges(edges, 'graph');
    });
    updateState(preState => {
      return {
        ...preState,
        loading: false,
      };
    });
  };

  return (
    <ImportFiles
      upload={{
        accept: '.sql,.ddl',
        title: 'Click or drag file to this area to upload',
        description:
          'If you already have SQLDDL file, feel free to upload it here, and the system will automatically infer possible graph models for you.',
      }}
    >
      {(params, updateState) => {
        return (
          <Button type="primary" onClick={() => onSubmit(params, updateState)} loading={params.loading}>
            Generate graph model
          </Button>
        );
      }}
    </ImportFiles>
  );
};

export default ImportFromCSV;
