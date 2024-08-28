import React, { useEffect, useMemo, useState } from 'react';
import { Spin } from 'antd';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';

import { ReactFlowProvider } from 'reactflow';
import { ThemeProvider, Section, Icons, LoadingGraph } from '@graphscope/studio-components';
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
    GS_ENGINE_TYPE,
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
    children,
    queryPrimitiveTypes,
    handleUploadFile,
    isSaveFiles,
    batchUploadFiles,
    onCreateLabel,
    onDeleteLabel,
    style,
    leftSide,
    rightSide,
  } = props;
  const { store, updateStore } = useContext();
  const [state, updateState] = useState({
    loading: false,
  });
  const { loading } = state;
  useEffect(() => {
    (async () => {
      updateState(preset => {
        return {
          ...preset,
          loading: true,
        };
      });
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

      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
        draft.appMode = appMode;
        draft.elementOptions = {
          isEditable: !isEmpty, // 操作按钮： nodes没有值,导入，删除，添加都可以操作；接口返回有值，只能操作添加按钮。
          isConnectable: GS_ENGINE_TYPE === 'groot' && appMode === 'DATA_MODELING' ? true : isEmpty, //  初始状态，接口获取画布有 Schema 数据的时候，不可连线;groot时候一直可以连线
        };

        draft.currentId = isEmpty ? '' : nodes[0].id;
        draft.currentType = 'nodes';
        draft.isSaveFiles = isSaveFiles;
      });
      updateState(preset => {
        return {
          ...preset,
          loading: false,
        };
      });
    })();
  }, []);
  const IS_PURE = appMode === 'PURE';

  return (
    <ThemeProvider locales={locales}>
      <Section
        leftSide={leftSide || <ImportSchema />}
        rightSide={
          rightSide || (
            <PropertiesEditor
              appMode={appMode}
              /**  第二项 */
              queryPrimitiveTypes={queryPrimitiveTypes}
              handleUploadFile={handleUploadFile}
              batchUploadFiles={batchUploadFiles}
              onCreateLabel={onCreateLabel}
              onDeleteLabel={onDeleteLabel}
            />
          )
        }
        leftSideStyle={leftSideStyle}
        rightSideStyle={rightSideStyle}
        defaultCollapsed={defaultCollapsed}
        style={{ height: 'calc(100vh - 50px)', ...style }}
        splitBorder
      >
        <ReactFlowProvider>
          {!IS_PURE && <ButtonController />}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {loading ? (
              <LoadingGraph>
                <Icons.Cluster style={{ fontSize: '160px', color: '#F5F6F8' }} />
              </LoadingGraph>
            ) : (
              <GraphCanvas />
            )}
          </div>
          {children}
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
