import React, { useState } from 'react';

import { Utils, ImportFiles } from '@graphscope/studio-components';
import { parseSchemaByFiles } from '@graphscope/studio-importor';
import { Button, notification } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useKuzuGraph, setFiles, getDriver } from '../../../services/kuzu-wasm';
import { transform } from './transform';

interface IImportIntoKuzuProps {
  handleClose: () => void;
}

const ImportIntoKuzu: React.FunctionComponent<IImportIntoKuzuProps> = props => {
  const { handleClose } = props;
  const onSubmit = async (
    params: {
      files: any[];
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

    const { result } = await Utils.asyncFunctionWithWorker(parseSchemaByFiles)(files);
    const schemaData = transform(result);

    const datasetId = 'graph-' + Utils.uuid();

    setFiles(datasetId, {
      schema: schemaData,
      files: csvFiles,
    });

    const { success, message } = await useKuzuGraph(datasetId);
    const notifyKey = success ? 'success' : 'error';
    notification[notifyKey]({
      message: message,
    });

    updateState(preState => {
      return {
        ...preState,
        loading: false,
      };
    });
    if (success) {
      handleClose();
      Utils.storage.set('query_endpoint', `kuzu_wasm://${datasetId}`);
      window.location.reload();
    }
  };

  return (
    <ImportFiles
      isSaveFiles
      upload={{
        accept: '.csv',
        //@ts-ignore
        title: <FormattedMessage id="Click or drag file to this area to parse it" />,
        //@ts-ignore
        description: (
          <FormattedMessage id="If you already have CSV data, feel free to parse it here, and the system will automatically infer possible graph models for you." />
        ),
      }}
    >
      {(params, updateState) => {
        return (
          <>
            <Button type="primary" onClick={() => onSubmit(params, updateState)} loading={params.loading}>
              <FormattedMessage id="Load CSV Files with Kuzu WASM" />
            </Button>
          </>
        );
      }}
    </ImportFiles>
  );
};

export default ImportIntoKuzu;
