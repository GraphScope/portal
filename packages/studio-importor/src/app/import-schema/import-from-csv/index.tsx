import React, { useState } from 'react';
import { useContext } from '../../useContext';
import { Utils, ImportFiles, ParsedFile } from '@graphscope/studio-components';
import { getSchemaData } from './web-worker';
import { transform } from './transform';
import { Button } from 'antd';
import localforage from 'localforage';
import { FormattedMessage } from 'react-intl';
interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
  const { updateStore, store } = useContext();
  const { isSaveFiles } = store;

  const onSubmit = async (
    params: {
      files: ParsedFile[];
      csvFiles: File[];
    },
    updateState,
  ) => {
    const { files, csvFiles } = params;
    updateState(preState => {
      return {
        ...preState,
        loading: true,
      };
    });
    const { result: schemaData, duration } = await Utils.asyncFunctionWithWorker(getSchemaData)(files);
    const { nodes, edges } = transform(schemaData);
    console.log(duration, schemaData, csvFiles);
    if (isSaveFiles) {
      localforage.setItem('DRAFT_GRAPH_FILES', csvFiles);
    }
    updateStore(draft => {
      draft.hasLayouted = false;
      draft.nodes = nodes;
      draft.edges = edges;
      draft.csvFiles = csvFiles;
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
      isSaveFiles={isSaveFiles}
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
            <FormattedMessage id="Generate graph model" />
          </Button>
        );
      }}
    </ImportFiles>
  );
};

export default ImportFromCSV;
