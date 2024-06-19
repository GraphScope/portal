import React, { useState } from 'react';
import { useContext } from '../../useContext';
import { Utils, ImportFiles } from '@graphscope/studio-components';
import { getSchemaData } from './web-worker';
import { transform } from './transform';
import { Button } from 'antd';

interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore } = useContext();

  const onSubmit = async (params, updateState) => {
    const { files } = params;
    updateState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    const { result: schemaData, duration } = await Utils.asyncFunctionWithWorker(getSchemaData)(files);
    const { nodes, edges } = transform(schemaData);
    console.log(duration, schemaData);
    updateStore(draft => {
      draft.hasLayouted = false;
      draft.nodes = nodes;
      draft.edges = edges;
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
        accept: '.csv',
        title: 'Click or drag file to this area to upload',
        description:
          'If you already have CSV data, feel free to upload it here, and the system will automatically infer possible graph models for you.',
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
