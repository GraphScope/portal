import React, { useEffect, useMemo } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import ImportSchema from './import-schema';

import { ReactFlowProvider } from 'reactflow';
import { Toolbar } from '@graphscope/studio-components';

import 'reactflow/dist/style.css';
import RightButton from './button-controller/right-button';
import LeftButton from './button-controller/left-button';
import ClearCanvas from './button-controller/clear-canvas';
import AddNode from './button-controller/add-node';
import { Divider, notification } from 'antd';
import { transformGraphNodes, transformEdges } from './elements/index';
import { IdContext } from './useContext';
import Provider from './provider';
import type { ImportorProps } from './typing';
interface Option {
  label: string;
  value: string;
}
import { useContext } from './useContext';
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
    defaultLeftStyles = {
      collapsed: true,
      width: 300,
    },
    defaultRightStyles = {
      collapsed: true,
      width: 400,
    },
    elementOptions,
    children,
    queryPrimitiveTypes,
    handleUploadFile,
  } = props;
  const { store, updateStore } = useContext();
  const { collapsed } = store;
  const { left, right } = collapsed;

  useEffect(() => {
    (async () => {
      let schema = {};
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
      //@ts-ignore
      const { nodes, edges } = schemaOptions || { nodes: [], edges: [] };
      updateStore(draft => {
        draft.nodes = nodes;
        draft.edges = edges;
        draft.appMode = appMode;
        draft.collapsed.left = defaultLeftStyles.collapsed;
        draft.collapsed.right = defaultRightStyles.collapsed;
        draft.elementOptions = {
          isClickable: (elementOptions || {}).isClickable !== false, //默认undefined 则返回true
          isEditable: nodes.length === 0, // 初始状态，接口获取画布有 Schema 数据的时候，不可编辑
          isConnectable: nodes.length === 0, //  初始状态，接口获取画布有 Schema 数据的时候，不可连线
        };
      });
    })();
  }, []);

  return (
    <Provider locale={locale} theme={theme}>
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '100%', display: 'flex' }}>
          <div
            style={{
              width: left ? '0px' : defaultLeftStyles.width,
              padding: left ? '0px' : '0px 12px',
              overflow: 'hidden',
              transition: 'width 0.2s ease',
            }}
          >
            <ImportSchema />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <ReactFlowProvider>
              {appMode === 'DATA_MODELING' && (
                <Toolbar>
                  <LeftButton />
                  <Divider type="horizontal" style={{ margin: '0px' }} />
                  <AddNode />
                  <ClearCanvas />
                  {/* <ModeSwitch /> */}
                </Toolbar>
              )}
              {children}

              <Toolbar style={{ top: '12px', right: '24px', left: 'unset' }} direction="horizontal">
                <RightButton />
              </Toolbar>
              <GraphCanvas />
            </ReactFlowProvider>
          </div>
          <div
            style={{
              width: right ? '0px' : defaultRightStyles.width,
              padding: right ? '0px' : '0px 12px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'width 0.2s ease',
            }}
          >
            <PropertiesEditor
              appMode={appMode}
              /**  第二项 */
              queryPrimitiveTypes={queryPrimitiveTypes}
              handleUploadFile={handleUploadFile}
            />
          </div>
        </div>
      </div>
    </Provider>
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
