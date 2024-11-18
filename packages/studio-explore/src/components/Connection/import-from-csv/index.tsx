import React, { useState } from 'react';

import { Utils, ImportFiles } from '@graphscope/studio-components';
import { getSchemaData } from './web-worker';

import { Button } from 'antd';
import localforage from 'localforage';
import { FormattedMessage } from 'react-intl';
import { useKuzuGraph, createKuzuWasmGraph } from '@graphscope/studio-driver';

interface IImportFromCSVProps {}

const ImportFromCSV: React.FunctionComponent<IImportFromCSVProps> = props => {
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
    const { result: schemaData, duration } = await Utils.asyncFunctionWithWorker(getSchemaData)(files);

    localforage.setItem('DRAFT_GRAPH_FILES', csvFiles);
    console.log('schemaData', schemaData);
    const datasetId = Utils.uuid();
    const _schema = {
      nodes: [
        {
          label: 'Paper',
          properties: [
            {
              name: 'id',
              type: 'DT_STRING',
              primaryKey: true,
            },
            {
              name: 'published',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'year',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'month',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'title',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'authors',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'summary',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'journal_ref',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'doi',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'primary_category',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'categories',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'bib',
              type: 'DT_STRING',
              primaryKey: false,
            },
          ],
        },
        {
          label: 'Contribution',
          properties: [
            {
              name: 'id',
              type: 'DT_STRING',
              primaryKey: true,
            },
            {
              name: 'original',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'summary',
              type: 'DT_STRING',
              primaryKey: false,
            },
          ],
        },
        {
          label: 'Challenge',
          properties: [
            {
              name: 'id',
              type: 'DT_STRING',
              primaryKey: true,
            },
            {
              name: 'name',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'description',
              type: 'DT_STRING',
              primaryKey: false,
            },
            {
              name: 'solution',
              type: 'DT_STRING',
              primaryKey: false,
            },
          ],
        },
      ],
      edges: [
        {
          source: 'Paper',
          target: 'Contribution',
          label: 'Paper_Has_Contribution',
          properties: [],
        },
        {
          source: 'Paper',
          target: 'Challenge',
          label: 'Paper_Has_Challenge',
          properties: [],
        },
      ],
    };
    createKuzuWasmGraph(datasetId, {
      schema: _schema,
      files: csvFiles,
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
          <Button type="primary" onClick={() => onSubmit(params, updateState)} loading={params.loading}>
            <FormattedMessage id="Load graph" />
          </Button>
        );
      }}
    </ImportFiles>
  );
};

export default ImportFromCSV;
