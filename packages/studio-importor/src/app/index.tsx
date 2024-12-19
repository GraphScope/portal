import React, { useEffect, useMemo } from 'react';
import GraphCanvas from './graph-canvas';
import PropertiesEditor from './properties-editor';
import { ReactFlowProvider } from 'reactflow';
import { Section, StudioProvier, GlobalSpin, useDynamicStyle } from '@graphscope/studio-components';
import cssStyles from './style';
import { transformGraphNodes, transformEdges } from './elements/index';

import ButtonController from './button-controller';
import type { ISchemaOptions, ImportorProps } from './typing';
import { initialStore } from './useContext';
import locales from '../locales';
import StoreProvider, { useContext } from '@graphscope/use-zustand';

const ImportApp: React.FunctionComponent<ImportorProps> = props => {
  const {
    appMode,
    GS_ENGINE_TYPE,
    queryGraphSchema,
    queryBoundSchema,
    id,
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
  const { isReady, displayMode } = store;

  useDynamicStyle(cssStyles, 'graphscope-importor');

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
        nodes: transformGraphNodes(schema.nodes, displayMode),
        // nodes: transformGraphNodes(schema.nodes, store.displayMode), //会报错！！！！
        edges: transformEdges(schema.edges, displayMode),
      };
      const { nodes, edges } = schemaOptions || { nodes: [], edges: [] };
      const isEmpty = nodes.length === 0;

      updateStore(draft => {
        draft.isReady = true;
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
    })();
  }, []);
  const IS_PURE = appMode === 'PURE';

  return (
    <StudioProvier locales={locales}>
      <Section
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
        {isReady ? (
          <ReactFlowProvider>
            {!IS_PURE && <ButtonController />}
            <GraphCanvas />
            {children}
          </ReactFlowProvider>
        ) : (
          <GlobalSpin />
        )}
      </Section>
    </StudioProvier>
  );
};

export default props => {
  return (
    <StoreProvider id={props.id} store={initialStore}>
      <ImportApp {...props} />
    </StoreProvider>
  );
};
