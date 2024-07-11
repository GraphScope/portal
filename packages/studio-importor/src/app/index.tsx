import React, { useEffect, useMemo } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';

import { ReactFlowProvider } from 'reactflow';
import { ThemeProvider, Section } from '@graphscope/studio-components';
import 'reactflow/dist/style.css';
import { transformGraphNodes, transformEdges } from './elements/index';
import { IdContext } from './useContext';
import ButtonController from './button-controller';

import type { ISchemaOptions, ImportorProps } from './typing';

import { useContext } from './useContext';
import locales from '../locales';
const ImportApp: React.FunctionComponent<ImportorProps> = props => {
  const {
    appMode,
    queryGraphSchema,
    queryBoundSchema,
    id,
    locale = 'zh-CN',
    theme = {
      primaryColor: '#1890ff',
      mode: 'defaultAlgorithm',
    },
    defaultCollapsed = {
      rightSide: false,
      leftSide: true,
    },
    leftSideStyle = {
      width: '350px',
      padding: '0px 12px',
    },
    rightSideStyle = {
      width: '450px',
      padding: '0px 12px',
    },
    elementOptions,
    children,
    queryPrimitiveTypes,
    handleUploadFile,
    isSaveFiles,
    batchUploadFiles,
  } = props;
  const { store, updateStore } = useContext();

  useEffect(() => {
    (async () => {
      let schema: ISchemaOptions = { nodes: [], edges: [] };
      if (appMode === 'DATA_MODELING' && queryGraphSchema) {
        schema = await queryGraphSchema();
      }
      if (appMode === 'DATA_IMPORTING' && queryBoundSchema) {
        schema = await queryBoundSchema();
      }
      const schemaOptions = {
        nodes: transformGraphNodes(schema.nodes, store.displayMode),
        edges: transformEdges(schema.edges, store.displayMode),
      };
      const { nodes, edges } = schemaOptions || { nodes: [], edges: [] };
      const isEmpty = nodes.length === 0;
      // const leftSideOpen = appMode === 'DATA_MODELING' && isEmpty;
      const rightSideOpen = !isEmpty;
      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
        draft.appMode = appMode;
        draft.elementOptions = {
          isClickable: (elementOptions || {}).isClickable !== false, //默认undefined 则返回true
          isEditable: isEmpty, // 初始状态，接口获取画布有 Schema 数据的时候，不可编辑
          isConnectable: isEmpty, //  初始状态，接口获取画布有 Schema 数据的时候，不可连线
        };
        draft.currentId = isEmpty ? '' : nodes[0].id;
        draft.currentType = 'nodes';
        draft.isSaveFiles = isSaveFiles;
      });
    })();
  }, []);

  return (
    <ThemeProvider locales={locales}>
      <Section
        leftSide={<ImportSchema />}
        rightSide={
          <PropertiesEditor
            appMode={appMode}
            /**  第二项 */
            queryPrimitiveTypes={queryPrimitiveTypes}
            handleUploadFile={handleUploadFile}
            batchUploadFiles={batchUploadFiles}
          />
        }
        leftSideStyle={leftSideStyle}
        rightSideStyle={rightSideStyle}
        defaultCollapsed={defaultCollapsed}
        style={{ height: 'calc(100vh - 50px)' }}
        splitBorder
      >
        <ReactFlowProvider>
          <ButtonController />
          {children}
          <GraphCanvas />
        </ReactFlowProvider>
      </Section>
    </ThemeProvider>
  );
};

export const MultipleInstance = props => {
  const SDK_ID = useMemo(() => {
    if (!props.id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.info(
        `%c ⚠️: The id prop is missing in the Importor component. A default SDK_ID: ${defaultId} is generated for managing multiple instances.`,
        'color:green',
      );
      return defaultId;
    }
    return props.id;
  }, []);

  return (
    <IdContext.Provider value={{ id: SDK_ID }}>
      <ImportApp {...props} />
    </IdContext.Provider>
  );
};

export default MultipleInstance;
